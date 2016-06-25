#!/usr/bin/env node
'use strict';

const tarec = require('./main');
tarec(process.cwd(), process.argv.slice(2));
