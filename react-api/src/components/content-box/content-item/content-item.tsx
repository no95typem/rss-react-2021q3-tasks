import * as React from 'react';
import { useHistory } from 'react-router';

import { WHSearchDataItemWithLifecycle } from '../../../defs';

import styles from '../content-box.scss';

export interface ContentItemProps {
  data: WHSearchDataItemWithLifecycle;
}

const ContentItem: React.FC<ContentItemProps> = (props: ContentItemProps) => {
  const history = useHistory();

  switch (props.data.loadSuccess) {
    case undefined:
      return <div></div>;
    // <Skeleton.Button
    //   active={true}
    //   className={styles['content-item__skeleton']}
    // />
    case true:
      return (
        <div className={styles['content-item__wrapper']}>
          <img
            className={styles['content-item_Image']}
            src={props.data.thumbs.small}
            alt=""
            width="100%"
            onClick={() => {
              history.push(`/details/${props.data.id}`);
            }}
          />
        </div>
      );
    case false:
    default:
      return <div></div>;
    // <Result
    //   status="error"
    //   subTitle="load failed"
    //   className={styles['content-item__text']}
    // />
  }
};

export default ContentItem;
