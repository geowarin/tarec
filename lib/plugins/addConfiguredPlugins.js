'use strict';

const path = require('path');
const resolve = require('resolve');
const chalk = require('chalk');
const fs = require('fs');
const debug = require('../utils/debug');

function resolveOrUndefined(basedir, pluginPath) {
  let resolved;
  try {
    resolved = resolve.sync(pluginPath, {basedir})
  } catch (e) {}
  return resolved;
}

module.exports = function addConfiguredPlugins (plugins, context, commands) {

  const operations = {
    dependencies: {
      resolve: (module) => require(module)
    },
    commands: {
      modify: commands.modify.bind(commands),
      add: commands.add.bind(commands)
    }
  };
  plugins.forEach(pluginPath => {

    let resolvedPath;
    if (pluginPath.indexOf('.') === 0) {
      resolvedPath = path.join(context.projectDir, pluginPath);
    } else {
      resolvedPath = resolveOrUndefined(context.projectDir, pluginPath);
    }

    if (resolvedPath === null || fs.existsSync(resolvedPath)) {
      try {
        const plugin = require(resolvedPath);
        plugin(context, operations);
      } catch (e) {
        debug.error(e.stack);
        throw new Error(`Error in plugin ${pluginPath}`);
      }
    } else {
      debug.warn(chalk.yellow(`Could not find plugin ${pluginPath}`));
    }

  })
};
