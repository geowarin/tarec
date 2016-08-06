const expect = require('expect');
const fs = require('fs');
const path = require('path');
const pkgDir = require('pkg-dir');
var matches = require('tmatch');

function getLoaders(webpackConfig) {
  return webpackConfig.module.loaders.map(l => {
    let name = l.loader || l.loaders.join(',');
    let query = null;

    var split = name.split('?');
    if (split.length > 1) {
      name = split[0];
      query = split[1];
    }
    if (fs.existsSync(name)) {
      name = path.basename(pkgDir.sync(name));
    }

    return {
      name,
      query,
      regexp: l.test
    };
  })
}

function toHandleFile (fileName) {
  const loaders = getLoaders(this.actual);
  const compatibleLoaders = loaders.filter(l => l.regexp.test(fileName));
  expect.assert(
    compatibleLoaders.length < 2,
    '%s is handled by more than one loader: %s',
    fileName,
    compatibleLoaders.map(l => l.name).join(', ')
  );
  expect.assert(
    compatibleLoaders.length === 1,
    '%s is not handled by loaders',
    fileName
  )
}

function toHandleFiles (...fileNames) {
  for (let filename of fileNames) {
    toHandleFile.apply(this, [filename]);
  }
}

function getPlugins(webpackConfig) {
  return webpackConfig.plugins.map(plugin => {
    return {
      name: plugin.constructor.name,
      options: Object.keys(plugin).reduce((p, k) => {
        p[k] = plugin[k];
        return p;
      }, {})
    }
  });
}

function toHavePlugin (pluginName, options) {
  const plugins = getPlugins(this.actual);

  const matchingPlugins = plugins.filter(p => p.name == pluginName);
  expect.assert(
    matchingPlugins.length > 0,
    'No plugin matching %s in %s',
    pluginName,
    plugins.map(p => p.name)
  );
  if (options) {
    var matchingOptions = matchingPlugins.filter(p => matches(p.options, options));
    expect.assert(
      matchingOptions.length > 0,
      'No plugin named %s with options %s in %s',
      pluginName,
      options,
      matchingPlugins.map(p => p.options)
    );
  }
}
function toNotHavePlugin (pluginName) {
  const plugins = getPlugins(this.actual);

  const matchingPlugins = plugins.filter(p => p.name == pluginName);
  expect.assert(
    matchingPlugins.length === 0,
    'Plugin %s wasn\'t expected in config',
    pluginName
  );
}


expect.extend({toHandleFile, toHandleFiles, toHavePlugin, toNotHavePlugin});

module.exports = expect;
