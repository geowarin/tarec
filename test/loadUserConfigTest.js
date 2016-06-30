const expect = require('expect');
const path = require('path');
const loadUserConfig = require('../lib/config/loadUserConfig');
const test = require('ava');

test('should parse config', () => {
  process.env['ENV_VAR'] = 'http://localhost:8181';
  const projectDir = path.resolve('fixtures/config/fullConfig.yml');
  const userConfig = loadUserConfig(projectDir);

  expect(userConfig.happypack).toEqual(true);

  expect(userConfig.aliases).toEqual([
    {expose: 'compo', src: './src/components'},
    {expose: 'app', src: '../app/dir/app'}
  ]);

  expect(userConfig.proxies).toEqual([
    {context: '/api', target: 'http://localhost:8080'}
  ]);

  expect(userConfig.define).toEqual({
    'API_URL': '"http://localhost:8080"',
    'API_URL2': '"http://localhost:9090"',
    'API_URL3': '"http://localhost:8181"'
  });
});

test('should parse empty config', () => {
  const projectDir = path.resolve('fixtures/config/emptyConfig.yml');
  const userConfig = loadUserConfig(projectDir);

  expect(userConfig.happypack).toEqual(false);
  expect(userConfig.aliases).toEqual([]);
  expect(userConfig.proxies).toEqual([]);
  expect(userConfig.define).toEqual({});
});
