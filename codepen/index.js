/**
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

  const handleChangeStatus = ({ meta, file }, status) => {
    console.log(status, meta, file)
  }

  return (
    <ReactDropzoneUploader.Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      dropzoneActiveClassName="dropzoneActive"
    />
  )
}

ReactDOM.render(<App />, document.getElementById('example'))
