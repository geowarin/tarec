'use strict';

const chalk = require('chalk');

module.exports = function showHelp (commands) {

  console.log("\nAvailable commands:");
  const availableCommands = commands.commands;
  Object.keys(availableCommands).forEach(commandName => {
    console.log("  * " + chalk.blue(commandName));
    const command = availableCommands[commandName];
    if (command.help) {
      console.log("    " + command.help)
    }
  })
};
