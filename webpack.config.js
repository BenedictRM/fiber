var path = require('path');
var webpack = require('webpack');
//Make encapsulated data available to other files
module.exports = {
  devtool: 'eval',
  //entry tell you which file is the entry point
  entry: {
    app : [
      'webpack-dev-server/client?http://localhost:3000', //Set module data location to localhost 3000
      'webpack/hot/only-dev-server', // This allows for compnent reload without page reload
      './lib/index.js'],
  },
  // compile the bundle in /public/js/ directory under name 'app.js'
  output: {
    path: path.join(__dirname, './public/js/'),
    filename: `app.js`,
    publicPath: '/js/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() //exchanges, adds, or removes modules while an application is running without a page reload
  ],
  node: {
    fs: "empty"
  },
  resolve: {
    alias: {
      'react': path.join(__dirname, 'node_modules', 'react')
    },
    extensions: ['', '.js']
  },
  resolveLoader: {
    'fallback': path.join(__dirname, 'node_modules')
  },
  module: {    
    loaders: [
    {
      // run babel on all files end in .js but only in our directory not in /node_modules/
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      exclude: /node_modules/,
      include: [path.join(__dirname,'./lib')]
    },
    {
      test: /\.xml$/,
      loader: "raw"
    },
    {
      test: /\.json$/,
      loaders: ['json-loader']
    },
    {
      test: /\.css?$/,
      loaders: ['style', 'raw'],
      include: __dirname
    }]
  }
};
