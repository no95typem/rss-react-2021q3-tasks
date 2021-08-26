import * as React from 'react';
import { useHistory } from 'react-router';

import { WHSearchDataItemWithLifecycle } from '../../../defs';
import { ErrorPlug } from '../../error-plug/error-plug';
import { Skeleton } from '../../skeleton/skeleton';

import styles from '../content-box.scss';

export interface ContentItemProps {
  data: WHSearchDataItemWithLifecycle;
}

const ContentItem: React.FC<ContentItemProps> = (props: ContentItemProps) => {
  const history = useHistory();

  switch (props.data.loadSuccess) {
    case undefined:
      return <Skeleton />;
    case true:
      return (
        <div
          className={styles['content-item__wrapper']}
          data-testid="content-img"
        >
          <img
            className={styles['content-item_Image']}
            src={props.data.thumbs.small}
            alt=""
            width="100%"
            onClick={() => {
              history.push(`/details/${props.data.id}`);
            }}
            role="img"
          />
        </div>
      );
    case false:
    default:
      return (
        <div
          data-testid="content-img"
          className={styles['content-item__wrapper']}
        >
          <ErrorPlug
            size="30%"
            text="Failed to load the image"
            color="rgba(190, 0, 0, 0.5)"
          />
        </div>
      );
  }
};

export default ContentItem;
