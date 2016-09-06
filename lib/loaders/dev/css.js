'use strict';

module.exports = [
  {
    test: /^((?!\.module).)*\.css$/,
    loaders: ['style', 'css?sourceMap'],
    happy: {id: 'css'}
  },
  {
    test: /\.module\.css$/,
    loaders: ['style', 'css-loader?sourceMap&module']
  }
];
