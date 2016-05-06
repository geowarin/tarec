const resolve = require('resolve');

function findReact () {
  try {
    return resolve.sync('react', {basedir: process.cwd()})
  } catch (e) {
    throw new UserError('React must be installed')
  }
}

function getAliases (context) {
  var aliases = context.userConfig.aliases;
  if (!aliases) {
    return [];
  }
  return aliases.map(alias => {
    var aliasName = Object.keys(alias)[0];
    return {
      src: alias[aliasName],
      expose: aliasName
    }
  });
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
      [require.resolve("babel-plugin-module-alias"), getAliases(context)]
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
