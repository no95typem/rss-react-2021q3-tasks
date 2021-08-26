import {
  WHPaginationData,
  WHQuery,
  WHSearchDataItemWithLifecycle,
} from '../defs';
import { ImgFetcher } from '../services/img-fetcher/img-fetcher';
import { WHWallpaperData } from '../../shared/wallheaven-types/wh-wallpaper-data';

export interface GalleryState {
  query: WHQuery;
  dataMap: Record<string, WHSearchDataItemWithLifecycle>;
  paginationData: WHPaginationData | undefined;
  contentScrollTop: number;
  flags: {
    fetching: boolean;
    error: boolean;
    searchPerformed: boolean;
    end: boolean;
  };
}

export interface DetailsPageState {
  data?: WHWallpaperData;
  flags: {
    dataLoaded: boolean | undefined; // true - success, false - error, undefined - not try
    imgPreloaded: boolean | undefined; // true - success, false - error, undefined - not try
  };
}

export interface CoreState {
  apiKey?: string;
  imgFetcher: ImgFetcher;
}

export interface State {
  coreState: CoreState;
  galleryState: GalleryState;
  detailsPageState: DetailsPageState;
}
