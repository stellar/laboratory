const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/app.js",
    vendor: ["axios", "react", "react-dom", "lodash", "stellar-sdk"],
  },
  output: {
    publicPath: "/laboratory/",
  },
  devtool: "source-map",
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.scss/,
        loader: ExtractTextPlugin.extract(["css-loader", "sass-loader"]),
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
    new ExtractTextPlugin({
      filename: "style-[contenthash].css",
      allChunks: true,
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
};
