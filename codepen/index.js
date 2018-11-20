/**
https://cdnjs.cloudflare.com/ajax/libs/react/16.4.2/umd/react.production.min.js
https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.4.2/umd/react-dom.production.min.js
https://cdnjs.cloudflare.com/ajax/libs/prop-types/15.6.2/prop-types.min.js
https://unpkg.com/react-dropzone-uploader@2.0.1/dist/react-dropzone-uploader.umd.js
https://unpkg.com/react-dropzone-uploader@2.0.1/dist/styles.css
 */

// index.html: `<div id="example"></div>`

const styles = {
  dropzone: {
    height: 200,
  },
}

const App = () => {
  const getUploadParams = ({ meta }) => {
    const url = 'https://httpbin.org/post'
    const fileUrl = `${url}/${encodeURIComponent(meta.name)}`
    return { url, meta: { fileUrl } }
  }

  const handleChangeStatus = ({ meta, file }, status) => {
    console.log(status, meta, file)
  }

  const handleSubmit = (files) => {
    console.log(files.map(f => f.meta))
  }

  return (
    <ReactDropzoneUploader.default
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      styles={styles}
    />
  )
}

ReactDOM.render(<App />, document.getElementById('example'))
