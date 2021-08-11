import * as React from 'react';
import { WHSearchDataItemWithLifecycle } from '../../../defs';
// import { Image as AntdImage, Skeleton, Result, Spin } from 'antd';

import styles from '../content-box.scss';

export interface ContentItemProps {
  data: WHSearchDataItemWithLifecycle;
  loadFullImage: (src: string) => Promise<boolean>;
}

const ContentItem: React.FC<ContentItemProps> = (props: ContentItemProps) => {
  const [fullLoaded, setFullLoaded] = React.useState<boolean | undefined>(
    undefined,
  );
  const [show, setShow] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleShow = () => {
    if (loading) return;
    setLoading(true);
    if (props.data.path) {
      props.loadFullImage(props.data.path).then(success => {
        if (success) {
          setFullLoaded(true);
          setLoading(false);
          setShow(true);
        } else {
          setFullLoaded(false);
          setLoading(false);
          setShow(true);
        }
      });
    }
  };

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
          <img src={props.data.thumbs.small} alt="" width="100%" />
          {fullLoaded === undefined && !loading ? (
            <div
              className={styles['content-item__Image-wall']}
              onClick={handleShow}
            ></div>
          ) : undefined}
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
