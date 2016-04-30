const resolve = require('resolve');

function findReact () {
  try {
    return resolve.sync('react', {basedir: process.cwd()})
  } catch (e) {
    throw new UserError('React must be installed')
  }
}

const reactPath = findReact();

module.exports = [
  {
    test: /\.js$/,
    loader: 'babel',
    exclude: /node_modules/,
    query: {
      presets: [
        require.resolve('babel-preset-react'),
        require.resolve('babel-preset-es2015-webpack'),
        require.resolve('babel-preset-stage-0')
      ],
      cacheDirectory: true,
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
  }
];
