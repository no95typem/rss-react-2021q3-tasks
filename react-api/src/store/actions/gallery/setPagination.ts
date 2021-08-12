import { Action } from 'redux';
import { WHPaginationData } from '../../../defs';
import { GalleryActions } from './gallery-actions.d';

export interface SetPaginationAction extends Action {
  payload: WHPaginationData;
}

export const setPagination = (data: WHPaginationData): SetPaginationAction => {
  return {
    type: GalleryActions.SET_PAGINATION,
    payload: data,
  };
};
