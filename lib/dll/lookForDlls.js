var path = require('path');
var fs = require('fs');
var groupBy = require('lodash.groupby');
var find = require('lodash.find');

module.exports = function lookForDlls(dllDirectory) {
  if (!fs.existsSync(dllDirectory)) {
    return [];
  }
  const dllFiles = fs.readdirSync(dllDirectory).filter(f => fs.statSync(path.join(dllDirectory, f)).isFile());
  const dllsByName = groupBy(dllFiles, f => f.split('.')[0]);
  return Object.keys(dllsByName).map(dllName => {
    const files = dllsByName[dllName];
    const dllFile = findFile(files, '.dll.js', dllName);
    const manifestFile = findFile(files, '.manifest.json', dllName);
    return {
      dllFile,
      manifestFile
    }
  });
};

function findFile(files, suffix, dllName) {
  const file = find(files, f => endsWith(f, suffix));
  if (!file) {
    throw new Error(`File not found: ${dllName}${suffix}`)
  }
  return file;
}

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
