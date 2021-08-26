/**
 * @jest-environment jsdom
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '../../../test-utils';
import { ErrorPlug } from '../error-plug';

describe('error-plug', () => {
  it('renders', () => {
    render(<ErrorPlug />);
  });
});
