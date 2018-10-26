import React from 'react'
import PropTypes from 'prop-types'

import './FileUploader.css'

const SubmitButton = ({ onSubmit, files, className }) => {
  if (!onSubmit) return null

  const disabled =
    files.some(f => f.meta.status === 'uploading' || f.meta.status === 'preparing') ||
    !files.some(f => ['headers_received', 'done'].includes(f.meta.status))

  const handleSubmit = () => {
    onSubmit(files.filter(f => ['headers_received', 'done'].includes(f.meta.status)))
  }

  return (
    <div className={className || 'uploader-buttonContainer'}>
      <button onClick={handleSubmit} disabled={disabled}>UPLOAD</button>
    </div>
  )
}

SubmitButton.propTypes = {
  className: PropTypes.string,
  onSubmit: PropTypes.func,
  files: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default SubmitButton
