import React from 'react'

import FileUploader from '../../src/FileUploader'

const App = () => {
  const getUploadParams = ({ file, meta }) => {
    const url = 'http://httpbin.org/post'
    const fileUrl = `${url}/${encodeURIComponent(meta.name)}`
    return { url: 'http://httpbin.org/post', meta: { fileUrl } }
  }

  const handleSubmit = (files) => {
    console.log(files.map(f => f.meta))
  }

  const handleUploadReady = ({ triggerUpload }) => {
    setTimeout(triggerUpload, 3000)
    return { delayUpload: true }
  }

  const onChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
  }

  return (
    <FileUploader
      getUploadParams={getUploadParams}
      // onUploadReady={handleUploadReady}
      onChangeStatus={onChangeStatus}
      onSubmit={handleSubmit}
      maxSizeBytes={1024 * 1024 * 100}
    />
  )
}

export default App
