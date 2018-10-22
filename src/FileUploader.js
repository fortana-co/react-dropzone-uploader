import React from 'react'
import PropTypes from 'prop-types'

import FilePreview from './FilePreview'
import SubmitButton from './SubmitButton'
import { formatDuration } from './string'
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
    const { onRemove } = this.props
    const index = this._files.findIndex(f => f.meta.id === _id)
    if (index !== -1) {
      if (onRemove) onRemove(this._files[index])
      this._files.splice(index, 1)
      this.forceUpdate()
    }
  }

  // expects an array of File objects
  handleFiles = (files) => {
    files.forEach(this.handleFile)
  }

  handleChangeStatus = (fileWithMeta) => {
    if (!this.props.onChangeStatus) return
    this.props.onChangeStatus(fileWithMeta, fileWithMeta.meta.status)
  }

  handleFile = (file) => {
    const { name, size, type, lastModified } = file
    const {
      maxSizeBytes,
      maxFiles,
      allowedTypePrefixes,
      getUploadParams,
      onUploadReady,
    } = this.props

    if (allowedTypePrefixes && !allowedTypePrefixes.some(p => type.startsWith(p))) return
    if (this._files.length >= maxFiles) return

    const uploadedDate = new Date().toISOString()
    const lastModifiedDate = lastModified && new Date(lastModified).toISOString()
    const fileWithMeta = {
      file,
      meta: { name, size, type, lastModifiedDate, uploadedDate, status: 'preparing', percent: 0, id },
    }
    this._files.push(fileWithMeta)
    this.handleChangeStatus(fileWithMeta)
    this.forceUpdate()
    id += 1

    if (size > maxSizeBytes) {
      fileWithMeta.meta.status = 'error_file_size'
      this.handleChangeStatus(fileWithMeta)
      this.forceUpdate()
      return
    }

    try { this.generatePreview(fileWithMeta) } catch (e) {}

    let triggered = false
    const triggerUpload = () => {
      // becomes a NOOP after first invocation
      if (triggered) return
      triggered = true

      if (getUploadParams) {
        this.uploadFile(fileWithMeta)
        fileWithMeta.meta.status = 'uploading'
      } else {
        fileWithMeta.meta.status = 'done'
      }
      this.handleChangeStatus(fileWithMeta)
      this.forceUpdate()
    }

    if (onUploadReady) {
      fileWithMeta.triggerUpload = triggerUpload
      const r = onUploadReady(fileWithMeta)
      if (r && r.delayUpload === true) return
    }

    triggerUpload()
  }

  generatePreview = (fileWithMeta) => {
    const { previewTypes } = this.props
    if (!previewTypes) return

    const { meta: { type } } = fileWithMeta
    const isImage = type.startsWith('image/')
    const isAudio = type.startsWith('audio/')
    const isVideo = type.startsWith('video/')
    if (!isImage && !isAudio && !isVideo) return

    const reader = new FileReader()
    reader.readAsDataURL(fileWithMeta.file)

    if (isImage && previewTypes.includes('image')) {
      reader.onloadend = () => {
        const img = new Image()
        img.src = reader.result
        img.onload = () => {
          fileWithMeta.meta.width = img.width
          fileWithMeta.meta.height = img.height
        }
        fileWithMeta.meta.previewUrl = reader.result
      }
    }

    if (isAudio && previewTypes.includes('audio')) {
      reader.onloadend = () => {
        const audio = new Audio()
        audio.src = reader.result
        audio.oncanplaythrough = () => {
          fileWithMeta.meta.duration = formatDuration(audio.duration)
        }
      }
    }

    if (isVideo && previewTypes.includes('video')) {
      reader.onloadend = () => {
        const video = document.createElement('video')
        video.src = reader.result
        video.oncanplaythrough = () => {
          fileWithMeta.meta.duration = formatDuration(video.duration)
        }
      }
    }
    this.forceUpdate()
  }

  uploadFile = async (fileWithMeta) => {
    const { getUploadParams } = this.props
    const params = await getUploadParams(fileWithMeta)
    const { fields = {}, headers = {}, meta: extraMeta = {}, method = 'POST', url } = params || {}

    if (!url) {
      fileWithMeta.meta.status = 'error_upload_params'
      this.handleChangeStatus(fileWithMeta)
      this.forceUpdate()
      return
    }

    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    xhr.open(method, url, true)

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
        this.handleChangeStatus(fileWithMeta)
        this.forceUpdate()
      } else if (xhr.status < 400) {
        fileWithMeta.meta.percent = 100
        fileWithMeta.meta.status = 'done'
        this.handleChangeStatus(fileWithMeta)
        this.forceUpdate()
      } else {
        fileWithMeta.meta.status = 'error_upload'
        this.handleChangeStatus(fileWithMeta)
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
      SubmitButtonComponent,
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

    const File = FilePreviewComponent || FilePreview
    const files = this._files.map((f) => {
      return (
        <File
          key={f.meta.id}
          meta={{ ...f.meta }}
          isUpload={Boolean(getUploadParams)}
          onCancel={canCancel && (() => this.handleCancel(f.meta.id))}
          onRemove={canRemove && (() => this.handleRemove(f.meta.id))}
        />
      )
    })

    let containerClassName = dropzoneClassName || 'uploader-dropzone'
    if (active) containerClassName = `${containerClassName} ${dropzoneActiveClassName || 'uploader-active'}`

    const Button = SubmitButtonComponent || SubmitButton

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
                {instructions || maxFiles.length === 1 ? 'Drag a File' : 'Drag Files'}
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
          <Button
            onSubmit={this.handleSubmit}
            disabled={
              this._files.some(f => f.meta.status === 'uploading' || f.meta.status === 'preparing') ||
              !this._files.some(f => f.meta.status === 'done')
            }
            submitButtonClassName={submitButtonClassName}
          />
        }
      </React.Fragment>
    )
  }
}

FileUploader.propTypes = {
  onChangeStatus: PropTypes.func,
  onUploadReady: PropTypes.func,
  getUploadParams: PropTypes.func, // should return { fields = {}, headers = {}, meta = {}, url = '' }

  onSubmit: PropTypes.func,
  onRemove: PropTypes.func,

  submitAll: PropTypes.bool,
  canCancel: PropTypes.bool,
  canRemove: PropTypes.bool,
  previewTypes: PropTypes.oneOf([
    null,
    PropTypes.arrayOf(PropTypes.oneOf(['image', 'audio', 'video'])),
  ]),

  FilePreviewComponent: PropTypes.any,
  SubmitButtonComponent: PropTypes.any,

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
  previewTypes: ['image', 'audio', 'video'],
  accept: '*',
  maxSizeBytes: Number.MAX_SAFE_INTEGER,
  maxFiles: Number.MAX_SAFE_INTEGER,
}

export default FileUploader
