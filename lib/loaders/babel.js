'use strict';
const path = require('path');

module.exports = [
  (context) => {
    return {
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/,
      include: path.join(context.projectDir, 'src'),
      happy: {id: 'js'}
    }
  }
];
