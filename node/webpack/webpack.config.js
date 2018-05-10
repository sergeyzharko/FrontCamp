const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const CleanWebpackPlugin = require("clean-webpack-plugin");

const outputDirectory = "../dist";

module.exports = {
  entry: './src/server.js',
  output: {
    path: path.resolve(__dirname, outputDirectory),
    filename: 'bundle.js',
    publicPath: '/'
  },
  target: 'node',
  externals: nodeExternals(),
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'production'`
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          "presets": ["env", "react"]
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      "/api": "http://localhost:8080"
    }
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory])
  ]
};