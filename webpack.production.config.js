var path = require('path');
var webpack = require('webpack');
//Make encapsulated data available to other files
module.exports = {
  entry: {//Which file is entry point for this module, in this case lib/index.js 
    app : [
      './lib/index.js'],
  },
  // compile the bundle in /public/js/ directory under name 'app.js'
  output: {
    path: path.join(__dirname, './public/js/'),
    filename: `app.js`,
    publicPath: '/js/'
  },
  plugins: [ //Add additional plugins to the compiler
    new webpack.DefinePlugin({ // Dependency injection -- this defines a free variable i.e. global constant
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin({ //Minimize all JavaScript output of chunks
    }),
  ],
  node: {
    fs: "empty" //load chunks asynchronously (I think)
  },
  resolve: { //Set options for resolving modules
    alias: { //Replace modules with other modulaes or paths
      'react': path.join(__dirname, 'node_modules', 'react') //add modules to the absolute path of react
    },
    extensions: ['', '.js']
  },
  resolveLoader: { //Set options for resolving Loaders
    'fallback': path.join(__dirname, 'node_modules') //set fallback for resolve loader: If resolve.root is missing directory in abs path, check resolveloader.fallback
  },
  module: {
    loaders: [ //An array of automatically applied loaders
    {
      test: /\.js$/, // "test" to match the file extension
	  // run babel on all files end in .js but only in our directory not in /node_modules/
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
