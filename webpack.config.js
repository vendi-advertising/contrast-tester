/*jslint esversion: 6, maxparams: 4, maxdepth: 4, maxstatements: 20, maxcomplexity: 8 */

const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
    entry: {
        main: './js/src/main.js'
    },
    devtool: 'source-map',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'js/dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'],
                                cacheDirectory: true,
                            }
                        },
                        {
                            loader: "ifdef-loader",
                            options: {
                                IE_DEBUG_MODE: false
                            },
                        }
                    ]
            }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin(
                {
                    analyzerMode: 'static',
                }
            )
    ],
};
