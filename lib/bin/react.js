#!/usr/bin/env node

const path = require('path');

const rootDir = path.join(__dirname, '../..');
const projectDir = process.cwd();
const distFolder = path.join(projectDir, 'dist');

if (process.argv.length == 2) {
  require('../tasks/start')({
    rootDir: rootDir,
    projectDir: projectDir
  });
} else if (process.argv[2] == 'build') {
  require('../tasks/clean')(distFolder);
  require('../tasks/build')({
    rootDir: rootDir,
    projectDir: projectDir
  });
}
