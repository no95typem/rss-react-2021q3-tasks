import { Action } from 'redux';
import { GalleryActions } from './gallery-actions.d';

export interface SetContentScrollTopAction extends Action {
  payload: number;
}

export const setContentScrollTop = (val: number): SetContentScrollTopAction => {
  return {
    type: GalleryActions.SET_CONTENT_SCROLL_TOP,
    payload: val,
  };
};
