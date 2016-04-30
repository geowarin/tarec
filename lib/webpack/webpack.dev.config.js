const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const requireDir = require('require-dir');
const path = require('path');
const webpack = require('webpack');

const allLoaders = requireDir('../loaders');
const loaders = Object.keys(allLoaders).reduce((p, k) => p.concat(allLoaders[k]), []);

const env = 'development';
const globals = {
  'process.env': {
    'NODE_ENV': JSON.stringify(env)
  }
};

// https://gist.github.com/sokra/27b24881210b56bbaff7
// http://www.2ality.com/2015/12/webpack-tree-shaking.html
module.exports = function config (options) {
  return {
    devtool: 'inline-source-map',
    entry: [
      'webpack-hot-middleware/client',
      path.join(options.projectDir, 'src/index')
    ],
    output: {
      path: path.join(options.projectDir, 'dist'),
      filename: '[name]-[hash].js',
      publicPath: '/'
    },
    plugins: [
      new webpack.DefinePlugin(globals),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new HtmlWebpackPlugin({
        title: 'ReactApp',
        template: path.join(options.projectDir, 'index.html')
      }),
      new ExtractTextPlugin('style.css')
    ],
    resolve: {
      modules: [path.join(options.projectDir, 'src'), 'node_modules'],
      extensions: ['', '.js', '.json']
    },
    resolveLoader: {
      modules: [path.join(options.rootDir, 'node_modules')]
    },
    module: {
      loaders: loaders
    }
  }
};
