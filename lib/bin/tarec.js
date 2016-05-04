#!/usr/bin/env node

const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const createBabelConfig = require('../babel/createBabelConfig');
const addPlugins = require('../plugins/addPlugins');

const rootDir = path.join(__dirname, '../..');
const projectDir = process.cwd();
const distFolder = path.join(projectDir, 'dist');

let userConfig = {
  aliases: [],
  plugins: []
};
const configFile = path.join(projectDir, 'tarec.yml');

if (fs.existsSync(configFile)) {
  userConfig = Object.assign(userConfig, yaml.safeLoad(fs.readFileSync(configFile, 'utf-8')));
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

context.babelConfig = createBabelConfig(context);
addPlugins(context);

if (process.argv.length == 2) {
  require('../tasks/start')(context);
} else if (process.argv[2] == 'build') {
  require('../tasks/clean')(distFolder);
  require('../tasks/build')(context);
}
