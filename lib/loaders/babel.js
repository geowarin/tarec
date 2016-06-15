'use strict';

module.exports = [
  (context) => {
    let babelConfig = context.webpackBabelConfig;
    if (process.env['NODE_ENV'] !== 'production') {
      babelConfig = Object.assign({}, context.webpackBabelConfig, {cacheDirectory: true});
    }
    return {
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: babelConfig
    }
  }
];
