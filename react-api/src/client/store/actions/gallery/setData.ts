import { Action } from 'redux';
import { WHSearchDataItemWithLifecycle } from '../../../defs';
import { Actions } from '../actions.d';

export interface SetDataAction extends Action {
  payload: Record<string, WHSearchDataItemWithLifecycle>;
}

export const setData = (
  data: Record<string, WHSearchDataItemWithLifecycle>,
): SetDataAction => {
  return {
    type: Actions.GALLERY_SET_DATA,
    payload: data,
  };
};
