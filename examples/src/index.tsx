//@ts-ignore
export = null

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
//@ts-ignore
import { getDroppedOrSelectedFiles } from 'html5-file-selector'
//@ts-ignore
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '../../src/styles.css'
import Dropzone, {
  defaultClassNames,
  IDropzoneProps,
  ILayoutProps,
  IPreviewProps,
  IInputProps,
} from '../../src/Dropzone'
import { imageDataUrl } from './data'

const Standard = () => {
  const getUploadParams: IDropzoneProps['getUploadParams'] = () => {
    return { url: 'https://httpbin.org/post' }
  }

  const handleChangeStatus: IDropzoneProps['onChangeStatus'] = ({ meta }, status) => {
    console.log(status, meta)
  }

  const handleSubmit: IDropzoneProps['onSubmit'] = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      styles={{ dropzone: { minHeight: 200, maxHeight: 250 } }}
    />
  )
}

const ImageAudioVideo = () => {
  const getUploadParams = ({ meta }) => {
    const url = 'https://httpbin.org/post'
    return { url, meta: { fileUrl: `${url}/${encodeURIComponent(meta.name)}` } }
  }

  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
  }

  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept="image/*,audio/*,video/*"
      inputContent={(files, { reject }) => (reject ? 'Image, audio and video files only' : 'Drag Files')}
      styles={{
        dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
        inputLabel: (files, { reject }) => (reject ? { color: 'red' } : {}),
      }}
    />
  )
}

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

const SingleFileAutoSubmit = () => {
  const getUploadParams = () => {
    return { url: 'https://httpbin.org/post' }
  }

  const handleChangeStatus = ({ meta, remove }, status) => {
    if (status === 'headers_received') {
      toast.success(`${meta.name} uploaded!`)
      remove()
    } else if (status === 'aborted') {
      toast.error(`${meta.name}, upload failed...`)
    }
  }

  return (
    <React.Fragment>
      <ToastContainer position="bottom-right" />
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        accept=".png"
        maxFiles={1}
        multiple={false}
        canCancel={false}
        inputContent="Drop A File"
        styles={{
          dropzone: { width: 400, height: 200 },
          dropzoneActive: { borderColor: 'green' },
          dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
        }}
      />
    </React.Fragment>
  )
}

const Preview = ({ meta }: IPreviewProps) => {
  const { name, percent, status } = meta
  return (
    <span style={{ alignSelf: 'flex-start', margin: '10px 3%' }}>
      {name}, {Math.round(percent)}%, {status}
    </span>
  )
}

const CustomPreview = () => {
  const getUploadParams = () => ({ url: 'https://httpbin.org/post' })

  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onSubmit={handleSubmit}
      PreviewComponent={Preview}
      inputContent="Drop Files (Custom Preview)"
      disabled={files => files.some(f => ['preparing', 'getting_upload_params', 'uploading'].includes(f.meta.status))}
    />
  )
}

const Layout = ({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles } }: ILayoutProps) => {
  return (
    <div>
      {previews}

      <div {...dropzoneProps}>{files.length < maxFiles && input}</div>

      {files.length > 0 && submitButton}
    </div>
  )
}

const CustomLayout = () => {
  const getUploadParams = () => ({ url: 'https://httpbin.org/post' })

  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      LayoutComponent={Layout}
      onSubmit={handleSubmit}
      classNames={{ inputLabelWithFiles: defaultClassNames.inputLabel }}
      inputContent="Drop Files (Custom Layout)"
    />
  )
}

