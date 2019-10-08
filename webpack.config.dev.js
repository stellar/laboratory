const webpack = require("webpack");
const path = require("path");
const baseConfig = require("./webpack.config.base");

module.exports = Object.assign({}, baseConfig, {
  devServer: {
    inline: true,
    host: "localhost",
    port: 3000,
    open: true,
    openPage: "laboratory/",
  },
  output: Object.assign({}, baseConfig.output, {
    filename: "[name].js",
    path: path.resolve("./.tmp"),
  }),
  plugins: baseConfig.plugins.concat([
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.bundle.js",
    }),
  ]),
});
