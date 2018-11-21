import React from 'react'
import ReactDOM from 'react-dom'

import '../../src/styles.css'
import Dropzone, { defaultClassNames } from '../../src/Dropzone'

const StandardWithAccept = () => {
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
    />
  )
}


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
      styles={{ dropzone: { width: 400, height: 200 }, dropzoneWithFiles: { width: 400, height: 200 } }}
    />
  )
}


const Preview = ({ meta }) => {
  const { name, percent, status } = meta
  return <span style={{ alignSelf: 'flex-start', margin: '10px 3%' }}>{name}, {Math.round(percent)}%, {status}</span>
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
    />
  )
}


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
      classNames={{ inputWithFiles: defaultClassNames.input }}
    />
  )
}

ReactDOM.render(<StandardWithAccept />, document.getElementById('example-1'))
ReactDOM.render(<NoUpload />, document.getElementById('example-2'))
ReactDOM.render(<SingleFileAutoSubmit />, document.getElementById('example-3'))
ReactDOM.render(<CustomPreview />, document.getElementById('example-4'))
ReactDOM.render(<CustomLayout />, document.getElementById('example-5'))
