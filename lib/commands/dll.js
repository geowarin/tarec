const deasync = require('deasync');
const webpack = deasync(require('webpack'));
const dllConfig = require('../webpack/webpack.dll.config');
const debug = require('../utils/debug');
const fs = require('fs');

module.exports = function generateDll(context, args) {

  const stats = webpack(dllConfig(context));
  const modules = stats.compilation.modules;
  const dlls = Object.keys(stats.compilation.assets).join(', ');
  debug.log(`Generated dlls for ${modules.length} vendor files in : ${dlls}`);
  if (stats.compilation.errors) {
    stats.compilation.errors.forEach(error => {
      debug.error(error.message);
    })
  }
};
