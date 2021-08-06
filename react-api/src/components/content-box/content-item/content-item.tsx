import * as React from 'react';
import { Image as AntdImage, Skeleton, Result, Spin } from 'antd';
import { DataRecordData } from '../../record/record';

import styles from '../content-box.scss';

export interface ContentItemProps {
  data: DataRecordData;
  loadFullImage: (src: string) => Promise<boolean>;
}

const ContentItem: React.FC<ContentItemProps> = (props: ContentItemProps) => {
  const [fullLoaded, setFullLoaded] = React.useState<boolean | undefined>(
    undefined,
  );
  const [show, setShow] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  switch (props.data.loadSuccess) {
    case undefined:
      return (
        <Skeleton.Button
          active={true}
          className={styles['content-item__skeleton']}
        />
      );
    case true:
      return (
        <div className={styles['content-item__wrapper']}>
          <AntdImage
            width="100%"
            src={fullLoaded === true ? props.data.path : props.data.src}
            className={styles['content-item_Image']}
            preview={{
              visible: show,
              onVisibleChange: visible => {
                if (fullLoaded !== undefined) setShow(visible);
              },
              mask: loading ? <Spin></Spin> : undefined,
            }}
          ></AntdImage>
          {fullLoaded === undefined && !loading ? (
            <div
              className={styles['content-item__Image-wall']}
              onClick={() => {
                if (loading) return;
                const loadImg = () => {
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
                setLoading(true);
                setTimeout(loadImg, 1000);
              }}
            ></div>
          ) : undefined}
        </div>
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
