const test = require('ava');
const expect = require('./utils/webpack-expect');
const loadUserConfig = require('../lib/config/loadUserConfig');
const path = require('path');

const projectDir = path.join(__dirname, 'fixtures/fake-project');

function createMinimalContext() {
  return {
    projectDir,
    rootDir: '/tarec',
    userConfig: loadUserConfig(null),
    pkg: {name: 'my-project'},
    dlls: []
  };
}

test('webpack : build config should handle common files', () => {

  const context = createMinimalContext();
  const args = {minify: true};
  const prodConfig = require('../lib/webpack/webpack.prod.config')(context, args);
  expect(prodConfig).toHandleFiles('my.css', 'my.module.css', 'my.json', 'my.woff', 'my.woff2', 'my.ttf', 'my.png');
  expect(prodConfig).toHavePlugin('UglifyJsPlugin');
});

test('webpack : build config should not minify if opted out', () => {

  const context = createMinimalContext();
  const args = {minify: false};
  const prodConfig = require('../lib/webpack/webpack.prod.config')(context, args);
  expect(prodConfig).toNotHavePlugin('UglifyJsPlugin');
});

test('webpack : dev config should handle common files', t => {

  const context = createMinimalContext();
  const args = {};
  const devConfig = require('../lib/webpack/webpack.dev.config')(context, args);
  expect(devConfig).toHandleFiles('my.css', 'my.module.css', 'my.json', 'my.woff', 'my.woff2', 'my.ttf', 'my.png');
  expect(devConfig).toHavePlugin('HotModuleReplacementPlugin');
  expect(devConfig).toHavePlugin('FriendlyErrorsWebpackPlugin');
});

test('webpack : dev config should disable friendly errors', t => {

  const context = createMinimalContext();
  const args = {quiet: true};
  const devConfig = require('../lib/webpack/webpack.dev.config')(context, args);
  expect(devConfig).toNotHavePlugin('FriendlyErrorsWebpackPlugin');
});

test('webpack : dev config should handle dlls', t => {

  const context = createMinimalContext();
  context.dlls = [
    {dllFile: 'vendor.dll.js', manifestFile: 'vendor.manifest.json'}
  ];
  const args = {};
  const devConfig = require('../lib/webpack/webpack.dev.config')(context, args);

  const expectedDllPluginOptions = {
    options: {
      context: projectDir
    }
  };
  expect(devConfig).toHavePlugin('DllReferencePlugin', expectedDllPluginOptions);
  var expectedAssetPluginOptions = {assets: [
    {filepath: path.join(projectDir, '.tarec/dll/vendor.dll.js')}
  ]};
  expect(devConfig).toHavePlugin('AddAssetHtmlPlugin', expectedAssetPluginOptions);
});

test('webpack : dev config should configure happyPack', () => {

  const context = createMinimalContext();
  context.dlls = [];
  const args = {happy: true};
  const devConfig = require('../lib/webpack/webpack.dev.config')(context, args);

  expect(devConfig).toHavePlugin('HappyPlugin', {id: 'css'});
  expect(devConfig).toHavePlugin('HappyPlugin', {id: 'js'});
});
