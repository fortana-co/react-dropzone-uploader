import React from 'react'
import PropTypes from 'prop-types'

import './styles.css'

const SubmitButton = ({ onSubmit, files, className, buttonClassName, text = 'Submit' }) => {
  if (!onSubmit || files.length === 0) return null

  const disabled =
    files.some(f => f.meta.status === 'uploading' || f.meta.status === 'preparing') ||
    !files.some(f => ['headers_received', 'done'].includes(f.meta.status))

  const handleSubmit = () => {
    onSubmit(files.filter(f => ['headers_received', 'done'].includes(f.meta.status)))
  }

  return (
    <div className={className || 'dzu-submitButtonContainer'}>
      <button
        className={buttonClassName || 'dzu-submitButton'}
        onClick={handleSubmit}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  )
}

SubmitButton.propTypes = {
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  text: PropTypes.string,
  onSubmit: PropTypes.func,
  files: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default SubmitButton
