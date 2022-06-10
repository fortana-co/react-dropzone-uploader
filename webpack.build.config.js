/* eslint import/no-extraneous-dependencies: 0 */
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path')
const CopyPlugin = require("copy-webpack-plugin");

if (process.env.NODE_ENV !== 'production') {
  throw new Error('Production builds must have NODE_ENV=production.')
}

function createConfig(entry, output) {
  return {
    mode: 'production',
    entry,
    output,
    optimization: {
      minimizer: [new TerserPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          loader: 'style-loader',
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
          exclude: /node_modules/,
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        },

      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.js']
    },
    plugins: [
      new CopyPlugin([
        "src/styles.css",
        {from: "src/assets/cancel.svg", to: "assets"},
        {from: "src/assets/remove.svg", to: "assets"},
        {from: "src/assets/restart.svg", to: "assets"},
      ]),
    ]
  }
}

module.exports = [
  createConfig('./src/Dropzone.tsx', {
    path: path.resolve('dist'),
    libraryTarget: 'commonjs2',
    filename: 'react-dropzone-uploader.js',
  }),
  createConfig('./src/Dropzone.tsx', {
    path: path.resolve('dist'),
    libraryTarget: 'umd',
    filename: 'react-dropzone-uploader.umd.js',
    library: 'ReactDropzoneUploader',
  }),
]
