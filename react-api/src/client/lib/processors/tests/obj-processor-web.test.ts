/**
 * @jest-environment jsdom
 */

import { OBJ_PROCESSOR } from '../obj-processor';

describe('obj-processor in JSDOM env', () => {
  it('return HTMLElement when it is passed as arg', () => {
    expect(OBJ_PROCESSOR.deepClone(new Image())).toBeInstanceOf(Image);
  });
});
