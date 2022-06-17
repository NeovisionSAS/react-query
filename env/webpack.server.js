const common = require('./webpack.common');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { spawn, exec } = require('child_process');
const nodeExternals = require('webpack-node-externals');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  watch: true,
  entry: {
    filename: path.resolve(__dirname, '../src/server/index.ts'),
  },
  target: 'node',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, '../tmp'),
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
              configFile: path.resolve(__dirname, '../tsconfig.server.json'),
            },
          },
        ],
      },
    ],
  },
  stats: 'minimal',
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin({
      dangerouslyAllowCleanPatternsOutsideProject: true,
      dry: false,
    }),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (_) => {
          exec(`lsof -t -i:3000 | xargs kill -9`, () => {
            const cmd = 'node';
            const arg = `${path.resolve(__dirname, '../tmp/server.js')}`;
            console.log(`> ${cmd} ${arg}\n`);
            spawn(cmd, [arg], { stdio: 'inherit' });
          });
        });
      },
    },
  ],
});
