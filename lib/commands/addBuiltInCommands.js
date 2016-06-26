'use strict';

const chalk = require('chalk');

module.exports = function addBuiltInCommands (commands) {
  commands
    .add('build')
    .summary(`Generate your bundled application in ${chalk.magenta('/dist')}`)
    .before((context, args) => {
      process.env['NODE_ENV'] = 'production';
      context.webpackConfig = require('../webpack/webpack.prod.config')(context);
      if (args.nominify !== true) {
        const webpack = require('webpack');
        context.webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
          compress: {
            unused: true,
            dead_code: true,
            warnings: false,
            screw_ie8: true
          }
        }))
      }
    })
    .apply((context, args) => {
      require('../commands/clean')(context);
      require('../commands/build')(context, args);
    });

  commands
    .add('start')
    .summary(`Creates a dev server on port ${chalk.magenta('3000')}`)
    .before((context, args) => {
      process.env['NODE_ENV'] = 'development';
      context.serverPort = args.p || args.port || 3000;
      context.webpackConfig = require('../webpack/webpack.dev.config')(context);
    })
    .apply((context, args) => {
      require('../commands/start')(context, args);
    });

  commands
    .add('init')
    .summary('Generates a simple application in the current directory')
    .apply((context, args) => {
      require('../commands/init')(context, args);
    });
};
