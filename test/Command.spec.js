'use strict';

const expect = require('expect');
const Commands = require('../lib/commands/Commands');
const addBuiltInCommands = require('../lib/commands/addBuiltInCommands');

const test = require('ava');
const debug = require('../lib/utils/debug');

test('should add built-in commands', t => {
  const commands = new Commands();
  addBuiltInCommands(commands);

  t.true(commands.exists('init'));
  t.true(commands.exists('build'));
  t.true(commands.exists('start'));
});

test('commands : should call the command', t => {

  let hasBeenCalled = false;
  const commands = new Commands();
  const beforeSpy = expect.createSpy();

  commands
    .add('testCommand')
    .before(beforeSpy)
    .before(beforeSpy)
    .apply(() => hasBeenCalled = true);

  commands.run('testCommand');
  t.true(hasBeenCalled, 'testCommand should have been called');
  t.is(beforeSpy.calls.length, 2);
});

test('commands : cannot redeclare existing command', t => {

  const commands = new Commands();
  commands
    .add('start')
    .apply(() => {});

  t.throws(
    () => { commands.add('start') },
    'Command "start" already exists'
  );
  t.throws(
    () => { commands.modify('start').apply(() => {}) },
    'Cannot redeclare command "start"'
  );
});

test('commands : can add behavior to existing command', t => {

  const beforeSpy = expect.createSpy();
  const commands = new Commands();
  commands
    .add('start')
    .apply(() => { });

  commands
    .modify('start')
    .before(beforeSpy);

  commands.run('start');
  expect(beforeSpy).toHaveBeenCalled();
});
