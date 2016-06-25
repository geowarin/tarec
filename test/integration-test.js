'use strict';

const expect = require('expect');
const tarec = require('../lib/bin/main');
const temp = require('temp').track();
const fs = require('fs');
const path = require('path');
const Nightmare = require('nightmare');
const {execSync} = require('child_process');
const deasync = require('deasync');
const findOpenPort = deasync(require('portfinder').getPort);

const test = require('ava');

function recursiveReaddir (root, includeFiles = true, includeDirs = false) {
  const files = [root];
  const results = [];

  const addResult = (file, parent) => {
    const relativeParent = path.relative(root, parent);
    results.push(path.join(relativeParent, file));
  };

  while (files.length) {
    const parent = files.pop();
    let subFiles = fs.readdirSync(parent);

    for (let file of subFiles) {
      const fullPath = path.join(parent, file);
      if (fs.statSync(fullPath).isDirectory()) {
        files.push(fullPath);
        if (includeDirs) {
          addResult(file, parent);
        }
      } else if (includeFiles) {
        addResult(file, parent);
      }
    }
  }
  return results;
}

function toHaveFiles (...expectedFiles) {
  const files = recursiveReaddir(this.actual);
  expect(files).toInclude(...expectedFiles);
}

function toHaveFilesMatching (...regexps) {
  const files = recursiveReaddir(this.actual);
  const atLeastOnFileMatches = r => files.filter(f => f.match(r)).length > 0;
  const noMatch = regexps.filter(regexp => !atLeastOnFileMatches(regexp));
  expect.assert(
    noMatch.length === 0,
    '%s have no matches within %s',
    noMatch,
    files
  )
}

function toHaveDirectories (...expectedDirs) {
  const files = recursiveReaddir(this.actual, false, true);
  expect(files).toInclude(...expectedDirs);
}

expect.extend({toHaveFiles, toHaveFilesMatching, toHaveDirectories});

function npmInstall (cwd) {
  execSync('npm install --cache-min 99999', {cwd, stdio: ['ignore', 'ignore', 'inherit']})
}

test.cb('Should init and run', t => {
  // things do not work properly in tmp on mac
  const tmp = temp.mkdirSync({dir: __dirname});

  tarec(tmp, ['init', '--minimal']);

  expect(tmp).toHaveFiles('package.json', 'src/index.js');

  npmInstall(tmp);
  const nodeModulesDir = path.join(tmp, 'node_modules');
  expect(nodeModulesDir).toHaveDirectories('react', 'react-dom');

  const port = findOpenPort();
  tarec(tmp, ['start', '-p', port]);

  Nightmare()
    .goto(`http://0.0.0.0:${port}`)
    .wait(() => document.querySelector('h1').textContent === 'Hello')
    .end()
    .then(t.end);
  
});

test('Should init and build', () => {
  // things do not work properly in tmp on mac
  const tmp = temp.mkdirSync({dir: __dirname});

  tarec(tmp, ['init', '--minimal']);

  const topLevelFiles = fs.readdirSync(tmp);
  expect(topLevelFiles).toInclude('package.json');

  npmInstall(tmp);
  tarec(tmp, ['build']);

  const distFolder = path.join(tmp, 'dist');
  expect(distFolder).toHaveFilesMatching(/main-.+?\.js/, /vendors-.+?\.js/, 'index.html');

});
