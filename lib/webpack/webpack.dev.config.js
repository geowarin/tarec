'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const requireDir = require('require-dir');
const path = require('path');
const webpack = require('webpack');
const getLoaders = require('./getLoaders');
const HappyPack = require('happypack');
const os = require('os');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const allLoaders = Object.assign(requireDir('../loaders'), requireDir('../loaders/dev'));
const debug = require('../utils/debug');
const chalk = require('chalk');
const NotifierPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');
const LOGO = path.join(__dirname, 'plugins/tarec_logo_ico.png');

const {concat} = require('../utils');

const env = 'development';

const defaultDefine = {
  'process.env': {
    'NODE_ENV': JSON.stringify(env)
  }
};

// https://gist.github.com/sokra/27b24881210b56bbaff7
// http://www.2ality.com/2015/12/webpack-tree-shaking.html
module.exports = function devConfig(context, args) {
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
    plugins: concat(
      new webpack.DefinePlugin(definitions),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new HtmlWebpackPlugin({
        title: context.pkg.name,
        template: context.indexPath
      }),
      new AddAssetHtmlPlugin(makeDlls(context)),
      args.quiet ? null : new NotifierPlugin({
	compilationSuccessMessage: `You application is accessible at ${chalk.cyan(`http://localhost:${context.serverPort}`)}`,
	onErrors: (...args) => desktopNotification(context, ...args)
      }),
      makeHappy(args, context, loaders),
      makeDllPlugins(context, args)
    ),
    resolve: {
      modules: [path.join(context.projectDir, 'src'), 'node_modules'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    resolveLoader: {
      modules: [path.join(context.rootDir, 'node_modules'), path.join(context.projectDir, 'node_modules')]
    },
    module: {
      loaders: loaders
    },
    babel: context.webpackBabelConfig
  }
};

function desktopNotification(context, severity, errors) {
  const showNotifications = context.userConfig.build.showNotifications;
  if (!showNotifications || severity !== 'error') {
    return;
  }
  const error = errors[0];
  notifier.notify({
    title: context.pkg.name,
    message: severity + ': ' + error.name,
    subtitle: error.file || '',
    icon: LOGO
  });
}

function makeHappy(args, context, loaders) {
  if (!context.userConfig.happypack.enabled && !args.happy) {
    return [];
  }
  const happyThreadPool = HappyPack.ThreadPool({size: context.userConfig.happypack.cpus});
  return loaders
    .filter(l => l.happy)
    .map(l => new HappyPack({
      id: l.happy.id,
      threadPool: happyThreadPool,
      tempDir: path.join(context.projectDir, '.tarec/happypack'),
      cache: context.userConfig.happypack.cache
    }))
}

function makeDllPlugins(context) {
  return context.dlls.map(dll => {
    return new webpack.DllReferencePlugin({
      context: context.projectDir,
      manifest: require(path.join(context.projectDir, '.tarec/dll', dll.manifestFile))
    })
  })
}

function makeDlls(context) {
  if (context.dlls.length > 0) {
    debug.info(`Loading ${context.dlls.length} dlls from '.tarec/dll'`);
    debug.log(`If you update your dependencies, do not forget to generate new dlls with ${chalk.blue('tarec dll')}`);
  }
  return context.dlls.map(dll => {
    return {
      filepath: path.join(context.projectDir, '.tarec/dll', dll.dllFile),
      includeSourcemap: false
    }
  })
}
