import * as React from 'react';
import ContentItem from './content-item/content-item';

import { DataRecordData } from '../record/record';

import styles from './content-box.scss';

export interface ContentBoxProps {
  memory: Record<string, DataRecordData>;
}

export const ContentBox: React.FC<ContentBoxProps> = (
  props: ContentBoxProps,
) => {
  return (
    <div className={styles.root__content}>
      {Object.values(props.memory).map(rec => {
        return (
          <article key={rec.id} className={styles['content-item']}>
            <ContentItem {...rec} />
          </article>
        );
      })}
    </div>
  );
};
