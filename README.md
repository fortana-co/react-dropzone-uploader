# React Dropzone Uploader


[![NPM](https://img.shields.io/npm/v/react-dropzone-uploader.svg)](https://www.npmjs.com/package/react-dropzone-uploader)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/react-dropzone-uploader.svg)](https://www.npmjs.com/package/react-dropzone-uploader)

React Dropzone Uploader is a customizable file dropzone and uploader, with progress indicators, upload cancellation and restart, and minimal dependencies.


## Features
- Fully controllable via optional props, callbacks, and component injection API 
- Rich file metadata and file previews, especially for image, video and audio files
- Detailed upload status and progress, upload cancellation and restart
- Trivially set auth headers and additional upload fields for any upload (see S3 example)
- Modular design allows for use as standalone file dropzone, file picker, file uploader
- Easily customizable and themeable
- Lightweight at ~15kB, including styles


## Installation
Run `npm install --save react-dropzone-uploader`.


## Getting Started
RDU's sensible defaults make it very powerful out of the box. The following code gives your users a dropzone and file picker that uploads files to `https://httpbin.org/post`, with a button to submit the files when they're done.

The `onChangeStatus` prop is thrown in just to show the status values a file is assigned as it's dropped or chosen and then uploaded. [Check out a live demo here](https://codepen.io/kylebebak/pen/wYRNzY/?editors=0110).

~~~js
import Dropzone from 'react-dropzone-uploader'

const Uploader = () => {
  const getUploadParams = ({ meta }) => { // upload `url` and other upload params can be a function of file `meta`
    const url = 'https://httpbin.org/post'
    const fileUrl = `${url}/${encodeURIComponent(meta.name)}` // new value can be merged into file meta
    return { url, meta: { fileUrl } }
  }

  const handleSubmit = (files) => { // array of all files that are done uploading
    console.log(files.map(f => f.meta))
  }

  const handleChangeStatus = ({ meta, file }, status) => { // invoked every time a file's `status` changes
    console.log(status, meta, file)
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
    />
  )
}
~~~
