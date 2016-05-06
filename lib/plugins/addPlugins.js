'use strict';

const path = require('path');
const resolve = require('resolve');

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
      plugin = require(path.join(context.projectDir, pluginPath));
    } else {
      plugin = require(resolve.sync(pluginPath, {basedir: process.cwd()}));
    }
    plugin(context, operations);
  })
};
