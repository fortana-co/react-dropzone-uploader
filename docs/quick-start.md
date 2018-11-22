---
id: quick-start
title: Quick Start
---


React Dropzone Uploader is a customizable HTML5 file dropzone and uploader for React.


## Installation
`npm install --save react-dropzone-uploader`

Import default styles in your app.

~~~js
import 'react-dropzone-uploader/dist/styles.css'
~~~


## `Dropzone`
RDU handles common use cases with almost no config. The following code gives you a dropzone and clickable file input that accepts image, audio and video files. It uploads files to `https://httpbin.org/post`, and renders a button to submit files that are done uploading. [Check out a live demo](https://codepen.io/kylebebak/pen/wYRNzY/?editors=0010).

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
      accept="image/*,audio/*,video/*"
    />
  )
}
~~~
