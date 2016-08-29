'use strict';

const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const os = require('os');
const merge = require('lodash.merge');
const deepMap = require('deep-map');

function getAliases(aliases) {
  return readList(aliases, {valueKey: 'src', keyKey: 'expose'})
}

function getProxies(proxies) {
  const defaultProxy = {
    changeOrigin: true,
    ws: true
  };
  return readList(proxies, {valueKey: 'target', keyKey: 'path', defaultObject: defaultProxy});
}

function getDefine(defines) {
  return readList(defines, {valueKey: 'value', keyKey: 'var'});
}

module.exports = function loadUserConfig(configFile) {
  let userConfig = {
    aliases: [],
    plugins: [],
    proxies: [],
    define: [],
    happypack: {
      enabled: false,
      cache: true,
      cpus: os.cpus().length
    },
    build: {
      showNotifications: true
    }
  };

  if (fs.existsSync(configFile)) {
    userConfig = merge(userConfig, yaml.safeLoad(fs.readFileSync(configFile, 'utf-8')));
    userConfig.aliases = getAliases(userConfig.aliases);
    userConfig.proxies = getProxies(userConfig.proxies);
    userConfig.define = getDefine(userConfig.define);

    userConfig = deepMap(userConfig, replaceEnvVars);

    userConfig.define = userConfig.define.reduce((obj, cur) => {
      obj[cur.var] = JSON.stringify(cur.value);
      return obj;
    }, {});
  }

  return userConfig;
};

function readList(list, options = {valueKey: 'value', keyKey: 'key', defaultObject: {}}) {
  return list
    .map(item => {
      const keys = Object.keys(item);
      let value = item;
      if (keys.length === 1) {
        const key = keys[0];
        value = {
          [options.valueKey]: item[key],
          [options.keyKey]: key
        }
      }
      return merge({}, options.defaultObject, value);
    });
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function toNative(str) {
  if (str === 'false') {
    return false;
  }
  if (str === 'true') {
    return true;
  }
  if (isNumeric(str)) {
    return Number(str);
  }
  return str;
}

function replaceEnvVars(str) {
  if (typeof str !== 'string') {
    return str;
  }

  const replacement = str.replace(/\$\{.*?\}/g, varStr => {
    varStr = varStr.replace('${', '').replace('}', '');
    let parts = varStr.split(':');

    const envVar = parts[0];
    let defaultValue = '';
    if (parts.length > 1) {
      defaultValue = parts[1];
    }

    if (process.env[envVar]) {
      return process.env[envVar];
    }
    return defaultValue;
  });
  return toNative(replacement);
}
