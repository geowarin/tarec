#!/usr/bin/env node
'use strict';

const tarec = require('./main');
require('../utils/debug').enable();
tarec(process.cwd(), process.argv.slice(2));
