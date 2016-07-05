'use strict';

const path = require('path');
const webpack = require('webpack');
const getLoaders = require('./getLoaders');
const requireDir = require('require-dir');
const allLoaders = Object.assign(requireDir('../loaders'), requireDir('../loaders/dev'));

function vendorArray (context) {
  return Object.keys(context.pkg.dependencies);
}

module.exports = function dllConfig (context) {
  const loaders = getLoaders(allLoaders, context);
  return {
    devtool: 'source-map',
    entry: {
      vendor: vendorArray(context)
    },
    output: {
      path: path.join(context.projectDir, '.tarec/dll'),
      filename: '[name].dll.js',
      library: '[name]_library'
    },
    plugins: [
      new webpack.DllPlugin({
        path: path.join(context.projectDir, '.tarec/dll', '[name].manifest.json'),
        name: '[name]_library'
      })
    ],
    resolve: {
      modules: [path.join(context.projectDir, 'src'), path.join(context.projectDir, 'node_modules')],
      extensions: ['.js']
    },
    resolveLoader: {
      modules: [path.join(context.rootDir, 'node_modules'), path.join(context.projectDir, 'node_modules')]
    },
    module: {
      loaders
    }
  }
};
