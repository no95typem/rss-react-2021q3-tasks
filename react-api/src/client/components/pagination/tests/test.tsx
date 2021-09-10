/**
 * @jest-environment jsdom
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as React from 'react';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { screen, render } from '../../../test-utils';

import { Pagination } from '../pagination';

describe('pagination', () => {
  it('calls onChange', async () => {
    const onChange = jest.fn();

    render(
      <Pagination
        current={1}
        total={600}
        perPage={20}
        maxBtns={10}
        onChange={onChange}
      />,
    );

    expect(screen.getByText('1')).toBeVisible();
    expect(screen.getByText('30')).toBeVisible();

    userEvent.click(screen.getByText('2'));

    expect(onChange).toBeCalledTimes(1);

    const numbersCtl = screen.getAllByRole('radio');

    const more = screen.getByText('...');

    expect(more).toBeDefined();

    userEvent.click(more as HTMLElement);

    const numbersCtl2 = screen.getAllByRole('radio');

    const notEqual = numbersCtl.some((v, i) => v !== numbersCtl2[i]);

    expect(notEqual).toBeTruthy();

    // userEvent.click()
  });
});
