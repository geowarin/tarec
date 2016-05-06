'use strict';

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const open = require('open');
const chalk = require('chalk');
const history = require('connect-history-api-fallback');
const proxy = require('http-proxy-middleware');

module.exports = function start (context, args) {

  if (args.help || args.h) {
    console.log(`tarec ${chalk.green('start')}`);
    console.log(`  Starts a dev server on port ${chalk.magenta('3000')}`);
    console.log(`  Options:`);
    console.log(`    -p, --port: change the server port`);
    console.log(`    -o, --open: open in your browser`);
    process.exit(0);
  }
  const shouldOpen = args.o || args.open || false;

  const app = express();
  const compiler = webpack(context.webpackConfig);
  app.use(history());

  app.use(express.static(path.join(context.projectDir, 'public')));
// app.use(proxy('/api', {target: 'http://localhost:8080', changeOrigin: true}));

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: context.webpackConfig.output.publicPath,
    stats: {
      colors: true
    }
  }));

  app.use(require('webpack-hot-middleware')(compiler));

  app.listen(context.serverPort, 'localhost', (err) => {
    if (err) {
      console.log(err);
      return;
    }

    const url = `http://localhost:${context.serverPort}`;
    console.log(`Listening at ${chalk.blue(url)}`);
    if (shouldOpen) {
      open(url);
    }
  });

};
