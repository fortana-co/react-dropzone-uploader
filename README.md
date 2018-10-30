# React Dropzone Uploader


[![NPM](https://img.shields.io/npm/v/react-dropzone-uploader.svg)](https://www.npmjs.com/package/react-dropzone-uploader)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/react-dropzone-uploader.svg)](https://www.npmjs.com/package/react-dropzone-uploader)

React Dropzone Uploader is a customizable HTML5 file dropzone and uploader for React, with progress indicators, upload cancellation and restart, and minimal dependencies.


## Features
- Fully controllable via optional props, callbacks, and component injection API 
- Rich file metadata and file previews, especially for image, video and audio files
- Detailed upload status and progress, upload cancellation and restart
- Trivially set auth headers and additional upload fields for any upload (see S3 example)
- Modular design allows for use as standalone file dropzone, file input, file uploader
- Easily customize styles and theme using CSS or JSX
- Lightweight at ~15kB, including styles


## Installation
`npm install --save react-dropzone-uploader`


## Getting Started
RDU's defaults make it very powerful out of the box. The following code gives your users a dropzone / file input that uploads files to `https://httpbin.org/post`, with a button to submit the files when they're done.

The `onChangeStatus` prop is thrown in to show the status how the file's status changes as it's dropped (or picked) and then uploaded. [Check out a live demo here](https://codepen.io/kylebebak/pen/wYRNzY/?editors=0010).

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

Want to disable the file input? Just pass `null` for `FileInputComponent`. Don't need a submit button after files are uploaded? Pass `null` for `SubmitButtonComponent`, or simply omit the `onSubmit` prop.

Don't want to upload files at all? Omit `getUploadParams`, and you'll have a dropzone that just calls `onChangeStatus` every time you add a file. This callback receives a `fileWithMeta` object and the file's `status`. If status is `'done'`, the file was accepted. Add it to an array of accepted files, or do whatever you want with it. And don't worry, `onChangeStatus` will never be called more than once for a given status.

By the way, `getUploadParams` can be async, in case you need to go over the network to get upload params for a file. This would be the case if you use, for example, [presigned upload URLs with S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/PresignedUrlUploadObject.html).

To filter which files can be dropped or picked, you can use the `accept` prop, which is really the [HTML5 input accept attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Limiting_accepted_file_types). Also available are the `minSizeBytes`, `maxSizeBytes` and `maxFiles` props.

Files whose sizes fall outside the range `[minSizeBytes, maxSizeBytes]` are rendered in the dropzone with a special error status. Files rejected because they don't have the correct type, or because they exceed your max number of files, call `onChangeStatus` with special status values, but are not rendered. Read more in the __Props__ section below.


## fileWithMeta Objects
RDU maintains an array of files it's currently tracking and rendering. The elements of this array are `fileWithMeta` objects, that contain the following keys:

- `file`
  + file instance returned by `onDrop` event or by input's `onChange` event
- `meta`
  + file metadata, containing a subset of the following keys: `status`, `type`, `name`, `uploadedDate`, `percent`, `size`, `lastModifiedDate`, `previewUrl`, `duration`, `width`, `height`, `videoWidth`, `videoHeight`; status is one of (__'preparing'__, __'error_file_size'__, __'uploading'__, __'error_upload_params'__, __'aborted'__, __'error_upload'__, __'headers_received'__, __'done'__)
- `xhr`
  + optional; instance of `XMLHttpRequest` if the file is being uploaded
- `triggerUpload`
  + optional; function that can be invoked once to initiate file upload; this is undefined unless you return `{ delayUpload: true }` from the optional `onUploadReady` prop

RDU's callback props (`onChangeStatus`, `onUploadReady`, `getUploadParams`, `onCancel`, `onRemove`, `onRestart`) all receive a `fileWithMeta` object, except for `onSubmit`, which receives an array of `fileWithMeta` objects.

These objects give you all the metadata you could want for creating a customized, reactive file dropzone, file input, or file uploader.

Note that `fileWithMeta` objects __are mutable__. If you mutate them, RDU may behave unexpectedly, so don't do this! The only callbacks with an explicit API for merging new values into a file's meta are `getUploadParams` and `onChangeStatus`. See the __getUploadParams__ section below.


## Customization
Notice the __"Drop Files"__ instructions that appear by default in an empty dropzone? This is likely one of the first things you'll want to change. You can use the `instructions` and `withFilesInstructions` props to render any JSX you want. The latter is for the instructions that are rendered if the dropzone has files. If you'd rather not render instructions, just pass `null`.

Want to change `submitButtonText` from its default value of __"Submit"__? Just pass a new string for this prop. To kill the text, just pass an empty string.

See all of the customization props in the __Props__ section.


### Custom Styles
RDU's default styles are defined using CSS. They can be overridden using the `classNames` and `styles` props, which expose RDU's simple, flexible styling framework.

Both `classNames` and `styles` should be objects containing a subset of the following keys:

- `dropzone`
  + wrapper for entire dropzone
- `dropzoneActive`
  + wrapper for entire dropzone when dropzone contains file(s); this is __added__ to the `dropzone` class
- `content`
  + wrapper for DropzoneContentComponent with no files present
- `contentWithFiles`
  + wrapper for DropzoneContentComponent with file(s) present
- `input`
  + applied directly input label
- `submitButtonContainer`
  + wrapper for root submit button div
- `submitButton`
  + applied directly to submit button

Each key points to a default CSS class bundled with RDU. A class can be overridden by pointing its key to a different class name, or it can be removed by pointing its key to the empty string `''`.

If you prefer to use style object literals instead of CSS classes, simply point a key to a style object.

Note that keys in the `styles` prop override keys with the same name in the `classNames` prop. Check out the demo in the __Getting Started__ section to see how this works!

As with any React component, declaring your `styles` prop inside your render method can hurt performance, because it will cause RDU components that use these styles to re-render even if their props haven't changed.


### Component Injection API
If no combination of props controlling styles and text achieves the look and feel you want, RDU provides a component injection API as an escape hatch. The `FileInputComponent`, `FilePreviewComponent`, `SubmitButtonComponent`, `DropzoneContentComponent` props can each be used to override their corresponding default components. These components receive the props they need to react to the current state of the dropzone and its files (see the __Props Passed to Injected Components__ section below).

`null`ing these props removes their corresponding components from the render tree. 

The file input and submit button are simple, and it's usually easy to specify their look and feel with the __...Text__ and __classNames__ props. For the file preview, these props might not be enough, and in this case you can pass a custom `FilePreviewComponent`. The custom component receives the same props that would have been passed to the default component.

It's worth noting that `DropzoneContentComponent` receives an `extra` prop, an object containing every callback and piece of state managed by the `Dropzone` itself. Overriding this component is the ultimate escape hatch, but also unnecessary except in rare cases.


## Props
The following props can be passed to `Dropzone`.

~~~js
Dropzone.propTypes = {
  onChangeStatus: PropTypes.func, // called every time file's status changes (fileWithMeta.meta.status); possible status values are {'rejected_file_type', 'rejected_max_files', 'preparing', 'error_file_size', 'uploading', 'error_upload_params', 'aborted', 'error_upload', 'headers_received', 'done'}
  onUploadReady: PropTypes.func, // called before file is uploaded; returning `{ delayUpload: true }` from this callback delays upload until fileWithMeta object's triggerUpload function is called
  getUploadParams: PropTypes.func, // called when file meta is ready, before upload; should return { fields (object), headers (object), meta (object), method (string), url (string) }

  onSubmit: PropTypes.func, // called when user presses submit button; receives array of `fileWithMeta` objects whose status is 'headers_received' or 'done'
  onCancel: PropTypes.func, // called when upload is cancelled; receives fileWithMeta object
  onRemove: PropTypes.func, // called when file is removed; receives fileWithMeta object
  onRestart: PropTypes.func, // called when upload is restarted; receives fileWithMeta object

  canCancel: PropTypes.bool, // false to remove cancel upload button in file preview
  canRemove: PropTypes.bool, // false to remove remove file button in file preview
  canRestart: PropTypes.bool, // false to remove restart upload button in file preview

  previewTypes: PropTypes.arrayOf(PropTypes.oneOf(['image', 'audio', 'video'])), // generate rich previews for these file types

  accept: PropTypes.string, // the accept attribute of the file input
  minSizeBytes: PropTypes.number.isRequired, // min file size in bytes (1024 * 1024 is 1MB)
  maxSizeBytes: PropTypes.number.isRequired, // max file size in bytes (1024 * 1024 is 1MB)
  maxFiles: PropTypes.number.isRequired, // max number of files that can be tracked and rendered by this dropzone

  FileInputComponent: PropTypes.any, // overrides FileInput; null to remove
  FilePreviewComponent: PropTypes.any, // overrides FilePreview; null to remove
  SubmitButtonComponent: PropTypes.any, // overrides SubmitButton; null to remove
  DropzoneContentComponent: PropTypes.any, // overrides DropzoneContent; null to remove

  instructions: PropTypes.any, // JSX for dropzone instructions if dropzone contains no files; null to remove
  withFilesInstructions: PropTypes.any, // JSX for dropzone instructions if dropzone contains file(s); null to remove
  fileInputText: PropTypes.string, // '' to remove
  fileInputWithFilesText: PropTypes.string, // '' to remove
  submitButtonText: PropTypes.string, // '' to remove
  submitButtonDisabled: PropTypes.bool,

  classNames: PropTypes.object, // see "Custom Styles" section
  styles: PropTypes.object, // see "Custom Styles" section
}
~~~


### Props Passed to Injected Components
If you use the component injection API, you'll want to know which props are passed to your injected components. Just scroll to the bottom of the following files to see their prop types.

- [DropzoneContentComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/DropzoneContent.js)
- [FilePreviewComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/FilePreview.js)
- [FileInputComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/FileInput.js)
- [SubmitButtonComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/SubmitButton.js)


## getUploadParams
### Example: S3 Uploader


## Thanks
`react-select`, `react-dropzone`, `react-fine-uploader` for inspiration.
