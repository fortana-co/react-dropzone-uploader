import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'

import { formatBytes } from 'tools/string'
import Styles from './FileUploader.css'


const FileUploadPreview = ({ name = '', percent = 0, size = 0, previewUrl, type, status, onCancel, onRemove }) => {
  const title = `${name || '?'}, ${formatBytes(size)}`

  if (status === 'error_file_size') {
    let tooBig = <span>Archivo demasiado grande...</span>
    if (type.startsWith('image/')) tooBig = <span>Imagen demasiado grande...</span>
    if (type.startsWith('video/')) {
      tooBig = (
        <div>
          <span>Vídeo demasiado grande...</span>
          <a className={Styles.link} href="https://www.youtube.com/watch?v=8CHw-1ZS8o8" target="_blank" rel="noopener noreferrer">Instrucciones para comprimirlo</a>
        </div>
      )
    }

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

export default pure(FileUploadPreview)
