import { Action } from 'redux';
import { WHSearchDataItemWithLifecycle } from '../../../defs';
import { GalleryActions } from './gallery-actions.d';

export interface SetDataAction extends Action {
  payload: Record<string, WHSearchDataItemWithLifecycle>;
}

export const setData = (
  data: Record<string, WHSearchDataItemWithLifecycle>,
): SetDataAction => {
  return {
    type: GalleryActions.SET_DATA,
    payload: data,
  };
};
