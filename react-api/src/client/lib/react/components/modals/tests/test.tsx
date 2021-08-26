/**
 * @jest-environment jsdom
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as React from 'react';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../../../test-utils';

import { BootstrapModal } from '../bootstrap-modal';
import { genUniqId } from '../../../../generators/generators';

describe('bootstrap-modal', () => {
  it('renders and calls cbs', () => {
    const onClose = jest.fn();
    const onOk = jest.fn();
    render(
      <BootstrapModal
        id={genUniqId()}
        ariaLabel="bootstrap test modal"
        onClose={onClose}
        title="test title"
        body="test body"
        btnText="OK"
        onOk={onOk}
      />,
    );

    screen.getAllByRole('button').forEach(b => userEvent.click(b));

    expect(onClose).toBeCalledTimes(2);
    expect(onOk).toBeCalledTimes(1);
  });
});
