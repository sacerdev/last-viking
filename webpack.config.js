const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  return {
    mode: options.mode,
    entry: {
      index: './src/js_puzzler/index.js',
    },
    output: {
      filename: 'game.js',
      path: path.resolve(__dirname, 'build'),
    },
    optimization: {
      minimizer: [
        new TerserWebpackPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction,
            },
            mangle: {
              properties: isProduction,
            }
          },
        }),
        new CssMinimizerPlugin(),
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
};
