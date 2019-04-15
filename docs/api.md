---
id: api
title: API
---


__RDU is modular__. In the Quick Start example, the only prop needed to perform uploads is `getUploadParams`. `onChangeStatus` is included to show how a file's status changes as it's dropped and uploaded. `onSubmit` gives users a button to submit files that are done uploading.

Want to disable the file input? Pass `null` for `InputComponent`. Don't want to show file previews? Pass `null` for `PreviewComponent`. Don't need a submit button after files are uploaded? Pass `null` for `SubmitButtonComponent`, or simply omit the `onSubmit` prop. 

Don't want to upload files? Omit `getUploadParams`, and you'll have a dropzone that calls `onChangeStatus` every time you add a file. This callback receives a `fileWithMeta` object and the file's `status`. If status is `'done'`, the file has been prepared and validated. Add it to an array of accepted files, or do whatever you want with it.


## `onChangeStatus`
This is called every time a file's status changes: `fileWithMeta.meta.status`.

It receives `(fileWithMeta, status, []fileWithMeta)`. The first argument is the `fileWithMeta` object whose status changed, while the third argument is the array of all `fileWithMeta` objects being tracked by the dropzone.

Returning a `meta` object from this callback lets you merge new values into the file's `meta`.

>`onChangeStatus` is never called repeatedly for the same status.


### Status Values
Here are all possible values for `fileWithMeta.meta.status`.

- `'rejected_file_type'`
  + set because of `accept` prop; file not added to dropzone's file array
- `'rejected_max_files'`
  + set because of `maxFiles` prop; file not added to dropzone's file array
- `'preparing'`
  + set before file validation and preview generation
- `'error_file_size'`
  + set because of `minSizeBytes` and/or `maxSizeBytes` props
- `'error_validation'`
  + set if you pass `validate` function and it returns falsy value
- `'ready'`
  + only set if you pass `autoUpload={false}`; set when file has been prepared and validated; client code can call `fileWithMeta.restart` to start upload
- `'started'`
  + set if status is `'ready'` and user starts upload, or client code calls `fileWithMeta.restart`
- `'getting_upload_params'`
  + set after file is prepared, right before `getUploadParams` is called
- `'error_upload_params'`
  + set if you pass `getUploadParams` and it throws an exception, or it doesn't return `{ url: '...' }`
- `'uploading'`
  + set right after `xhr.send` is called and xhr is set on `fileWithMeta`
- `'exception_upload'`
  + set if upload times out or there is no connection to upload server
- `'aborted'`
  + set if `fileWithMeta.meta.status` is `'uploading'` and user aborts upload, or client code calls `fileWithMeta.cancel`
- `'restarted'`
  + set if user restarts upload, or client code calls `fileWithMeta.restart`
- `'removed'`
  + set if user removes file from dropzone, or client code calls `fileWithMeta.remove`
- `'error_upload'`
  + set if upload response has HTTP [status code >= 400](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status)
- `'headers_received'`
  + set for successful upload when [xhr.readyState is HEADERS_RECEIVED](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState); headers are available but response body is not
- `'done'`
  + set for successful upload when [xhr.readyState is DONE](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState); response body is available
  + if you don't pass a `getUploadParams` function because you're not using RDU to upload files, this is set after file is prepared and validated


## `getUploadParams`
`getUploadParams` is a callback that receives a `fileWithMeta` object and returns the params needed to upload the file. If this prop isn't passed, RDU doesn't initiate and manage file uploads.

`getUploadParams` can be async, in case you need to go over the network to get upload params for a file. It should return an object with `{ url (string), method (string), body, fields (object), headers (object), meta (object) }`.

The only required key is `url`. __POST__ is the default method. `headers` sets headers using `XMLHttpRequest.setRequestHeader`, which makes it easy to authenticate with the upload server.

If you pass your own [request `body`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send#Syntax), RDU uploads it using [xhr.send](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send).

~~~js
const getUploadParams = ({ file, meta }) => {
  const body = new FormData()
  body.append('fileField', file)
  return { url: 'https://httpbin.org/post', body }
}
~~~

If you don't, RDU creates the request body for you. It creates a `FormData` instance and appends the file to it using `formData.append('file', fileWithMeta.file)`. `fields` lets you [append additional fields to the FormData instance](https://developer.mozilla.org/en-US/docs/Web/API/FormData/append).

Returning a `meta` object from this callback lets you merge new values into the file's `meta`.


## `onSubmit`
This is called when a user presses the submit button.

It receives `([]fileWithMeta, []fileWithMeta)`. The first argument is an array of `fileWithMeta` objects whose status is `'headers_received'` or `'done'`. The second argument is the array of __all__ `fileWithMeta` objects being tracked by the dropzone.

If you omit this prop the dropzone doesn't render a submit button.


## `fileWithMeta` Objects
RDU maintains an array of files it's currently tracking and rendering. The elements of this array are `fileWithMeta` objects, which contain the following keys:

- `file`
  + [file instance](https://developer.mozilla.org/en-US/docs/Web/API/File) returned by `onDrop` event or by input's `onChange` event
- `meta`
  + file metadata, containing a subset of the following keys: `status`, `type`, `name`, `uploadedDate`, `percent`, `size`, `lastModifiedDate`, `previewUrl`, `duration`, `width`, `height`, `videoWidth`, `videoHeight`, `id`
- `cancel`, `restart`, `remove`
  + functions that allow client code to take control of the upload lifecycle; cancel file upload, (re)start file upload, or remove file from dropzone
- `xhr`
  + instance of `XMLHttpRequest` if the file is being uploaded, else undefined

RDU's callback props `onChangeStatus`, `getUploadParams`, `onSubmit` and `validate` receive single or multiple `fileWithMeta` objects.

These objects give you all the metadata you need to create a customized, reactive file dropzone, file input, or file uploader.


### Mutability
Note that `fileWithMeta` objects __are mutable__. If you mutate them, RDU may behave unexpectedly, so don't do this!

>This is why `onChangeStatus` also receives `status` instead of just `fileWithMeta`. Your callback gets the correct, immutable value of `status`, even if `fileWithMeta.meta.status` is later updated.

`getUploadParams` and `onChangeStatus` have an API for safely merging new values into a file's meta. If you return something like `{ meta: { newKey: newValue } }` from these functions, RDU merges the new values into the file's `meta`.


## Accepted Files
To control which files can be dropped or picked, you can use the `accept` prop, which is really the [HTML5 input accept attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Limiting_accepted_file_types). Also available are the `minSizeBytes`, `maxSizeBytes` and `maxFiles` props.

Files whose sizes fall outside the range `[minSizeBytes, maxSizeBytes]` are rendered in the dropzone with a special error status. Files rejected because they don't have the correct type, or because they exceed your max number of files, call `onChangeStatus` with special status values, but are not rendered.

If you need totally custom filter logic, you can pass a generic `validate` function. This function receives a `fileWithMeta` object. If you return a falsy value from `validate`, the file is accepted, else it's rejected.


## Utility Functions
In case you want to use them, RDU exports the following utility functions:

- `formatBytes(bytes: number): string`
- `formatDuration(seconds: number): string`
- `accepts(file: { name?: string; type?: string }, accept?: string): boolean`
- `getFilesFromEvent(event: React.DragEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>): Array<File | DataTransferItem>`
