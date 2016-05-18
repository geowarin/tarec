const expect = require('expect');
const path = require('path');
const loadUserConfig = require('../lib/bin/loadUserConfig');

describe('loadUserConfig', () => {

  it('should parse config', () => {
    process.env['ENV_VAR'] = 'http://localhost:8181';
    const projectDir = path.resolve('test/fixtures/config');
    const userConfig = loadUserConfig(projectDir);

    expect(userConfig.aliases).toEqual([
      { expose: 'compo', src: './src/components' },
      { expose: 'app', src: '../app/dir/app' }
    ]);

    expect(userConfig.proxies).toEqual([
      { context: '/api', target: 'http://localhost:8080' }
    ]);

    expect(userConfig.define).toEqual({
      'API_URL': '"http://localhost:8080"',
      'API_URL2': '"http://localhost:9090"',
      'API_URL3': '"http://localhost:8181"'
    });
  });
});
