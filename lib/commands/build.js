'use strict';

const deasync = require('deasync');
const webpack = deasync(require('webpack'));
const chalk = require('chalk');
const debug = require('../utils/debug');

module.exports = function build (context, args) {
  if (args.help || args.h) {
    debug.log(`\nCommand: ${chalk.green('tarec build')}`);
    debug.log(`  Generates your bundled application in ${chalk.magenta('/dist')}`);
    debug.log(`  Options:`);
    debug.log(`    -nominify: do not use uglifyjs to compress the javascript code`);
    process.exit(0);
  }

  const stats = webpack(context.webpackConfig);
  debug.log(stats.toString({
    children: false,
    chunks: false,
    colors: true,
    modules: false
  }));
};
