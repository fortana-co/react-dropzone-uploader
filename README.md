# React Dropzone Uploader


React Dropzone Uploader is a customizable file dropzone and uploader, with progress indicators, upload cancellation and restart, and minimal dependencies.

- Fully controllable via optional props and callbacks
- Rich file metadata and file previews, especially for image, video and audio files
- Upload status, progress, cancellation, and restart
- Trivial to set auth headers and additional upload fields for any upload (see S3 example)
- Modular design allows for use as standalone file dropzone, file picker, file uploader
- Easily customizable and themeable
- Lightweight at 14kB, including styles

~~~js
import React from 'react'

import Dropzone from 'react-dropzone-uploader'

const Uploader = () => {
  const getUploadParams = ({ meta }) => {
    const url = 'https://httpbin.org/post'
    const fileUrl = `${url}/${encodeURIComponent(meta.name)}`
    return { url, meta: { fileUrl } }
  }

  const handleSubmit = (files) => {
    console.log(files.map(f => f.meta))
  }

  const onChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={onChangeStatus}
      onSubmit={handleSubmit}
      maxSizeBytes={1024 * 1024 * 1000}
    />
  )
}

export default Uploader
~~~


Made the library available as ES Module in addition to CommonJS (@markusenglund)
https://webpack.js.org/guides/author-libraries/

Only dep @babel/runtime
<script src="https://unpkg.com/react-dropzone-uploader@<version>/dist/react-dropzone-uploader.umd.js"></script>


https://codepen.io/kylebebak/pen/wYRNzY/?editors=0110
