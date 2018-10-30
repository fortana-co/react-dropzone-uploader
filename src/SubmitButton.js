import React from 'react'
import PropTypes from 'prop-types'

import './styles.css'

const SubmitButton = (props) => {
  const { onSubmit, files, className, buttonClassName, style, buttonStyle, text = 'Submit', disabled } = props

  if (!onSubmit || files.length === 0) return null

  const _disabled =
    files.some(f => f.meta.status === 'uploading' || f.meta.status === 'preparing') ||
    !files.some(f => ['headers_received', 'done'].includes(f.meta.status))

  const handleSubmit = () => {
    onSubmit(files.filter(f => ['headers_received', 'done'].includes(f.meta.status)))
  }

  return (
    <div className={className} style={style}>
      <button
        className={buttonClassName}
        style={buttonStyle}
        onClick={handleSubmit}
        disabled={disabled || _disabled}
      >
        {text}
      </button>
    </div>
  )
}

SubmitButton.propTypes = {
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  style: PropTypes.string,
  buttonStyle: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  text: PropTypes.string,
  onSubmit: PropTypes.func,
  files: PropTypes.arrayOf(PropTypes.any).isRequired,
  extra: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    accept: PropTypes.string.isRequired,
    minSizeBytes: PropTypes.number.isRequired,
    maxSizeBytes: PropTypes.number.isRequired,
    maxFiles: PropTypes.number.isRequired,
  }).isRequired,
}

export default SubmitButton
