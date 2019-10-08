const webpack = require("webpack");
const UglifyJs = require("uglifyjs-webpack-plugin");
const path = require("path");
const baseConfig = require("./webpack.config.base");

module.exports = Object.assign({}, baseConfig, {
  bail: true,
  output: Object.assign({}, baseConfig.output, {
    filename: "[name]-[chunkhash].js",
    path: path.resolve("./dist"),
  }),
  plugins: baseConfig.plugins.concat([
    new UglifyJs({}),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.bundle.js",
    }),
  ]),
});
