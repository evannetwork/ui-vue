/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');

module.exports = function(name, dist, externals) {
  externals = externals || {
    '@evan.network/api-blockchain-core': '@evan.network/api-blockchain-core',
    '@evan.network/smart-contracts-core': '@evan.network/smart-contracts-core',
    '@evan.network/ui': '@evan.network/ui',
    '@evan.network/ui-dapp-browser': '@evan.network/ui-dapp-browser',
    '@evan.network/ui-vue-core': '@evan.network/ui-vue-core',
    'axios': 'axios',
    'vue': 'vue',
    'vue-material': 'vue-material',
    'vue-recaptcha': 'vue-recaptcha',
    'vue-router': 'vue-router',
    'vuex': 'vuex',
    'vuex-i18n': 'vuex-i18n',
  };

  return {
    entry: './src/index.ts',
    externals: externals,
    devtool: '#eval-source-map',
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    output: {
      path: dist,
      publicPath: '/dist/',
      filename: `${ name }.js`,
      library: `${ name }.js`,
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/],
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
              // the "scss" and "sass" values for the lang attribute to the right configs here.
              // other preprocessors should work out of the box, no loader config like this necessary.
              'scss': [
                'vue-style-loader',
                'css-loader',
                'sass-loader'
              ]
            }
            // other vue-loader options go here
          }
        },
        {
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader, // process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader', // translates css into commonJS
            'sass-loader' // compiles sass to css, using node sass by default
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[ext]?[hash]'
            }
          }]
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        },
        {
          test: /\.js$/,
          exclude: file => (/node_modules/.test(file) && !/\.vue\.js/.test(file)),
          loader: 'babel-loader'
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: `${ name }.css`,
        chunkFilename: `${ name }.css`,
      }),
      new HardSourceWebpackPlugin({ cacheDirectory: 'build-cache', })
    ],
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    devServer: {
      historyApiFallback: true,
      noInfo: true
    },
    performance: {
      hints: false
    }
  }

  if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new UglifyJsPlugin({
        test: /\.js($|\?)/i,
        exclude: /(node_modules)/,
        parallel: true,
        sourceMap: false
      }),
      new OptimizeCSSAssetsPlugin({}),
    ])
  };
}