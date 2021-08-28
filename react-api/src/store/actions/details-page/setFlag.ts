import { Action } from 'redux';
import { DetailsPageFlag } from '../../initials/detailsPageFlag';
import { Actions } from '../actions.d';

export interface SetDetailsPageFlagAction extends Action {
  payload: { key: DetailsPageFlag; val: boolean };
}

export const setFlag = (
  key: DetailsPageFlag,
  val: boolean,
): SetDetailsPageFlagAction => {
  return {
    type: Actions.DETAILS_PAGE_SET_FLAG,
    payload: { key, val },
  };
};
