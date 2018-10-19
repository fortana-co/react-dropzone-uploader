import React from 'react'
import PropTypes from 'prop-types'

import FileUploadPreview from './FileUploadPreview'
import './FileUploader.css'

let id = 0

class FileUploader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
    }
    this._files = [] // fileWithMeta objects: { file, meta }
  }

  componentWillUnmount() {
    for (const file of this._files) {
      if (file.meta.status === 'uploading') file.xhr.abort()
    }
  }

  handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ active: true })
  }

  handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    clearTimeout(this._timeoutId)
    this.setState({ active: true })
  }

  handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // prevents repeated toggling of `active` state when file is dragged over children of uploader
    // see: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
    this._timeoutId = setTimeout(() => this.setState({ active: false }), 150)
  }

  handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ active: false })

    const { dataTransfer: { files } } = e
    this.handleFiles([...files])
  }

  handleSubmit = () => {
    const { onSubmit, submitAll } = this.props
    if (!onSubmit) return

    if (submitAll) onSubmit(this._files)
    else onSubmit(this._files.filter(f => f.meta.status === 'done'))
  }

  handleCancel = (_id) => {
    const index = this._files.findIndex(f => f.meta.id === _id)
    if (index !== -1 && this._files[index].xhr) this._files[index].xhr.abort()
  }

  handleRemove = (_id) => {
    const index = this._files.findIndex(f => f.meta.id === _id)
    if (index !== -1) {
      this._files.splice(index, 1)
      this.forceUpdate()
    }
  }

  // expects an array of File objects
  handleFiles = (files) => {
    files.forEach(this.handleFile)
  }

  handleFile = (file) => {
    const { name, size, type, lastModified } = file
    const { maxSizeBytes, maxFiles, allowedTypePrefixes, getUploadParams, onUploadReady, onUploadFail } = this.props
    if (allowedTypePrefixes && !allowedTypePrefixes.some(p => type.startsWith(p))) return
    if (this._files.length >= maxFiles) return

    const uploadedDate = new Date().toISOString()
    const lastModifiedDate = lastModified && new Date(lastModified).toISOString()
    const fileWithMeta = {
      file,
      meta: { name, size, type, lastModifiedDate, uploadedDate, status: 'uploading', percent: 0, id },
    }
    this._files.push(fileWithMeta)
    id += 1

    if (size > maxSizeBytes) {
      fileWithMeta.meta.status = 'error_file_size'
      if (onUploadFail) onUploadFail(fileWithMeta)
      this.forceUpdate()
      return
    }
    this.previewFile(fileWithMeta)

    let triggered = false
    const triggerUpload = () => {
      // becomes a NOOP after first invocation
      if (triggered) return
      triggered = true

      if (getUploadParams) this.uploadFile(fileWithMeta)
      else fileWithMeta.meta.status = 'done'
      this.forceUpdate()
    }

    if (onUploadReady) {
      fileWithMeta.triggerUpload = triggerUpload
      const { delayUpload } = onUploadReady(fileWithMeta) || {}
      if (delayUpload === true) return
    }

    triggerUpload()
  }

  previewFile = (fileWithMeta) => {
    const { meta: { type } } = fileWithMeta
    if (!type.startsWith('image/')) return

    const reader = new FileReader()
    reader.readAsDataURL(fileWithMeta.file)
    reader.onloadend = () => {
      const img = new Image()
      img.src = reader.result
      img.onload = () => {
        fileWithMeta.meta.width = img.width
        fileWithMeta.meta.height = img.height
      }

      fileWithMeta.meta.previewUrl = reader.result
      this.forceUpdate()
    }
  }

  uploadFile = async (fileWithMeta) => {
    const { getUploadParams, onUploadSuccess, onUploadFail } = this.props
    const params = await getUploadParams(fileWithMeta)
    const { fields = {}, headers = {}, meta: extraMeta = {}, url } = params || {}

    if (!url) {
      fileWithMeta.meta.status = 'error_upload_params'
      if (onUploadFail) onUploadFail(fileWithMeta)
      this.forceUpdate()
      return
    }

    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    xhr.open('POST', url, true)

    for (const field of Object.keys(fields)) formData.append(field, fields[field])
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    for (const header of Object.keys(headers)) xhr.setRequestHeader(header, headers[header])
    fileWithMeta.meta = { ...fileWithMeta.meta, ...extraMeta }

    // update progress (can be used to show progress indicator)
    xhr.upload.addEventListener('progress', (e) => {
      fileWithMeta.meta.percent = ((e.loaded * 100.0) / e.total) || 100
      this.forceUpdate()
    })

    xhr.addEventListener('readystatechange', (e) => {
      if (xhr.readyState !== 4) return // `readyState` of 4 corresponds to `XMLHttpRequest.DONE`

      if (xhr.status === 0) {
        fileWithMeta.meta.status = 'aborted'
        if (onUploadFail) onUploadFail(fileWithMeta)
        this.forceUpdate()
      } else if (xhr.status < 400) {
        fileWithMeta.meta.percent = 100
        fileWithMeta.meta.status = 'done'
        if (onUploadSuccess) onUploadSuccess(fileWithMeta)
        this.forceUpdate()
      } else {
        fileWithMeta.meta.status = 'error_upload'
        if (onUploadFail) onUploadFail(fileWithMeta)
        this.forceUpdate()
      }
    })

    formData.append('file', fileWithMeta.file)
    xhr.send(formData)
    fileWithMeta.xhr = xhr
  }

  render() {
    const {
      instructions,
      subInstructions,
      maxFiles,
      accept,
      onSubmit,
      getUploadParams,
      FilePreviewComponent,
      dropzoneClassName,
      dropzoneActiveClassName,
      submitButtonClassName,
      instructionsClassName,
      canCancel,
      canRemove,
    } = this.props
    const { active } = this.state

    const chooseFiles = (text) => {
      return (
        <React.Fragment>
          <label
            htmlFor="fileUploaderInputId"
            className="uploader-inputLabel"
          >
            {text}
          </label>
          <input
            id="fileUploaderInputId"
            className="uploader-input"
            type="file"
            multiple
            accept={accept}
            onChange={e => this.handleFiles(Array.from(e.target.files))}
          />
        </React.Fragment>
      )
    }

    const FilePreview = FilePreviewComponent || FileUploadPreview
    const files = this._files.map((f) => {
      return (
        <FilePreview
          key={f.meta.id}
          meta={{ ...f.meta }}
          showProgress={Boolean(getUploadParams)}
          onCancel={canCancel && (() => this.handleCancel(f.meta.id))}
          onRemove={canRemove && (() => this.handleRemove(f.meta.id))}
        />
      )
    })

    let containerClassName = dropzoneClassName || 'uploader-dropzone'
    if (active) containerClassName = `${containerClassName} ${dropzoneActiveClassName || 'uploader-active'}`

    return (
      <React.Fragment>
        <div
          className={containerClassName}
          onDragEnter={this.handleDragEnter}
          onDragOver={this.handleDragOver}
          onDragLeave={this.handleDragLeave}
          onDrop={this.handleDrop}
        >
          {this._files.length === 0 &&
            <div className={instructionsClassName || 'uploader-dropzoneInstructions'}>
              <span className="uploader-largeText">
                {instructions || `Drag up to ${maxFiles} file${maxFiles === 1 ? '' : 's'}`}
              </span>
              {subInstructions && <span className="uploader-smallText">{subInstructions}</span>}
              <span className="uploader-smallText">- or you can -</span>
              {chooseFiles(maxFiles.length === 1 ? 'Choose a File' : 'Choose Files')}
            </div>
          }

          {this._files.length > 0 &&
            <div className="uploader-previewListContainer">
              {files}
              {this._files.length < maxFiles &&
                <div className="uploader-addFiles">{chooseFiles('Add')}</div>
              }
            </div>
          }
        </div>

        {this._files.length > 0 && onSubmit &&
          <div className={submitButtonClassName || 'uploader-buttonContainer'}>
            <button
              onClick={this.handleSubmit}
              disabled={
                this._files.some(f => f.meta.status === 'uploading') || !this._files.some(f => f.meta.status === 'done')
              }
            >
              UPLOAD
            </button>
          </div>
        }
      </React.Fragment>
    )
  }
}

