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

function getDefine (proxies) {
  return proxies.map(proxy => {
    var proxyName = Object.keys(proxy)[0];
    return {
      value: replaceVars(proxy[proxyName]),
      var: proxyName
    }
  });
}

function replaceVars (str) {
  return str.replace(/\$\{.*?\}/g, (varStr) => {
    varStr = varStr.replace('${', '').replace('}', '');
    let parts = varStr.split(':');
    if (parts.length === 1) {
      return varStr;
    }
    parts = [parts[0]].concat(parts.slice(1).join(':'));
    if (process.env[parts[0]]) {
      return process.env[parts[0]];
    }
    return parts[1];
  });
}

module.exports = function loadUserConfig(projectDir) {
  let userConfig = {
    aliases: [],
    plugins: [],
    proxies: [],
    define: []
  };

  const configFile = path.join(projectDir, 'tarec.yml');

  if (fs.existsSync(configFile)) {
    userConfig = Object.assign(userConfig, yaml.safeLoad(fs.readFileSync(configFile, 'utf-8')));
    userConfig.aliases = getAliases(userConfig.aliases);
    userConfig.proxies = getProxies(userConfig.proxies);
    userConfig.define = getDefine(userConfig.define).reduce((obj, cur) => {
      obj[cur.var] = JSON.stringify(cur.value);
      return obj;
    }, {});
  }

  return userConfig;
};
