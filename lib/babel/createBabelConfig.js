'use strict';

const resolve = require('resolve');
const chalk = require('chalk');

function findReact () {
  try {
    return resolve.sync('react', {basedir: process.cwd()});
  } catch (e) {
    throw new Error('Could not find react in your node_modules. Run npm install to fix the issue.');
  }
}

module.exports = function createBabelConfig (context, isWebpack) {
  const reactPath = findReact();
  return {
    presets: [
      require.resolve('babel-preset-react'),
      isWebpack ? require.resolve('babel-preset-es2015-webpack'): require.resolve('babel-preset-es2015'),
      require.resolve('babel-preset-stage-0')
    ],
    plugins: [
      [require.resolve('babel-plugin-module-alias'), context.userConfig.aliases],
      [require.resolve('babel-plugin-transform-decorators-legacy')],
      [require.resolve('babel-plugin-transform-runtime')]
    ],
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
  }
};
