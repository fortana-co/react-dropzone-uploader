Standard file uploader with custom `InputComponent`. Uses default `getFilesFromEvent` prop to ensure array of files is extracted from `onChange` event and passed to `onFiles`.

~~~js
const Input = ({ accept, onFiles, files, getFilesFromEvent }) => {
  const text = files.length > 0 ? 'Add more files' : 'Choose files'

  return (
    <label style={{ backgroundColor: '#007bff', color: '#fff', cursor: 'pointer', padding: 15, borderRadius: 3 }}>
      {text}
      <input
        style={{ display: 'none' }}
        type="file"
        accept={accept}
        multiple
        onChange={e => {
          onFiles(getFilesFromEvent(e))
        }}
      />
    </label>
  )
}

const CustomInput = () => {
  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  return (
    <Dropzone
      getUploadParams={() => ({ url: 'https://httpbin.org/post' })}
      onSubmit={handleSubmit}
      InputComponent={Input}
    />
  )
}

<CustomInput />
~~~