const Input = ({ accept, onFiles, files, getFilesFromEvent }: IInputProps) => {
  const text = files.length > 0 ? 'Add more files' : 'Choose files'

  return (
    <label style={{ backgroundColor: '#007bff', color: '#fff', cursor: 'pointer', padding: 15, borderRadius: 3 }}>
      {text}
      <input
        style={{ display: 'none' }}
        type="file"
        accept={accept}
        multiple
        onChange={async e => {
          const chosenFiles = await getFilesFromEvent(e)
          onFiles(chosenFiles as File[])
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

  const getFilesFromEvent = async e => {
    const chosenFiles = await getDroppedOrSelectedFiles(e)
    return chosenFiles.map(f => f.fileObject)
  }

  return (
    <Dropzone
      accept="image/*,audio/*,video/*,.pdf"
      getUploadParams={() => ({ url: 'https://httpbin.org/post' })}
      onSubmit={handleSubmit}
      InputComponent={Input}
      getFilesFromEvent={getFilesFromEvent}
    />
  )
}

const NoInputLayout = ({ previews, submitButton, dropzoneProps, files }: ILayoutProps) => {
  return (
    <div {...dropzoneProps}>
      {files.length === 0 && (
        <span className={defaultClassNames.inputLabel} style={{ cursor: 'unset' }}>
          Only Drop Files (No Input)
        </span>
      )}

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

  return <Dropzone getUploadParams={getUploadParams} LayoutComponent={NoInputLayout} onSubmit={handleSubmit} />
}

const NoDropzoneLayout = ({ previews, submitButton, input, files, dropzoneProps }: ILayoutProps) => {
  const { ref, className, style } = dropzoneProps

  return (
    <p ref={ref} className={className} style={style}>
      {previews}

      {input}

      {files.length > 0 && submitButton}
    </p>
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

class InitialFileFromDataUrl extends React.Component {
  state = { file: undefined }

  handleClick = async () => {
    const res = await fetch(imageDataUrl)
    const buf = await res.arrayBuffer()
    const file = new File([buf], 'image_data_url.jpg', { type: 'image/jpeg' })
    this.setState({ file })
  }

  handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
    this.setState({ file: undefined })
  }

  render() {
    const { file } = this.state
    if (!file)
      return (
        <div style={{ border: '2px solid #d9d9d9', padding: 10, borderRadius: 4 }} onClick={this.handleClick}>
          Click me to upload a file from a data URL.
        </div>
      )

    return (
      <Dropzone
        getUploadParams={() => ({ url: 'https://httpbin.org/post' })}
        InputComponent={null}
        onSubmit={this.handleSubmit}
        initialFiles={[file]}
        canCancel={false}
        canRemove={false}
        canRestart={false}
      />
    )
  }
}

const OnFilesLayout = ({ previews, submitButton, dropzoneProps, files, extra }: ILayoutProps) => {
  const handleClick = async () => {
    const res = await fetch(imageDataUrl)
    const buf = await res.arrayBuffer()
    const file = new File([buf], 'image_data_url.jpg', { type: 'image/jpeg' })
    extra.onFiles([file])
  }

  return (
    <section {...dropzoneProps} style={{ height: 200 }}>
      <button style={{ marginTop: 10 }} onClick={handleClick}>
        Upload file from data URL
      </button>
      {previews}

      {files.length > 0 && submitButton}
    </section>
  )
}

const CustomOnFiles = () => {
  return (
    <Dropzone
      getUploadParams={() => ({ url: 'https://httpbin.org/post' })}
      LayoutComponent={OnFilesLayout}
      onSubmit={(files, allFiles) => {
        console.log(files.map(f => f.meta))
        allFiles.forEach(f => f.remove())
      }}
      canCancel={false}
      canRemove={false}
      canRestart={false}
    />
  )
}

ReactDOM.render(<Standard />, document.getElementById('example-1'))
ReactDOM.render(<ImageAudioVideo />, document.getElementById('example-2'))
ReactDOM.render(<NoUpload />, document.getElementById('example-3'))
ReactDOM.render(<SingleFileAutoSubmit />, document.getElementById('example-4'))
ReactDOM.render(<CustomPreview />, document.getElementById('example-5'))
ReactDOM.render(<CustomLayout />, document.getElementById('example-6'))
ReactDOM.render(<CustomInput />, document.getElementById('example-7'))
ReactDOM.render(<DropzoneNoInput />, document.getElementById('example-8'))
ReactDOM.render(<InputNoDropzone />, document.getElementById('example-9'))
ReactDOM.render(<InitialFileFromDataUrl />, document.getElementById('example-10'))
ReactDOM.render(<CustomOnFiles />, document.getElementById('example-11'))
