'use strict';

module.exports = [
  (context) => ({
    test: /\.js$/,
    loader: 'babel',
    exclude: /node_modules/,
    query: Object.assign({}, context.webpackBabelConfig, {cacheDirectory: true})
  })
];
