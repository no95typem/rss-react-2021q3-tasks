import { OBJ_PROCESSOR } from '../lib/processors/obj-processor';

class WHSortingClass {
  readonly 'date_added' = 'date_added';

  readonly 'relevance' = 'relevance';

  readonly 'random' = ' random';

  readonly 'views' = ' views';

  readonly 'favorites' = 'favorites';

  readonly 'toplist' = 'toplist';
}

export const WHSortings = OBJ_PROCESSOR.deepFreeze(new WHSortingClass());

export type WHSorting = keyof WHSortingClass;
