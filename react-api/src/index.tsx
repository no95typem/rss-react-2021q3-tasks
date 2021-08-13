import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import { render } from 'react-dom';

import { App } from './components/app/app';

const rootEl = document.getElementById('root');

render(<App />, rootEl);
