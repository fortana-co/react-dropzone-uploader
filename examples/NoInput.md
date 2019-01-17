If for some reason you want to do this...

~~~js
const { defaultClassNames } = require('../src/Dropzone')

const NoInputLayout = ({ previews, submitButton, dropzoneProps, files }) => {
  return (
    <div {...dropzoneProps}>
      {files.length === 0 &&
        <span className={defaultClassNames.inputLabel} style={{ cursor: 'unset' }}>
          Only Drop Files (No Input)
        </span>
      }

      {previews}

      {files.length > 0 && submitButton}
    </div>
  )
}

const DropzoneNoInput = () => {
  const getUploadParams = () => ({ url: 'https://httpbin.org/post' })

  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      LayoutComponent={NoInputLayout}
      onSubmit={handleSubmit}
    />
  )
}

<DropzoneNoInput />
~~~
