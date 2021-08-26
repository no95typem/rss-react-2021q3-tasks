import { combineReducers } from 'redux';
import { coreStateReducer } from './coreState-reducer';
import { detaildPageStateReducer } from './detailsPageState-reducer';
import { galleryStateReducer } from './galleryState-reducer';

export const rootReducer = combineReducers({
  galleryState: galleryStateReducer,
  detailsPageState: detaildPageStateReducer,
  coreState: coreStateReducer,
});
