const express = require('express');
const proxy = require('express-http-proxy');

const app = express();
const port = 3011;

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.use(
  '/',
  proxy('www.wallhaven.cc', {
    userResHeaderDecorator: (x, y, z) => {
      console.log('y:', y, 'z:', z);
      return {
        'Access-Control-Allow-Origin': 'http://localhost:8080',
        'Access-Control-Allow-Headers': '*',
      };
    },
  }),
);

const server = app.listen(port, () => {
  console.log(`Proxy listening at http://localhost:${port}`);
});

process.on('SIGINT', function () {
  console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
  server.close();
  // some other closing procedures go here
  process.exit(1);
});
