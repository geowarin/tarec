#!/usr/bin/env node
'use strict';

const tarec = require('../lib/main');
require('../lib/utils/debug').enable();
tarec(process.cwd(), process.argv.slice(2));
