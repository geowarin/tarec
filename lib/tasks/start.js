const express = require('express');
const webpack = require('webpack');
const history = require('connect-history-api-fallback');
const proxy = require('http-proxy-middleware');
const makeConfig = require('../webpack/webpack.dev.config');

module.exports = function start (options) {

  const app = express();
  const config = makeConfig({
    rootDir: options.rootDir,
    projectDir: options.projectDir
  });
  
  const compiler = webpack(config);
  app.use(history());
  
  // app.use(express.static(staticPath));
// app.use(proxy('/api', {target: 'http://localhost:8080', changeOrigin: true}));

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath,
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
