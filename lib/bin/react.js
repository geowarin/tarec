#!/usr/bin/env node

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const del = require('del');
const requireDir = require('require-dir');

const rootDir = path.join(__dirname, '../..');
const projectDir = process.cwd();
const distFolder = path.join(projectDir, 'dist');

del.sync(distFolder);

const env = 'production';
const globals = {
    'process.env': {
        'NODE_ENV': JSON.stringify(env)
    }
};

const allLoaders = requireDir('../loaders');
const loaders = Object.keys(allLoaders).reduce((p, k) => p.concat(allLoaders[k]), []);

// https://gist.github.com/sokra/27b24881210b56bbaff7
// http://www.2ality.com/2015/12/webpack-tree-shaking.html
const config = {
    devtool: 'source-map',
    entry: [
        path.join(projectDir, 'src/index')
    ],
    output: {
        path: distFolder,
        filename: '[name]-[hash].js'
    },
    plugins: [
        new webpack.DefinePlugin(globals),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            minChunks(module) {
                return (
                    module.resource &&
                    module.resource.indexOf('node_modules') >= 0
                )
            }
        }),
        new HtmlWebpackPlugin({
            title: 'ReactApp',
            template: path.join(projectDir, 'index.html')
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                unused: true,
                dead_code: true,
                warnings: false,
                screw_ie8: true
            }
        }),
        new ExtractTextPlugin('style.css')
    ],
    resolve: {
        modules: [path.join(projectDir, 'src'), 'node_modules'],
        extensions: ['', '.js', '.json']
    },
    resolveLoader: {
        modules: [path.join(rootDir, 'node_modules')]
    },
    module: {
        loaders: loaders
    }
};

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
