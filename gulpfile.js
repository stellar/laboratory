'use strict';

var bs          = require('browser-sync').create();
var gulp        = require('gulp');
var webpack     = require("webpack");

gulp.task('build', function(done) {
  var options = {
    entry: {
      app: "./src/app.js",
      vendor: ["react", "react-dom", "lodash", "flux"]
    },
    devtool: "source-map",
    output: {
      filename: "[name].js",
      path: './dist'
    },
    resolve: {
      root: ['src'],
      modulesDirectories: ["node_modules"]
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
        { test: /\.json$/, loader: 'json'},
        { test: /\.html/, loader: 'file?name=[name].html'},
        { test: /\.(jpe?g|png|gif|svg)/, loader: 'file?name=images/[hash].[ext]'}
      ]
    },
    plugins: [
      // Ignore native modules (ed25519)
      new webpack.IgnorePlugin(/ed25519/),
      new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js")
    ]
  };

  var watchOptions = {
    aggregateTimeout: 300
  };

  var bsInitialized = false;

  var compiler = webpack(options);
  compiler.purgeInputFileSystem();
  compiler.watch(watchOptions, function(error, stats) {
    if (!bsInitialized) {
      bs.watch("dist/**/*").on("change", bs.reload);
      bs.init({
        notify: false,
        server: "./dist"
      });
      bsInitialized = true;
    }
    console.log(stats.toString({
      hash: false,
      version: false,
      timings: true,
      chunks: false,
      colors: true
    }));
  });
});
