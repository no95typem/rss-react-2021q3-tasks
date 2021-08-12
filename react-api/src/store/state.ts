import {
  DEFALUT_WHQUERY,
  WHPaginationData,
  WHQuery,
  WHSearchDataItemWithLifecycle,
} from '../defs';

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
  wtf: unknown;
}

export interface State {
  galleryState: GalleryState;
  detailsPageState: DetailsPageState;
}
