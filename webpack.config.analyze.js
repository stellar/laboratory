const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const prodConfig = require("./webpack.config.prod");

module.exports = Object.assign({}, prodConfig, {
  plugins: prodConfig.plugins.concat([new BundleAnalyzerPlugin()]),
});
