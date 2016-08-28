'use strict';

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const open = require('open');
const chalk = require('chalk');
const history = require('connect-history-api-fallback');
const proxy = require('http-proxy-middleware');
const debug = require('../utils/debug');

module.exports = function start (context, args) {

  const url = `http://localhost:${context.serverPort}`;

  const app = express();
  const compiler = webpack(context.webpackConfig);
  app.use(history());

  app.use(express.static(path.join(context.projectDir, 'public')));
  app.use(express.static(path.join(context.projectDir, '.tarec/dll')));

  context.userConfig.proxies.forEach(proxyConfig => {
    app.use(proxy(proxyConfig.context, {target: proxyConfig.target, changeOrigin: true, ws: true}));
  });

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: context.webpackConfig.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    }
  }));

  app.use(require('webpack-hot-middleware')(compiler, {
    quiet: true,
    reload: true,
    log: () => {}
  }));

  app.listen(context.serverPort, '0.0.0.0', (err) => {
    if (err) {
      debug.log(err);
      return;
    }

    debug.log(`${chalk.green('Compiling...')}`);
    if (args.open) {
      open(url);
    }
  });

};
