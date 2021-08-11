import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { CORS_PROXY } from '../../defs';
import { WHWallpaperData } from '../../wallheaven-types/wh-wallpaper-data';
import { LOADERS_CONTEXT, SECRET_CONTEXT } from '../app/contexts';
import { SpinnerBorder } from '../spinner-border/spinner-border';
import { SpinnerGrowing } from '../spinner-growing/spinner-growing';

import styles from './details.scss';

const WH_API_GET_IMG_BASE_STR = 'https://wallhaven.cc/api/v1/w/';

const fakeImg = require('./1.jpg');

const accessWHWallpaper = (
  id: string,
  apiKey?: string,
): Promise<WHWallpaperData> => {
  return new Promise(res => {
    fetch(
      `${CORS_PROXY}${WH_API_GET_IMG_BASE_STR}${id}${
        apiKey ? `?${apiKey}` : ''
      }`,
    )
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('');
      })
      .then(json => {
        res(json.data as WHWallpaperData);
      });
  });
};

const fakeAccessWHWallpaper = (
  id: string,
  apiKey?: string,
): Promise<WHWallpaperData> => {
  return new Promise(res => {
    const fake = {
      id: '94x38z',
      url: 'https://wallhaven.cc/w/94x38z',
      short_url: 'http://whvn.cc/94x38z',
      uploader: {
        username: 'test-user',
        group: 'User',
        avatar: {
          '200px':
            'https://wallhaven.cc/images/user/avatar/200/11_3339efb2a813.png',
          '128px':
            'https://wallhaven.cc/images/user/avatar/128/11_3339efb2a813.png',
          '32px':
            'https://wallhaven.cc/images/user/avatar/32/11_3339efb2a813.png',
          '20px':
            'https://wallhaven.cc/images/user/avatar/20/11_3339efb2a813.png',
        },
      },
      views: 12,
      favorites: 0,
      source: '',
      purity: 'sfw',
      category: 'anime',
      dimension_x: 6742,
      dimension_y: 3534,
      resolution: '6742x3534',
      ratio: '1.91',
      file_size: 5070446,
      file_type: 'image/jpeg',
      created_at: '2018-10-31 01:23:10',
      colors: ['#000000', '#abbcda', '#424153', '#66cccc', '#333399'],
      path: 'https://w.wallhaven.cc/full/94/wallhaven-94x38z.jpg',
      thumbs: {
        large: 'https://th.wallhaven.cc/lg/94/94x38z.jpg',
        original: 'https://th.wallhaven.cc/orig/94/94x38z.jpg',
        small: 'https://th.wallhaven.cc/small/94/94x38z.jpg',
      },
      tags: [
        {
          id: 1,
          name: 'anime',
          alias: 'Chinese cartoons',
          category_id: 1,
          category: 'Anime & Manga',
          purity: 'sfw',
          created_at: '2015-01-16 02:06:45',
        },
      ],
    };
    // throw new Error('');
    // setTimeout(() => {
      res({ ...fake, path: fakeImg.default } as WHWallpaperData);
    // }, 5000);
  });
};

const disassembleObjToTable = (
  obj: Record<string, unknown>,
  header: string,
): JSX.Element => {
  return (
    <table className="table">
      <thead>
        <th>{header}</th>
      </thead>
      <tbody>
        {Object.entries(obj).map(entry => {
          const [key, val] = entry;
          if (typeof val === 'object' && val !== null) {
            return (
              <tr key={key}>
                <td colSpan={9999}>
                  {disassembleObjToTable(val as Record<string, unknown>, key)}
                </td>
              </tr>
            );
          }
          return (
            <tr key={key}>
              <th scope="col">{key}</th>
              <th scope="col">{val as string}</th>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export interface DetailsPageProps {
  apiKey?: string;
}

export const DetailsPage: React.FC<DetailsPageProps> = (
  props: DetailsPageProps,
) => {
  const [loaded, setLoaded] = React.useState<boolean | undefined>(undefined);
  const [imgData, setImgData] = React.useState<WHWallpaperData | undefined>(
    undefined,
  );
  const [imgPreloaded, setImgPreloaded] = React.useState<boolean | undefined>(
    undefined,
  );

  const params = useParams<{ id: string }>();
  const history = useHistory();

  const { apiKey } = React.useContext(SECRET_CONTEXT);
  const { loadImg } = React.useContext(LOADERS_CONTEXT);

  React.useEffect(() => {
    // console.log(params.id, apiKey);
    // fakeAccessWHWallpaper(params.id, apiKey)
    accessWHWallpaper(params.id, apiKey)
      .then(data => {
        setImgData(data);
        loadImg(data.path).then(result => {
          // setTimeout(() => {
            setImgPreloaded(result);
          // }, 2000);
        });
        setLoaded(true);
      })
      .catch(() => setLoaded(false));
  }, [params.id]);

  let content: JSX.Element | undefined;

  if (loaded === undefined) content = <SpinnerBorder />;
  else if (loaded === false || imgPreloaded === false)
    content = (
      <div className="alert alert-error" role="alert">
        Failed to load image
      </div>
    );
  else if (imgPreloaded) content = <img src={imgData?.path} />;
  else content = <SpinnerGrowing />;

  return (
    <section className={styles.root}>
      <aside className={`${styles.root__aside} table-responsive table-sm`}>
        {disassembleObjToTable(
          (imgData as unknown as Record<string, unknown>) || {},
          'Info',
        )}
      </aside>
      <div className={styles.root__content}>
        {content}
        <button
          className={`${styles['root__btn-backward']} btn btn-secondary`}
          onClick={() => history.goBack()}
        >
          Back to search
        </button>
      </div>
    </section>
  );
};
