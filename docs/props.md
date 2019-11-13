---
id: props
title: Props
---


The following props can be passed to `Dropzone`.

| Name | Type | Default Value | Description |
| --- | --- | --- | --- |
| onChangeStatus | func | | called every time __fileWithMeta.meta.status__ changes; receives __(fileWithMeta, status, []fileWithMeta)__; possible status values are __'rejected_file_type', 'rejected_max_files', 'preparing', 'error_file_size', 'error_validation', 'ready', 'started', 'getting_upload_params', 'error_upload_params', 'uploading', 'exception_upload', 'aborted', 'restarted', 'removed', 'error_upload', 'headers_received', 'done'__ |
| getUploadParams | func | | called after file is prepared and validated, right before upload; receives __fileWithMeta__ object; should return params needed for upload: __{ fields (object), headers (object), meta (object), method (string), url (string) }__; omit to remove upload functionality from dropzone |
| onSubmit | func | | called when user presses submit button; receives array of __fileWithMeta__ objects whose status is __'headers_received'__ or __'done'__; also receives array of all __fileWithMeta__ objects as second argument; omit to remove submit button |
| accept | string | `'*'` | the accept attribute of the file dropzone/input |
| multiple | bool | `true` | the multiple attribute of the file input |
| minSizeBytes | number | `0` | min file size in bytes (1024 * 1024 = 1MB) |
| maxSizeBytes | number | `2^53 - 1` | max file size in bytes (1024 * 1024 = 1MB) |
| maxFiles | number | `2^53 - 1` | max number of files that can be tracked and rendered by the dropzone |
| validate | func | | generic validation function called after file is prepared; receives __fileWithMeta__ object; should return falsy value if validation succeeds; should return truthy value if validation fails, which sets __meta.status__ to __'error_validation'__, and sets __meta.validationError__ to the returned value |
| autoUpload | bool | `true` | pass false to prevent file from being uploaded automatically; sets __meta.status__ to __'ready'__ (instead of __'getting_upload_params'__) after file is prepared and validated; you can call __fileWithMeta.restart__ whenever you want to initiate file upload |
| timeout | number | | pass an integer to make upload time out after this many ms; if upload times out, onChangeStatus is invoked with value __'exception_upload'__ |
| initialFiles | `File[]` | | add these files to dropzone, without any user interaction; if a new array of `initialFiles` is passed, they will also be added to dropzone; see here for an [example of creating and uploading a file from a data URL](https://react-dropzone-uploader.js.org/docs/examples#initial-file-from-data-url) |


## Component Customization Props
| Name | Type | Default Value | Description |
| --- | --- | --- | --- |
| disabled | bool/func | `false` | true to disable dropzone and input |
| canCancel | bool/func | `true` | false to remove cancel button in file preview |
| canRestart | bool/func | `true` | false to remove restart button in file preview |
| canRemove | bool/func | `true` | false to remove remove button in file preview |
| inputContent | node/func | `'Drag Files or Click to Browse'` | child of input __label__; '' or null to remove |
| inputWithFilesContent | node/func | `'Add Files'` | child of input __label__; '' or null to remove |
| submitButtonDisabled | bool/func | `false` | true to disable submit button |
| submitButtonContent | node/func | `'Submit'` | '' or null to remove |
| classNames | object | `{}` | see "Custom Styles" section |
| styles | object | `{}` | see "Custom Styles" section |
| addClassNames | object | `{}` | see "Custom Styles" section |


## Component Injection Props
| Name | Type | Default Value | Description |
| --- | --- | --- | --- |
| InputComponent | func | | overrides __Input__; null to remove |
| PreviewComponent | func | | overrides __Preview__; null to remove |
| SubmitButtonComponent | func | | overrides __SubmitButton__; null to remove |
| LayoutComponent | func | | overrides __Layout__; can't be removed |


## Props Passed To Injected Components
If you use the component injection API, you'll want to know which props are passed to your injected components. Scroll to the bottom of the following files to see their prop types.

- [InputComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Input.js)
- [PreviewComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Preview.js)
- [SubmitButtonComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/SubmitButton.js)
- [LayoutComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Layout.js)