FileUploader.propTypes = {
  onUploadReady: PropTypes.func,
  getUploadParams: PropTypes.func, // should return { fields = {}, headers = {}, meta = {}, url = '' }
  onUploadSuccess: PropTypes.func,
  onUploadFail: PropTypes.func,
  onSubmit: PropTypes.func,

  submitAll: PropTypes.bool,
  canCancel: PropTypes.bool,
  canRemove: PropTypes.bool,

  FilePreviewComponent: PropTypes.any,

  allowedTypePrefixes: PropTypes.arrayOf(PropTypes.string),
  accept: PropTypes.string, // the accept attribute of the input
  maxSizeBytes: PropTypes.number.isRequired,
  maxFiles: PropTypes.number.isRequired,

  instructions: PropTypes.string,
  subInstructions: PropTypes.string,

  dropzoneClassName: PropTypes.string,
  dropzoneActiveClassName: PropTypes.string,
  instructionsClassName: PropTypes.string,
  submitButtonClassName: PropTypes.string,
}

FileUploader.defaultProps = {
  submitAll: false,
  canCancel: true,
  canRemove: true,
  accept: '*',
  maxSizeBytes: Number.MAX_SAFE_INTEGER,
  maxFiles: Number.MAX_SAFE_INTEGER,
}

export default FileUploader
