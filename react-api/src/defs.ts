import { OBJ_PROCESSOR } from './lib/processors/obj-processor';
import { WHCategories, WHCategoriesList } from './wallheaven-types/categories';
import { WHPerPageValue } from './wallheaven-types/pagination';
import { WHPurities, WHPurityList } from './wallheaven-types/purity';
import { WHSorting, WHSortings } from './wallheaven-types/sorting';
import { WHSearchDataItem } from './wallheaven-types/wh-search-data';

// export type ReactHookSetter<T> = React.Dispatch<React.SetStateAction<T>>;

// export type WHImageEssentialData = {
//   id: string;
//   src?: string;
//   loadSuccess?: boolean;
//   path?: string;
// };

export interface WHSearchDataItemWithLifecycle extends WHSearchDataItem {
  loadSuccess?: boolean;
}

export class WHQuery {
  constructor(
    public q: string,
    public categories: WHCategoriesList,
    public purity: WHPurityList,
    public sorting: WHSorting,
    public page: number,
    public apiKey?: string,
  ) {}
}

export type WHPaginationData = {
  current_page: number;
  last_page: number;
  per_page: WHPerPageValue;
  total: number;
};

export const DEFALUT_WHQUERY = OBJ_PROCESSOR.deepFreeze(
  new WHQuery(
    '',
    [WHCategories.general],
    [WHPurities.sfw],
    WHSortings.date_added,
    1,
  ),
);

export const CORS_PROXY = 'http://localhost:3020/';
