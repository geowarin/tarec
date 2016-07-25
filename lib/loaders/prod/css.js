'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
  {
    test: /^((?!\.module).)*\.css$/,
    loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader' })
  },
  {
    test: /\.module\.css/,
    loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?modules' })
  }
];
