'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
  {
    test: /^((?!\.module).)*\.css$/,
    loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
  },
  {
    test: /\.module\.css/,
    loader: ExtractTextPlugin.extract('style', 'css?modules')
  }
];
