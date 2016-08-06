'use strict';

const expect = require('./utils/expect');
const tarec = require('../lib/main');
const temp = require('temp').track();
const fs = require('fs');
const path = require('path');
const Nightmare = require('nightmare');
const {execSync} = require('child_process');
const deasync = require('deasync');
const findOpenPort = deasync(require('portfinder').getPort);

const test = require('ava');

function npmInstall (cwd) {
  execSync('npm install --cache-min 99999', {cwd, stdio: ['ignore', 'ignore', 'inherit']})
}

function makeTempDir() {
  // things do not work properly in tmp on mac
  const tmp = path.join(__dirname, '../tmp');
  if (!fs.existsSync(tmp)) {
    fs.mkdirSync(tmp);
  }
  return temp.mkdirSync({dir: tmp});
}

test.cb('it-start : Should init and run', t => {
  const tmp = makeTempDir();

  tarec(tmp, ['init', '--minimal']);

  expect(tmp).toHaveFilesDeep('package.json', 'src/index.js');

  npmInstall(tmp);
  const nodeModulesDir = path.join(tmp, 'node_modules');
  expect(nodeModulesDir).toHaveDirectories('react', 'react-dom');

  const port = findOpenPort();
  tarec(tmp, ['start', '-p', port, '--quiet']);

  Nightmare()
    .goto(`http://0.0.0.0:${port}`)
    .wait(() => document.querySelector('h1').textContent === 'Hello')
    .end()
    .then(t.end);
});

test('it-build : should init and build', () => {
  const tmp = makeTempDir();

  tarec(tmp, ['init', '--minimal']);

  npmInstall(tmp);
  tarec(tmp, ['build', '--stats']);

  const distFolder = path.join(tmp, 'dist');
  expect(distFolder).toHaveFilesMatching(/main-.+?\.js/, /vendors-.+?\.js/, 'index.html');

  expect(tmp).toHaveFiles('webpack-stats.json');
});

test('it-dll : should generate dll', () => {
  const tmp = makeTempDir();

  tarec(tmp, ['init', '--minimal']);

  npmInstall(tmp);
  tarec(tmp, ['dll']);

  const dllFolder = path.join(tmp, '.tarec/dll');
  expect(dllFolder).toHaveFiles('vendor.dll.js', 'vendor.manifest.json');
});
