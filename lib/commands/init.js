'use strict';

const deasync = require('deasync');
const copy = deasync(require('copy-template-dir'));
const path = require('path');
const chalk = require('chalk');

module.exports = function init (context, args) {
  if (args.help || args.h) {
    console.log(`\nCommand: ${chalk.green('tarec init')}`);
    console.log(`  Generates a simple application in the current directory`);
    console.log(`  Options: <None>`);
    process.exit(0);
  }
  const minimal = args.minimal;

  const projectName = path.basename(context.projectDir);
  const vars = {
    projectName: projectName,
    tarecVersion: context.tarecPkg.version
  };

  const templateName = minimal ? 'minimal' : 'app';
  const inDir = path.join(context.rootDir, `templates/${templateName}`);
  const outDir = path.join(context.projectDir);

  const createdFiles = copy(inDir, outDir, vars);
  createdFiles.forEach(filePath => console.log(`${chalk.green('created')} ${filePath}`))
};
