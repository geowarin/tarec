'use strict';

const chalk = require('chalk');

module.exports = function showHelp (commands, tarecPkg) {

  const version = tarecPkg.version;
  console.log(`Tarec ${chalk.blue(version)}`);
  console.log("\nAvailable commands:");
  const availableCommands = commands.commands;
  Object.keys(availableCommands).forEach(commandName => {
    console.log("  * " + chalk.blue(commandName));
    const command = availableCommands[commandName];
    if (command.help) {
      console.log("    " + command.help)
    }
  })
  console.log(`\nType ${chalk.blue('tarec <command> --help')} for more information on a specific command`);
};
