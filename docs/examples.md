---
id: examples
title: Live Examples
---


## Standard

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
      accept="image/*,audio/*,video/*"
      styles={{ dropzone: { height: 200 }, dropzoneWithFiles: { maxHeight: 250 } }}
    />
  )
}
~~~
<div id="example-1" style="margin-bottom:100px;"></div>


## No Upload

~~~js
const NoUpload = () => {
  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
  }

  const handleSubmit = (files) => {
    console.log(files.map(f => f.meta))
  }

  return (
    <Dropzone
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      maxFiles={2}
      inputContent="Drop Up To 2 Files"
      inputWithFilesContent="Add One More File"
    />
  )
}
~~~
<div id="example-2" style="margin-bottom:100px;"></div>


## Single File, Auto Submit

~~~js
const SingleFileAutoSubmit = () => {
  const getUploadParams = () => {
    return { url: 'https://httpbin.org/post' }
  }

  const handleChangeStatus = ({ meta, remove }, status) => {
    if (status === 'headers_received') {
      console.log('submit file automatically and remove it', meta)
      remove()
    }
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      maxFiles={1}
      canCancel={false}
      inputContent="Drop A File"
      styles={{ dropzone: { width: 400, height: 200 }, dropzoneWithFiles: { width: 400, height: 200 }, dropzoneActive: { borderColor: 'red' } }}
    />
  )
}
~~~
<div id="example-3" style="margin-bottom:100px;"></div>


## Custom Preview

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
  const getUploadParams = () => {
    return { url: 'https://httpbin.org/post' }
  }

  const handleSubmit = (files) => {
    console.log(files.map(f => f.meta))
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onSubmit={handleSubmit}
      PreviewComponent={Preview}
      inputContent="Drop Files (Custom Preview)"
    />
  )
}

~~~
<div id="example-4" style="margin-bottom:100px;"></div>


## Custom Layout

~~~js
const Layout = (props) => {
  const {
    input,
    previews,
    submitButton,
    dropzoneProps,
    files,
    extra: { maxFiles },
  } = props

  return (
    <div>
      <div {...dropzoneProps}>
        {files.length < maxFiles && input}
      </div>

      {previews}
      {files.length > 0 && submitButton}
    </div>
  )
}

const CustomLayout = () => {
  const getUploadParams = () => {
    return { url: 'https://httpbin.org/post' }
  }

  const handleSubmit = (files) => {
    console.log(files.map(f => f.meta))
  }

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
<div id="example-5" style="margin-bottom:100px;"></div>

<script src="/docs/assets/bundle.js"></script>
