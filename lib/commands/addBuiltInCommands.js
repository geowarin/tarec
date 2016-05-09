'use strict';

const chalk = require('chalk');

module.exports = function addBuiltInCommands (commands) {
  commands.addCommandHelp('build', `Generate your bundled application in ${chalk.magenta('/dist')}`);
  commands.addPreCommand('build', (context) => {
    process.env['NODE_ENV'] = 'production';
    context.webpackConfig = require('../webpack/webpack.prod.config')(context);
  });
  commands.addCommand('build', (context, args) => {
    require('../commands/clean')(context.distFolder, args);
    require('../commands/build')(context, args);
  });

  commands.addCommandHelp('start', `Creates a dev server on port ${chalk.magenta('3000')}`);
  commands.addPreCommand('start', (context, args) => {
    process.env['NODE_ENV'] = 'development';
    context.serverPort = args.p || args.port || 3000;
    context.webpackConfig = require('../webpack/webpack.dev.config')(context);
  });
  commands.addCommand('start', (context, args) => {
    require('../commands/start')(context, args);
  });

  commands.addCommandHelp('init', 'Generates a simple application in the current directory');
  commands.addCommand('init', (context, args) => {
    require('../commands/init')(context, args);
  });
};
