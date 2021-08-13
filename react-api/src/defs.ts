import { OBJ_PROCESSOR } from './lib/processors/obj-processor';
import { WHCategories, WHCategoriesList } from './wallheaven-types/categories';
import { WHPurities, WHPurityList } from './wallheaven-types/purity';
import { WHSorting, WHSortings } from './wallheaven-types/sorting';

// export type ReactHookSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type WHImageData = {
  id: string;
  src?: string;
  loadSuccess?: boolean;
  path?: string;
};
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

export type WHPagination = {
  current_page: number;
  last_page: number;
  per_page: number;
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
