import React from 'react'
import PropTypes from 'prop-types'

import { formatBytes } from './string'
import Styles from './FileUploader.css'

class FileUploadPreview extends React.PureComponent {
  render() {
    const { name = '', percent = 0, size = 0, previewUrl, type, status, onCancel, onRemove } = this.props
    const title = `${name || '?'}, ${formatBytes(size)}`

    if (status === 'error_file_size') {
      let tooBig = <span>File exceeds size limit...</span>
      if (type.startsWith('image/')) tooBig = <span>Image exceeds size limit...</span>
      if (type.startsWith('video/')) tooBig = <div><span>Video exceeds size limit...</span></div>

      return (
        <div className={Styles.previewContainer}>
          <span>{title}</span>
          {tooBig}
          {onRemove && <span className={Styles.abortButton} onClick={onRemove} />}
        </div>
      )
    }

    return (
      <div className={Styles.previewContainer}>
        {previewUrl && <img className={Styles.preview} src={previewUrl} alt={title} title={title} />}
        {!previewUrl && <span>{title}</span>}

        <div className={Styles.statusContainer}>
          <progress max={100} value={status === 'done' ? 100 : percent} />
          {status === 'uploading' && onCancel && <span className={Styles.abortButton} onClick={onCancel} />}
          {status !== 'uploading' && onRemove && <span className={Styles.abortButton} onClick={onRemove} />}
        </div>
      </div>
    )
  }
}

FileUploadPreview.propTypes = {
  name: PropTypes.string,
  percent: PropTypes.number,
  size: PropTypes.number,
  previewUrl: PropTypes.string,
  type: PropTypes.string.isRequired,
  status: PropTypes.oneOf(
    ['uploading', 'error_file_size', 'error_upload_url', 'aborted', 'done', 'error_upload']
  ).isRequired,
  onCancel: PropTypes.func,
  onRemove: PropTypes.func,
}

export default FileUploadPreview
