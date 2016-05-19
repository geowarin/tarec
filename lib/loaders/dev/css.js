'use strict';

module.exports = [
  {
    test: /^((?!\.module).)*\.css$/,
    loaders: ['style', 'css']
  },
  {
    test: /\.module\.css$/,
    loaders: ['style', 'css-loader?modules']
  }
];
