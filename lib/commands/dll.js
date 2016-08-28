const deasync = require('deasync');
const webpack = deasync(require('webpack'));
const dllConfig = require('../webpack/webpack.dll.config');
const debug = require('../utils/debug');
const fs = require('fs');

module.exports = function generateDll(context) {

  const stats = webpack(dllConfig(context));
  const modules = stats.compilation.modules;
  const dlls =
    Object.keys(stats.compilation.assets)
      .filter(asset => asset.includes('dll.js'))
      .map(asset => `.tarec/dll/${asset}`)
      .join(', ');
  debug.log(`Generated dlls for ${modules.length} vendor files in : ${dlls}`);
  if (stats.compilation.errors) {
    stats.compilation.errors.forEach(error => {
      debug.error(error.message);
    })
  }
  if (stats.compilation.errors.length > 0) {
    process.exit(1);
  }
};
