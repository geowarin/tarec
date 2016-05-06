const path = require('path');
const resolve = require('resolve');

module.exports = function addPlugins (context, operations) {

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
