import { OBJ_PROCESSOR } from '../lib/processors/obj-processor';

class WHPaginationVariantsClass {
  readonly '24' = '24';

  readonly '32' = '32';
}

export const WHPaginationVariants = OBJ_PROCESSOR.deepFreeze(
  new WHPaginationVariantsClass(),
);

export type WHPaginationPerPage = (keyof WHPaginationVariantsClass)[];

export const DEFAULT_WH_PER_PAGE = '24';
