'use strict';

module.exports = [
  {
    test: /^((?!\.module).)*\.css$/,
    loaders: ['style', 'css?sourceMap', 'postcss']
  },
  {
    test: /\.module\.css$/,
    loaders: ['style-loader', 'css-loader?modules', 'postcss']
  }
];
