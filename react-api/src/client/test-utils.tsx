import * as React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store/store';

export const AllTheProviders: React.FC = ({
  // eslint-disable-next-line react/prop-types
  children,
}) => {
  return <Provider store={store}>{children}</Provider>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
