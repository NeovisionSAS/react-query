/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
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
      {
        test: /\.(s?css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions,
  },
  devtool: 'inline-source-map',
};
