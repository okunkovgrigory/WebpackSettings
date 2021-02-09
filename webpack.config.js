const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const DashboardPlugin = require("webpack-dashboard/plugin");


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
    const config = {};
    if (isProd) {
        config.minimizer = [
            new TerserWebpackPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
            new OptimizeCssAssetsWebpackPlugin()
        ];
    }

    return config
};

function generateHtmlWebpackPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
        return new HtmlWebpackPlugin({
            filename: `${item}`,
            template: path.resolve(__dirname, `${templateDir}/${item}`),
            minify: {
                collapseWhitespace: isProd
            }
        });
    })
}

const htmlPlugins = generateHtmlWebpackPlugins('src/HTML');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        index: './index.js',
    },
    output: {
        filename: './assets/js/[name].js',
        path: path.resolve(__dirname, 'dist/'),
        publicPath: ""
    },

    optimization: optimization(),

    devtool: isDev? "source-map": false,

    devServer: {
        overlay: true,
        historyApiFallback: true,
        compress: true,
        open: true,
        port: 5000
    },

    plugins: [
        new DashboardPlugin(),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
                patterns: [
                    {from: path.resolve(__dirname, 'src/assets/img/favicon.ico'), to: path.resolve(__dirname, 'dist/assets/img/')},
                ]
            }
        ),
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].css'
        })
    ].concat(htmlPlugins),

    module: {

        rules: [
            {
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: (resourcePath, context) => {
                                return path.relative(path.dirname(resourcePath), context).replace('\\', '/') + "/";
                            },
                        },
                    },
                    'css-loader',
                    'sass-loader'
                ],
            },

            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },

            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: '[path][name].[ext]'
                    }
                }
                ]
            },

            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: '[path][name].[ext]'
                    }
                }
                ]
            },

        ]
    },

    resolve: {
        extensions: [".js"]
    },
    target: ['es5']
};