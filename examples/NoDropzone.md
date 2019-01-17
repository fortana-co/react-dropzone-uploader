User can choose files with input, but can't drop them.

~~~js
const NoDropzoneLayout = ({ previews, submitButton, input, files, dropzoneProps }) => {
  const { ref, className, style } = dropzoneProps
  return (
    <div ref={ref} className={className} style={style}>
      {previews}

      {input}

      {files.length > 0 && submitButton}
    </div>
  )
}

const InputNoDropzone = () => {
  const getUploadParams = () => ({ url: 'https://httpbin.org/post' })

  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      LayoutComponent={NoDropzoneLayout}
      inputContent="Only Choose Files (No Dropzone)"
      onSubmit={handleSubmit}
    />
  )
}

<InputNoDropzone />
~~~
