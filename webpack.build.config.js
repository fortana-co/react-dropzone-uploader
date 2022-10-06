/* eslint import/no-extraneous-dependencies: 0 */
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
  throw new Error('Production builds must have NODE_ENV=production.')
}

function createConfig(entry, output) {
  return {
    mode: 'production',
    entry,
    output,
    optimization: {
      minimizer: [new UglifyJSPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: [/node_modules/, /src\/*.tsx/],
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
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
}

module.exports = [
  createConfig('./src/Dropzone.js', {
    path: path.resolve('dist'),
    libraryTarget: 'commonjs2',
    filename: 'react-dropzone-uploader.js',
  }),
  createConfig('./src/Dropzone.js', {
    path: path.resolve('dist'),
    libraryTarget: 'umd',
    filename: 'react-dropzone-uploader.umd.js',
    library: 'ReactDropzoneUploader',
  }),
]
