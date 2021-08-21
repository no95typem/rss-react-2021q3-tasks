/**
 * @jest-environment jsdom
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { ImgFetcher } from '../img-fetcher';

describe('img-fetcher', () => {
  it('tries to load img', async () => {
    const REQ_PER_WIND = 2;
    const WIND = 30;
    const fetcher = new ImgFetcher(REQ_PER_WIND, WIND);

    let res1: boolean | undefined;
    let res2: boolean | undefined;
    let res3: boolean | undefined;

    const load1 = fetcher.loadImg('yyy').then(result => {
      res1 = result;
    });
    const load2 = fetcher.loadImg('xxx').then(result => {
      res2 = result;
    });
    const load3 = fetcher.loadImg('zzz').then(result => {
      res3 = result;
    });

    await new Promise(res => setTimeout(res, 200));

    expect(res1).toBeFalsy();
    expect(res2).toBeFalsy();
    expect(res3).toBeUndefined();
  });
});
