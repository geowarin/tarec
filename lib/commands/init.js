'use strict';

const deasync = require('deasync');
const copy = deasync(require('copy-template-dir'));
const path = require('path');
const chalk = require('chalk');
const debug = require('../utils/debug');

module.exports = function init (context, args) {
  const minimal = args.minimal;
  const typescript = args.typescript;

  const projectName = path.basename(context.projectDir);
  const vars = {
    projectName: projectName,
    tarecVersion: context.tarecPkg.version
  };

  const templateName = minimal ? 'minimal' : typescript ? 'typescript' : 'app';
  const inDir = path.join(context.rootDir, `templates/${templateName}`);
  const outDir = path.join(context.projectDir);

  const createdFiles = copy(inDir, outDir, vars);
  createdFiles.forEach(filePath => debug.log(`${chalk.green('created')} ${filePath}`))
};
