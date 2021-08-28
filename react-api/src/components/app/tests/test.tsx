/**
 * @jest-environment jsdom
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as React from 'react';

import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import '@testing-library/jest-dom';
import { findByRole, fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../test-utils';

import store from '../../../store/store';
import { App } from '../app';

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

    let search = await screen.findByRole('search');

    userEvent.type(screen.getByPlaceholderText(/api/i), 'xxx');
    expect(store.getState().coreState.apiKey).toEqual('xxx');

    userEvent.type(search, 'ERROR');
    fireEvent(
      search,
      new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
      }),
    );

    await new Promise(res => setTimeout(res, 500));

    expect(await screen.findByRole('alert')).toBeVisible();

    userEvent.type(search, 'zzz');
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
    history.push('/about');
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

  it('render details and tries to load an img by id and shows alert when fails', async () => {
    const history = createMemoryHistory();
    history.push('/details/testid');
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
