import React from 'react'
import PropTypes from 'prop-types'

import LayoutDefault from './Layout'
import InputDefault from './Input'
import PreviewDefault from './Preview'
import SubmitButtonDefault from './SubmitButton'
import { formatBytes, formatDuration, accepts, mergeStyles } from './utils'

let id = 0

class Dropzone extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
    }
    this._files = [] // fileWithMeta objects: { file, meta }
    this._mounted = true
    this._dropzone = React.createRef()
  }

  componentWillUnmount() {
    this._mounted = false
    for (const file of this._files) {
      if (file.meta.status === 'uploading') file.xhr.abort()
    }
  }

  _forceUpdate = () => {
    if (this._mounted) this.forceUpdate()
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

  handleChangeStatus = (fileWithMeta) => {
    if (!this.props.onChangeStatus) return
    const { meta } = this.props.onChangeStatus(fileWithMeta, fileWithMeta.meta.status, this._files) || {}
    if (meta) {
      delete meta.status
      fileWithMeta.meta = { ...fileWithMeta.meta, ...meta }
      this._forceUpdate()
    }
  }

  handleCancel = (fileWithMeta) => {
    if (!fileWithMeta.xhr) return
    fileWithMeta.xhr.abort()
  }

  handleRemove = (fileWithMeta) => {
    const index = this._files.findIndex(f => f.meta.id === fileWithMeta.meta.id)
    if (index !== -1) {
      fileWithMeta.meta.status = 'removed'
      this.handleChangeStatus(fileWithMeta)
      this._files.splice(index, 1)
      this._forceUpdate()
    }
  }

  handleRestart = (fileWithMeta) => {
    if (!this.props.getUploadParams) return

    if (fileWithMeta.meta.status === 'ready') fileWithMeta.meta.status = 'started'
    else fileWithMeta.meta.status = 'restarted'
    this.handleChangeStatus(fileWithMeta)

    fileWithMeta.meta.status = 'uploading'
    fileWithMeta.meta.percent = 0
    this.handleChangeStatus(fileWithMeta)
    this._forceUpdate()
    this.uploadFile(fileWithMeta)
  }

  // expects an array of File objects
  handleFiles = (files) => {
    files.forEach(this.handleFile)
    const { current } = this._dropzone
    if (current) setTimeout(() => current.scroll({ top: current.scrollHeight, behavior: 'smooth' }), 150)
  }

  handleFile = async (file) => {
    const { name, size, type, lastModified } = file
    const { minSizeBytes, maxSizeBytes, maxFiles, accept, getUploadParams, autoUpload, validate } = this.props

    const uploadedDate = new Date().toISOString()
    const lastModifiedDate = lastModified && new Date(lastModified).toISOString()
    const fileWithMeta = {
      file,
      meta: { name, size, type, lastModifiedDate, uploadedDate, percent: 0, id },
    }

    // firefox versions prior to 53 return a bogus mime type for file drag events,
    // so files with that mime type are always accepted
    if (file.type !== 'application/x-moz-file' && !accepts(file, accept)) {
      fileWithMeta.meta.status = 'rejected_file_type'
      this.handleChangeStatus(fileWithMeta)
      return
    }
    if (this._files.length >= maxFiles) {
      fileWithMeta.meta.status = 'rejected_max_files'
      this.handleChangeStatus(fileWithMeta)
      return
    }

    fileWithMeta.cancel = () => this.handleCancel(fileWithMeta)
    fileWithMeta.remove = () => this.handleRemove(fileWithMeta)
    fileWithMeta.restart = () => this.handleRestart(fileWithMeta)

    fileWithMeta.meta.status = 'preparing'
    this._files.push(fileWithMeta)
    this.handleChangeStatus(fileWithMeta)
    this._forceUpdate()
    id += 1

    if (size < minSizeBytes || size > maxSizeBytes) {
      fileWithMeta.meta.status = 'error_file_size'
      this.handleChangeStatus(fileWithMeta)
      this._forceUpdate()
      return
    }

    await this.generatePreview(fileWithMeta)

    if (validate) {
      const error = validate(fileWithMeta)
      if (error) {
        fileWithMeta.meta.status = 'error_validation'
        fileWithMeta.meta.validationError = error // usually a string, but doesn't have to be
        this.handleChangeStatus(fileWithMeta)
        this._forceUpdate()
        return
      }
    }

    if (getUploadParams) {
      if (autoUpload) {
        this.uploadFile(fileWithMeta)
        fileWithMeta.meta.status = 'uploading'
      } else {
        fileWithMeta.meta.status = 'ready'
      }
    } else {
      fileWithMeta.meta.status = 'done'
    }
    this.handleChangeStatus(fileWithMeta)
    this._forceUpdate()
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
    this._forceUpdate()
  }

  uploadFile = async (fileWithMeta) => {
    const { getUploadParams } = this.props
    const params = await getUploadParams(fileWithMeta)
    const { fields = {}, headers = {}, meta: extraMeta = {}, method = 'POST', url } = params || {}
    delete extraMeta.status

    if (!url) {
      fileWithMeta.meta.status = 'error_upload_params'
      this.handleChangeStatus(fileWithMeta)
      this._forceUpdate()
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
      this._forceUpdate()
    })

    xhr.addEventListener('readystatechange', () => {
      // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
      if (xhr.readyState !== 2 && xhr.readyState !== 4) return

      if (xhr.status === 0) {
        fileWithMeta.meta.status = 'aborted'
        this.handleChangeStatus(fileWithMeta)
        this._forceUpdate()
      } else if (xhr.status < 400) {
        fileWithMeta.meta.percent = 100
        if (xhr.readyState === 2) fileWithMeta.meta.status = 'headers_received'
        if (xhr.readyState === 4) fileWithMeta.meta.status = 'done'
        this.handleChangeStatus(fileWithMeta)
        this._forceUpdate()
      } else {
        fileWithMeta.meta.status = 'error_upload'
        this.handleChangeStatus(fileWithMeta)
        this._forceUpdate()
      }
    })

    formData.append('file', fileWithMeta.file)
    xhr.send(formData)
    fileWithMeta.xhr = xhr
  }

  render() {
    const {
      accept,
      maxFiles,
      minSizeBytes,
      maxSizeBytes,
      onSubmit,
      getUploadParams,
      InputComponent,
      PreviewComponent,
      SubmitButtonComponent,
      LayoutComponent,
      canCancel,
      canRemove,
      canRestart,
      inputContent,
      inputWithFilesContent,
      submitButtonContent,
      classNames,
      styles,
      addClassNames,
    } = this.props
    const { active } = this.state

    const Input = InputComponent || InputDefault
    const Preview = PreviewComponent || PreviewDefault
    const SubmitButton = SubmitButtonComponent || SubmitButtonDefault
    const Layout = LayoutComponent || LayoutDefault

    const {
      classNames: {
        dropzone: dropzoneClassName,
        dropzoneWithFiles: dropzoneWithFilesClassName,
        dropzoneActive: dropzoneActiveClassName,
        input: inputClassName,
        inputWithFiles: inputWithFilesClassName,
        preview: previewClassName,
        previewImage: previewImageClassName,
        submitButtonContainer: submitButtonContainerClassName,
        submitButton: submitButtonClassName,
      },
      styles: {
        dropzone: dropzoneStyle,
        dropzoneWithFiles: dropzoneWithFilesStyle,
        dropzoneActive: dropzoneActiveStyle,
        input: inputStyle,
        inputWithFiles: inputWithFilesStyle,
        preview: previewStyle,
        previewImage: previewImageStyle,
        submitButtonContainer: submitButtonContainerStyle,
        submitButton: submitButtonStyle,
      },
    } = mergeStyles(classNames, styles, addClassNames)

    const extra = { active, accept, minSizeBytes, maxSizeBytes, maxFiles }

    const files = [...this._files]
    let previews = null
    if (PreviewComponent !== null) {
      previews = files.map((f) => {
        return (
          <Preview
            className={previewClassName}
            imageClassName={previewImageClassName}
            style={previewStyle}
            imageStyle={previewImageStyle}
            key={f.meta.id}
            fileWithMeta={f}
            meta={{ ...f.meta }}
            isUpload={Boolean(getUploadParams)}
            canCancel={canCancel}
            canRemove={canRemove}
            canRestart={canRestart}
            files={files}
            extra={extra}
          />
        )
      })
    }

    const input = InputComponent !== null ? (
      <Input
        className={inputClassName}
        withFilesClassName={inputWithFilesClassName}
        style={inputStyle}
        withFilesStyle={inputWithFilesStyle}
        accept={accept}
        content={inputContent}
        withFilesContent={inputWithFilesContent}
        onFiles={this.handleFiles}
        files={files}
        extra={extra}
      />
    ) : null

    const submitButton = onSubmit && SubmitButtonComponent !== null ? (
      <SubmitButton
        className={submitButtonContainerClassName}
        buttonClassName={submitButtonClassName}
        style={submitButtonContainerStyle}
        buttonStyle={submitButtonStyle}
        content={submitButtonContent}
        onSubmit={onSubmit}
        files={files}
        extra={extra}
      />
    ) : null

    const dropzoneBaseClassName = files.length > 0 ? dropzoneWithFilesClassName : dropzoneClassName
    const dropzoneBaseStyle = files.length > 0 ? dropzoneWithFilesStyle : dropzoneStyle
    return (
      <Layout
        input={input}
        previews={previews}
        submitButton={submitButton}
        dropzoneProps={{
          ref: this._dropzone,
          className: active ? `${dropzoneBaseClassName} ${dropzoneActiveClassName}` : dropzoneBaseClassName,
          style: active ? { ...(dropzoneBaseStyle || {}), ...(dropzoneActiveStyle || {}) } : dropzoneBaseStyle,
          onDragEnter: this.handleDragEnter,
          onDragOver: this.handleDragOver,
          onDragLeave: this.handleDragLeave,
          onDrop: this.handleDrop,
        }}
        files={files}
        extra={{
          active,
          accept,
          minSizeBytes,
          maxSizeBytes,
          maxFiles,
          canCancel,
          canRemove,
          canRestart,
          onSubmit,
          onFiles: this.handleFiles,
          onCancelFile: this.handleCancel,
          onRemoveFile: this.handleRemove,
          onRestartFile: this.handleRestart,
          isUpload: Boolean(getUploadParams),
        }}
      />
    )
  }
}

