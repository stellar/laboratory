const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/app.js",
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.scss/,
        loader: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      { test: /\.html$/, loader: "file-loader?name=[name].html" },
      {
        test: /\.(jpe?g|png|gif|svg|woff2?)$/,
        loader: "file-loader?name=images/[hash].[ext]",
      },
    ],
  },
  plugins: [
    // Ignore native modules (ed25519)
    new webpack.IgnorePlugin(/ed25519/),
    new HtmlWebpackPlugin({
      template: "!!ejs-loader!./src/index.ejs",
      title: "Stellar Laboratory",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
    }),
    new webpack.DefinePlugin({
      "process.env": {
        AMPLITUDE_KEY: JSON.stringify(process.env.AMPLITUDE_KEY),
      },
    }),
  ],
  node: {
    fs: "empty",
  },
  stats: {
    all: false,
    assets: true,
    errors: true,
    warnings: true,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
