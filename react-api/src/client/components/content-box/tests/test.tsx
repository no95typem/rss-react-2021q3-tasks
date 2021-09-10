/**
 * @jest-environment jsdom
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as React from 'react';

import '@testing-library/jest-dom';
import { getByText } from '@testing-library/dom';

import { render, screen } from '../../../test-utils';

import { ContentBox } from '../content-box';
import ContentItem from '../content-item/content-item';
import { WHSearchDataItemWithLifecycle } from '../../../defs';


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

describe('content item', () => {
  it('shows error whel load failed', () => {
    const failedData: WHSearchDataItemWithLifecycle = {
      loadSuccess: false,
    } as WHSearchDataItemWithLifecycle;
    render(<ContentItem data={failedData} />);
    const elem = screen.getByRole('status');
    expect(getByText(elem, /fail/i)).toBeVisible();
  });
});
