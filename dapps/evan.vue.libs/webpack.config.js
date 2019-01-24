const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');

// process.env.NODE_ENV = 'production';

// load name from package.json
const name = 'evan.vue.libs';

module.exports = {
  entry: './src/index.ts',
  externals: {
    'bcc': 'bcc',
    'dapp-browser': 'dapp-browser',
    'smart-contracts': 'smart-contracts',
    'vue': 'vue',
    'vue-material': 'vue-material',
    'vuex': 'vuex',
    'vuex-i18n': 'vuex-i18n',
  },
  devtool: '#eval-source-map',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
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
        test: /\.(woff(2)?|ttf|eot|svg|png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'assets/[name].[ext]?[hash]',
            publicPath: './'
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
    })
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
    })
  ])
}