const path = require("path");
const baseConfig = require("./webpack.config.base");

module.exports = Object.assign({}, baseConfig, {
  mode: "production",
  bail: true,
  output: Object.assign({}, baseConfig.output, {
    filename: "[name]-[chunkhash].js",
    path: path.resolve("./dist"),
  }),
  plugins: baseConfig.plugins.concat([]),
});
