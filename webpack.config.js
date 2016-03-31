var path = require('path');
var webpack = require('webpack');
//Make encapsulated data available to other files
module.exports = {
  devtool: 'eval',
  //entry tell you which file is the entry point, since we're loading an array all modules are loaded, last is exported
  entry: {
    app : [
      'webpack-dev-server/client?http://localhost:3000', //Set module data location to localhost 3000 for use there
      'webpack/hot/only-dev-server', // This allows for compnent reload without page reload
      './lib/index.js'],
  },
  // compile the bundle in /public/js/ directory under name 'app.js'
  output: {
    path: path.join(__dirname, './public/js/'),
    filename: `app.js`,
    publicPath: '/js/'
  },
  plugins: [ //Add additional plugins to the compiler
    new webpack.HotModuleReplacementPlugin() //exchanges, adds, or removes modules while an application is running without a page reload
  ],
  node: {
    fs: "empty" //load chunks asynchronously (I think)
  },
  resolve: { //Set options for resolving modules
    alias: {
      'react': path.join(__dirname, 'node_modules', 'react')
    },
    extensions: ['', '.js']
  },
  resolveLoader: { //Set options for resolving Loaders
    'fallback': path.join(__dirname, 'node_modules')
  },
  module: {    
    loaders: [ // An array of automatically applied loaders
    {
      // run babel on all files end in .js but only in our directory not in /node_modules/
      test: /\.js$/, // "test" to match the file extension
      loaders: ['react-hot', 'babel'], //The loaders themselves
      exclude: /node_modules/, // "exclude" to exclude exceptions in file path
      include: [path.join(__dirname,'./lib')] //"include" to match the directories
    },
    {
	  //Find all xml file extensions and load as raw
      test: /\.xml$/,
      loader: "raw"
    },
    {
	  //find all json file extensions and load with json-loader
      test: /\.json$/,
      loaders: ['json-loader']
    },
    {
	  //find all css file extensions and load with raw in root directory
      test: /\.css?$/,
      loaders: ['style', 'raw'],
      include: __dirname
    }]
  }
};
