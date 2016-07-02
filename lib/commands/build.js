'use strict';

const deasync = require('deasync');
const webpack = deasync(require('webpack'));
const chalk = require('chalk');
const debug = require('../utils/debug');
var fs = require('fs');

module.exports = function build (context, args) {
  const stats = webpack(context.webpackConfig);
  debug.log(stats.toString({
    children: false,
    chunks: false,
    colors: true,
    modules: false
  }));
  if (args.stats) {
    fs.writeFileSync('webpack-stats.json', JSON.stringify(stats.toJson()));
    debug.log(`Wrote webpack stats to ${chalk.green('webpack-stats.json')}`);
  }
};
