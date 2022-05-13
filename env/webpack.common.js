/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

const extensions = [
  '.mjs',
  '.js',
  '.tsx',
  '.ts',
  '.png',
  '.jpg',
  '.jpeg',
  '.css',
  '.scss',
];

module.exports = {
  devServer: {
    historyApiFallback: true,
  },
  output: {
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  resolve: {
    extensions,
    plugins: [
      new TsconfigPathsPlugin({
        extensions,
        configFile: path.resolve(__dirname, '../tsconfig.json'),
      }),
    ],
  },
  devtool: 'inline-source-map',
};
