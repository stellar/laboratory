'use strict';

var bs          = require('browser-sync').create();
var gulp        = require('gulp');
var path        = require('path');
var webpack     = require("webpack");

var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
        {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
        {test: /\.json$/, loader: 'json'},
        {test: /\.scss/, loader: ExtractTextPlugin.extract('css?sourceMap!sass?sourceMap&' +
          'includePaths[]=' + encodeURIComponent(path.resolve(__dirname, './node_modules')))},
        {test: /\.html$/, loader: 'file?name=[name].html'},
        {test: /\.(jpe?g|png|gif|svg)$/, loader: 'file?name=images/[hash].[ext]'}
      ]
    },
    plugins: [
      // Ignore native modules (ed25519)
      new webpack.IgnorePlugin(/ed25519/),
      new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"),
      new ExtractTextPlugin('style.css', {
        allChunks: true
      })
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
