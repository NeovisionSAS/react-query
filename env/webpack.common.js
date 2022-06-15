/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const { extensions } = require('./extensions');

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
