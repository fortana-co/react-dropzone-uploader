import React from 'react'
import PropTypes from 'prop-types'

import './FileUploader.css'

const SubmitButton = ({ onSubmit, disabled, submitButtonClassName }) => {
  return (
    <div className={submitButtonClassName || 'uploader-buttonContainer'}>
      <button onClick={onSubmit} disabled={disabled}>UPLOAD</button>
    </div>
  )
}

SubmitButton.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  submitButtonClassName: PropTypes.string,
}

export default SubmitButton
