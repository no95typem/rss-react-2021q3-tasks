/**
 * @jest-environment jsdom
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as React from 'react';

import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../test-utils';

import { DEFALUT_WHQUERY } from '../../../defs';
import { WHSearchBox } from '../wh-search-box';
import { WHCategories } from '../../../wallheaven-types/categories';

import { WHPurities } from '../../../wallheaven-types/purity';

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
