import { Action } from 'redux';
import { Actions } from '../actions/actions.d';
import { SetApiKeyAction } from '../actions/core/setApiKey';
import { CORE_INITIAL_STATE } from '../initials/coreState';
import { CoreState } from '../state';

export const coreStateReducer = (
  state = CORE_INITIAL_STATE,
  action: Action,
): CoreState => {
  switch (action.type) {
    case Actions.CORE_SET_API_KEY:
      return { ...state, apiKey: (action as SetApiKeyAction).payload };
    default:
      return state;
  }
};
