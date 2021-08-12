import { Action } from 'redux';
import { WHQuery } from '../../../defs';
import { GalleryActions } from './gallery-actions.d';

export interface SetQueryAction extends Action {
  payload: WHQuery;
}

export const setQuery = (query: WHQuery): SetQueryAction => {
  return {
    type: GalleryActions.SET_QUERY,
    payload: query,
  };
};
