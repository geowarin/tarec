#!/usr/bin/env node

const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = path.join(__dirname, '../..');
const projectDir = process.cwd();

var entry = path.join(projectDir, 'src/index');
console.log(path.resolve(entry));

// https://gist.github.com/sokra/27b24881210b56bbaff7
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
        new webpack.optimize.OccurrenceOrderPlugin(),
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
        modules: [path.join(projectDir, 'src'), 'node_modules'],
        extensions: ['', '.js', '.json']
    },
    resolveLoader: {
        modules: [path.join(rootDir, 'node_modules')]
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
                // plugins: [
                //     require.resolve('babel-plugin-transform-es2015-template-literals'),
                //     require.resolve('babel-plugin-transform-es2015-literals'),
                //     require.resolve('babel-plugin-transform-es2015-function-name'),
                //     require.resolve('babel-plugin-transform-es2015-arrow-functions'),
                //     require.resolve('babel-plugin-transform-es2015-block-scoped-functions'),
                //     require.resolve('babel-plugin-transform-es2015-classes'),
                //     require.resolve('babel-plugin-transform-es2015-object-super'),
                //     require.resolve('babel-plugin-transform-es2015-shorthand-properties'),
                //     require.resolve('babel-plugin-transform-es2015-duplicate-keys'),
                //     require.resolve('babel-plugin-transform-es2015-computed-properties'),
                //     require.resolve('babel-plugin-transform-es2015-for-of'),
                //     require.resolve('babel-plugin-transform-es2015-sticky-regex'),
                //     require.resolve('babel-plugin-transform-es2015-unicode-regex'),
                //     require.resolve('babel-plugin-check-es2015-constants'),
                //     require.resolve('babel-plugin-transform-es2015-spread'),
                //     require.resolve('babel-plugin-transform-es2015-parameters'),
                //     require.resolve('babel-plugin-transform-es2015-destructuring'),
                //     require.resolve('babel-plugin-transform-es2015-block-scoping'),
                //     require.resolve('babel-plugin-transform-es2015-typeof-symbol'),
                //     [require.resolve('babel-plugin-transform-regenerator'), { async: false, asyncGenerators: false }]
                // ]
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
