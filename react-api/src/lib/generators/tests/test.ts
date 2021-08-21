/**
 * @jest-environment jsdom
 */

import {
  gen2DArray,
  genRandomHexColor,
  genUniqId,
  getRandomArbitraryInt,
  getRandomInt,
} from '../generators';

const checkRandom = (func: () => unknown) => {
  const ids = Array(100)
    .fill(null)
    .map(() => func());

  return ids.some((currId, currIndex) => {
    return ids.some((id, index) => id === currId && index !== currIndex);
  });
};

describe('generators', () => {
  it('should generate uniqId', () => {
    const isDuplicateExist = checkRandom(genUniqId);
    expect(isDuplicateExist).toBeFalsy();
  });

  it('should generate rand hex', () => {
    const isDuplicateExist = checkRandom(genRandomHexColor);
    expect(isDuplicateExist).toBeFalsy();
  });

  it('should gen2darray', () => {
    const matrix = gen2DArray(7, 3);

    expect(matrix.length).toEqual(7);
    expect(matrix[0].length).toEqual(3);
  });

  it('should gen rand integers', () => {
    for (let i = 0; i < 1000; i += 10) {
      const rand = getRandomInt(i);
      expect(rand).toBeLessThanOrEqual(i);
      const arbRand = getRandomArbitraryInt(rand, i);
      expect(arbRand).toBeGreaterThanOrEqual(rand);
      expect(arbRand).toBeLessThanOrEqual(i);
    }
  });
});
