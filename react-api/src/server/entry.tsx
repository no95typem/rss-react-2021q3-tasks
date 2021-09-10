import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import * as Express from 'express';
import { StaticRouter } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { State } from '../client/store/state';
import { GALLERY_INITIAL_STATE } from '../client/store/initials/galleryState';
import { DETAILS_PAGE_INIT_STATE } from '../client/store/initials/detailsPageFlag';
import { CORE_INITIAL_STATE } from '../client/store/initials/coreState';

import { App } from '../client/components/app/app';
import {
  getWHWallpaperFake,
  getWHSearch,
  getWHWallpaper,
  getWHSearchFake,
} from './wh-server-api';
import {
  WHWpInfoProxyReq,
  ProxyReq,
  WHSearchProxyReq,
} from './wh-server-api.def';
import { ProxyReqCodes } from '../shared/proxy.def';

const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 9000;

// create express application
const app = Express();

const jsonParser = bodyParser.json();

if (IS_DEV) {
  app.get(/node_modules/, Express.static(path.resolve(__dirname, '../../')));
}

app.get(
  /\.(js|css|map|ico|png|jpeg|jpg)$/,
  Express.static(path.resolve(__dirname, '../client')),
);

const fetchOneWallpaper = IS_ONLINE ? getWHWallpaper : getWHWallpaperFake;

const proxyOneWHWalpaper = (res: Express.Response, req: WHWpInfoProxyReq) => {
  fetchOneWallpaper(req)
    .then(data => {
      res.status(200);
      return res.send({ data });
    })
    .catch(err => {
      console.error(
        `Server encounter an error while fething one wallpaper: ${err} `,
      );
      res.status(500);
      return res.send();
    });
};

const getWHSearchFunc = IS_ONLINE ? getWHSearch : getWHSearchFake;

const proxyWHSearch = (res: Express.Response, req: WHSearchProxyReq) => {
  getWHSearchFunc(req)
    .then(data => {
      res.status(200);
      return res.send(data);
    })
    .catch(err => {
      console.error(
        `Server encounter an error while fething one wallpaper: ${err} `,
      );
      res.status(500);
      return res.send();
    });
};

app.post('/proxy', jsonParser, (req, res, next) => {
  try {
    const payload = req.body as ProxyReq;
    switch (payload.code) {
      case ProxyReqCodes.WHWpInfo:
        proxyOneWHWalpaper(res, payload as WHWpInfoProxyReq);
        return;
      case ProxyReqCodes.WHSearch:
        proxyWHSearch(res, payload as WHSearchProxyReq);
        return;
      default:
        throw new Error();
    }
  } catch {
    res.status(404);
    res.send('Unrecognizable proxy request');
  }
});

// в ответ на любые другие запросы отправляем 'index.html'
app.use('*', (req, res) => {
  // читаем файл `index.html`
  let indexHTML = fs.readFileSync(
    path.resolve(__dirname, '../client/index.html'),
    {
      encoding: 'utf8',
    },
  );

  const initState: State = {
    galleryState: GALLERY_INITIAL_STATE,
    detailsPageState: DETAILS_PAGE_INIT_STATE,
    coreState: CORE_INITIAL_STATE,
  };

  const store = createStore(state => state, initState);
  const context = {};

  // получаем HTML строку из компонента 'App'
  const appHTML = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={req.originalUrl} context={context}>
        <App />
      </StaticRouter>
    </Provider>,
  );

  // заполняем элемент '#root' содержимым из 'appHTML'
  // indexHTML = indexHTML.replace(
  //   '&lt;div id=&quot;root&quot;&gt;&lt;/div&gt;',
  //   `&lt;div id=&quot;root&quot;&gt;${appHTML}&lt;/div&gt;`,
  // );

  indexHTML = indexHTML.replace(
    '<div id="root"></div>',
    `<div id="root">${appHTML}</div>`,
  );

  // устанавливаем заголовок и статус
  res.contentType('text/html');
  res.status(200);

  return res.send(indexHTML);
});
// запускаем сервер на порту 9000
app.listen(PORT, () => {
  console.log(`Express server started at port ${PORT}`);
});
