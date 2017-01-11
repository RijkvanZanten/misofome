/* eslint-disable no-extraneous-dependencies */
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const clientConfig = {
  entry: {
    main: './pwa/index.jsx',
  },
  output: {
    path: './dist',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[chunkhash].js',
    publicPath: '/',
  },
  cache: false,
  debug: false,
  progress: true,
  target: 'web',
  devtool: false,
  plugins: [
    new CleanWebpackPlugin(['./dist']),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        warnings: false,
      },
    }),
    new HtmlWebpackPlugin({
      template: 'template-html.ejs',
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.woff$/,
        loaders: ['url?limit=50000&name=[name].[ext]?[hash:5]'],
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url?limit=10000&name=[name].[ext]?[hash:5]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },
    ],
  },
  resolve: {
    root: process.cwd(),
    extensions: ['', '.js', '.jsx'],
  },
  node: {
    __dirname: true,
    fs: 'empty',
  },
};

module.exports = clientConfig;
