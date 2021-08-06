import { OBJ_PROCESSOR } from '../lib/processors/obj-processor';

class WHPurityClass {
  readonly 'sfw' = 'sfw';

  readonly 'sketchy' = 'sketchy';

  readonly 'nsfw' = 'nsfw';
}

export const WHPurities = OBJ_PROCESSOR.deepFreeze(new WHPurityClass());

export type WHPurityList = (keyof WHPurityClass)[];
