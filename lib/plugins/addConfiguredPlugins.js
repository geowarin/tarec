'use strict';

const path = require('path');
const resolve = require('resolve');
const chalk = require('chalk');

module.exports = function addConfiguredPlugins (context, commands) {

  const operations = {
    addCommandHelp: commands.addCommandHelp.bind(commands),
    addCommand: commands.addCommand.bind(commands),
    addPreCommand: commands.addPreCommand.bind(commands),
    resolve: (module) => require(module)
  };
  context.userConfig.plugins.forEach(pluginPath => {

    let plugin;
    if (pluginPath.indexOf('.') === 0) {
      try {
        plugin = require(path.join(context.projectDir, pluginPath));
        plugin(context, operations);
      } catch (e) {
        console.warn(chalk.yellow(`Could not find plugin ${pluginPath}`));
      }
    } else {
      try {
        plugin = require(resolve.sync(pluginPath, {basedir: process.cwd()}));
        plugin(context, operations);
      } catch (e) {
        console.warn(chalk.yellow(`Could not find plugin ${pluginPath}`));
      }
    }
  })
};
