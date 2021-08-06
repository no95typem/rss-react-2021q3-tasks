/* eslint-disable react/display-name */
import * as React from 'react';
import { ImgLoader } from '../img-loader/img-loader';

import styles from './record.scss';

export type DataRecordData = {
  id: string;
  src?: string;
  loadSuccess?: boolean;
  path?: string;
};

export const DataRecord: React.FC<{
  data: DataRecordData;
}> = (props: { data: DataRecordData }) => {
  return (
    <figure className={styles.root}>
      <ImgLoader base64={props.data.src} />
    </figure>
  );
};

export default DataRecord;
