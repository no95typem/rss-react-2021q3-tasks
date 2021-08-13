import { QueueManager } from '../../lib/misc/queue-manager';

export class ImgFetcher {
  private IMG_LOAD_QUEUE_MANAGER = new QueueManager<boolean>(
    async (reqPerWindow: number, firstTimeInWindow: number) => {
      const throttleTime =
        reqPerWindow >= this.REQ_PER_WINDOW
          ? this.WINDOW - (Date.now() - firstTimeInWindow)
          : 0;
      await new Promise(res => setTimeout(res, throttleTime));
    },
    this.WINDOW,
  );

  constructor(public REQ_PER_WINDOW: number, public WINDOW: number) {}

  loadImg = (src: string): Promise<boolean> => {
    const action = async () => {
      return new Promise<boolean>(res => {
        const img = new Image();
        img.onload = () => res(true);
        img.onerror = () => res(false);

        img.referrerPolicy = 'no-referrer'; // !
        img.src = src;
      });
    };
    return this.IMG_LOAD_QUEUE_MANAGER.do(action);
  };
}
