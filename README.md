# React Dropzone Uploader


[![NPM](https://img.shields.io/npm/v/react-dropzone-uploader.svg)](https://www.npmjs.com/package/react-dropzone-uploader)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/react-dropzone-uploader.svg)](https://www.npmjs.com/package/react-dropzone-uploader)

React Dropzone Uploader is a customizable file dropzone and uploader, with progress indicators, upload cancellation and restart, and minimal dependencies.


## Features
- Fully controllable via optional props, callbacks, and component injection API 
- Rich file metadata and file previews, especially for image, video and audio files
- Detailed upload status and progress, upload cancellation and restart
- Trivially set auth headers and additional upload fields for any upload (see S3 example)
- Modular design allows for use as standalone file dropzone, file input, file uploader
- Easily customizable and themeable
- Lightweight at ~15kB, including styles


## Installation
Run `npm install --save react-dropzone-uploader`.


## Getting Started
RDU's defaults make it very powerful out of the box. The following code gives your users a dropzone and file input that upload files to `https://httpbin.org/post`, with a button to submit the files when they're done.

The `onChangeStatus` prop is thrown in just to show the status values a file is assigned as it's dropped or chosen and then uploaded. [Check out a live demo here](https://codepen.io/kylebebak/pen/wYRNzY/?editors=0110).

~~~js
import Dropzone from 'react-dropzone-uploader'

const MyUploader = () => {
  const getUploadParams = ({ meta }) => {
    const url = 'https://httpbin.org/post' // upload `url` and other upload params can be a function of file meta
    const fileUrl = `${url}/${encodeURIComponent(meta.name)}` // new values can be merged into file meta
    return { url, meta: { fileUrl } }
  }
  
  // receives array of all files that are done uploading
  const handleSubmit = (files) => { console.log(files.map(f => f.meta)) }
  
  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
    />
  )
}
~~~

Want to disable the file input? Just pass `null` for `FileInputComponent`. Don't need a submit button after files are uploaded? Pass `null` for `SubmitButtonComponent`, or simply omit the `onSubmit` prop. Don't want to upload files at all? Omit `getUploadParams`, and you'll simply have a dropzone that calls your `handleChangeStatus` every time you add a file.

By the way, `getUploadParams` can be async, in case you need to go over the network to get upload params for a file, as would be the case if you use, for example, [presigned upload URLs with S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/PresignedUrlUploadObject.html).

To filter which files can be dropped or chosen, you can use the `allowedTypePrefixes` and `accept` props (for the dropzone and file input, respectively), as well as the `maxFiles` and `maxSizeBytes` props. Files whose size exceeds the limit set in `maxSizeBytes` are rendered in the dropzone with a special error status. Files rejected because they don't have the correct type, or because they exceed your max number of files, call `onChangeStatus` with special status values, but are not rendered. Read more in the props section below.


## fileWithMeta Objects


## Customization
Notice the __"Drop Files"__ instructions that appear by default in an empty dropzone? This is likely one of the first things you'll want to change. You can use the `instructions` and `withFilesInstructions` props to render any JSX you want. The latter is for the instructions that are rendered if the dropzone has files. If you'd rather not render instructions, just pass `null`.

Want to change `submitButtonText` from its default value of __"Submit"__? Just pass a new string for this prop. To kill the text, just pass an empty string.


### Custom Styles
RDU's default styles are defined using CSS. They can be overridden using various __...ClassName__ props, which are listed below. They can be removed entirely by passing an empty string for any of these props.


### Component Injection API
If no combination of props controlling styles and layout creates the look and feel you want, RDU provides a component injection API as an escape hatch. The `FileInputComponent`, `FilePreviewComponent`, `SubmitButtonComponent`, `DropzoneContentComponent` can each be used to override their corresponding default components. These components receive the props they need to react to the current state of the dropzone and its files.

`null`ing any of these props prevents its corresponding component from being rendered. 

The file input and submit button are simple, and it's usually easy to specify their look and feel with a few of RDU's __...Text__ and __...ClassName__ props. For the file input, text and className props might not be enough to get the right look and feel, and in this case you can pass a custom `FilePreviewComponent`. The custom component receives the same props that would have been passed to the default component.

It's worth noting that `DropzoneContentComponent` receives an `extra` prop, an object literal that contains every callback and piece of state managed by the `Dropzone` itself. Overriding this component is the ultimate escape hatch, but also unnecessary except in very rare cases.


## Props and Component Prop Types
The following props can be passed to `Dropzone`.

~~~js
Dropzone.propTypes = {
  onChangeStatus: PropTypes.func, // called every time file's status is changed (fileWithMeta.meta.status); possible status values are {'rejected_file_type', 'rejected_max_files', 'preparing', 'error_file_size', 'uploading', 'error_upload_params', 'aborted', 'error_upload', 'headers_received', 'done'}
  onUploadReady: PropTypes.func, // called before file is uploaded; returning `{ delayUpload: true }` from this callback delays upload until fileWithMeta object's triggerUpload function is called
  getUploadParams: PropTypes.func, // called when file meta is ready, before upload; should return { fields (object), headers (object), meta (object), method (string), url (string) }

  onSubmit: PropTypes.func, // called when user presses submit button; receives array of `fileWithMeta` objects whose status is 'headers_received' or 'done'
  onCancel: PropTypes.func, // called when upload is cancelled; receives fileWithMeta object
  onRemove: PropTypes.func, // called when file is removed; receives fileWithMeta object
  onRestart: PropTypes.func, // called when upload is restarted; receives fileWithMeta object

  canCancel: PropTypes.bool, // pass false to negate upload cancel button in file preview
  canRemove: PropTypes.bool, // pass false to negate file remove button in file preview
  canRestart: PropTypes.bool, // pass false to negate upload restart button in file preview

  previewTypes: PropTypes.arrayOf(PropTypes.oneOf(['image', 'audio', 'video'])), // generate rich previews for these file types

  allowedTypePrefixes: PropTypes.arrayOf(PropTypes.string),
  accept: PropTypes.string, // the accept attribute of the file input
  maxSizeBytes: PropTypes.number.isRequired, // max file size in bytes (1024 * 1024 is 1MB)
  maxFiles: PropTypes.number.isRequired, // max number of files that can be tracked and rendered by a given dropzone

  FileInputComponent: PropTypes.any, // overrides FileInput; pass null to negate
  FilePreviewComponent: PropTypes.any, // overrides FilePreview; pass null to negate
  SubmitButtonComponent: PropTypes.any, // overrides SubmitButton; pass null to negate
  DropzoneContentComponent: PropTypes.any, // overrides DropzoneContent; pass null to negate

  instructions: PropTypes.any, // JSX for dropzone instructions; pass null to negate
  withFilesInstructions: PropTypes.any, // JSX for dropzone instructions if dropzone contains one or more files; pass null to negate
  fileInputText: PropTypes.string, // pass '' to negate
  fileInputWithFilesText: PropTypes.string, // pass '' to negate
  submitButtonText: PropTypes.string, // pass '' to negate
  submitButtonDisabled: PropTypes.bool,

  dropzoneClassName: PropTypes.string, // wrapper class of root div; pass '' to negate
  dropzoneActiveClassName: PropTypes.string, // wrapper class of root div when file(s) have been dragged into dropzone; pass '' to negate
  contentClassName: PropTypes.string, // wrapper class for DropzoneContent; pass '' to negate
  contentWithFilesClassName: PropTypes.string, // wrapper class for DropzoneContent with one or more files present; pass '' to negate
  inputClassName: PropTypes.string, // pass '' to negate
  submitButtonContainerClassName: PropTypes.string, // pass '' to negate
  submitButtonClassName: PropTypes.string, // pass '' to negate
}
~~~


## Examples: S3 Uploader
