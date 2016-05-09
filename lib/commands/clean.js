'use strict';

const del = require('del');
const path = require('path');

module.exports = function clean(context) {
  del.sync(path.join(context.projectDir, 'dist'));
};
