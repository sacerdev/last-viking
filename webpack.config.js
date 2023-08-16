const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/js/index.js',
  },
  output: {
    filename: 'game.js',
    path: path.resolve(__dirname, 'build'),
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin(),
      new CompressionWebpackPlugin(),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/html/index.html',
      inject: 'body',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/css', to: './' },
        { from: './src/assets', to: './assets' },
      ],
    }),
    new ZipWebpackPlugin({
      filename: 'entry.zip',
      path: path.resolve(__dirname, 'dist'),
      pathPrefix: 'build/',
      threshold: 13000, // Set your threshold here
    }),
  ],
};
