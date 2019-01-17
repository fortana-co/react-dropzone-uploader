/* eslint import/no-extraneous-dependencies: 0 */
/* eslint global-require: 0 */
const path = require('path')

module.exports = {
  title: 'Live Examples · React Dropzone Uploader',
  styleguideDir: path.join(__dirname, 'styleguide'),
  webpackConfig: require('./webpack.config.js'),
  require: [
    path.join(__dirname, 'src', 'styles.css'),
    path.join(__dirname, 'examples', 'styles.css'),
  ],
  exampleMode: 'expand',
  usageMode: 'expand',
  showSidebar: false,
  serverPort: 8080,
  compilerConfig: {
    transforms: { dangerousTaggedTemplateString: true },
    objectAssign: 'Object.assign',
  },
  sections: [
    {
      name: 'Live Examples',
      components: ['./src/Dropzone.js'],
    },
    {
      name: 'Examples',
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
          name: 'Dropzone With No Input',
          content: 'examples/NoInput.md',
        },
        {
          name: 'Input With No Dropzone',
          content: 'examples/NoDropzone.md',
        },
      ],
    },
  ],
}
