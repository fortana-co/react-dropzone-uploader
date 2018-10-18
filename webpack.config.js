const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './example/src/index',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'example/dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'example/src/index.html'),
      filename: path.join(__dirname, 'example/dist/index.html'),
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'example/src/responsive_example.html'),
      filename: path.join(__dirname, 'example/dist/responsive_example.html'),
      chunks: ['responsive_example'],
    }),
  ],
  devServer: {
    contentBase: './example',
    host: '0.0.0.0',
  },
}
