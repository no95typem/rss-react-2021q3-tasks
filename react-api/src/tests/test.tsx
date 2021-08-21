/**
 * @jest-environment jsdom
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as React from 'react';
import '@testing-library/jest-dom';
import {
  findAllByTestId,
  findByRole,
  findByTestId,
  fireEvent,
  getAllByRole,
  getAllByText,
  getByLabelText,
  getByRole,
  getByText,
  waitForElementToBeRemoved,
} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { App } from '../components/app/app';
import { render, screen } from '../test-utils';

import { WHSearchBox } from '../components/wh-search-box/wh-search-box';
import { CORS_PROXY, DEFALUT_WHQUERY, WHQuery } from '../defs';

import { WHCategories, WHCategoriesList } from '../wallheaven-types/categories';
import { WHPurities, WHPurityList } from '../wallheaven-types/purity';
import { ContentBox } from '../components/content-box/content-box';

import { Provider } from 'react-redux';
import store from '../store/store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { ImgFetcher } from '../services/img-fetcher/img-fetcher';
import { genRandomHexColor, genUniqId } from '../lib/generators/generators';
import { modQuery, calcWHQueryStr } from '../services/wh-api/wh-api';
import { WHSorting } from '../wallheaven-types/sorting';

describe('App', () => {
  it('integrates gallery and details', async () => {
    const history = createMemoryHistory();
    render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>,
    );

    const search = await screen.findByRole('search');
    userEvent.type(search, 'test');
    fireEvent(
      search,
      new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
      }),
    );

    await new Promise(res => setTimeout(res, 500));

    const imgs = await screen.findAllByTestId('content-img');

    userEvent.click(await findByRole(imgs[0] as HTMLElement, 'img'));

    await new Promise(res => setTimeout(res, 1000));

    expect(history.location.pathname).toMatch(/details/i);
  });

  it('shows the about page', async () => {
    const history = createMemoryHistory();
    history.push('about');
    render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>,
    );
    expect(screen.getAllByText(/about/i).length).toBeGreaterThanOrEqual(2);
  });

  it('shows the 404 page', async () => {
    const history = createMemoryHistory();
    history.push('dasdaskdjaplkda[ijdpia');
    render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>,
    );
    expect(screen.getAllByText(/404/i).length).toBeGreaterThan(0);
  });
});

describe('SearchBox', () => {
  const query = DEFALUT_WHQUERY;

  it('renders', () => {
    render(
      <WHSearchBox query={query} onChange={() => {}} onSubmit={() => {}} />,
    );
  });

  it('calls onSubmit', () => {
    const onSubmit = jest.fn();
    render(
      <WHSearchBox query={query} onChange={() => {}} onSubmit={onSubmit} />,
    );
    fireEvent(
      screen.getByRole('search'),
      new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
      }),
    );
    expect(onSubmit).toBeCalledTimes(1);
  });

  it('calls onChange for categories', () => {
    const onChange = jest.fn();
    const categories = Object.getOwnPropertyNames(WHCategories);
    render(
      <WHSearchBox query={query} onSubmit={() => {}} onChange={onChange} />,
    );
    categories.forEach(c => {
      userEvent.click(screen.getByText(c));
    });
    expect(onChange).toBeCalledTimes(categories.length);
  });

  it('calls onChange for purities', () => {
    const onChange = jest.fn();
    const categories = Object.getOwnPropertyNames(WHPurities);
    render(
      <WHSearchBox query={query} onSubmit={() => {}} onChange={onChange} />,
    );
    categories.forEach(c => {
      userEvent.click(screen.getByText(c));
    });
    expect(onChange).toBeCalledTimes(categories.length);
  });
});

describe('ContentBox', () => {
  it('renders', () => {
    render(<ContentBox memory={{}} />);
  });

  it('show alert for error', () => {
    render(<ContentBox memory={{}} error />);
    screen.getByRole('alert');
  });

  it('show status when it is needed', () => {
    render(<ContentBox memory={{}} fetching />);
    screen.getByRole('status');
  });

  it('show alert if nothing found', () => {
    render(<ContentBox memory={{}} searchPerformed />);
    screen.getByRole('alert');
  });

  it('show info for start', () => {
    render(<ContentBox memory={{}} />);
    screen.getByRole('contentinfo');
  });
});

describe('img-fetcher', () => {
  it('try to load img', async () => {
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

describe('details page', () => {
  it('try to load an img by id and shows alert', async () => {
    const history = createMemoryHistory();
    history.push('details/testid');
    render(
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>,
    );

    expect(await screen.findByRole('alert')).toBeDefined();
  });
});

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
});

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
  });

  it('should open notification when api is not set and nsfw is on', async () => {
    const purities: WHPurityList = ['sfw', 'nsfw', 'sketchy'];
    const modedQuery = modQuery(DEFALUT_WHQUERY, 'purity', purities);

    await screen.findByRole('dialog');
  });
});
