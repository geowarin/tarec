'use strict';

const chalk = require('chalk');
const debug = require('../utils/debug');

module.exports = function showHelp (commands, tarecPkg) {

  const version = tarecPkg.version;
  debug.log(`Tarec ${chalk.blue(version)}`);
  debug.log("\nAvailable commands:");
  const availableCommands = commands.commands;
  Object.keys(availableCommands).forEach(commandName => {
    debug.log("  * " + chalk.blue(commandName));
    const command = availableCommands[commandName];
    if (command.help) {
      debug.log("    " + command.help)
    }
  });
  debug.log(`\nType ${chalk.blue('tarec <command> --help')} for more information on a specific command`);
};
