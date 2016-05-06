class Commands {

  constructor() {
    this.commands = {};
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
    if (!commandEntry) {
      throw new Error('Command not found: ' + name);
    }
    (commandEntry.precommands || []).forEach(precommand => precommand(context, args));
    commandEntry.command(context, args);
  }
}


module.exports = Commands;
