import * as React from 'react';
import { Image, Skeleton, Result } from 'antd';
import { DataRecordData } from '../../record/record';

import styles from '../content-box.scss';

const ContentItem: React.FC<DataRecordData> = (props: DataRecordData) => {
  switch (props.loadSuccess) {
    case undefined:
      return (
        <Skeleton.Button
          active={true}
          className={styles['content-item__skeleton']}
        />
      );
    case true:
      return (
        <Image
          width="100%"
          src={props.src}
          className={styles['content-item__Image']}
        ></Image>
      );
    case false:
    default:
      return (
        <Result
          status="error"
          subTitle="load failed"
          className={styles['content-item__text']}
        />
      );
  }
};

export default ContentItem;
