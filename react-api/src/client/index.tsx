import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from './store/store';

import { App } from './components/app/app';

const rootEl = document.getElementById('root');

export const INDEX = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

hydrate(INDEX, rootEl);
