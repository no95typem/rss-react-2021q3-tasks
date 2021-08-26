import { ImgFetcher } from '../../services/img-fetcher/img-fetcher';
import { CoreState } from '../state';

const WALLHAVEN_WINDOW = 60000;
const WALLHAVEN_REQ_PER_WINDOW = 700; // ! in fact 45 req per min for API, for images I don't know...

export const CORE_INITIAL_STATE: CoreState = {
  apiKey: undefined,
  imgFetcher: new ImgFetcher(WALLHAVEN_REQ_PER_WINDOW, WALLHAVEN_WINDOW),
};
