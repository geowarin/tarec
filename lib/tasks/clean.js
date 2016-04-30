const del = require('del');

module.exports = function clean(distFolder) {
  del.sync(distFolder);
};
