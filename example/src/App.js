import React from 'react'

import FileUploader from '../..'

const App = () => {
  const getUploadParams = ({ file, meta }) => {
    const url = 'http://httpbin.org/post'
    const fileUrl = `${url}/${encodeURIComponent(meta.name)}`
    return { url: 'http://httpbin.org/post', meta: { fileUrl } }
  }

  const handleSubmit = (files) => {
    console.log(files.map(f => f.meta))
  }

  return (
    <FileUploader
      getUploadParams={getUploadParams}
      onSubmit={handleSubmit}
    />
  )
}

export default App
