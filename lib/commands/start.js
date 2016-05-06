const path = require('path');
const express = require('express');
const webpack = require('webpack');
const history = require('connect-history-api-fallback');
const proxy = require('http-proxy-middleware');

module.exports = function start (context) {

  const app = express();
  const compiler = webpack(context.webpackConfig);
  app.use(history());

  app.use(express.static(path.join(context.projectDir, 'public')));
// app.use(proxy('/api', {target: 'http://localhost:8080', changeOrigin: true}));

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: context.webpackConfig.output.publicPath,
    stats: {
      colors: true
    }
  }));

  app.use(require('webpack-hot-middleware')(compiler));

  app.listen(3000, 'localhost', (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Listening at http://localhost:3000');
  });

};
