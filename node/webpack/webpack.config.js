const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const outputDirectory = "../dist";

module.exports = {
  entry: './src/server/index',
  mode: "development",
  output: {
    path: path.resolve(__dirname, outputDirectory),
    filename: 'bundle.js',
    publicPath: '/static/'
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
        test: /\.jsx?/,
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
    new CleanWebpackPlugin([outputDirectory]),
    new CopyWebpackPlugin([ //  копирование файлов из начальной папки в конечную
        {from:'src/server/static',to:'static'} //, {from:'assets',to:'assets'} 
    ])
  ],
  node: {
    __dirname: false
  }
};