---
id: examples
title: Live Examples
---


>Open your browser's console to see how RDU manages file metadata and the upload lifecycle.


## Standard
Uploads files to <https://httpbin.org/post>, and merges extra `fileUrl` field into file meta. Logs file metadata to console on submit.

Limits dropzone height with `styles` prop.

~~~js
const Standard = () => {
  const getUploadParams = ({ meta }) => {
    const url = 'https://httpbin.org/post'
    return { url, meta: { fileUrl: `${url}/${encodeURIComponent(meta.name)}` } }
  }

  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
  }

  const handleSubmit = (files) => {
    console.log(files.map(f => f.meta))
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      styles={{ dropzone: { minHeight: 200, maxHeight: 250 } }}
    />
  )
}
~~~
<div id="example-1" style="margin-bottom:100px;"></div>


## Only Image, Audio, Video
Only accepts __image__, __audio__, and __video__ files. Colors dropzone red on drag if files will be rejected because of file type.

Customization functions that receive `(files, extra)` allow `inputContent` and `inputLabel` style to react to dropzone state.

~~~js
const ImageAudioVideo = () => {
  const getUploadParams = ({ meta }) => {
    const url = 'https://httpbin.org/post'
    return { url, meta: { fileUrl: `${url}/${encodeURIComponent(meta.name)}` } }
  }

  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
  }

  const handleSubmit = (files) => {
    console.log(files.map(f => f.meta))
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept="image/*,audio/*,video/*"
      inputContent={(files, extra) => (extra.reject ? 'Image, audio and video files only' : 'Drag Files')}
      styles={{
        dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
        inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
      }}
    />
  )
}
~~~
<div id="example-2" style="margin-bottom:100px;"></div>


## No Upload
Doesn't upload files. Disables submit button until 3 files have been dropped, dynamically updates number of remaining files.

Logs file metadata to console on submit, and removes files from dropzone using `fileWithMeta.remove`.

~~~js
const NoUpload = () => {
  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
  }

  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  return (
    <Dropzone
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      maxFiles={3}
      inputContent="Drop 3 Files"
      inputWithFilesContent={files => `${3 - files.length} more`}
      submitButtonDisabled={files => files.length < 3}
    />
  )
}
~~~
<div id="example-3" style="margin-bottom:100px;"></div>


## Single File, Auto Submit
Automatically removes file from dropzone when it finishes uploading. Limits dropzone to 1 file using `maxFiles` prop. Doesn't include submit button.

Changes border color for "active" dropzone using `styles` prop.

~~~js
import { ToastContainer, toast } from 'react-toastify'

const SingleFileAutoSubmit = () => {
  const getUploadParams = () => {
    return { url: 'https://httpbin.org/post' }
  }

  const handleChangeStatus = ({ meta, remove }, status) => {
    if (status === 'headers_received') {
      toast.success(`${meta.name} uploaded!`)
      remove()
    } else if (status === 'aborted') {
      toast.error(`${meta.name}, upload failed...`)
    }
  }

  return (
    <React.Fragment>
      <ToastContainer position="bottom-right" />
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        maxFiles={1}
        multiple={false}
        canCancel={false}
        inputContent="Drop A File"
        styles={{
          dropzone: { width: 400, height: 200 },
          dropzoneActive: { borderColor: 'green' },
        }}
      />
    </React.Fragment>
  )
}
~~~
<div id="example-4" style="margin-bottom:100px;"></div>


## Custom Preview
Standard file uploader with custom `PreviewComponent`. Also disables dropzone while files are being uploaded.

~~~js
const Preview = ({ meta }) => {
  const { name, percent, status } = meta
  return (
    <span style={{ alignSelf: 'flex-start', margin: '10px 3%' }}>
      {name}, {Math.round(percent)}%, {status}
    </span>
  )
}

const CustomPreview = () => {
  const getUploadParams = () => ({ url: 'https://httpbin.org/post' })

  const handleSubmit = (files) => { console.log(files.map(f => f.meta)) }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onSubmit={handleSubmit}
      PreviewComponent={Preview}
      inputContent="Drop Files (Custom Preview)"
      disabled={files => files.some(f => ['uploading', 'preparing'].includes(f.meta.status))}
    />
  )
}
~~~
<div id="example-5" style="margin-bottom:100px;"></div>


## Custom Layout
Custom `LayoutComponent`. Renders file previews above dropzone, and submit button below it. Uses `defaultClassNames` and `classNames` prop to ensure input label style doesn't change when dropzone contains files.

~~~js
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader'

const Layout = ({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles } }) => {
  return (
    <div>
      {previews}

      <div {...dropzoneProps}>
        {files.length < maxFiles && input}
      </div>

      {files.length > 0 && submitButton}
    </div>
  )
}

const CustomLayout = () => {
  const getUploadParams = () => ({ url: 'https://httpbin.org/post' })

  const handleSubmit = (files) => { console.log(files.map(f => f.meta)) }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      LayoutComponent={Layout}
      onSubmit={handleSubmit}
      classNames={{ inputLabelWithFiles: defaultClassNames.inputLabel }}
      inputContent="Drop Files (Custom Layout)"
    />
  )
}
~~~
<div id="example-6" style="margin-bottom:100px;"></div>


## Dropzone With No Input
If for some reason you want to do this...

~~~js
const NoInputLayout = ({ previews, submitButton, dropzoneProps, files }) => {
  return (
    <div {...dropzoneProps}>
      {files.length === 0 &&
        <span className={defaultClassNames.inputLabel} style={{ cursor: 'unset' }}>
          Only Drop Files (No Input)
        </span>
      }

      {previews}

      {files.length > 0 && submitButton}
    </div>
  )
}

const DropzoneNoInput = () => {
  const getUploadParams = () => ({ url: 'https://httpbin.org/post' })

  const handleSubmit = (files) => { console.log(files.map(f => f.meta)) }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      LayoutComponent={NoInputLayout}
      onSubmit={handleSubmit}
    />
  )
}
~~~
<div id="example-7" style="margin-bottom:100px;"></div>


## Input With No Dropzone
User can choose files with input, but can't drop them.

~~~js
const NoDropzoneLayout = ({ previews, submitButton, input, files, dropzoneProps }) => {
  const { ref, className, style } = dropzoneProps
  return (
    <div ref={ref} className={className} style={style}>
      {previews}

      {input}

      {files.length > 0 && submitButton}
    </div>
  )
}

const InputNoDropzone = () => {
  const getUploadParams = () => ({ url: 'https://httpbin.org/post' })

  const handleSubmit = (files) => { console.log(files.map(f => f.meta)) }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      LayoutComponent={NoDropzoneLayout}
      inputContent="Only Choose Files (No Dropzone)"
      onSubmit={handleSubmit}
    />
  )
}
~~~
<div id="example-8" style="margin-bottom:100px;"></div>

<script src="./assets/bundle.js"></script>
