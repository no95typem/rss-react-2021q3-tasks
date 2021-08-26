import { OBJ_PROCESSOR } from '../../client/lib/processors/obj-processor';

class WHCategoriesClass {
  readonly 'general' = 'general';

  readonly 'anime' = 'anime';

  readonly 'people' = 'people';
}

export const WHCategories = OBJ_PROCESSOR.deepFreeze(new WHCategoriesClass());

export type WHCategoriesList = (keyof WHCategoriesClass)[];
