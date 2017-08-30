const path = require('path');
const webpack = require('webpack');
const isDevBuild = process.argv.indexOf('--env.prod') < 0;

const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('vendor.css');

module.exports = {
    stats: {
        modules: false
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.woff(2)?(\?[a-z0-9]+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?[a-z0-9]+)?$/,
                loader: "file-loader"
            },
        ]
    },
    entry: {
        vendor: [
            '@angular/common',
            '@angular/compiler',
            '@angular/core',
            '@angular/http',
            '@angular/material',
            '@angular/material/prebuilt-themes/deeppurple-amber.css',
            '@angular/platform-browser',
            '@angular/platform-browser-dynamic',
            '@angular/router',
            '@angular/platform-server',
            'core-js/es6',
            'core-js/es7/reflect',
            'ng-recaptcha',
            'zone.js',
        ]
    },
    output: {
        filename: '[name].js',
        library: '[name]_[hash]',
        publicPath: '/dist/',
        path: path.join(__dirname, './wwwroot', 'dist')
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/\@angular\b.*\b(bundles|linker)/, path.join(__dirname, './AppClient')), // Workaround for https://github.com/angular/angular/issues/11580
        extractCSS,
        new webpack.DllPlugin({
            path: path.join(__dirname, './wwwroot', 'dist', '[name]-manifest.json'),
            name: '[name]_[hash]'
        })
    ].concat(isDevBuild ? [] : [
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
    ])
};