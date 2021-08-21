/**
 * @jest-environment jsdom
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as React from 'react';

import '@testing-library/jest-dom';
import { getByText } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../test-utils';
import { Select, SelectOption } from '../select';

describe('select', () => {
  const options: SelectOption[] = [
    {
      value: 'test1',
      text: 'test1',
    },
    {
      value: 'test2',
      text: 'test2',
    },
  ];
  it('should call callback on change', () => {
    const onChange = jest.fn();
    render(
      <Select onChange={onChange} options={options} ariaLabel="test select" />,
    );

    userEvent.selectOptions(screen.getByRole('listbox'), 'test2');

    expect(onChange).toBeCalled();
  });
});
