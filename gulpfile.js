'use strict';

require('dotenv').config()
var _           = require('lodash');
var bs          = require('browser-sync').create();
var gulp        = require('gulp');
var path        = require('path');
var webpack     = require("webpack");
var webpackDevServer = require("webpack-dev-server");

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var mocha = require('gulp-mocha');

gulp.task('default', ['develop']);

var webpackOptions = {
  entry: {
    app: "./src/app.js",
    vendor: ["axios", "react", "react-dom", "lodash", "stellar-sdk"]
  },
  output: {
    publicPath: '/laboratory/'
  },
  devtool: "source-map",
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.scss/, loader: ExtractTextPlugin.extract(['css-loader','sass-loader'])},
      {test: /\.html$/, loader: 'file-loader?name=[name].html'},
      {test: /\.(jpe?g|png|gif|svg|woff2?)$/, loader: 'file-loader?name=images/[hash].[ext]'}
    ]
  },
  plugins: [
    // Ignore native modules (ed25519)
    new webpack.IgnorePlugin(/ed25519/),
    new HtmlWebpackPlugin({
      template: "!!ejs-loader!./src/index.ejs",
      title: 'Stellar Laboratory'
    })
  ],
  node: {
    fs: 'empty'
  }
};

gulp.task('develop', function(done) {
  var options = merge(webpackOptions, {
    devServer: {
      inline: true,
      host: "localhost",
      port: 3000,
      open: true,
    },
    output: {
      ...webpackOptions.output,
      filename: "[name].js",
      path: path.resolve("./.tmp"),
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          AMPLITUDE_KEY: JSON.stringify(process.env.AMPLITUDE_KEY),
          NODE_ENV: JSON.stringify('development')
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
      new ExtractTextPlugin({ filename: 'style.css', allChunks: true})
    ]
  });

  var compiler = webpack(options);
  compiler.purgeInputFileSystem();
  var server = new webpackDevServer(compiler, {
    publicPath: options.output.publicPath,
    stats: {
      colors: true,
      chunks: false,
    },
  });
  server.listen(3000);
});

gulp.task('build', function(done) {
  var options = merge(webpackOptions, {
    bail: true,
    output: {
      ...webpackOptions.output,
      filename: "[name]-[chunkhash].js",
      path: path.resolve('./dist')
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          AMPLITUDE_KEY: JSON.stringify(process.env.AMPLITUDE_KEY),
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
      new ExtractTextPlugin({filename: 'style-[contenthash].css', allChunks: true}),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin()
    ]
  });

  var compiler = webpack(options);
  compiler.purgeInputFileSystem();
  compiler.run(done);
});


function merge(object1, object2) {
  return _.mergeWith(object1, object2, function(a, b) {
    if (_.isArray(a)) {
      return a.concat(b);
    }
  });
}

gulp.task('test:mocha', function(done) {
  return gulp.src(['test/test-helper.js', 'test/{unit,smoke}/**/*.js'], {read: false})
    .pipe(mocha())
});

gulp.task('test', ['test:mocha'], function() {});
