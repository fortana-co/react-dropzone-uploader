/* eslint import/no-extraneous-dependencies: 0 */
/* eslint global-require: 0 */
const path = require('path')

module.exports = {
  title: 'Live Examples · React Dropzone Uploader',
  styleguideDir: path.join(__dirname, 'docs/assets/styleguide'),
  webpackConfig: require('./webpack.config.js'),
  require: [
    path.join(__dirname, 'src', 'styles.css'),
    path.join(__dirname, 'examples', 'styles.css'),
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
      name: 'Standard',
      content: 'examples/Standard.md',
    },
    {
      name: 'Only Image, Audio, Video',
      content: 'examples/Accept.md',
    },
    {
      name: 'No Upload',
      content: 'examples/NoUpload.md',
    },
    {
      name: 'Single File, Auto Submit',
      content: 'examples/SingleFile.md',
    },
    {
      name: 'Custom Preview',
      content: 'examples/CustomPreview.md',
    },
    {
      name: 'Custom Layout',
      content: 'examples/CustomLayout.md',
    },
    {
      name: 'Custom Input, Directory Drag and Drop',
      content: 'examples/CustomInput.md',
    },
    {
      name: 'Dropzone With No Input',
      content: 'examples/NoInput.md',
    },
    {
      name: 'Input With No Dropzone',
      content: 'examples/NoDropzone.md',
    },
    {
      name: 'Initial File From Data URL',
      content: 'examples/InitialFileFromDataUrl.md',
    },
  ],
}
