/* eslint-disable no-param-reassign */
import React from 'react'
import PropTypes from 'prop-types'

import RaisedButton from 'material-ui/RaisedButton'

import service from 'api/service'
import FormStyles from 'src/Form.css'
import FileUploadPreview from './FileUploadPreview'
import Styles from './FileUploader.css'


let id = 0

class FileUploader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
    }
    this._files = []
    this.dropzone = React.createRef()
  }

  handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ active: true })
  }

  componentWillUnmount() {
    for (const file of this._files) {
      if (file.meta.status === 'uploading') file.xhr.abort()
    }
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
    const _files = [...files]
    this.handleFiles(_files)
  }

  // expects an array of File objects
  handleFiles = (files) => {
    files.forEach(this.handleFile)
  }

  handleFile = (file) => {
    const { name, size, type } = file
    const { maxSizeBytes, maxFiles, allowedTypePrefixes } = this.props
    if (allowedTypePrefixes && !allowedTypePrefixes.some(p => type.startsWith(p))) return
    if (this._files.length >= maxFiles) return

    const fileWithMeta = { file, meta: { name, size, type, status: 'uploading', percent: 0, id } }
    this._files.push(fileWithMeta)
    id += 1

    if (size > maxSizeBytes) {
      fileWithMeta.meta.status = 'error_file_size'
      return
    }
    this.previewFile(fileWithMeta)
    this.uploadFile(fileWithMeta)
    this.forceUpdate()
    setTimeout(this.scrollToBottom, 500)
  }

  scrollToBottom = () => {
    this.dropzone.current.scrollTop = this.dropzone.current.scrollHeight
  }

  previewFile = (fileWithMeta) => {
    const { meta: { type } } = fileWithMeta
    if (!type.startsWith('image/')) return

    const reader = new FileReader()
    reader.readAsDataURL(fileWithMeta.file)
    reader.onloadend = () => {
      fileWithMeta.meta.previewUrl = reader.result
      this.forceUpdate()
    }
  }

  uploadFile = async (fileWithMeta) => {
    const { file, meta: { name } } = fileWithMeta
    const { data } = await service.getUploadUrl(name)
    if (!data) {
      fileWithMeta.meta.status = 'error_upload_url'
      this.forceUpdate()
      return
    }

    const { fields, url, full_url: fullUrl } = data
    fileWithMeta.meta.url = fullUrl

    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    // update progress (can be used to show progress indicator)
    xhr.upload.addEventListener('progress', (e) => {
      fileWithMeta.meta.percent = (e.loaded * 100.0 / e.total) || 100
      this.forceUpdate()
    })

    xhr.addEventListener('readystatechange', (e) => {
      if (xhr.readyState !== 4) return // `readyState` of 4 corresponds to `XMLHttpRequest.DONE`
      if (xhr.status === 0) {
        fileWithMeta.meta.status = 'aborted'
        this.forceUpdate()
      } else if (xhr.status < 400) {
        fileWithMeta.meta.percent = 100
        fileWithMeta.meta.status = 'done'
        this.forceUpdate()
      } else {
        fileWithMeta.meta.status = 'error_upload'
        this.forceUpdate()
      }
    })

    for (const field of Object.keys(fields)) {
      formData.append(field, fields[field])
    }
    formData.append('file', file)
    xhr.send(formData)
    fileWithMeta.xhr = xhr
  }

  handleSubmit = () => {
    this.props.onSubmit(
      this._files.map(f => f.meta).filter(f => f.status === 'done')
    )
  }

  handleCancel = (_id) => {
    const index = this._files.findIndex(f => f.meta.id === _id)
    if (index !== -1) this._files[index].xhr.abort()
  }

  handleRemove = (_id) => {
    const index = this._files.findIndex(f => f.meta.id === _id)
    if (index !== -1) {
      this._files.splice(index, 1)
      this.forceUpdate()
    }
  }

  render() {
    const { disabled = false, instructions, subInstructions, maxFiles, allowedTypeString } = this.props
    const { active } = this.state

    const chooseFiles = (add = false) => {
      return (
        <React.Fragment>
          <label
            htmlFor="fileUploaderInputId"
            className={Styles.inputLabel}
          >
            {add ? 'Agregar' : 'Escoger archivos'}
          </label>
          <input
            id="fileUploaderInputId"
            className={Styles.input}
            type="file"
            multiple
            accept={allowedTypeString || '*'}
            onChange={e => this.handleFiles(Array.from(e.target.files))}
          />
        </React.Fragment>
      )
    }

    const files = this._files.map((f) => {
      return (
        <FileUploadPreview
          key={f.meta.id}
          {...f.meta}
          onCancel={() => this.handleCancel(f.meta.id)}
          onRemove={() => this.handleRemove(f.meta.id)}
        />
      )
    })

    return (
      <React.Fragment>
        <div
          className={`${Styles.dropzone} ${active ? Styles.active : Styles.inactive}`}
          onDragEnter={this.handleDragEnter}
          onDragOver={this.handleDragOver}
          onDragLeave={this.handleDragLeave}
          onDrop={this.handleDrop}
          ref={this.dropzone}
        >
          {this._files.length === 0 &&
            <div className={Styles.dropzoneInstructions}>
              <span className={Styles.largeText}>
                {instructions || `Arrastra hasta ${maxFiles} archivo${maxFiles === 1 ? '' : 's'}`}
              </span>
              {subInstructions && <span className={Styles.smallText}>{subInstructions}</span>}
              <span className={Styles.smallText}>- o puedes -</span>
              {chooseFiles(false)}
            </div>
          }

          {this._files.length > 0 &&
            <div className={Styles.previewListContainer}>
              {files}
              {this._files.length > 0 && this._files.length < maxFiles &&
                <div className={Styles.addFiles}>{chooseFiles(true)}</div>
              }
            </div>
          }
        </div>

        {this._files.length > 0 &&
          <div className={Styles.buttonContainer}>
            <RaisedButton
              backgroundColor="#3DC59F"
              labelColor="#ffffff"
              className={FormStyles.primaryButton}
              label="SUBIR"
              onClick={this.handleSubmit}
              disabled={disabled
                || this._files.some(f => f.meta.status === 'uploading')
                || !this._files.some(f => f.meta.status === 'done')
              }
            />
          </div>
        }
      </React.Fragment>
    )
  }
}

FileUploader.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  instructions: PropTypes.string,
  subInstructions: PropTypes.string,
  maxSizeBytes: PropTypes.number.isRequired,
  maxFiles: PropTypes.number.isRequired,
  allowedTypePrefixes: PropTypes.arrayOf(PropTypes.string),
  allowedTypeString: PropTypes.string, // for input element when choosing files instead of dragging
}

export default FileUploader
