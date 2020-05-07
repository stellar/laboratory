const webpack = require("webpack");
const path = require("path");
const baseConfig = require("./webpack.config.base");

module.exports = Object.assign({}, baseConfig, {
  mode: "development",
  devServer: {
    inline: true,
    host: "localhost",
    port: 3000,
  },
  devtool: "inline-source-map",
  output: Object.assign({}, baseConfig.output, {
    filename: "[name].js",
    path: path.resolve("./.tmp"),
  }),
  plugins: baseConfig.plugins.concat([
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
  ]),
});
