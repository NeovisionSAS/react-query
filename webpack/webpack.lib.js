/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = merge(
  {
    mode: 'production',
    entry: path.resolve('src', 'module.ts'),
    output: {
      path: path.resolve(__dirname, '../', 'lib'),
      publicPath: '/',
      library: {
        name: 'react-query',
        type: 'umd',
      },
      filename: 'module.js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader' },
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(
                  __dirname,
                  '../typescript/tsconfig.lib.json'
                ),
              },
            },
          ],
        },
        {
          test: /\.s?css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    ],
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
    },
    optimization: {
      minimize: false,
    },
  },
  common
);
