import { OBJ_PROCESSOR } from '../lib/processors/obj-processor';

class WHPerPageValuesClass {
  readonly '24' = '24';

  readonly '32' = '32';

  readonly '64' = '64';
}

export const WHPerPageValues = OBJ_PROCESSOR.deepFreeze(
  new WHPerPageValuesClass(),
);

export type WHPerPageValue = keyof WHPerPageValuesClass;

export const DEFAULT_WH_PER_PAGE_VALUE: WHPerPageValue = '24';
