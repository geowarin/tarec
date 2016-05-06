const expect = require('expect');
const path = require('path');
const loadUserConfig = require('../lib/bin/loadUserConfig');

describe('loadUserConfig', () => {

  it('should parse config', () => {
    const projectDir = path.resolve('test/fixtures/config');
    const userConfig = loadUserConfig(projectDir);

    expect(userConfig.aliases).toEqual([
      { expose: 'compo', src: './src/components' },
      { expose: 'app', src: '../app/dir/app' }
    ]);

    expect(userConfig.proxies).toEqual([
      { context: '/api', target: 'http://localhost:8080' }
    ]);
  });
});
