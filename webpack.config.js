const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/LocalDataStorage.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'LocalDataStorage.min.js'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
}
