#!/usr/bin/env node

const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

const rootDir = path.join(__dirname, '../..');
const projectDir = process.cwd();
const distFolder = path.join(projectDir, 'dist');

let userConfig = {};
const configFile = path.join(projectDir, 'tarec.yml');

if (fs.existsSync(configFile)) {
  userConfig = yaml.safeLoad(fs.readFileSync(configFile, 'utf-8'));
  console.log(userConfig);
}

const options = {
  rootDir: rootDir,
  projectDir: projectDir,
  userConfig: userConfig
};

if (process.argv.length == 2) {
  require('../tasks/start')(options);
} else if (process.argv[2] == 'build') {
  require('../tasks/clean')(distFolder);
  require('../tasks/build')(options);
}
