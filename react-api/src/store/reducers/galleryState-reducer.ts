import { Action } from 'redux';
import { GalleryActions } from '../actions/gallery/gallery-actions.d';
import { SetFlagAction } from '../actions/gallery/setFlag';
import { SetDataAction } from '../actions/gallery/setData';
import { GALLERY_INITIAL_STATE } from '../initials/galleryState';
import { GalleryState } from '../state';
import { SetQueryAction } from '../actions/gallery/setQuery';
import { SetPaginationAction } from '../actions/gallery/setPagination';
import { SetContentScrollTopAction } from '../actions/gallery/setContentScrollTop';

export const galleryStateReducer = (
  state = GALLERY_INITIAL_STATE,
  action: Action,
): GalleryState => {
  switch (action.type) {
    case GalleryActions.SET_FLAG:
      const sfA = action as SetFlagAction;
      const flags = { ...state.flags };
      flags[sfA.payload.key] = sfA.payload.val;
      return { ...state, flags };
    case GalleryActions.SET_DATA:
      const sdA = action as SetDataAction;
      return { ...state, dataMap: sdA.payload };
    case GalleryActions.SET_QUERY:
      const sqA = action as SetQueryAction;
      return { ...state, query: sqA.payload };
    case GalleryActions.SET_PAGINATION:
      const spA = action as SetPaginationAction;
      return { ...state, paginationData: spA.payload };
    case GalleryActions.SET_CONTENT_SCROLL_TOP:
      return {
        ...state,
        contentScrollTop: (action as SetContentScrollTopAction).payload,
      };
    default:
      return state;
  }
};
