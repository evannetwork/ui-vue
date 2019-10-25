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
*/

const DeclarationBundlerPlugin = require('./declaration-bundler-webpack-plugin');
const fs = require('fs');
const getExternals = require('./webpack.externals');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');

/**
 * Returns the webpack configuration for the dapp to build
 *
 * @param      {string}         name                        dapp name
 * @param      {string}         dist                        destination folder
 * @param      {Array<string>}  [externals=getExternals()]  list of build externals that should be
 *                                                          excluded from the bundle
 * @param      {boolean}        [prodMode=false]            uglify, ...
 * @param      {boolean}        [transpileOnly=false]       disable d.ts filling, so build speed
 *                                                          will be increased drastically
 * @return     {any}            webpack config
 */
module.exports = function(
  name,
  dist,
  transpileOnly = false,
  prodMode = false,
  externals = getExternals(),
) {
  // enable prodMode, when node_env was set
  prodMode = prodMode || process.env.NODE_ENV === 'production';

  const packageJson = require(path.resolve(`${ dist }/../package.json`));
  const webpackConfig = {
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
            transpileOnly,
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
          test: /\.(woff(2)?|ttf|eot|svg|png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[ext]?[hash]',
              publicPath: (url, resourcePath, context) => url
            }
          }]
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
    ],
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    performance: {
      hints: false
    }
  }

  if (prodMode) {
    webpackConfig.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    webpackConfig.plugins = (webpackConfig.plugins || []).concat([
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
    ]);
  } else if (!transpileOnly) {
    webpackConfig.plugins.push(new HardSourceWebpackPlugin({ cacheDirectory: 'build-cache', }));
  }

  // only rebuild d.ts files when we are running in production mode or they does not exists
  if (!transpileOnly && (prodMode || !fs.existsSync(`${ dist }/${ name }.d.ts`))) {
    webpackConfig.plugins.push(new DeclarationBundlerPlugin({
      moduleName: `'${ packageJson.name }'`,
      out: `${ name }.d.ts`,
    }));
  }

  return webpackConfig;
}
