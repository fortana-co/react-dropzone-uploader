const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
  throw new Error('Production builds must have NODE_ENV=production.')
}

module.exports = {
  mode: 'production',
  entry: './src/FileUploader.js',
  output: {
    path: path.resolve('dist'),
    filename: 'FileUploader.js',
    libraryTarget: 'commonjs2',
  },
  optimization: {
    minimizer: [new UglifyJSPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=10000',
      },
    ],
  },
}
