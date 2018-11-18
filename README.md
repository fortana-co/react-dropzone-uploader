# React Dropzone Uploader


[![NPM](https://img.shields.io/npm/v/react-dropzone-uploader.svg)](https://www.npmjs.com/package/react-dropzone-uploader)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/react-dropzone-uploader.svg)](https://www.npmjs.com/package/react-dropzone-uploader)

React Dropzone Uploader is a customizable HTML5 file dropzone and uploader for React.


## Features
- Rich file metadata and previews, especially for image, video and audio files
- Detailed upload status and progress, upload cancellation and restart
- Trivially set auth headers and additional upload fields (see S3 example)
- Modular design; use as standalone dropzone, file input, file uploader
- Easily customize styles using CSS or JS
- Fully controllable via optional props, callbacks and component injection
- Lightweight and fast


## Installation
`npm install --save react-dropzone-uploader`

Import default styles in your app.

~~~js
import 'react-dropzone-uploader/dist/styles.css'
~~~


## Quick Start
RDU requires zero config for many use cases. The following code gives you a dropzone and clickable file input that uploads files to `https://httpbin.org/post`, with a button to submit files that are done uploading. [Check out a live demo](https://codepen.io/kylebebak/pen/wYRNzY/?editors=0010).

~~~js
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'

const MyUploader = () => {
  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }
  
  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }
  
  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files) => { console.log(files.map(f => f.meta)) }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
    />
  )
}
~~~


## API
__RDU is modular__. In the example above, the only prop needed to perform uploads is `getUploadParams`. `onChangeStatus` is included to show how a file's status changes as it's dropped and uploaded. `onSubmit` gives users a button to submit files that are done uploading.

Want to disable the file input? Pass `null` for `InputComponent`. Don't want to show file previews? Pass `null` for `PreviewComponent`. Don't need a submit button after files are uploaded? Pass `null` for `SubmitButtonComponent`, or simply omit the `onSubmit` prop. 

Don't want to upload files? Omit `getUploadParams`, and you'll have a dropzone that just calls `onChangeStatus` every time you add a file. This callback receives a `fileWithMeta` object and the file's `status`. If status is `'done'`, the file has been prepared and validated. Add it to an array of accepted files, or do whatever you want with it. And don't worry, `onChangeStatus` won't be called multiple times for the same status.

By the way, `getUploadParams` can be async, in case you need to go over the network to get upload params for a file. This would be the case if you use, for example, [presigned upload URLs with S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/PresignedUrlUploadObject.html).


### Accepted Files
To control which files can be dropped or picked, you can use the `accept` prop, which is really the [HTML5 input accept attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Limiting_accepted_file_types). Also available are the `minSizeBytes`, `maxSizeBytes` and `maxFiles` props.

Files whose sizes fall outside the range `[minSizeBytes, maxSizeBytes]` are rendered in the dropzone with a special error status. Files rejected because they don't have the correct type, or because they exceed your max number of files, call `onChangeStatus` with special status values, but are not rendered.

If you need totally custom filter logic, you can pass a generic `validate` function. This function receives a `fileWithMeta` object. If you return a falsy value from `validate`, the file is accepted, else it's rejected. Read more in the __Props__ section below.


### getUploadParams
`getUploadParams` is a regular or async callback that receives a `fileWithMeta` object and returns the params needed to upload the file. If this prop isn't passed, RDU doesn't initiate and manage file uploads.

It should return an object with `{ fields (object), headers (object), meta (object), method (string), url (string) }`.

