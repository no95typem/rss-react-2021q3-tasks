/**
 * @jest-environment jsdom
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as React from 'react';

import '@testing-library/jest-dom';
import { queryByText } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { screen } from '../../../test-utils';

import { CORS_PROXY, DEFALUT_WHQUERY } from '../../../defs';
import { WHCategoriesList } from '../../../wallheaven-types/categories';
import { WHPurityList } from '../../../wallheaven-types/purity';
import { WHSorting } from '../../../wallheaven-types/sorting';
import {
  accessWHWallpaper,
  calcWHQueryStr,
  loadDataFromWH,
  modQuery,
} from '../wh-api';

describe('wh-api', () => {
  it('should mod query and transform query to string', () => {
    const query = DEFALUT_WHQUERY;
    const query1 = modQuery(query, 'apiKey', 'x');
    const categories: WHCategoriesList = ['anime', 'people'];
    const query2 = modQuery(query1, 'categories', categories);
    const purities: WHPurityList = ['sfw', 'nsfw', 'sketchy'];
    const query3 = modQuery(query2, 'purity', purities);
    const query4 = modQuery(query3, 'page', 5);
    const sorting: WHSorting = 'favorites';
    const query5 = modQuery(query4, 'sorting', sorting);
    const query6 = modQuery(query5, 'q', 'test');

    expect(query1.apiKey).toBe('x');
    expect(query2.categories.join('')).toBe(categories.join(''));
    expect(query3.purity.join('')).toBe(purities.join(''));
    expect(query4.page).toBe(5);
    expect(query5.sorting).toBe(sorting);
    expect(query6.q).toBe('test');

    const q = calcWHQueryStr(query6);
    expect(q).toBe(
      `${CORS_PROXY}http://wallhaven.cc/api/v1/search?q=test&categories=011&purity=111&sorting=favorites&page=5&apikey=x`,
    );

    const queryWithoutApiKey = modQuery(query6, 'apiKey', '');
    expect(queryWithoutApiKey.purity.includes('nsfw')).toBeFalsy();
  });

  it('should open notification when api is not set and nsfw is on', async () => {
    const purities: WHPurityList = ['sfw', 'nsfw', 'sketchy'];
    const modedQuery = modQuery(DEFALUT_WHQUERY, 'purity', purities);

    await screen.findByRole('dialog');

    const btns = screen.getAllByRole('button');

    const goToBtn = btns.find(btn => queryByText(btn, /settings/i));

    expect(goToBtn).toBeDefined();

    userEvent.click(goToBtn as HTMLElement);

    // screen.getByText(/close/i);
  });

  it('should throw an error when search query is not valid', async () => {
    const query = modQuery(DEFALUT_WHQUERY, 'q', undefined);
    const error = await loadDataFromWH(query).catch(err => err);
    expect(error).toBeInstanceOf(Error);
  });

  it('should throw error for specific wp info when id is INvalid', async () => {
    const error = await accessWHWallpaper(undefined as unknown as string).catch(
      err => err,
    );
    expect(error).toBeInstanceOf(Error);
  });

  it('should fetch when search query is valid', async () => {
    // global.fetch = jest.fn(
    //   () =>
    //     Promise.resolve({
    //       json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
    //     }) as Promise<Response>,
    // );
    global.fetch = (await import('node-fetch'))
      .default as unknown as typeof fetch;
    const result = await loadDataFromWH(DEFALUT_WHQUERY).catch(err => false);
    expect(result).toBeTruthy();
  });

  it('should fetch specific wp info when id is valid', async () => {
    global.fetch = (await import('node-fetch'))
      .default as unknown as typeof fetch;
    const ID = 'gjjlzd';
    const result = await accessWHWallpaper(ID).catch(err => false);
    expect(result).toBeTruthy();
  });
});
