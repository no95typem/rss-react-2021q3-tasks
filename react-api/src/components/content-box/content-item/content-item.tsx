import * as React from 'react';
import { useHistory } from 'react-router';
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
          />
          {fullLoaded === undefined && !loading ? (
            <div
              className={styles['content-item__Image-wall']}
              onClick={() => {
                history.push(`/details/${props.data.id}`);
              }}
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
