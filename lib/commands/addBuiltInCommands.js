'use strict';

const chalk = require('chalk');

module.exports = function addBuiltInCommands (context, commands) {
  commands.addCommandHelp('build', `Generate your bundled application in ${chalk.magenta('dist/')}`);
  commands.addPreCommand('build', () => {
    process.env['NODE_ENV'] = 'production';
    context.webpackConfig = require('../webpack/webpack.prod.config')(context);
  });
  commands.addCommand('build', () => {
    require('../commands/clean')(context.distFolder);
    require('../commands/build')(context);
  });

  commands.addCommandHelp('start', 'Creates a dev server on port 3000');
  commands.addPreCommand('start', () => {
    process.env['NODE_ENV'] = 'development';
    context.webpackConfig = require('../webpack/webpack.dev.config')(context);
  });
  commands.addCommand('start', () => {
    require('../commands/start')(context);
  });
  
  commands.addCommandHelp('init', 'Creates a new project');
  commands.addCommand('init', () => {
    require('../commands/init')(context);
  });
};
