'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function loadPackageJson(projectDir) {
  const pkgPath = path.join(projectDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    return require(pkgPath);
  }
  return {
    name: 'React-App'
  }
};
