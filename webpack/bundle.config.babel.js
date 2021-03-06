import os from 'os'
import path from 'path'
import webpack from 'webpack'
import CleanPlugin from 'clean-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import SvgStore from 'webpack-svgstore-plugin'
import UglifyJsParallelPlugin from 'webpack-uglify-parallel'

import createHappyPlugin from '../lib/createHappyPlugin'

const cwd = process.cwd()

export default {
  cache: true,
  devtool: 'source-map',
  context: cwd,
  progress: true,
  entry: {
    docs: './docs/js/index-with-styles.js',
    all: ['./js/index-with-styles.js'],
    jquery: ['./js/jquery/index.js'],
    react: ['./js/react/index.js'],
  },
  output: {
    path: path.resolve(cwd, 'dist/bundles'),
    filename: '[name].min.js',
    chunkFilename: '[name]-[chunkhash].min.js',
    publicPath: '/dist/',
  },
  resolve: {
    modulesDirectories: [
      'node_modules',
    ],
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'happypack/loader?id=jsx',
    }, {
      test: /\.scss$/,
      // loader: ExtractTextPlugin.extract('style', 'happypack/loader?id=sass'),
      loader: ExtractTextPlugin.extract('style', [
        'css?importLoaders=2&sourceMap',
        'custom-postcss',
        'sass-loader-once?outputStyle=expanded&sourceMap=true&sourceMapContents=true',
      ]),
    }],
    noParse: [
      'jquery',
      // 'react',
      // 'react-dom',
      'baconjs',
      'moment',
      'classnames',
      // 'svg4everybody',
      'zeroclipboard',
      // 'iframe-resizer',
      'lunr',
      // 'slick-carousel',
    ].map((module) => new RegExp(require.resolve(module))),
  },
  plugins: [
    createHappyPlugin('jsx', ['babel?cacheDirectory=true']),
    // createHappyPlugin('sass', [
    //   'css?importLoaders=2&sourceMap',
    //   'custom-postcss',
    //   'sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true',
    // ]),
    new CleanPlugin([
      path.resolve(cwd, 'dist/bundles'),
    ], {
      root: cwd,
    }),
    new ExtractTextPlugin('[name].min.css', {
      allChunks: true,
    }),
    new SvgStore({
      svgoOptions: {
        plugins: [{ removeTitle: true }],
      },
      prefix: '',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new UglifyJsParallelPlugin({
      workers: os.cpus().length,
      compress: {
        warnings: false,
      },
    }),
  ],
  resolveLoader: {
    alias: { // custom-postcss is used because there is no way to pass it to happypack otherwise
      'custom-postcss': path.join(__dirname, './custom-postcss.js'),
    },
  },
}
