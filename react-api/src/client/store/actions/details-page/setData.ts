import { Action } from 'redux';
import { WHWallpaperData } from '../../../../shared/wallheaven-types/wh-wallpaper-data';
import { Actions } from '../actions.d';

export interface SetDetailsPageDataAction extends Action {
  payload: WHWallpaperData | undefined;
}

export const setData = (
  data: WHWallpaperData | undefined,
): SetDetailsPageDataAction => {
  return {
    type: Actions.DETAILS_PAGE_SET_DATA,
    payload: data,
  };
};
