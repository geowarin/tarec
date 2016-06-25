'use strict';

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const open = require('open');
const chalk = require('chalk');
const history = require('connect-history-api-fallback');
const proxy = require('http-proxy-middleware');
const ngrok = require('ngrok');
const debug = require('../utils/debug');

module.exports = function start (context, args) {

  if (args.help || args.h) {
    debug.log(`\nCommand: ${chalk.green('tarec start')}`);
    debug.log(`  Starts a dev server on port ${chalk.magenta('3000')}`);
    debug.log(`  Options:`);
    debug.log(`    -p, --port <port>: change the server port`);
    debug.log(`    -o, --open: open in your browser`);
    debug.log(`    --ngrok: creates a tunnel to your local server so it is accessible on the outside`);
    process.exit(0);
  }
  const shouldOpen = args.o || args.open || false;
  const shouldOpenTunnel = args.ngrok;

  const url = `http://localhost:${context.serverPort}`;

  const app = express();
  const compiler = webpack(context.webpackConfig);
  app.use(history());

  app.use(express.static(path.join(context.projectDir, 'public')));

  context.userConfig.proxies.forEach(proxyConfig => {
    app.use(proxy(proxyConfig.context, {target: proxyConfig.target, changeOrigin: true}));
  });

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: context.webpackConfig.output.publicPath,
    stats: {
      colors: true
    }
  }));

  app.use(require('webpack-hot-middleware')(compiler));

  app.listen(context.serverPort, '0.0.0.0', (err) => {
    if (err) {
      debug.log(err);
      return;
    }

    debug.log(`Listening at ${chalk.blue(url)}`);
    if (shouldOpenTunnel) {
      ngrok.connect(context.serverPort, (ngrokErr, ngrokUrl) => {
        if (ngrokErr) {
          debug.log(ngrokErr);
          return;
        }
        debug.log(`Tunnel opened at: ${chalk.blue(ngrokUrl)}`);
      });

    }

    if (shouldOpen) {
      open(url);
    }
  });

};
