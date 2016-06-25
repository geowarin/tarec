'use strict';

const chalk = require('chalk');
const debug = require('../utils/debug');

class Commands {

  constructor() {
    this.commands = {};
  }

  addCommandHelp(name, help) {
    const commandEntry = this.commands[name] || {};
    Object.assign(commandEntry, {help: help});
    this.commands[name] = commandEntry;
  }

  addPreCommand(name, precommand) {
    const commandEntry = this.commands[name] || {};
    commandEntry.precommands = (commandEntry.precommands || []).concat(precommand);
    this.commands[name] = commandEntry;
  }

  addCommand(name, command) {
    const commandEntry = this.commands[name] || {};
    if (commandEntry.command) {
      throw new Error('Command "' + name + '" already exists');
    }
    Object.assign(commandEntry, {command: command});
    this.commands[name] = commandEntry;
  }

  runCommand(name, context, args) {
    const commandEntry = this.commands[name];
    if (!commandEntry || !commandEntry.command) {
      throw new Error('Command not found: ' + name);
    }
    (commandEntry.precommands || []).forEach(precommand => precommand(context, args));
    commandEntry.command(context, args);
  }

  showHelp (tarecVersion) {

    debug.log(`Tarec ${chalk.blue(tarecVersion)}`);
    debug.log("\nAvailable commands:");
    const availableCommands = this.commands;
    Object.keys(availableCommands).forEach(commandName => {
      debug.log("  * " + chalk.blue(commandName));
      const command = availableCommands[commandName];
      if (command.help) {
        debug.log("    " + command.help)
      }
    });
    debug.log(`\nType ${chalk.blue('tarec <command> --help')} for more information on a specific command`);
  };
}


module.exports = Commands;
