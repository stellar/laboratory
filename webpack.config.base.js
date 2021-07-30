const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/app.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.scss/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          "css-loader",
          "sass-loader"],
      },
      {
        test: /\.html$/,
        use: "file-loader?name=[name].html"
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff2?)$/,
        use: "file-loader?name=images/[hash].[ext]",
      },
    ],
  },
  plugins: [
    // Ignore native modules (ed25519)
    new webpack.IgnorePlugin(/ed25519/),
    new HtmlWebpackPlugin({
      template: "!!raw-loader!./src/index.ejs",
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
  resolve: {
    fallback: {
      fs: false,
      http: false,
      https: false,
      util: false
    }
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
