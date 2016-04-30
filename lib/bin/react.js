#!/usr/bin/env node

const path = require('path');
const webpack = require('webpack');
const del = require('del');

const rootDir = path.join(__dirname, '../..');
const projectDir = process.cwd();
const distFolder = path.join(projectDir, 'dist');

del.sync(distFolder);


const config = require('../webpack/webpack.prod.config')({
  rootDir: rootDir,
  projectDir: projectDir
});

webpack(config, (error, stats) => {
    if (error) {
        throw new Error("webpack", error);
    }

    console.log(stats.toString({
        children: false,
        chunks: false,
        colors: true,
        modules: false
    }));
});
