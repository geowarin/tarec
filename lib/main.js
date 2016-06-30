'use strict';

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const yargs = require('yargs');

const loadPackageJson = require('./config/loadPackageJson');
const loadUserConfig = require('./config/loadUserConfig');
const createBabelConfig = require('./babel/createBabelConfig');
const addBuiltInCommands = require('./commands/addBuiltInCommands');
const addConfiguredPlugins = require('./plugins/addConfiguredPlugins');
const lookForDlls = require('./dll/lookForDlls');
const Commands = require('./commands/Commands');
const debug = require('./utils/debug');

function tarec(projectDir, args) {
  const rootDir = path.join(__dirname, '..');

  const userConfig = loadUserConfig(path.join(projectDir, 'tarec.yml'));

  let indexPath = path.join(projectDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    indexPath = path.join(rootDir, 'templates/index.ejs');
  }

  const tarecPkg = require(path.join(rootDir, 'package.json'));
  const pkg = loadPackageJson(projectDir);

  const context = {
    rootDir: rootDir,
    projectDir: projectDir,
    userConfig: userConfig,
    indexPath: indexPath,
    pkg: pkg,
    tarecPkg: tarecPkg,
    dlls: []
  };

  context.dlls = lookForDlls(projectDir);

  const commands = new Commands();
  addBuiltInCommands(commands);
  addConfiguredPlugins(context.userConfig.plugins, context, commands);

  let parsedArgs = yargs(args);
  commands.addToYargs(parsedArgs);

  const commandArgs = parsedArgs
    .usage(`Tarec ${chalk.blue(tarecPkg.version)}`)
    .help()
    .alias('h', 'help')
    .require(1, 'Requires a command')
    .strict()
    .epilog(`Type ${chalk.blue('tarec <command> --help')} for more information on a specific command`)
    .wrap(yargs.terminalWidth())
    .argv;

  const commandName = commandArgs._[0];

  if (commandName !== 'init') {
    context.webpackBabelConfig = createBabelConfig(context, true);
    context.babelConfig = createBabelConfig(context, false);
  }

  try {
    commands.run(commandName, context, commandArgs);
  } catch (e) {
    debug.error(chalk.red(e.message));
    debug.error(e.stack);
    yargs.showHelp();
    process.exit(1);
  }
}

module.exports = tarec;
