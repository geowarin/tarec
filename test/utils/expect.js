const expect = require('expect');
const fs = require('fs');
const path = require('path');

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

function toHaveFilesDeep (...expectedFiles) {
  const files = recursiveReaddir(this.actual);
  expect(files).toInclude(...expectedFiles);
}

function toHaveFiles (...expectedFiles) {
  const files = fs.readdirSync(this.actual);
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

expect.extend({toHaveFiles, toHaveFilesDeep, toHaveFilesMatching, toHaveDirectories});

module.exports = expect;
