Doesn't upload files. Disables submit button until 3 files have been dropped, dynamically updates number of remaining files.

~~~js
const NoUpload = () => {
  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
  }

  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  return (
    <Dropzone
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      maxFiles={3}
      inputContent="Drop 3 Files"
      inputWithFilesContent={files => `${3 - files.length} more`}
      submitButtonDisabled={files => files.length < 3}
    />
  )
}

<NoUpload />
~~~
