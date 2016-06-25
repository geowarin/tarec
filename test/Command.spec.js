'use strict';

const expect = require('expect');
const Commands = require('../lib/commands/Commands');
const test = require('ava');
const debug = require('../lib/utils/debug');

test('should call the command', t => {

  let hasBeenCalled = false;
  const commands = new Commands();
  commands.addCommand('testCommand', () => hasBeenCalled = true);
  commands.runCommand('testCommand');
  t.true(hasBeenCalled, 'testCommand should have been called');
});

test('should display help', t => {

  const commands = new Commands();
  
  debug.capture();
  commands.addCommandHelp('cmd', 'cmdHelp');
  commands.showHelp('v0');
  t.deepEqual(debug.capturedMessages, [
    'Tarec v0',
    'Available commands:',
    '* cmd',
    'cmdHelp',
    'Type tarec <command> --help for more information on a specific command'
  ]);
  debug.endCapture();
});
