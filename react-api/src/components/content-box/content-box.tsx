import * as React from 'react';
import { Spin, Result } from 'antd';

import ContentItem from './content-item/content-item';
import { WHImageData } from '../../defs';

import styles from './content-box.scss';

export interface ContentBoxProps {
  memory: Record<string, WHImageData>;
  loadFullImgCb: (path: string) => Promise<boolean>;
  onScrollEnd?: () => unknown;
  end?: boolean;
  reset?: boolean;
  error?: boolean;
  fetching?: boolean;
}

export const ContentBox: React.FC<ContentBoxProps> = (
  props: ContentBoxProps,
) => {
  const root = React.useRef<HTMLDivElement>(null);
  const spinDiv = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const div = root.current as HTMLDivElement;
    if (div) {
      div.onscroll = () => {
        const rect = spinDiv.current?.getBoundingClientRect();
        const height = window.innerHeight;
        if (rect && rect?.top < height) props.onScrollEnd?.();
      };
      return () => {
        div.onscroll = null;
      };
    }
    return undefined;
  });

  const cards = Object.values(props.memory);
  const oneLoaded = cards.some(v => v.loadSuccess !== undefined);
  let content: JSX.Element | JSX.Element[] | undefined;
  if (props.error)
    content = (
      <Result
        status="error"
        title="Fetching error"
        className={styles['content-item_plug']}
      ></Result>
    );
  else if (!oneLoaded && props.fetching)
    content = <Spin className={styles['content-item_plug']}></Spin>;
  else
    content = cards.map(rec => {
      return (
        <article key={rec.id}>
          <ContentItem data={rec} loadFullImage={props.loadFullImgCb} />
        </article>
      );
    });

  return (
    <div className={styles.root} ref={root}>
      {props.error ? (
        content
      ) : (
        <div className={styles.root__cards}>
          {content}
          {props.end || (props.fetching && cards.length === 0) ? undefined : (
            <div
              className={`${styles['root__spinner-box']} ${styles['content-item_plug']}`}
              ref={spinDiv}
            >
              <Spin></Spin>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
