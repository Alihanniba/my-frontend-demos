var webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
  __DEVTOOLS__: true,
  __CLIENT__: true,
  __SERVER__: false,
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

var ip;
try{
  ip = require(__dirname + '/ip')
}catch(e){
  ip = 'localhost';
}
var port = 9010
module.exports = {
  ip: ip,
  port: port,
  devtool: "eval",
  entry: {
    main:  [
      "webpack-dev-server/client?http://" + ip + ":" + port,
      "webpack/hot/only-dev-server",
      './src/index.jsx'
      ],
    other: [
      "webpack-dev-server/client?http://" + ip + ":" + port,
      "webpack/hot/only-dev-server",
      './src/other.jsx'
    ]
  },
  output: {
    path: __dirname + "/public/build",
    library: '[name]',
    filename: '[name].js',
    publicPath: "http://" + ip + ":" + port + "/build/"
  },
  module: {
    loaders: [
      {test: /\.jsx$/, loader: 'babel', exclude: /(node_modules|bower_components)/, query: { presets: ['react', 'es2015'] }},
      {test: /\.js$/, loader: 'babel', exclude: /(node_modules|bower_components)/, query: { presets: ['react', 'es2015'] }},
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    definePlugin,
    commonsPlugin
  ]
};