import { Action } from 'redux';
import { Actions } from '../actions/actions.d';
import { SetDetailsPageDataAction } from '../actions/details-page/setData';
import { SetDetailsPageFlagAction } from '../actions/details-page/setFlag';
import { DETAILS_PAGE_INIT_STATE } from '../initials/detailsPageFlag';
import { DetailsPageState } from '../state';

export const detaildPageStateReducer = (
  state = DETAILS_PAGE_INIT_STATE,
  action: Action,
): DetailsPageState => {
  switch (action.type) {
    case Actions.DETAILS_PAGE_SET_DATA:
      return { ...state, data: (action as SetDetailsPageDataAction).payload };
    case Actions.DETAILS_PAGE_SET_FLAG:
      const sfA = action as SetDetailsPageFlagAction;
      const flags = { ...state.flags };
      flags[sfA.payload.key] = sfA.payload.val;
      return { ...state, flags };
    case Actions.DETAILS_PAGE_RESET:
      return DETAILS_PAGE_INIT_STATE;
    default:
      return state;
  }
};
