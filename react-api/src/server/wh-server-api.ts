import fetch from 'node-fetch';

import { DEFAULT_WH_PER_PAGE_VALUE } from '../shared/wallheaven-types/pagination';

import {
  WHSearchDataItem,
  WHSearchMeta,
  WHSearchResponse,
} from '../shared/wallheaven-types/wh-search-data';
import { WHWallpaperData } from '../shared/wallheaven-types/wh-wallpaper-data';
import { WHWpInfoProxyReq, WHSearchProxyReq } from './wh-server-api.def';

const WH_API_BASE_STR = 'https://wallhaven.cc/api/v1/';

/* --- GET ONE WALLPAPER --- */

export const getWHWallpaper = (
  req: WHWpInfoProxyReq,
): Promise<WHWallpaperData> => {
  return new Promise((res, rej) => {
    fetch(`${WH_API_BASE_STR}w/${req.id}${req.apiKey ? `?${req.apiKey}` : ''}`)
      .then(response => {
        if (response.status !== 200) throw new Error(response.statusText);
        else return response.json();
      })
      .then(json => res(json.data as WHWallpaperData))
      .catch(err => rej(err));
  });
};

/* --- FAKE --- */

const fakeImgSrc = '/public/test-image.jpg';

export const getWHWallpaperFake = (): Promise<WHWallpaperData> => {
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
    res({ ...fake, path: fakeImgSrc } as WHWallpaperData);
    // }, 5000);
  });
};

/* ---/// FAKE --- */

/* --- /// GET ONE WALLPAPER --- */

/* --- GET WH SEARCH RESULT --- */

export const getWHSearch = (
  req: WHSearchProxyReq,
): Promise<WHSearchResponse> => {
  return new Promise((res, rej) => {
    fetch(`${WH_API_BASE_STR}${req.fetchStr}`)
      .then(response => {
        if (response.status !== 200) throw new Error(response.statusText);
        else return response.json();
      })
      .then(json => res(json))
      .catch(err => rej(err));
  });
};

/* --- FAKE --- */

const FAKE_PREVIEW_SRC = '/public/test-preview.jpg';
const FAKE_ITEMS_COUNT = 24;

const genFakeData = (page: number): WHSearchResponse => {
  const fakeData = Array(FAKE_ITEMS_COUNT)
    .fill(null)
    .map(() => {
      return {
        id: Math.random() * 1000, // ! Create true node random with crypto!
        thumbs: {
          small: FAKE_PREVIEW_SRC,
        },
        path: FAKE_PREVIEW_SRC,
        loadSuccess: undefined,
      } as unknown as WHSearchDataItem;
    });

  const fakeMeta = {
    current_page: page,
    total: FAKE_ITEMS_COUNT * 100,
    last_page: 100,
    per_page: DEFAULT_WH_PER_PAGE_VALUE,
  } as WHSearchMeta;

  return { data: fakeData, meta: fakeMeta };
};

export const getWHSearchFake = async (
  req: WHSearchProxyReq,
): Promise<WHSearchResponse> => {
  const url = new URLSearchParams(req.fetchStr);
  if (url.get('q') === 'ERROR') throw new Error();
  const page = url.get('page');
  const fakeResponse = genFakeData(page ? +page : 1);
  return fakeResponse;
};

/* ---/// FAKE --- */

/* ---/// GET WH SEARCH RESULT --- */
