'use strict';

const expect = require('expect');
const tarec = require('../lib/bin/main');
const temp = require('temp').track();
const fs = require('fs');
const path = require('path');
const Nightmare = require('nightmare');
const {execSync} = require('child_process');

const test = require('ava');

function recursiveReaddir (root) {
  const files = [root];
  const results = [];

  while (files.length) {
    const parent = files.pop();
    let subFiles = fs.readdirSync(parent);

    for (let file of subFiles) {
      const fullPath = path.join(parent, file);
      if (fs.statSync(fullPath).isDirectory()) {
        files.push(fullPath);
      } else {
        const relativeParent = path.relative(root, parent);
        results.push(path.join(relativeParent, file));
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

expect.extend({toHaveFiles, toHaveFilesMatching});

function npmInstall (cwd) {
  execSync('npm install --cache-min 99999', {cwd, stdio: ['ignore', 'ignore', 'ignore']})
}


test.cb('IT - Should init and run', t => {
  // things do not work properly in tmp on mac
  const tmp = temp.mkdirSync({dir: __dirname});

  tarec(tmp, ['init', '--minimal']);

  expect(tmp).toHaveFiles('package.json', 'src/index.js');

  npmInstall(tmp);
  tarec(tmp, ['start']);

  Nightmare()
    .goto('http://localhost:3000')
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
