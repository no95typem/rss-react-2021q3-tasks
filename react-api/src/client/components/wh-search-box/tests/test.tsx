/**
 * @jest-environment jsdom
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as React from 'react';

import '@testing-library/jest-dom';
import { findByRole, fireEvent, getByText, queryByText } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../test-utils';

import { DEFALUT_WHQUERY, WHPaginationData } from '../../../defs';
import { WHSearchBox } from '../wh-search-box';
import { WHCategories } from '../../../../shared/wallheaven-types/categories';

import { WHPurities } from '../../../../shared/wallheaven-types/purity';

describe('SearchBox', () => {
  const query = DEFALUT_WHQUERY;

  it('renders', () => {
    render(
      <WHSearchBox query={query} onChange={() => {}} onSubmit={() => {}} />,
    );
  });

  it('renders per page error modal', async () => {
    const pagination: WHPaginationData = {
      current_page: 1,
      last_page: 20,
      per_page: '24',
      total: 100,
    };

    render(
      <WHSearchBox
        query={query}
        onChange={() => {}}
        onSubmit={() => {}}
        pagination={pagination}
      />,
    );

    const selects = screen.getAllByRole('listbox');

    const perPageSelect = selects.find(s =>
      queryByText(s, pagination.per_page),
    );

    expect(perPageSelect).toBeVisible();

    userEvent.selectOptions(perPageSelect as HTMLSelectElement, '32');

    expect(screen.getByRole('dialog')).toBeVisible();
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
