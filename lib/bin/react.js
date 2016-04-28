#!/usr/bin/env node

const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = path.join(__dirname, '../..');
const projectDir = process.cwd();

var entry = path.join(projectDir, 'src/index');
console.log(path.resolve(entry));

const config = {
    devtool: 'source-map',
    entry: [
        path.join(projectDir, 'src/index')
    ],
    output: {
        path: path.join(projectDir, 'dist'),
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            minChunks(module, count) {
                return (
                    module.resource &&
                    module.resource.indexOf(path.resolve('node_modules')) === 0
                )
            }
        }),
        new HtmlWebpackPlugin({
            title: 'ReactApp',
            template: path.join(projectDir, 'index.html')
        })
    ],
    resolve: {
        extensions: ['', '.js', '.json'],
        modulesDirectories: ['node_modules']
        // root: projectDir
    },
    resolveLoader: {
        modulesDirectories: ['node_modules'],
        root: path.join(rootDir, 'node_modules')
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: [
                    require.resolve("babel-preset-react"),
                    require.resolve("babel-preset-es2015"),
                    require.resolve("babel-preset-stage-0")
                ]
            }
        }, {
            test: /\.json/,
            loaders: ['json']
        }]
    }
};

webpack(config, (error, stats) => {
    if (error) {
        throw new Error("webpack", error);
    }

    // console.log(stats);
});
