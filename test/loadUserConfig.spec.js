const expect = require('expect');
const path = require('path');
const loadUserConfig = require('../lib/config/loadUserConfig');
const test = require('ava');
const os = require('os');
const assert = require('assert-diff')

test('config : should parse config', () => {
  process.env['ENV_VAR'] = 'http://localhost:8181';
  const userConfig = loadUserConfig(path.resolve('fixtures/config/fullConfig.yml'));

  expect(userConfig.happypack).toEqual({
    enabled: true,
    cache: true,
    cpus: 2
  });

  expect(userConfig.aliases).toEqual([
    {expose: 'compo', src: './src/components'},
    {expose: 'app', src: '../app/dir/app'}
  ]);

  expect(userConfig.proxies).toEqual([
    {path: '/api', target: 'http://localhost:8080', ws: true, changeOrigin: true},
    {path: '/complex/route', target: 'http://google.nl', ws: true, changeOrigin: true, prependPath: false}
  ]);

  expect(userConfig.define).toEqual({
    'API_URL': '"http://localhost:8080"',
    'API_URL2': '"http://localhost:9090"',
    'API_URL3': '"http://localhost:8181"'
  });
});

test('config : should parse empty config', () => {
  const userConfig = loadUserConfig(path.resolve('fixtures/config/emptyConfig.yml'));

  expect(userConfig.happypack).toEqual({
    enabled: false,
    cache: true,
    cpus: os.cpus().length
  });
  expect(userConfig.aliases).toEqual([]);
  expect(userConfig.proxies).toEqual([]);
  expect(userConfig.define).toEqual({});
});
