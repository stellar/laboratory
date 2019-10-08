const webpack = require("webpack");
const path = require("path");
const baseConfig = require("./webpack.config.base");

module.exports = {
  ...baseConfig,
  bail: true,
  output: {
    ...baseConfig.output,
    filename: "[name]-[chunkhash].js",
    path: path.resolve("./dist"),
  },
  plugins: [
    ...baseConfig.plugins,
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.bundle.js",
    }),
  ],
};
