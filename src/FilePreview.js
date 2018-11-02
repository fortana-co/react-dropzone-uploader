import React from 'react'
import PropTypes from 'prop-types'

import { formatBytes, formatDuration } from './utils'
import './styles.css'

class FilePreview extends React.PureComponent {
  render() {
    const {
      fileWithMeta: { cancel, remove, restart },
      meta: { name = '', percent = 0, size = 0, previewUrl, status, duration, validationError },
      isUpload,
      canCancel,
      canRemove,
      canRestart,
      extra: { minSizeBytes },
    } = this.props

    let title = `${name || '?'}, ${formatBytes(size)}`
    if (duration) title = `${title}, ${formatDuration(duration)}`

    if (status === 'error_file_size' || status === 'error_validation') {
      return (
        <div className="dzu-previewContainer">
          <span>{title}</span>
          {status === 'error_file_size' && <span>{size < minSizeBytes ? 'File too small' : 'File too big'}</span>}
          {status === 'error_validation' && <span>{String(validationError)}</span>}
          {canRemove && <span className="dzu-abortButton" onClick={remove} />}
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
          {status === 'uploading' && canCancel && <span className="dzu-abortButton" onClick={cancel} />}
          {status !== 'uploading' && status !== 'preparing' &&
            canRemove && <span className="dzu-abortButton" onClick={remove} />}
          {['error_upload_params', 'error_upload', 'aborted', 'ready'].includes(status) &&
            canRestart && <span className="dzu-restartButton" onClick={restart} />}
        </div>
      </div>
    )
  }
}

FilePreview.propTypes = {
  fileWithMeta: PropTypes.shape({
    file: PropTypes.any.isRequired,
    meta: PropTypes.object.isRequired,
    cancel: PropTypes.func.isRequired,
    restart: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    xhr: PropTypes.any,
  }).isRequired,
  meta: PropTypes.shape({ // copy of fileWithMeta.meta, won't be mutated
    status: PropTypes.oneOf([
      'preparing',
      'error_file_size',
      'error_validation',
      'ready',
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
    validationError: PropTypes.any,
  }).isRequired,
  isUpload: PropTypes.bool.isRequired,
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
