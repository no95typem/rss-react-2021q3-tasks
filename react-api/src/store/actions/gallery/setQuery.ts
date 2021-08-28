import { Action } from 'redux';
import { WHQuery } from '../../../defs';
import { Actions } from '../actions.d';

export interface SetQueryAction extends Action {
  payload: WHQuery;
}

export const setQuery = (query: WHQuery): SetQueryAction => {
  return {
    type: Actions.GALLERY_SET_QUERY,
    payload: query,
  };
};
