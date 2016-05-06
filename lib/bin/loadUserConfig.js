'use strict';

const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

module.exports = function loadUserConfig(projectDir) {
  let userConfig = {
    aliases: [],
    plugins: []
  };

  const configFile = path.join(projectDir, 'tarec.yml');

  if (fs.existsSync(configFile)) {
    userConfig = Object.assign(userConfig, yaml.safeLoad(fs.readFileSync(configFile, 'utf-8')));
  }

  return userConfig;
};
