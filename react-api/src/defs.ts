import { OBJ_PROCESSOR } from './lib/processors/obj-processor';
import { WHCategories, WHCategoriesList } from './wallheaven-types/categories';
import { WHPurities, WHPurityList } from './wallheaven-types/purity';
import { WHSorting, WHSortings } from './wallheaven-types/sorting';

export class WHQuery {
  constructor(
    public q: string,
    public categories: WHCategoriesList,
    public purity: WHPurityList,
    public sorting: WHSorting,
  ) {}
}

export const DEFALUT_WHQUERY = OBJ_PROCESSOR.deepFreeze(
  new WHQuery(
    '',
    [WHCategories.general],
    [WHPurities.sfw],
    WHSortings.date_added,
  ),
);