The only required key is `url`. __POST__ is the default method. `fields` lets you [append fields to the formData instance](https://developer.mozilla.org/en-US/docs/Web/API/FormData/append) submitted with the request. `headers` sets headers using `XMLHttpRequest.setRequestHeader`, which makes it easy to authenticate with the upload server.

Returning a `meta` object lets you merge new values into the file's `meta`, which is also something you can do with `onChangeStatus`.


### fileWithMeta Objects
RDU maintains an array of files it's currently tracking and rendering. The elements of this array are `fileWithMeta` objects, which contain the following keys:

- `file`
  + [file instance](https://developer.mozilla.org/en-US/docs/Web/API/File) returned by `onDrop` event or by input's `onChange` event
- `meta`
  + file metadata, containing a subset of the following keys: `status`, `type`, `name`, `uploadedDate`, `percent`, `size`, `lastModifiedDate`, `previewUrl`, `duration`, `width`, `height`, `videoWidth`, `videoHeight`; see __Props__ section for possible status values
- `cancel`, `restart`, `remove`
  + functions that allow client code to take control of upload lifecycle; cancel file upload, (re)start file upload, or remove file from dropzone
- `xhr`
  + instance of `XMLHttpRequest` if the file is being uploaded, else undefined

RDU's callback props `onChangeStatus`, `getUploadParams`, and `validate` receive a `fileWithMeta` object, while `onSubmit` receives an array of `fileWithMeta` objects.

>For convenience, `onChangeStatus` also receives the array of `fileWithMeta` objects being tracked by the dropzone as a third argument.

These objects give you all the metadata you could want for creating a customized, reactive file dropzone, file input, or file uploader.

Note that `fileWithMeta` objects __are mutable__. If you mutate them, RDU may behave unexpectedly, so don't do this!

>This is why `onChangeStatus` also receives `status` instead of just `fileWithMeta`. Your callback gets the correct, immutable value of `status`, even if `fileWithMeta` is later mutated.

`getUploadParams` and `onChangeStatus` have an explicit API for merging new values into a file's meta. If you return something like `{ meta: { newKey: newValue } }` from these functions, RDU merges the new values into the file's `meta`.


## Customization
Notice the __"Drag Files or Click to Browse"__ text that appears by default in an empty dropzone? This is likely something you'll want to change. You can use the `inputContent` and `inputWithFilesContent` props to render any string or JSX you want. The latter is for the content that's rendered if the dropzone has files. If you'd rather not render file input content, just pass `null`.

Want to change `submitButtonContent` from its default value of __"Submit"__? Just pass a new string or JSX for this prop. To kill this text, just pass an empty string or null.

See all of the customization props in the __Props__ section.


### Custom Styles
RDU's default styles are defined using CSS. They can be overridden using the `classNames` and `styles` props, which expose RDU's simple, flexible styling framework.

Both `classNames` and `styles` should be objects containing a subset of the following keys:

- `dropzone`
  + wrapper for dropzone
- `dropzoneWithFiles`
  + wrapper for dropzone if dropzone has files
- `dropzoneActive`
  + wrapper for dropzone on drag over; this is __added__ to the __dropzone__ or __dropzoneWithFiles__ class
- `input`
  + input label
- `inputWithFiles`
  + input label if dropzone has files
- `preview`
  + wrapper for preview div
- `previewImage`
  + preview image
- `submitButtonContainer`
  + wrapper for submit button div
- `submitButton`
  + submit button

Each key points to a [CSS class in the default stylesheet](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/styles.css). A class can be overridden by pointing its key to a different class name, or it can be removed by pointing its key to the empty string `''`.

If you prefer to use style object literals instead of CSS classes, point a key to a style object. The style object is passed to the target component's `style` prop, which means it takes precedence over its default class, but doesn't overwrite it.

To overwrite it, you can remove the default class by passing an empty string inside the `classNames` prop.

>As with any React component, declaring your `styles` object inside your render method can hurt performance, because it will cause RDU components that use these styles to re-render even if their props haven't changed.


#### Adding To Default Classes
If you want to merge your class names with RDU's default classes, use the `addClassNames` prop. Added class names work like `classNames`, except instead of overwriting default classes they are added (concatenated) to them.

You can use both `classNames` and `addClassNames` if you want to overwrite some classes and add to others.

>Use `addClassNames` to override individual default styles, such as `border`, with your own styles. As long as you import RDU's default styles at the top of your app's root component, you won't have to use `!important`.


### Component Injection
If no combination of props controlling styles and content achieves the look and feel you want, RDU provides a component injection API as an escape hatch. The `InputComponent`, `PreviewComponent`, `SubmitButtonComponent`, `LayoutComponent` props can each be used to override their corresponding default components. These components receive the props they need to react to the current state of the dropzone and its files (see the __Props Passed to Injected Components__ section below).

`null`ing these props removes their corresponding components, except for `LayoutComponent`.

The file input and submit button are simple, and it's usually easy to get the right look and feel with the content and style props. For the file preview, these props might not be enough. In this case you can pass a custom `PreviewComponent`, which should be a React component. The custom component receives the same props that would have been passed to the default component.


#### Custom Layout
By default, RDU's [layout component](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Layout.js) renders previews, file input and submit button as children of a dropzone div that responds to drag and drop events.

If you want to change this layout, e.g. to render the previews and submit button outside of your dropzone, you'll need to pass your own `LayoutComponent`.

If this sounds daunting you probably haven't looked at [Layout](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Layout.js) yet. Layout gets pre-rendered `input`, `previews`, and `submitButton` props, which makes changing RDU's layout incredibly easy.

>`LayoutComponent` receives an `extra` prop, an object containing nearly every callback and piece of state managed by `Dropzone`. Using this object is the ultimate escape hatch, but also unnecessary except in rare cases. Log it to the console to see what's inside.


## Props
The following props can be passed to `Dropzone`.

~~~js
Dropzone.propTypes = {
  onChangeStatus: PropTypes.func, // called every time fileWithMeta.meta.status changes; receives (fileWithMeta, status, []fileWithMeta); possible status values are 'rejected_file_type', 'rejected_max_files', 'preparing', 'error_file_size', 'error_validation', 'ready', 'started', 'uploading', 'error_upload_params', 'aborted', 'restarted', 'removed', 'error_upload', 'headers_received', 'done'

  getUploadParams: PropTypes.func, // called after file is prepared and validated, right before upload; receives fileWithMeta object; should return params needed for upload: { fields (object), headers (object), meta (object), method (string), url (string) }; omit to remove upload functionality from dropzone

  onSubmit: PropTypes.func, // called when user presses submit button; receives array of fileWithMeta objects whose status is 'headers_received' or 'done'; note that omitting removes default submit button

  accept: PropTypes.string, // the accept attribute of the file dropzone/input
  minSizeBytes: PropTypes.number.isRequired, // min file size in bytes (1024 * 1024 = 1MB)
  maxSizeBytes: PropTypes.number.isRequired, // max file size in bytes (1024 * 1024 = 1MB)
  maxFiles: PropTypes.number.isRequired, // max number of files that can be tracked and rendered by the dropzone

  validate: PropTypes.func, // generic validation function called after file is prepared; receives fileWithMeta object; should return falsy value if validation succeeds; should return truthy value if validation fails, which sets meta.status to 'error_validation', and sets meta.validationError to the returned value

  autoUpload: PropTypes.bool, // pass false to prevent file from being uploaded automatically; sets meta.status to 'ready' (instead of 'uploading') after file is prepared and validated; you can call `fileWithMeta.restart` whenever you want to initiate file upload

  previewTypes: PropTypes.arrayOf(PropTypes.oneOf(['image', 'audio', 'video'])), // generate rich previews (thumbnail, duration, dimensions) for these file types; defaults to all 3 types; only change this if you think generating rich previews is hurting performance

  /*
  Component Injection and Customization
   */
  InputComponent: PropTypes.func, // overrides Input; null to remove
  PreviewComponent: PropTypes.func, // overrides Preview; null to remove
  SubmitButtonComponent: PropTypes.func, // overrides SubmitButton; null to remove
  LayoutComponent: PropTypes.func, // overrides Layout; can't be removed

  canCancel: PropTypes.bool, // false to remove cancel button in file preview
  canRestart: PropTypes.bool, // false to remove restart button in file preview
  canRemove: PropTypes.bool, // false to remove remove button in file preview

  inputContent: PropTypes.node, // '' or null to remove
  inputWithFilesContent: PropTypes.node, // '' or null to remove
  submitButtonContent: PropTypes.node, // '' or null to remove

  classNames: PropTypes.object, // see "Custom Styles" section
  styles: PropTypes.object, // see "Custom Styles" section
  addClassNames: PropTypes.object, // see "Custom Styles" section
}
~~~


### Props Passed to Injected Components
If you use the component injection API, you'll want to know which props are passed to your injected components. Just scroll to the bottom of the following files to see their prop types.

- [InputComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Input.js)
- [PreviewComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Preview.js)
- [SubmitButtonComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/SubmitButton.js)
- [LayoutComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Layout.js)


## Example: S3 Uploader
Let's say you want to upload a file to one of your S3 buckets.

Your API has a protected endpoint that returns the necessary S3 upload params. Maybe it [uses Boto to do this](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Client.generate_presigned_post).

A successful request to this endpoint returns something like this:

~~~json
{
  "fields": {
    "AWSAccessKeyId": "AKIAJSQUO7ORWYVCSV6Q",
    "acl": "public-read",
    "key": "files/89789486-d94a-4251-a42d-18af752ab7d2-test.txt",
    "policy": "eyJleHBpcmF0aW9uIjogIjIwMTgtMTAtMzBUMjM6MTk6NDdaIiwgImNvbmRpdGlvbnMiOiBbeyJhY2wiOiAicHVibGljLXJlYWQifSwgWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsIDEwLCAzMTQ1NzI4MF0sIHsiYnVja2V0IjogImJlYW10ZWNoLWZpbGUifSwgeyJrZXkiOiAiY29tcGFueS8zLzg5Nzg5NDg2LWQ5NGEtNDI1MS1hNDJkLTE4YWY3NTJhYjdkMi10ZXN0LnR4dCJ9XX0=",
    "signature": "L7r3KBtyOXjUKy31g42JTYb1sio="
  },
  "fileUrl": "https://my-bucket.s3.amazonaws.com/files/89789486-d94a-4251-a42d-18af752ab7d2-test.txt",
  "uploadUrl": "https://my-bucket.s3.amazonaws.com/"
}
~~~

Fields has everything you need to authenticate with your S3 bucket, but you need to add them to the request sent by RDU. It turns out this is super easy.

~~~js
const getUploadParams = async ({ meta: { name } }) => {
  const { fields, uploadUrl, fileUrl } = await myApiService.getPresignedUploadParams(name)
  return { fields, meta: { fileUrl }, url: uploadUrl }
}
~~~

That's it. If `myApiService.getPresignedUploadParams` succeeds, you return `uploadUrl` as `url`. You also decide to merge `fileUrl` into your file's meta so you can use it later. RDU takes care of the rest, including appending the fields to the `formData` instance used in the `XMLHttpRequest`.

Let's say `myApiService.getPresignedUploadParams` fails and returns `{}`. In this case `uploadUrl` and hence `url` are undefined. RDU abandons the upload and changes the file's status to `'error_upload_params'`. At this point you might show the user an error message, and the user might remove the file or restart the upload.


## UMD Build
This library is available as an ES Module at <https://unpkg.com/react-dropzone-uploader@2.0.1/dist/react-dropzone-uploader.umd.js>.

If you want to include it in your page, you need to include the dependencies and CSS as well.

~~~html
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.4.2/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.4.2/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prop-types/15.6.2/prop-types.min.js"></script>

<script src="https://unpkg.com/react-dropzone-uploader@2.0.1/dist/react-dropzone-uploader.umd.js"></script>
<link rel"stylesheet" href="https://unpkg.com/react-dropzone-uploader@2.0.1/dist/styles.css"></script>
~~~


## Thanks
Thanks to `react-dropzone`, `react-fine-uploader`, `react-select`, and `redux-form` for inspiration.
