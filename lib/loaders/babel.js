'use strict';
const path = require('path');

module.exports = [
  (context) => {
    let babelConfig = context.webpackBabelConfig;
    if (process.env['NODE_ENV'] !== 'production') {
      const cacheDirectory = path.join(context.projectDir, '.tarec/babel-cache');
      babelConfig = Object.assign({}, context.webpackBabelConfig, {cacheDirectory});
    }
    return {
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/,
      include: path.join(context.projectDir, 'src'),
      query: babelConfig,
      happy: {id: 'js'}
    }
  }
];
