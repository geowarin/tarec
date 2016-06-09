'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const requireDir = require('require-dir');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const getLoaders = require('./getLoaders');

const allLoaders = Object.assign(requireDir('../loaders'), requireDir('../loaders/prod'));

const env = 'production';
const defaultDefine = {
  'process.env': {
    'NODE_ENV': JSON.stringify(env)
  }
};

// https://gist.github.com/sokra/27b24881210b56bbaff7
// http://www.2ality.com/2015/12/webpack-tree-shaking.html
module.exports = function prodConfig (context) {
  const loaders = getLoaders(allLoaders, context);
  const definitions = Object.assign({}, defaultDefine, context.userConfig.define);

  return {
    devtool: 'source-map',
    entry: [
      path.join(context.projectDir, 'src/index')
    ],
    output: {
      path: path.join(context.projectDir, 'dist'),
      filename: '[name]-[hash].js'
    },
    plugins: [
      new webpack.DefinePlugin(definitions),
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
        title: context.pkg.name,
        template: context.indexPath
      }),
      new ExtractTextPlugin('[name]-[hash].css'),
      new CopyWebpackPlugin(
        [
          {
            context: path.join(context.projectDir, 'public'),
            from: {
              glob: '**/*',
              dot: true
            },
            to: path.join(context.projectDir, 'dist'),
          }
        ], {
          ignore: ['.gitkeep']
        }
      )
    ],
    resolve: {
      modules: [path.join(context.projectDir, 'src'), 'node_modules'],
      extensions: ['', '.js', '.json']
    },
    resolveLoader: {
      modules: [path.join(context.rootDir, 'node_modules'), path.join(context.projectDir, 'node_modules')]
    },
    module: {
      loaders: loaders
    }
  }
};
