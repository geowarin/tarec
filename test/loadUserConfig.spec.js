const expect = require('expect');
const path = require('path');
const loadUserConfig = require('../lib/config/loadUserConfig');
const test = require('ava');
const os = require('os');

test('config : should parse config', () => {
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
    'API_URL': '"http://localhost:8080"'
  });
});

test('config: should support environment variables everywhere', t => {
  process.env['HAPPY'] = 'false';
  process.env['API_URL'] = 'http://localhost:8080';

  const userConfig = loadUserConfig(path.resolve('fixtures/config/envVars.yml'));

  expect(userConfig.happypack).toEqual({
    enabled: false,
    cpus: 42,
    cache: true
  });

  expect(userConfig.proxies).toEqual([
    {path: '/defaultValue/', target: 'http://google.nl', ws: true, changeOrigin: true}
  ]);

  expect(userConfig.define).toEqual({
    'API_URL': '"http://localhost:8080"'
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
