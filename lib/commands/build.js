const webpack = require('webpack');

module.exports = function build(context) {
  webpack(context.webpackConfig, (error, stats) => {
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
