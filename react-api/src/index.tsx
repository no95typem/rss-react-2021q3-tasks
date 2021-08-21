import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store/store';

import { App } from './components/app/app';

const rootEl = document.getElementById('root');

export const INDEX = (
  <Provider store={store}>
    <App />
  </Provider>
);

render(INDEX, rootEl);
