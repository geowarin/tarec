'use strict';

const path = require('path');
const resolve = require('resolve');
const chalk = require('chalk');
const isInstalled = require('../utils/isInstalled');

function findReact(basedir) {
  try {
    return resolve.sync('react', {basedir});
  } catch (e) {
    throw new Error('Could not find react in your node_modules. Run npm install to fix the issue.');
  }
}

module.exports = function createBabelConfig(context, isWebpack) {
  const reactPath = findReact(context.projectDir);

  const plugins = [
    require.resolve('babel-plugin-transform-decorators-legacy'),
  ];
  if (context.userConfig.aliases.length > 0) {
    plugins.push([require.resolve('babel-plugin-module-alias'), context.userConfig.aliases])
  }
  if (isInstalled(context, 'babel-runtime/core-js')) {
    plugins.push(require.resolve('babel-plugin-transform-runtime'))
  }

  const babelConfig = {
    presets: [
      require.resolve('babel-preset-react'),
      [require.resolve('babel-preset-es2015'), {modules: !isWebpack}],
      require.resolve('babel-preset-stage-0')
    ],
    plugins,
    env: {
      development: {
        plugins: [
          [require.resolve('babel-plugin-react-transform'), {
            transforms: [{
              transform: require.resolve('react-transform-hmr'),
              imports: [reactPath],
              locals: ['module']
            }, {
              transform: require.resolve('react-transform-catch-errors'),
              imports: [reactPath, require.resolve('redbox-noreact')]
            }]
          }]
        ]
      }
    }
  };

  if (isWebpack && process.env['NODE_ENV'] !== 'production') {
    const cacheDirectory = path.join(context.projectDir, '.tarec/babel-cache');
    Object.assign(babelConfig, {cacheDirectory})
  }

  return babelConfig;
};
