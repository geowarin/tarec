'use strict';

const chalk = require('chalk');

module.exports = function addBuiltInCommands (commands) {
  commands.addCommandHelp('build', `Generate your bundled application in ${chalk.magenta('dist/')}`);
  commands.addPreCommand('build', (context) => {
    process.env['NODE_ENV'] = 'production';
    context.webpackConfig = require('../webpack/webpack.prod.config')(context);
  });
  commands.addCommand('build', (context) => {
    require('../commands/clean')(context.distFolder);
    require('../commands/build')(context);
  });

  commands.addCommandHelp('start', 'Creates a dev server on port 3000');
  commands.addPreCommand('start', (context, args) => {
    process.env['NODE_ENV'] = 'development';
    context.serverPort = args.p || args.port || 3000;
    context.webpackConfig = require('../webpack/webpack.dev.config')(context);
  });
  commands.addCommand('start', (context, args) => {
    require('../commands/start')(context, args);
  });

  commands.addCommandHelp('init', 'Creates a new project');
  commands.addCommand('init', (context) => {
    require('../commands/init')(context);
  });
};
