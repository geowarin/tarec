'use strict';

const deasync = require('deasync');
const webpack = deasync(require('webpack'));
const chalk = require('chalk');
const debug = require('../utils/debug');

module.exports = function build (context, args) {
  const stats = webpack(context.webpackConfig);
  debug.log(stats.toString({
    children: false,
    chunks: false,
    colors: true,
    modules: false
  }));
};
