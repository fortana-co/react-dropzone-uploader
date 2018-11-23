---
id: props
title: Props
---


The following props can be passed to `Dropzone`.

| Name | Type | Default Value | Description |
| --- | --- | --- | --- |
| onChangeStatus | func | | called every time __fileWithMeta.meta.status__ changes; receives __(fileWithMeta, status, []fileWithMeta)__; possible status values are __'rejected_file_type', 'rejected_max_files', 'preparing', 'error_file_size', 'error_validation', 'ready', 'started', 'uploading', 'error_upload_params', 'aborted', 'restarted', 'removed', 'error_upload', 'headers_received', 'done'__ |
| getUploadParams | func | | called after file is prepared and validated, right before upload; receives __fileWithMeta__ object; should return params needed for upload: __{ fields (object), headers (object), meta (object), method (string), url (string) }__; omit to remove upload functionality from dropzone |
| onSubmit | func | | called when user presses submit button; receives array of __fileWithMeta__ objects whose status is __'headers_received'__ or __'done'__; also receives array of all __fileWithMeta__ objects as second argument; omit to remove submit button |
| accept | string | `'*'` | the accept attribute of the file dropzone/input |
| multiple | bool | `true` | the multiple attribute of the file input |
| minSizeBytes | number | `0` | min file size in bytes (1024 * 1024 = 1MB) |
| maxSizeBytes | number | `2^53 - 1` | max file size in bytes (1024 * 1024 = 1MB) |
| maxFiles | number | `2^53 - 1` | max number of files that can be tracked and rendered by the dropzone |
| validate | func | | generic validation function called after file is prepared; receives __fileWithMeta__ object; should return falsy value if validation succeeds; should return truthy value if validation fails, which sets __meta.status__ to __'error_validation'__, and sets __meta.validationError__ to the returned value |
| autoUpload | bool | `true` | pass false to prevent file from being uploaded automatically; sets __meta.status__ to __'ready'__ (instead of __'uploading'__) after file is prepared and validated; you can call __fileWithMeta.restart__ whenever you want to initiate file upload |
| previewTypes | array | `['image', 'audio', 'video']` | generate rich previews (thumbnail, duration, dimensions) for these file types; defaults to all 3 types; only change this if you think generating rich previews is hurting performance |
| InputComponent | func | | overrides __Input__; null to remove |
| PreviewComponent | func | | overrides __Preview__; null to remove |
| SubmitButtonComponent | func | | overrides __SubmitButton__; null to remove |
| LayoutComponent | func | | overrides __Layout__; can't be removed |
| canCancel | bool | `true` | false to remove cancel button in file preview |
| canRestart | bool | `true` | false to remove restart button in file preview |
| canRemove | bool | `true` | false to remove remove button in file preview |
| inputContent | node | `'Drag Files or Click to Browse'` | '' or null to remove |
| inputWithFilesContent | node | `'Add Files'` | '' or null to remove |
| submitButtonContent | node | `'Submit'` | '' or null to remove |
| classNames | object | `{}` | see "Custom Styles" section |
| styles | object | `{}` | see "Custom Styles" section |
| addClassNames | object | `{}` | see "Custom Styles" section |


## Props Passed to Injected Components
If you use the component injection API, you'll want to know which props are passed to your injected components. Just scroll to the bottom of the following files to see their prop types.

- [InputComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Input.js)
- [PreviewComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Preview.js)
- [SubmitButtonComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/SubmitButton.js)
- [LayoutComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Layout.js)
