import React from 'react'
import PropTypes from 'prop-types'

import './FileUploader.css'

const SubmitButton = ({ onSubmit, disabled, className }) => {
  return (
    <div className={className || 'uploader-buttonContainer'}>
      <button onClick={onSubmit} disabled={disabled}>UPLOAD</button>
    </div>
  )
}

SubmitButton.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
}

export default SubmitButton
