#!/usr/bin/env node

const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = path.join(__dirname, '../..');
const projectDir = process.cwd();

const env = 'production';
const globals = {
    'process.env': {
        'NODE_ENV': JSON.stringify(env)
    }
};

// https://gist.github.com/sokra/27b24881210b56bbaff7
// http://www.2ality.com/2015/12/webpack-tree-shaking.html
const config = {
    devtool: 'source-map',
    entry: [
        path.join(projectDir, 'src/index')
    ],
    output: {
        path: path.join(projectDir, 'dist'),
        filename: '[name]-[hash].js'
    },
    plugins: [
        new webpack.DefinePlugin(globals),
        new webpack.optimize.OccurrenceOrderPlugin(),
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
        new webpack.optimize.DedupePlugin()
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
                    require.resolve("babel-preset-es2015-webpack"),
                    require.resolve("babel-preset-stage-0")
                ],
                cacheDirectory: true
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

    console.log(stats.toString({
        children: false,
        chunks: false,
        colors: true,
        modules: false
    }));
});
