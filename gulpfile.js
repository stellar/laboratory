'use strict';

var bs          = require('browser-sync').create();
var gulp        = require('gulp');
var path        = require('path');
var webpack     = require("webpack");

var ExtractTextPlugin = require('extract-text-webpack-plugin');

gulp.task('default', ['develop']);

var webpackOptions = {
  entry: {
    app: "./src/app.js",
    vendor: ["axios", "react", "react-dom", "lodash", "flux", "stellar-sdk"]
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
      {test: /\.scss/, loader: ExtractTextPlugin.extract('css?sourceMap!sass?sourceMap')},
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

gulp.task('develop', function(done) {
  webpackOptions.output.path = './.tmp';

  var watchOptions = {
    aggregateTimeout: 300
  };

  var bsInitialized = false;

  var compiler = webpack(webpackOptions);
  compiler.purgeInputFileSystem();
  compiler.watch(watchOptions, function(error, stats) {
    if (!bsInitialized) {
      gulp.watch(".tmp/**/*").on("change", bs.reload);
      bs.init({
        notify: false,
        server: "./.tmp"
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

gulp.task('build', function(done) {
  webpackOptions.plugins.push(new webpack.optimize.DedupePlugin());
  webpackOptions.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
  webpackOptions.plugins.push(new webpack.optimize.UglifyJsPlugin());

  var compiler = webpack(webpackOptions);
  compiler.purgeInputFileSystem();
  compiler.run(done);
});
