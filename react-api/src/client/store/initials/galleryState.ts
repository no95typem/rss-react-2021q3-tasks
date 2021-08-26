import { DEFALUT_WHQUERY } from '../../defs';
import { GalleryState } from '../state';

export const GALLERY_INITIAL_STATE: GalleryState = {
  query: DEFALUT_WHQUERY,
  dataMap: {},
  paginationData: undefined,
  contentScrollTop: 0,
  flags: {
    fetching: false,
    error: false,
    searchPerformed: false,
    end: true,
  },
};

export type GalleryFlags = keyof typeof GALLERY_INITIAL_STATE.flags;
