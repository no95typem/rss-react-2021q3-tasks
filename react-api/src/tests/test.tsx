/**
 * @jest-environment jsdom
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as React from 'react';
import '@testing-library/jest-dom';
import { App } from '../components/app/app';
import { render, screen } from '../test-utils';

describe('Test', () => {
  test('render', () => {
    render(<App />);

    screen.debug();
  });
});
