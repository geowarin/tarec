const addConfiguredPlugins = require('../lib/plugins/addConfiguredPlugins');
const Commands = require('../lib/commands/Commands');
const debug = require('../lib/utils/debug');

const test = require('ava');
const expect = require('expect');

test('plugins : should warn if local plugin is not found', t => {

  const plugins = ['./doesNotExist'];
  const context = {projectDir: __dirname};
  const commands = new Commands();

  debug.capture();
  addConfiguredPlugins(plugins, context, commands);
  t.deepEqual(debug.capturedMessages, ['Could not find plugin ./doesNotExist']);
  debug.endCapture();
});

test('plugins : should fail if plugin throws', t => {

  const plugins = ['./fixtures/plugins/failingPlugin.js'];
  const context = {projectDir: __dirname};
  const commands = new Commands();

  debug.capture();
  t.throws(
    () => {
      addConfiguredPlugins(plugins, context, commands);
    },
    'Error in plugin ./fixtures/plugins/failingPlugin.js'
  );
  // stack trace is shown
  t.is(debug.capturedMessages.length, 1);
  t.regex(debug.capturedMessages[0], /^Error: oh noes!.*/);
  debug.endCapture();
});


test('plugins : should not throw if plugin exists', t => {

  const plugins = ['./fixtures/plugins/examplePlugin.js'];
  const context = {projectDir: __dirname};
  const commands = new Commands();

  t.notThrows(
    () => {
      addConfiguredPlugins(plugins, context, commands);
    }
  );
});


test('plugins : should load external plugin', t => {

  const plugins = ['noop2'];
  const context = {projectDir: __dirname};
  const commands = new Commands();

  t.notThrows(
    () => {
      addConfiguredPlugins(plugins, context, commands);
    }
  );
});
