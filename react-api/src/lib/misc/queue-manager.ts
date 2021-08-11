export type QueueItem<T> = {
  action: () => Promise<T>;
  res: (result: T) => void;
  rej: (reason?: Error) => void;
  next?: QueueItem<T>;
  number: number;
};

export type ThrottlerFunc = (
  reqPerWindow: number,
  firstTimeInWindow: number,
) => Promise<void>;

export class QueueManager<T> {
  private lastQueued: QueueItem<T> | undefined;

  private timestamps: number[] = [];

  constructor(
    private throttler?: ThrottlerFunc,
    private throttlerTimeWindow = 1000,
  ) {}

  do(action: () => Promise<T>): Promise<T> {
    return new Promise<T>((res, rej) => {
      const item: QueueItem<T> = { action, res, rej, number: 0 };

      if (this.lastQueued) {
        this.lastQueued.next = item;
        item.number = this.lastQueued.number + 1;
        this.lastQueued = item;
      } else {
        this.lastQueued = item;
        this.processItem(item);
      }
    });
  }

  private throttleReq() {
    if (!this.throttler) return Promise.resolve();
    return new Promise<void>(res => {
      const last = Date.now();
      this.timestamps.push(last);
      const cutoff = last - this.throttlerTimeWindow;
      this.timestamps = this.timestamps.filter(t => t > cutoff);
      (this.throttler as ThrottlerFunc)(
        this.timestamps.length,
        this.timestamps[0] || 0,
      ).then(() => res());
    });
  }

  private processItem(item: QueueItem<T>) {
    this.throttleReq().then(() => {
      item
        .action()
        .then(result => item.res(result))
        .catch(err => item.rej(err))
        .finally(() => {
          if (item.next) this.processItem(item.next as QueueItem<T>);
          else this.lastQueued = undefined;
        });
    });
  }
}
