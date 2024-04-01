//@ts-check

'use strict';

const path = require('path');
const {DefinePlugin} = require('webpack');
const fs = require('node:fs');
const pkgInfo = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json')).toString(),
);

const isProduction = process.env.NODE_ENV === 'production';
//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node', // VS Code extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
  mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

  entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // modules added here also need to be added in the .vscodeignore file
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      isProduction
        ? {
            test: /\.m?ts$/,
            exclude: /(node_modules)/,
            use: {
              loader: 'swc-loader',
            },
          }
        : {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'ts-loader',
                options: {
                  compilerOptions: {
                    module: 'es6', // override `tsconfig.json` so that TypeScript emits native JavaScript modules.
                  },
                },
              },
            ],
          },
    ],
  },
  devtool: 'source-map',
  infrastructureLogging: {
    level: 'info', // enables logging required for problem matchers
  },
  plugins: [
    new DefinePlugin({
      'process.env.version': JSON.stringify(pkgInfo.version),
    }),
  ],
};
module.exports = [extensionConfig];
