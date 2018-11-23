---
id: api
title: API
---


__RDU is modular__. In the Quick Start example, the only prop needed to perform uploads is `getUploadParams`. `onChangeStatus` is included to show how a file's status changes as it's dropped and uploaded. `onSubmit` gives users a button to submit files that are done uploading.

Want to disable the file input? Pass `null` for `InputComponent`. Don't want to show file previews? Pass `null` for `PreviewComponent`. Don't need a submit button after files are uploaded? Pass `null` for `SubmitButtonComponent`, or simply omit the `onSubmit` prop. 

Don't want to upload files? Omit `getUploadParams`, and you'll have a dropzone that just calls `onChangeStatus` every time you add a file. This callback receives a `fileWithMeta` object and the file's `status`. If status is `'done'`, the file has been prepared and validated. Add it to an array of accepted files, or do whatever you want with it. And don't worry, `onChangeStatus` won't be called multiple times for the same status.

By the way, `getUploadParams` can be async, in case you need to go over the network to get upload params for a file. This would be the case if you use, for example, [presigned upload URLs with S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/PresignedUrlUploadObject.html).


## Accepted Files
To control which files can be dropped or picked, you can use the `accept` prop, which is really the [HTML5 input accept attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Limiting_accepted_file_types). Also available are the `minSizeBytes`, `maxSizeBytes` and `maxFiles` props.

Files whose sizes fall outside the range `[minSizeBytes, maxSizeBytes]` are rendered in the dropzone with a special error status. Files rejected because they don't have the correct type, or because they exceed your max number of files, call `onChangeStatus` with special status values, but are not rendered.

If you need totally custom filter logic, you can pass a generic `validate` function. This function receives a `fileWithMeta` object. If you return a falsy value from `validate`, the file is accepted, else it's rejected.


## `onChangeStatus`
This is called every time a file's status changes: `fileWithMeta.meta.status`.

It receives `(fileWithMeta, status, []fileWithMeta)`. The first argument is the `fileWithMeta` object whose status changed, while the third argument is the array of all `fileWithMeta` objects being tracked by the dropzone.

Possible status values are `'rejected_file_type'`, `'rejected_max_files'`, `'preparing'`, `'error_file_size'`, `'error_validation'`, `'ready'`, `'started'`, `'uploading'`, `'error_upload_params'`, `'aborted'`, `'restarted'`, `'removed'`, `'error_upload'`, `'headers_received'`, `'done'`.

Returning a `meta` object lets you merge new values into the file's `meta`.


## `getUploadParams`
`getUploadParams` is a regular or async callback that receives a `fileWithMeta` object and returns the params needed to upload the file. If this prop isn't passed, RDU doesn't initiate and manage file uploads.

It should return an object with `{ fields (object), headers (object), meta (object), method (string), url (string) }`.

The only required key is `url`. __POST__ is the default method. `fields` lets you [append fields to the formData instance](https://developer.mozilla.org/en-US/docs/Web/API/FormData/append) submitted with the request. `headers` sets headers using `XMLHttpRequest.setRequestHeader`, which makes it easy to authenticate with the upload server.

Returning a `meta` object lets you merge new values into the file's `meta`.


## `onSubmit`
This is called when a user presses the submit button.

It receives `([]fileWithMeta, []fileWithMeta)`. The first argument is an array of `fileWithMeta` objects whose status is `'headers_received'` or `'done'`. The second argument is the array of __all__ `fileWithMeta` objects being tracked by the dropzone.

If you omit this prop the dropzone doesn't render a submit button.


## `fileWithMeta` Objects
RDU maintains an array of files it's currently tracking and rendering. The elements of this array are `fileWithMeta` objects, which contain the following keys:

- `file`
  + [file instance](https://developer.mozilla.org/en-US/docs/Web/API/File) returned by `onDrop` event or by input's `onChange` event
- `meta`
  + file metadata, containing a subset of the following keys: `status`, `type`, `name`, `uploadedDate`, `percent`, `size`, `lastModifiedDate`, `previewUrl`, `duration`, `width`, `height`, `videoWidth`, `videoHeight`
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
