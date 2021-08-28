import { Action } from 'redux';
import { Actions } from '../actions.d';

export interface SetApiKeyAction extends Action {
  payload: string | undefined;
}

export const setApiKey = (apiKey: string | undefined): SetApiKeyAction => {
  return {
    type: Actions.CORE_SET_API_KEY,
    payload: apiKey,
  };
};
