const webpack = require('webpack');

module.exports = function build(options) {
  process.env['NODE_ENV'] = JSON.stringify('production');
  const config = require('../webpack/webpack.prod.config')(options);
  webpack(config, (error, stats) => {
    if (error) {
      throw new Error("webpack", error);
    }

    console.log(stats.toString({
      children: false,
      chunks: false,
      colors: true,
      modules: false
    }));
  });
};
