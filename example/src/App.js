import React from 'react'

import Dropzone from '../../src/Dropzone'

import './styles.css'

const App = () => {
  const getUploadParams = ({ file, meta }) => {
    const url = 'https://httpbin.org/post'
    const fileUrl = `${url}/${encodeURIComponent(meta.name)}`
    return { url, meta: { fileUrl } }
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
      maxSizeBytes={1024 * 1024 * 1000}
      height={250}
      addClassNames={{ dropzone: 'dropzone', dropzoneActive: 'dropzoneActive' }}
    />
  )
}

export default App
