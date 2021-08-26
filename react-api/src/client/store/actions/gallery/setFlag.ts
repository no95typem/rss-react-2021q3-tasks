import { Action } from 'redux';
import { GalleryFlags } from '../../initials/galleryState';
import { Actions } from '../actions.d';

export interface SetFlagAction extends Action {
  payload: { key: GalleryFlags; val: boolean };
}

export const setFlag = (key: GalleryFlags, val: boolean): SetFlagAction => {
  return {
    type: Actions.GALLERY_SET_FLAG,
    payload: { key, val },
  };
};
