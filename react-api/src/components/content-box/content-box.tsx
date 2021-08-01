import * as React from 'react';
import { DataRecord, DataRecordData } from '../record/record';

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
          <article className={styles.root__card} key={rec.id}>
            <DataRecord data={rec} />
          </article>
        );
      })}
    </div>
  );
};
