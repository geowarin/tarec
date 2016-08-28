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

  example (example) {
    this.entry.examples.push(example);
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

  option (optionName, optionObject) {
    optionObject.name = optionName;
    this.entry.options.push(optionObject);
    return this;
  }
}

class Commands {

  constructor () {
    this.commands = [];
  }

  addToYargs (yargs) {
    for (let command of this.commands) {
      yargs.command(command.name, command.summary,
        (yargs) => {
          for (let opt of command.options) {
            yargs.option(opt.name, opt);
          }
          for (let example of command.examples) {
            yargs.example(example);
          }
          yargs.usage(command.summary);
        }
      );
    }
  }

  add (commandName) {
    if (this.findCommand(commandName)) {
      throw new Error(`Command "${commandName}" already exists`)
    }
    const commandEntry = {};
    this.commands.push(commandEntry);
    commandEntry.name = commandName;
    commandEntry.options = [];
    commandEntry.before = [];
    commandEntry.examples = [];
    return new CommandBuilder(commandEntry);
  }

  findCommand (commandName) {
    for (let command of this.commands) {
      if (command.name === commandName) {
        return command
      }
    }
  }

  modify (commandName) {
    const commandEntry = this.findCommand(commandName);
    if (!commandEntry) {
      throw new Error(`Command ${commandName} does not exist`)
    }
    return new CommandBuilder(commandEntry, true);
  }

  run (name, context, args) {
    const commandEntry = this.findCommand(name);
    if (!commandEntry || !commandEntry.command) {
      throw new Error('Command not found: ' + name);
    }
    commandEntry.before.forEach(precommand => precommand(context, args));
    commandEntry.command(context, args);
  }

  exists (commandName) {
    return Boolean(this.findCommand(commandName));
  }
}


module.exports = Commands;
