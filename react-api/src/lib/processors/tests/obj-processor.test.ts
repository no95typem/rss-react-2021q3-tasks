// ! set no dom !

import { OBJ_PROCESSOR } from '../obj-processor';

describe('obj-processor in WEBWORKER env', () => {
  it('throws error when arg is not an obj', () => {
    let throwError = false;
    try {
      OBJ_PROCESSOR.deepFreeze(1);
    } catch {
      throwError = true;
    }
    expect(throwError).toBeTruthy();
  });

  it('returns new Date for deepClone', () => {
    expect(OBJ_PROCESSOR.deepClone(new Date())).toBeInstanceOf(Date);
  });

  it('create clone for webworker', () => {
    const obj = { v: { m: [2] } };
    const clone = OBJ_PROCESSOR.deepCloneForWebworker(obj);
    expect(clone.v.m[0] === obj.v.m[0]).toBeTruthy();
  });
});
