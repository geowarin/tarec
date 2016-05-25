'use strict';

const copy = require('copy-template-dir');
const path = require('path');
const chalk = require('chalk');

module.exports = function init (context, args) {
  if (args.help || args.h) {
    console.log(`\nCommand: ${chalk.green('tarec init')}`);
    console.log(`  Generates a simple application in the current directory`);
    console.log(`  Options: <None>`);
    process.exit(0);
  }

  const projectName = path.basename(context.projectDir);
  const vars = {
    projectName: projectName,
    tarecVersion: context.tarecPkg.version
  };

  const inDir = path.join(context.rootDir, 'lib/templates/app');
  const outDir = path.join(context.projectDir);

  copy(inDir, outDir, vars, (err, createdFiles) => {
    if (err) {
      throw err;
    }

    createdFiles.forEach(filePath => console.log(`${chalk.green('created')} ${filePath}`))
  })
};
