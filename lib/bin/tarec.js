#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const minimist = require('minimist');

const showHelp = require('./showHelp');
const createBabelConfig = require('../babel/createBabelConfig');
const addBuiltInCommands = require('../commands/addBuiltInCommands');
const loadUserConfig = require('./loadUserConfig');
const addConfiguredPlugins = require('../plugins/addConfiguredPlugins');
const Commands = require('../commands/Commands');

const rootDir = path.join(__dirname, '../..');
const projectDir = process.cwd();
const distFolder = path.join(projectDir, 'dist');

const userConfig = loadUserConfig(projectDir);

let indexPath = path.join(projectDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  indexPath = path.join(rootDir, 'lib/templates/index.ejs');
}

const context = {
  rootDir: rootDir,
  projectDir: projectDir,
  userConfig: userConfig,
  indexPath: indexPath
};

const args = process.argv.slice(2);
if (args.length === 0 || args[0] == '-h' || args[0] == '--help') {
  showHelp(commands);
  process.exit(0);
}
const commandName = args[0];
const commandArgs = minimist(args.slice(1));

if (commandName !== 'init') {
  context.webpackBabelConfig = createBabelConfig(context, true);
  context.babelConfig = createBabelConfig(context, false);
}

const commands = new Commands();

addBuiltInCommands(commands);
addConfiguredPlugins(context, commands);

try {
  commands.runCommand(commandName, context, commandArgs);
} catch (e) {
  console.log(chalk.red(e.message));
  showHelp(commands);
  process.exit(1);
}
