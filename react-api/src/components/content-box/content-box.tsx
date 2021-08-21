import * as React from 'react';

import ContentItem from './content-item/content-item';
import { SpinnerBorder } from '../spinner-border/spinner-border';

import styles from './content-box.scss';
import { WHSearchDataItemWithLifecycle } from '../../defs';

export interface ContentBoxProps {
  memory: Record<string, WHSearchDataItemWithLifecycle>;
  onScrollEnd?: () => unknown;
  end?: boolean;
  error?: boolean;
  fetching?: boolean;
  searchPerformed?: boolean;
  onScroll?: (scrollTop: number) => unknown;
  scrollTop?: number;
}

export const ContentBox: React.FC<ContentBoxProps> = (
  props: ContentBoxProps,
) => {
  const root = React.useRef<HTMLDivElement>(null);
  const spinDiv = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const div = root.current as HTMLDivElement;
    if (div) {
      if (props.scrollTop) div.scrollTop = props.scrollTop;
      div.onscroll = () => {
        props.onScroll?.(div.scrollTop);
        const rect = spinDiv.current?.getBoundingClientRect();
        const height = window.innerHeight;
        if (rect && rect?.top < height) props.onScrollEnd?.();
      };
      return () => {
        div.onscroll = null;
      };
    }
    return undefined;
  }, []);

  const cards = Object.values(props.memory);
  const oneLoaded = cards.some(v => v.loadSuccess !== undefined);

  let content: JSX.Element | JSX.Element[] | undefined;

  if (props.error)
    content = (
      <div className="alert alert-danger" role="alert">
        Fetching error!
      </div>
    );
  else if (!oneLoaded && props.fetching)
    content = (
      <div className={styles['content-item_plug']}>
        <SpinnerBorder />
      </div>
    );
  else if (cards.length > 0)
    content = cards.map(rec => {
      return (
        <article key={rec.id}>
          <ContentItem data={rec} />
        </article>
      );
    });
  else if (props.searchPerformed)
    content = (
      <div className="alert alert-light" role="alert">
        Found nothing
      </div>
    );
  else
    content = (
      <div
        className="info info-primary d-flex align-items-center"
        role="contentinfo"
        style={{ gap: '10px' }}
      >
        <div>
          <i className="bi-search"></i>
        </div>
        <div>Search anything!</div>
      </div>
    );

  return (
    <div className={styles.root} ref={root} role="grid">
      {props.error || cards.length === 0 ? (
        content
      ) : (
        <div className={styles.root__cards}>
          {content}
          {props.end || (props.fetching && cards.length === 0) ? undefined : (
            <div
              className={`${styles['root__spinner-box']} ${styles['content-item_plug']}`}
              ref={spinDiv}
            >
              <SpinnerBorder />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
