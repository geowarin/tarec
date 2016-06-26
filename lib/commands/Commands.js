'use strict';

const chalk = require('chalk');
const debug = require('../utils/debug');

class CommandBuilder {

  constructor (entry, modificationMode = false) {
    this.entry = entry;
    this.modificationMode = modificationMode;
  }

  summary (summary) {
    this.entry.summary = summary;
    return this;
  }

  before (beforeFn) {
    this.entry.before = (this.entry.before || []).concat(beforeFn);
    return this;
  }

  apply (commandFn) {
    if (this.modificationMode) {
      throw new Error(`Cannot redeclare command "${this.entry.name}"`)
    }
    this.entry.command = commandFn;
    return this;
  }
}

class Commands {

  constructor () {
    this.commands = {};
  }

  add (commandName) {
    if (this.commands[commandName]) {
      throw new Error(`Command "${commandName}" already exists`)
    }
    const commandEntry = {};
    this.commands[commandName] = commandEntry;
    commandEntry.name = commandName;
    return new CommandBuilder(commandEntry);
  }

  modify (commandName) {
    if (!this.commands[commandName]) {
      throw new Error(`Command ${commandName} does not exist`)
    }
    return new CommandBuilder(this.commands[commandName], true);
  }

  run (name, context, args) {
    const commandEntry = this.commands[name];
    if (!commandEntry || !commandEntry.command) {
      throw new Error('Command not found: ' + name);
    }
    (commandEntry.before || []).forEach(precommand => precommand(context, args));
    commandEntry.command(context, args);
  }

  exists (commandName) {
    return Boolean(this.commands[commandName]);
  }

  showHelp (tarecVersion) {

    debug.log(`Tarec ${chalk.blue(tarecVersion)}`);
    debug.log("\nAvailable commands:");
    const availableCommands = this.commands;
    Object.keys(availableCommands).forEach(commandName => {
      debug.log("  * " + chalk.blue(commandName));
      const command = availableCommands[commandName];
      if (command.summary) {
        debug.log("    " + command.summary)
      }
    });
    debug.log(`\nType ${chalk.blue('tarec <command> --help')} for more information on a specific command`);
  };
}


module.exports = Commands;
