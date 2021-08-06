import * as React from 'react';
import { Spin } from 'antd';
import ContentItem from './content-item/content-item';

import { DataRecordData } from '../record/record';

import styles from './content-box.scss';
import { AnimationDef, playAnimation } from '../../lib/gui/animation';

export interface ContentBoxProps {
  memory: Record<string, DataRecordData>;
  onScrollEnd?: () => unknown;
  end?: boolean;
  reset?: boolean;
}

const BLUR_FILTER = 'blur(25px)';

const BLUR_OUT_ANIM_DEF: AnimationDef = {
  keyframes: [{ filter: BLUR_FILTER }, { filter: 'blur(0px)' }],
  options: {
    duration: 500,
    fill: 'forwards',
  },
};

export const ContentBox: React.FC<ContentBoxProps> = (
  props: ContentBoxProps,
) => {
  const root = React.useRef<HTMLDivElement>(null);
  const spinDiv = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const div = root.current as HTMLDivElement;
    if (div) {
      div.onscroll = e => {
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

  // React.useEffect(() => {
  //   const div = root.current as HTMLDivElement;
  //   if (div && props.reset) {
  //     div.scrollTop = 0;
  //     div.style.filter = BLUR_FILTER;
  //   }
  // });
  const cards = Object.values(props.memory);
  const oneLoaded = cards.some(v => v.loadSuccess !== undefined);
  let content: JSX.Element | JSX.Element[] | undefined;
  if (cards.length === 0) content = undefined;
  else if (!oneLoaded) content = <Spin></Spin>;
  else
    content = cards.map(rec => {
      return (
        <article key={rec.id} className={styles['content-item']}>
          <ContentItem {...rec} />
        </article>
      );
    });

  return (
    <div className={styles.root} ref={root}>
      <div className={styles.root__cards}>{content}</div>
      <div className={styles['root__spinner-box']} ref={spinDiv}>
        {props.end ? undefined : <Spin></Spin>}
      </div>
    </div>
  );
};
