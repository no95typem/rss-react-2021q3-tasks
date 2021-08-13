import { Action } from 'redux';
import { Actions } from '../actions.d';

export const resetDetailsPageState = (): Action => {
  return {
    type: Actions.DETAILS_PAGE_RESET,
  };
};
