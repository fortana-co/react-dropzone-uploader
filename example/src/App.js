import React from 'react'

import Dropzone from '../../src/Dropzone'

const App = () => {
  const getUploadParams = ({ file, meta }) => {
    const url = 'https://httpbin.org/post'
    const fileUrl = `${url}/${encodeURIComponent(meta.name)}`
    return { url, meta: { fileUrl } }
  }

  const handleSubmit = (files) => {
    console.log(files.map(f => f.meta))
  }

  const handleUploadReady = ({ triggerUpload }) => {
    // setTimeout(triggerUpload, 3000)
    // return { delayUpload: true }
  }

  const onChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onUploadReady={handleUploadReady}
      onChangeStatus={onChangeStatus}
      onSubmit={handleSubmit}
      maxSizeBytes={1024 * 1024 * 1000}
    />
  )
}

export default App
