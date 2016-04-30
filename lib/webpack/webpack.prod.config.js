const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const requireDir = require('require-dir');
const path = require('path');
const webpack = require('webpack');

const allLoaders = Object.assign(requireDir('../loaders'), requireDir('../loaders/prod'));
const loaders = Object.keys(allLoaders).reduce((p, k) => p.concat(allLoaders[k]), []);

const env = 'production';
const globals = {
  'process.env': {
    'NODE_ENV': JSON.stringify(env)
  }
};

// https://gist.github.com/sokra/27b24881210b56bbaff7
// http://www.2ality.com/2015/12/webpack-tree-shaking.html
module.exports = function config (options) {
  return {
    devtool: 'source-map',
    entry: [
      path.join(options.projectDir, 'src/index')
    ],
    output: {
      path: path.join(options.projectDir, 'dist'),
      filename: '[name]-[hash].js'
    },
    plugins: [
      new webpack.DefinePlugin(globals),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors',
        minChunks(module) {
          return (
            module.resource &&
            module.resource.indexOf('node_modules') >= 0
          )
        }
      }),
      new HtmlWebpackPlugin({
        title: 'ReactApp',
        template: path.join(options.projectDir, 'index.html')
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          unused: true,
          dead_code: true,
          warnings: false,
          screw_ie8: true
        }
      }),
      new ExtractTextPlugin('style-[hash].css')
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
