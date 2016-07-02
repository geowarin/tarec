'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const requireDir = require('require-dir');
const path = require('path');
const webpack = require('webpack');
const getLoaders = require('./getLoaders');
const HappyPack = require('happypack');
const os = require('os');
var AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

var happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});

const allLoaders = Object.assign(requireDir('../loaders'), requireDir('../loaders/dev'));

const env = 'development';

const defaultDefine = {
  'process.env': {
    'NODE_ENV': JSON.stringify(env)
  }
};

function makeHappy (args, context, loaders) {
  if (!context.userConfig.happypack && !args.happy) {
    return [];
  }
  return loaders
    .filter(l => l.happy)
    .map(l => new HappyPack({
      id: l.happy.id,
      threadPool: happyThreadPool,
      tempDir: path.join(context.projectDir, '.tarec/happypack'),
      cache: true
    }))
}

function makeDllPlugins (context) {
  return context.dlls.map(dll => {
    return new webpack.DllReferencePlugin({
      context: path.join(context.projectDir),
      manifest: require(path.join(context.projectDir, '.tarec/dll', dll.manifestFile))
    })
  })
}

function makeDlls (context) {
  return context.dlls.map(dll => {
    return {
      filename: path.join(context.projectDir, '.tarec/dll', dll.dllFile),
      includeSourcemap: false
    }
  })
}

// https://gist.github.com/sokra/27b24881210b56bbaff7
// http://www.2ality.com/2015/12/webpack-tree-shaking.html
module.exports = function devConfig (context, args) {
  const loaders = getLoaders(allLoaders, context);
  const definitions = Object.assign({}, defaultDefine, context.userConfig.define);

  return {
    // cache: true,
    devtool: 'inline-source-map',
    entry: [
      require.resolve('webpack-hot-middleware/client'),
      path.join(context.projectDir, 'src/index')
    ],
    output: {
      path: path.join(context.projectDir, 'dist'),
      filename: '[name].js',
      publicPath: '/'
    },
    plugins: [
      new webpack.DefinePlugin(definitions),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new HtmlWebpackPlugin({
        title: context.pkg.name,
        template: context.indexPath
      }),
      new AddAssetHtmlPlugin(makeDlls(context))
    ]
      .concat(...makeHappy(args, context, loaders))
      .concat(...makeDllPlugins(context, args)),
    resolve: {
      modules: [path.join(context.projectDir, 'src'), 'node_modules'],
      extensions: ['.js']
    },
    resolveLoader: {
      modules: [path.join(context.rootDir, 'node_modules'), path.join(context.projectDir, 'node_modules')]
    },
    module: {
      loaders: loaders
    }
  }
};
