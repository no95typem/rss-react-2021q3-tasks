/* eslint-disable react/display-name */
import * as React from 'react';
import { ImgLoader } from '../img-loader/img-loader';

import styles from './record.scss';

export type DataRecordData = {
  id: string;
  imgBase64?: string;
};

export const DataRecord: React.FC<{
  data: DataRecordData;
}> = (props: { data: DataRecordData }) => {
  return (
    <figure className={styles.root}>
      <ImgLoader base64={props.data.imgBase64} />
    </figure>
  );
};

export default DataRecord;
