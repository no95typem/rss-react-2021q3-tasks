import { Action } from 'redux';
import { Actions } from '../actions.d';

export interface SetContentScrollTopAction extends Action {
  payload: number;
}

export const setContentScrollTop = (val: number): SetContentScrollTopAction => {
  return {
    type: Actions.GALLERY_SET_CONTENT_SCROLL_TOP,
    payload: val,
  };
};
