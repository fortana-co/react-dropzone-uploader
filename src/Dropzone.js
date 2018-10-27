import React from 'react'
import PropTypes from 'prop-types'

import DropzoneContentDefault from './DropzoneContent'
import FilePreviewDefault from './FilePreview'
import SubmitButtonDefault from './SubmitButton'
import { formatBytes, formatDuration } from './string'
import './styles.css'

let id = 0

class Dropzone extends React.Component {
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
    clearTimeout(this._dragTimeoutId)
    this.setState({ active: true })
  }

  handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // prevents repeated toggling of `active` state when file is dragged over children of uploader
    // see: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
    this._dragTimeoutId = setTimeout(() => this.setState({ active: false }), 150)
  }

  handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ active: false })

    const { dataTransfer: { files } } = e
    this.handleFiles([...files])
  }

  handleCancel = (fileWithMeta) => {
    if (!fileWithMeta.xhr) return
    fileWithMeta.xhr.abort()
    if (this.props.onCancel) this.props.onCancel(fileWithMeta)
  }

  handleRemove = (fileWithMeta) => {
    const index = this._files.findIndex(f => f.meta.id === fileWithMeta.meta.id)
    if (index !== -1) {
      if (this.props.onRemove) this.props.onRemove(fileWithMeta)
      this._files.splice(index, 1)
      this.forceUpdate()
    }
  }

  handleRestart = (fileWithMeta) => {
    this.uploadFile(fileWithMeta)
    fileWithMeta.meta.status = 'uploading'
    this.forceUpdate()
    if (this.props.onRestart) this.props.onRestart(fileWithMeta)
  }

  // expects an array of File objects
  handleFiles = (files) => {
    files.forEach(this.handleFile)
  }

  handleChangeStatus = (fileWithMeta) => {
    if (!this.props.onChangeStatus) return
    this.props.onChangeStatus(fileWithMeta, fileWithMeta.meta.status)
  }

  handleFile = async (file) => {
    const { name, size, type, lastModified } = file
    const { maxSizeBytes, maxFiles, allowedTypePrefixes, getUploadParams, onUploadReady } = this.props

    const uploadedDate = new Date().toISOString()
    const lastModifiedDate = lastModified && new Date(lastModified).toISOString()
    const fileWithMeta = {
      file,
      meta: { name, size, type, lastModifiedDate, uploadedDate, percent: 0, id },
    }

    if (allowedTypePrefixes && !allowedTypePrefixes.some(p => type.startsWith(p))) {
      fileWithMeta.meta.status = 'rejected_file_type'
      this.handleChangeStatus(fileWithMeta)
      return
    }
    if (this._files.length >= maxFiles) {
      fileWithMeta.meta.status = 'rejected_max_files'
      this.handleChangeStatus(fileWithMeta)
      return
    }

    fileWithMeta.meta.status = 'preparing'
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

    await this.generatePreview(fileWithMeta)

    let triggered = false
    const triggerUpload = () => {
      // becomes NOOP after first invocation
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

  generatePreview = async (fileWithMeta) => {
    const { previewTypes } = this.props

    const { meta: { type }, file } = fileWithMeta
    const isImage = type.startsWith('image/')
    const isAudio = type.startsWith('audio/')
    const isVideo = type.startsWith('video/')
    if (!isImage && !isAudio && !isVideo) return

    const objectUrl = URL.createObjectURL(file)

    const fileCallbackToPromise = (fileObj, callback) => {
      return new Promise((resolve) => { fileObj[callback] = resolve })
    }

    try {
      if (isImage && previewTypes.includes('image')) {
        const img = new Image()
        img.src = objectUrl
        fileWithMeta.meta.previewUrl = objectUrl
        await fileCallbackToPromise(img, 'onload')
        fileWithMeta.meta.width = img.width
        fileWithMeta.meta.height = img.height
      }

      if (isAudio && previewTypes.includes('audio')) {
        const audio = new Audio()
        audio.src = objectUrl
        await fileCallbackToPromise(audio, 'onloadedmetadata')
        fileWithMeta.meta.duration = audio.duration
      }

      if (isVideo && previewTypes.includes('video')) {
        const video = document.createElement('video')
        video.src = objectUrl
        await fileCallbackToPromise(video, 'onloadedmetadata')
        fileWithMeta.meta.duration = video.duration
        fileWithMeta.meta.videoWidth = video.videoWidth
        fileWithMeta.meta.videoHeight = video.videoHeight
      }
      URL.revokeObjectURL(objectUrl)
    } catch (e) { URL.revokeObjectURL(objectUrl) }
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

    xhr.addEventListener('readystatechange', () => {
      // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
      if (xhr.readyState !== 2 && xhr.readyState !== 4) return

      if (xhr.status === 0) {
        fileWithMeta.meta.status = 'aborted'
        this.handleChangeStatus(fileWithMeta)
        this.forceUpdate()
      } else if (xhr.status < 400) {
        fileWithMeta.meta.percent = 100
        if (xhr.readyState === 2) fileWithMeta.meta.status = 'headers_received'
        if (xhr.readyState === 4) fileWithMeta.meta.status = 'done'
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
      maxFiles,
      accept,
      onSubmit,
      getUploadParams,
      canCancel,
      canRemove,
      canRestart,
      FilePreviewComponent,
      SubmitButtonComponent,
      DropzoneContentComponent,
      submitButtonText,
      dropzoneClassName,
      dropzoneActiveClassName,
      submitButtonContainerClassName,
      submitButtonClassName,
      contentClassName,
      contentWithFilesClassName,
      contentInputClassName,
    } = this.props
    const { active } = this.state

    const FilePreview = FilePreviewComponent || FilePreviewDefault
    const SubmitButton = SubmitButtonComponent || SubmitButtonDefault
    const DropzoneContent = DropzoneContentComponent || DropzoneContentDefault

    let containerClassName = dropzoneClassName || 'dzu-dropzone'
    if (active) containerClassName = `${containerClassName} ${dropzoneActiveClassName || 'dzu-dropzoneActive'}`

    const filePreviews = this._files.map((f) => {
      if (FilePreview === null) return null
      return (
        <FilePreview
          key={f.meta.id}
          meta={{ ...f.meta }}
          isUpload={Boolean(getUploadParams)}
          onCancel={canCancel ? () => this.handleCancel(f) : undefined}
          onRemove={canRemove ? () => this.handleRemove(f) : undefined}
          onRestart={canRestart ? () => this.handleRestart(f) : undefined}
        />
      )
    })

    return (
      <div
        className={containerClassName}
        onDragEnter={this.handleDragEnter}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
      >
        {DropzoneContentComponent !== null &&
          <DropzoneContent
            className={contentClassName}
            withFilesClassName={contentWithFilesClassName}
            inputClassName={contentInputClassName}
            accept={accept}
            maxFiles={maxFiles}
            handleFiles={this.handleFiles}
            filePreviews={filePreviews}
            files={this._files}
            active={active}
          />
        }
        {SubmitButtonComponent !== null &&
          <SubmitButton
            className={submitButtonContainerClassName}
            buttonClassName={submitButtonClassName}
            text={submitButtonText}
            onSubmit={onSubmit}
            files={this._files}
          />
        }
      </div>
    )
  }
}

Dropzone.propTypes = {
  onChangeStatus: PropTypes.func,
  onUploadReady: PropTypes.func,
  getUploadParams: PropTypes.func, // should return { fields = {}, headers = {}, meta = {}, url = '' }

  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  onRemove: PropTypes.func,
  onRestart: PropTypes.func,

  canCancel: PropTypes.bool,
  canRemove: PropTypes.bool,
  canRestart: PropTypes.bool,
  previewTypes: PropTypes.arrayOf(PropTypes.oneOf(['image', 'audio', 'video'])),

  allowedTypePrefixes: PropTypes.arrayOf(PropTypes.string),
  accept: PropTypes.string, // the accept attribute of the input
  maxSizeBytes: PropTypes.number.isRequired,
  maxFiles: PropTypes.number.isRequired,

  FilePreviewComponent: PropTypes.any,
  SubmitButtonComponent: PropTypes.any,
  DropzoneContentComponent: PropTypes.any,

  submitButtonText: PropTypes.string,

  dropzoneClassName: PropTypes.string,
  dropzoneActiveClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  contentWithFilesClassName: PropTypes.string,
  contentInputClassName: PropTypes.string,
  submitButtonContainerClassName: PropTypes.string,
  submitButtonClassName: PropTypes.string,
}

Dropzone.defaultProps = {
  canCancel: true,
  canRemove: true,
  canRestart: true,
  previewTypes: ['image', 'audio', 'video'],
  accept: '*',
  maxSizeBytes: Number.MAX_SAFE_INTEGER,
  maxFiles: Number.MAX_SAFE_INTEGER,
}

export default Dropzone
export {
  Dropzone,
  DropzoneContentDefault as DropzoneContent,
  FilePreviewDefault as FilePreview,
  SubmitButtonDefault as SubmitButton,
  formatBytes,
  formatDuration,
}
