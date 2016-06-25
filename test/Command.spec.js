'use strict';

const expect = require('expect');
const Commands = require('../lib/commands/Commands');
const test = require('ava');

test('should call the command', t => {

  let hasBeenCalled = false;
  const commands = new Commands();
  commands.addCommand('testCommand', () => hasBeenCalled = true);
  commands.runCommand('testCommand');
  t.true(hasBeenCalled, 'testCommand should have been called');
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
