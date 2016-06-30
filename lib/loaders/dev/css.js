'use strict';

module.exports = [
  {
    test: /^((?!\.module).)*\.css$/,
    loaders: ['style', 'css'],
    happy: {id: 'css'}
  },
  {
    test: /\.module\.css$/,
    loaders: ['style', 'css-loader?module']
  }
];
