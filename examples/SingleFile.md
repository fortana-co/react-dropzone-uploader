Automatically removes file from dropzone when it finishes uploading. Limits dropzone to 1 file using `maxFiles` prop. Doesn't include submit button.

Changes border color for "active" dropzone using `styles` prop.

~~~js
const SingleFileAutoSubmit = () => {
  const toast = (innerHTML) => {
    const el = document.getElementById('toast')
    el.innerHTML = innerHTML
    el.className = 'show'
    setTimeout(() => { el.className = el.className.replace('show', '') }, 3000)
  }

  const getUploadParams = () => {
    return { url: 'https://httpbin.org/post' }
  }

  const handleChangeStatus = ({ meta, remove }, status) => {
    if (status === 'headers_received') {
      toast(`${meta.name} uploaded!`)
      remove()
    } else if (status === 'aborted') {
      toast(`${meta.name}, upload failed...`)
    }
  }

  return (
    <React.Fragment>
      <div id="toast">Upload</div>
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        maxFiles={1}
        multiple={false}
        canCancel={false}
        inputContent="Drop A File"
        styles={{
          dropzone: { width: 400, height: 200 },
          dropzoneActive: { borderColor: 'green' },
        }}
      />
    </React.Fragment>
  )
}

<SingleFileAutoSubmit />
~~~
