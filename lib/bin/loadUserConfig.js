'use strict';

const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

function getAliases (aliases) {
  return aliases.map(alias => {
    var aliasName = Object.keys(alias)[0];
    return {
      src: alias[aliasName],
      expose: aliasName
    }
  });
}
function getProxies (proxies) {
  return proxies.map(proxy => {
    var proxyName = Object.keys(proxy)[0];
    return {
      target: proxy[proxyName],
      context: proxyName
    }
  });
}

module.exports = function loadUserConfig(projectDir) {
  let userConfig = {
    aliases: [],
    plugins: [],
    proxies: []
  };

  const configFile = path.join(projectDir, 'tarec.yml');

  if (fs.existsSync(configFile)) {
    userConfig = Object.assign(userConfig, yaml.safeLoad(fs.readFileSync(configFile, 'utf-8')));
    userConfig.aliases = getAliases(userConfig.aliases);
    userConfig.proxies = getProxies(userConfig.proxies);
  }

  return userConfig;
};
