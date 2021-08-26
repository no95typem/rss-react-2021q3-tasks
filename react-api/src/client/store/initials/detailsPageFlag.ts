import { DetailsPageState } from '../state';

export const DETAILS_PAGE_INIT_STATE: DetailsPageState = {
  data: undefined,
  flags: {
    dataLoaded: undefined,
    imgPreloaded: undefined,
  },
};

export type DetailsPageFlag = keyof typeof DETAILS_PAGE_INIT_STATE.flags;
