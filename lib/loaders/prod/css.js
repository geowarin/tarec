'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
  {
    test: /^((?!\.module).)*\.css$/,
    loader: ExtractTextPlugin.extract('style', 'css?sourceMap', 'postcss')
  },
  {
    test: /\.module\.css/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules', 'postcss')
  }
];
