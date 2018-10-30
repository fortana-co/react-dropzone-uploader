import React from 'react'
import PropTypes from 'prop-types'

import { formatBytes, formatDuration } from './utils'
import './styles.css'

class FilePreview extends React.PureComponent {
  render() {
    const {
      meta: { name = '', percent = 0, size = 0, previewUrl, status, duration },
      isUpload,
      onCancel,
      onRemove,
      onRestart,
      canCancel,
      canRemove,
      canRestart,
      extra: { minSizeBytes },
    } = this.props

    let title = `${name || '?'}, ${formatBytes(size)}`
    if (duration) title = `${title}, ${formatDuration(duration)}`

    if (status === 'error_file_size') {
      return (
        <div className="dzu-previewContainer">
          <span>{title}</span>
          <span>{size < minSizeBytes ? 'File too small' : 'File too big'}</span>
          {onRemove && <span className="dzu-abortButton" onClick={onRemove} />}
        </div>
      )
    }

    if (status === 'error_upload_params' || status === 'error_upload') title = `${title} (upload failed)`
    if (status === 'aborted') title = `${title} (cancelled)`

    return (
      <div className="dzu-previewContainer">
        {previewUrl && <img className="dzu-previewImage" src={previewUrl} alt={title} title={title} />}
        {!previewUrl && <span>{title}</span>}

        <div className="dzu-previewStatusContainer">
          {isUpload &&
            <progress max={100} value={status === 'done' || status === 'headers_received' ? 100 : percent} />
          }
          {status === 'uploading' && canCancel && <span className="dzu-abortButton" onClick={onCancel} />}
          {status !== 'uploading' && status !== 'preparing' &&
            canRemove && <span className="dzu-abortButton" onClick={onRemove} />}
          {(status === 'error_upload_params' || status === 'error_upload' || status === 'aborted') &&
            canRestart && <span className="dzu-restartButton" onClick={onRestart} />}
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
  onCancel: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onRestart: PropTypes.func.isRequired,
  canCancel: PropTypes.bool.isRequired,
  canRemove: PropTypes.bool.isRequired,
  canRestart: PropTypes.bool.isRequired,
  extra: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    accept: PropTypes.string.isRequired,
    minSizeBytes: PropTypes.number.isRequired,
    maxSizeBytes: PropTypes.number.isRequired,
    maxFiles: PropTypes.number.isRequired,
  }).isRequired,
}

export default FilePreview
