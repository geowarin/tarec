'use strict';

const expect = require('expect');
const Commands = require('../lib/commands/Commands');

describe('Commands', () => {

  it('should call the command', () => {

    let hasBeenCalled = false;
    const commands = new Commands();
    commands.addCommand('testCommand', () => hasBeenCalled = true);
    commands.runCommand('testCommand');
    expect(hasBeenCalled).toEqual(true);
  });

  // it('should display help', () => {
  //   let captured_text = "";
  //   const commands = new Commands();
  //
  //   var unhook_intercept = captureStdout(txt => captured_text += txt);
  //   commands.addCommand('commandWithHelp', () => {});
  //   commands.addCommandHelp('commandWithHelp', 'help');
  //   commands.runCommand('commandWithHelp', {}, {help: true});
  //   unhook_intercept();
  //
  //   expect(captured_text).toEqual('help');
  // });
});
