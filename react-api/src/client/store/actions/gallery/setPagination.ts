import { Action } from 'redux';
import { WHPaginationData } from '../../../defs';
import { Actions } from '../actions.d';

export interface SetPaginationAction extends Action {
  payload: WHPaginationData;
}

export const setPagination = (data: WHPaginationData): SetPaginationAction => {
  return {
    type: Actions.GALLERY_SET_PAGINATION,
    payload: data,
  };
};
