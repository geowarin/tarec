'use strict';

const webpack = require('webpack');
const chalk = require('chalk');

module.exports = function build(context, args) {
  if (args.help || args.h) {
    console.log(`\nCommand: ${chalk.green('tarec build')}`);
    console.log(`  Generates your bundled application in ${chalk.magenta('/dist')}`);
    console.log(`  Options:`);
    console.log(`    -nominify: do not use uglifyjs to compress the javascript code`);
    process.exit(0);
  }

  webpack(context.webpackConfig, (error, stats) => {
    if (error) {
      throw new Error("webpack", error);
    }

    console.log(stats.toString({
      children: false,
      chunks: false,
      colors: true,
      modules: false
    }));
  });
};
