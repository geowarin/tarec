'use strict';

const chalk = require('chalk');

module.exports = function addBuiltInCommands (commands) {
  commands
    .add('build')
    .summary(`Generate your bundled application in ${chalk.magenta('/dist')}`)
    .option('minify', { default: true, describe: 'do not use uglifyjs to compress the javascript code', type: 'boolean'})
    .option('stats', { default: false, describe: 'generates webpack stats. Use https://webpack.github.io/analyse/ to analyze them', type: 'boolean'})
    .before((context, args) => {
      process.env['NODE_ENV'] = 'production';
      context.webpackConfig = require('../webpack/webpack.prod.config')(context, args);
    })
    .apply((context, args) => {
      require('../commands/clean')(context);
      require('../commands/build')(context, args);
    });

  commands
    .add('start')
    .summary(`Creates a dev server on port ${chalk.magenta('3000')}`)
    .option('port', { alias: 'p', type: 'number', default: 3000, describe: 'change the server port'})
    .option('open', { alias: 'o', type: 'boolean', default: false, describe: 'open in your browser'})
    .option('happy', { type: 'boolean', default: false, describe: 'attempts to speed up you build with happypack (multithreaded compilation)'})
    .option('quiet', { type: 'boolean', default: false, describe: 'Displays no message during compilation'})
    .before((context, args) => {
      process.env['NODE_ENV'] = 'development';
      context.serverPort = args.port;
      context.webpackConfig = require('../webpack/webpack.dev.config')(context, args);
    })
    .apply((context, args) => {
      require('../commands/start')(context, args);
    });

  commands
    .add('init')
    .option('minimal', { type: 'boolean', default: false, describe: 'Generates the minimal react application'})
    .option('typescript', { type: 'boolean', default: false, describe: 'Generates a typescript and react application'})
    .summary('Generates a simple application in the current directory')
    .apply((context, args) => {
      require('../commands/init')(context, args);
    });

  commands
    .add('dll')
    .summary('Generates dlls for your vendor dependencies - run this when you project dependencies change.')
    .apply((context, args) => {
      require('../commands/dll')(context, args);
    });
};