Dropzone.propTypes = {
  onChangeStatus: PropTypes.func,
  getUploadParams: PropTypes.func, // should return { fields = {}, headers = {}, meta = {}, method, url = '' }
  onSubmit: PropTypes.func,

  accept: PropTypes.string,
  minSizeBytes: PropTypes.number.isRequired,
  maxSizeBytes: PropTypes.number.isRequired,
  maxFiles: PropTypes.number.isRequired,

  validate: PropTypes.func,

  autoUpload: PropTypes.bool,

  previewTypes: PropTypes.arrayOf(PropTypes.oneOf(['image', 'audio', 'video'])),

  /* component injection and customization */
  InputComponent: PropTypes.func,
  PreviewComponent: PropTypes.func,
  SubmitButtonComponent: PropTypes.func,
  LayoutComponent: PropTypes.func,

  canCancel: PropTypes.bool,
  canRemove: PropTypes.bool,
  canRestart: PropTypes.bool,

  inputContent: PropTypes.node,
  inputWithFilesContent: PropTypes.node,
  submitButtonContent: PropTypes.node,

  classNames: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
  addClassNames: PropTypes.object.isRequired,
}

Dropzone.defaultProps = {
  accept: '*',
  minSizeBytes: 0,
  maxSizeBytes: Number.MAX_SAFE_INTEGER,
  maxFiles: Number.MAX_SAFE_INTEGER,
  autoUpload: true,
  previewTypes: ['image', 'audio', 'video'],
  canCancel: true,
  canRemove: true,
  canRestart: true,
  inputContent: 'Drag Files or Click to Browse',
  submitButtonContent: 'Submit',
  classNames: {},
  styles: {},
  addClassNames: {},
}

export default Dropzone
export {
  LayoutDefault as Layout,
  InputDefault as Input,
  PreviewDefault as Preview,
  SubmitButtonDefault as SubmitButton,
  formatBytes,
  formatDuration,
  accepts,
}
