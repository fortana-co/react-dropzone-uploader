/* eslint import/no-extraneous-dependencies: 0 */
/* eslint global-require: 0 */
const path = require('path')

module.exports = {
  title: 'Quickstart · React Dropzone Uploader',
  styleguideDir: path.join(__dirname, 'docs/assets/styleguide-quickstart'),
  webpackConfig: require('./webpack.config.js'),
  require: [
    path.join(__dirname, 'src', 'styles.css'),
    path.resolve(__dirname, 'styleguide.setup.js'),
  ],
  exampleMode: 'expand',
  usageMode: 'expand',
  showSidebar: false,
  serverPort: 8080,
  compilerConfig: {
    transforms: { dangerousTaggedTemplateString: true },
    objectAssign: 'Object.assign',
  },
  styles: {
    StyleGuide: {
      content: {
        padding: [[16, 0]],
      },
    },
    Heading: {
      heading1: {
        fontSize: 32,
      },
    },
  },
  sections: [
    {
      content: 'examples/Quickstart.md',
    },
  ],
}
