const expect = require('expect');
const path = require('path');
const lookForDlls = require('../lib/dll/lookForDlls');
const test = require('ava');

test('dll : should fail if manifest is missing', t => {

  const dllDirectory = path.join(__dirname, 'fixtures/dlls/missing-dll');
  t.throws(
    () => {
      lookForDlls(dllDirectory)
    },
    'File not found: test.manifest.json'
  )
});

test('dll : should list dlls', t => {

  const dllDirectory = path.join(__dirname, 'fixtures/dlls/vendor-dll');
  const dlls = lookForDlls(dllDirectory);
  t.deepEqual(dlls, [
    {manifestFile: 'vendor.manifest.json', dllFile: 'vendor.dll.js'}
  ])
});
