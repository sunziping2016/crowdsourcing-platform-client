process.env.NODE_ENV = 'development';

const opn = require('opn');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');
const webpackConfig = require('./webpack.dev.conf');

const port = process.env.PORT || 59033;
const proxyOption = {
  target: 'http://localhost:41682',
  ws: true,
  changeOrigin: true
};
const proxyTable = {
  '/api': proxyOption,
  '/uploads': proxyOption,
  '/socket.io': proxyOption
};

let app = express();
let compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
});
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({action: 'reload'});
    cb();
  });
});

Object.keys(proxyTable).forEach(context => {
  let options = proxyTable[context];
  if (typeof options === 'string')
    options = {target: options};
  app.use(proxyMiddleware(options.filter || context, options));
});

app.use(require('connect-history-api-fallback')());

app.use(devMiddleware);
app.use(hotMiddleware);
app.use('/static', express.static('./static'));

const uri = 'http://127.0.0.1:' + port;

let _resolve, readyPromise = new Promise(resolve => {
  _resolve = resolve;
});

console.log('> Starting dev server...');
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n');
  if (process.env.NODE_ENV !== 'testing')
    opn(uri);
  _resolve();
});

const server = app.listen(port);

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close();
  }
};
