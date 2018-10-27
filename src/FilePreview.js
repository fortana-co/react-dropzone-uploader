import React from 'react'
import PropTypes from 'prop-types'

import { formatBytes, formatDuration } from './string'
import './styles.css'

class FilePreview extends React.PureComponent {
  render() {
    const {
      meta: { name = '', percent = 0, size = 0, previewUrl, type, status, duration },
      isUpload,
      onCancel,
      onRemove,
      onRestart,
    } = this.props

    let title = `${name || '?'}, ${formatBytes(size)}`
    if (duration) title = `${title}, ${formatDuration(duration)}`

    if (status === 'error_file_size') {
      let tooBig = <span>File exceeds size limit...</span>
      if (type.startsWith('image/')) tooBig = <span>Image exceeds size limit...</span>
      if (type.startsWith('video/')) tooBig = <div><span>Video exceeds size limit...</span></div>

      return (
        <div className="dzu-previewContainer">
          <span>{title}</span>
          {tooBig}
          {onRemove && <span className="dzu-abortButton" onClick={onRemove} />}
        </div>
      )
    }

    if (status === 'error_upload_params' || status === 'error_upload') title = `${title} (upload failed)`
    if (status === 'aborted') title = `${title} (cancelled)`

    return (
      <div className="dzu-previewContainer">
        {previewUrl && <img className="dzu-preview" src={previewUrl} alt={title} title={title} />}
        {!previewUrl && <span>{title}</span>}

        <div className="dzu-statusContainer">
          {isUpload &&
            <progress max={100} value={status === 'done' || status === 'headers_received' ? 100 : percent} />
          }
          {status === 'uploading' && onCancel && <span className="dzu-abortButton" onClick={onCancel} />}
          {status !== 'uploading' && status !== 'preparing' &&
            onRemove && <span className="dzu-abortButton" onClick={onRemove} />}
          {(status === 'error_upload_params' || 'error_upload' || status === 'aborted') &&
            onRestart && <span className="dzu-restartButton" onClick={onRestart} />}
        </div>
      </div>
    )
  }
}

FilePreview.propTypes = {
  meta: PropTypes.shape({
    status: PropTypes.oneOf([
      'preparing',
      'error_file_size',
      'uploading',
      'error_upload_params',
      'aborted',
      'error_upload',
      'headers_received',
      'done',
    ]).isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string,
    uploadedDate: PropTypes.string.isRequired,
    percent: PropTypes.number,
    size: PropTypes.number,
    lastModifiedDate: PropTypes.string,
    previewUrl: PropTypes.string,
    duration: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    videoWidth: PropTypes.number,
    videoHeight: PropTypes.number,
  }).isRequired,
  isUpload: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onRemove: PropTypes.func,
  onRestart: PropTypes.func,
}

export default FilePreview
