#!/usr/bin/env node

const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const createBabelConfig = require('../babel/createBabelConfig');
const addPlugins = require('../plugins/addPlugins');
const Commands = require('../commands/Commands');

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
if (!fs.existsSync(indexPath)) {
  indexPath = path.join(rootDir, 'lib/templates/index.ejs');
}

const context = {
  rootDir: rootDir,
  projectDir: projectDir,
  userConfig: userConfig,
  indexPath: indexPath
};

context.webpackBabelConfig = createBabelConfig(context, true);
context.babelConfig = createBabelConfig(context, false);

const args = process.argv.slice(2);
const commandName = args.length === 0 ? 'start' : args[0];
const commandArgs = args.slice(1);

const commands = new Commands();
commands.addPreCommand('build', () => {
  process.env['NODE_ENV'] = 'production';
  context.webpackConfig = require('../webpack/webpack.prod.config')(context);
});
commands.addCommand('build', () => {
  require('../commands/clean')(distFolder);
  require('../commands/build')(context);
});

commands.addPreCommand('start', () => {
  process.env['NODE_ENV'] = 'development';
  context.webpackConfig = require('../webpack/webpack.dev.config')(context);
});
commands.addCommand('start', () => {
  require('../commands/start')(context);
});

const operations = {
  addCommand: commands.addCommand.bind(commands),
  addPreCommand: commands.addPreCommand.bind(commands)
};
addPlugins(context, operations);

commands.runCommand(commandName, context, commandArgs);
