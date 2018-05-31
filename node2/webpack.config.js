const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

const outputDirectory = "dist";

module.exports = {
  entry: './src/server/index.js',
  output: {
    path: path.resolve(__dirname, outputDirectory),
    filename: 'bundle.js'
  },
  target: 'node',
  externals: nodeExternals()
};