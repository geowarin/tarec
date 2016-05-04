const webpack = require('webpack');

module.exports = function build(context) {
  process.env['NODE_ENV'] = 'production';
  const config = require('../webpack/webpack.prod.config')(context);
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
