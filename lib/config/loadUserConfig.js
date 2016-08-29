'use strict';

const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const os = require('os');
const merge = require('lodash.merge');

function mapObject(obj, fn) {
  return Object.keys(obj).reduce(
    (res, key) => {
      res[key] = fn(obj[key]);
      return res;
    },
    {}
  )
}

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
    })
    .map(obj => mapObject(obj, replaceEnvVars));
}


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

function replaceEnvVars(str) {
  if (typeof str !== 'string') {
    return str;
  }

  return str.replace(/\$\{.*?\}/g, varStr => {
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
    userConfig.define = getDefine(userConfig.define).reduce((obj, cur) => {
      obj[cur.var] = JSON.stringify(cur.value);
      return obj;
    }, {});
  }

  return userConfig;
};
