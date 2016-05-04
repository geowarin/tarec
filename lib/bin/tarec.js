#!/usr/bin/env node

const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

const rootDir = path.join(__dirname, '../..');
const projectDir = process.cwd();
const distFolder = path.join(projectDir, 'dist');

let userConfig = {
  aliases: []
};
const configFile = path.join(projectDir, 'tarec.yml');

if (fs.existsSync(configFile)) {
  userConfig = Object.assign(yaml.safeLoad(fs.readFileSync(configFile, 'utf-8')), userConfig);
}

let indexPath = path.join(projectDir, 'index.html');
if (!fs.existsSync()) {
  indexPath = path.join(rootDir, 'lib/templates/index.ejs');
}

const context = {
  rootDir: rootDir,
  projectDir: projectDir,
  userConfig: userConfig,
  indexPath: indexPath
};

if (process.argv.length == 2) {
  require('../tasks/start')(context);
} else if (process.argv[2] == 'build') {
  require('../tasks/clean')(distFolder);
  require('../tasks/build')(context);
}
