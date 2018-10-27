/**
https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.0.0/polyfill.min.js
https://cdnjs.cloudflare.com/ajax/libs/react/16.4.2/umd/react.production.min.js
https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.4.2/umd/react-dom.production.min.js
https://cdnjs.cloudflare.com/ajax/libs/prop-types/15.6.2/prop-types.min.js
https://unpkg.com/react-dropzone-uploader@<version>/dist/react-dropzone-uploader.umd.js
 */

const App = () => {
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
    <ReactDropzoneUploader.Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={onChangeStatus}
      onSubmit={handleSubmit}
      maxSizeBytes={1024 * 1024 * 1000}
    />
  )
}

ReactDOM.render(<App />, document.getElementById('example'))
