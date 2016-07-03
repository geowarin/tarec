const expect = require('expect');
const path = require('path');
const lookForDlls = require('../lib/dll/lookForDlls');
const test = require('ava');

test('dll : should fail if manifest is missing', t => {

  const dllDiretocry = path.join(__dirname, 'fixtures/dlls/missing-dll');
  t.throws(
    () => {
      lookForDlls(dllDiretocry)
    },
    'File not found: test.manifest.json'
  )
});

test('dll : should list dlls', t => {

  const dllDiretocry = path.join(__dirname, 'fixtures/dlls/vendor-dll');
  const dlls = lookForDlls(dllDiretocry);
  t.deepEqual(dlls, [
    {manifestFile: 'vendor.manifest.json', dllFile: 'vendor.dll.js'}
  ])
});
