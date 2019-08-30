import React from 'react'
import PropTypes from 'prop-types'

import { ISubmitButtonProps } from './Dropzone'

const SubmitButton = (props: ISubmitButtonProps) => {
  const { className, buttonClassName, style, buttonStyle, disabled, content, onSubmit, files } = props

  const _disabled =
    files.some(f => ['preparing', 'getting_upload_params', 'uploading'].includes(f.meta.status)) ||
    !files.some(f => ['headers_received', 'done'].includes(f.meta.status))

  const handleSubmit = () => {
    onSubmit(files.filter(f => ['headers_received', 'done'].includes(f.meta.status)))
  }

  return (
    <div className={className} style={style}>
      <button className={buttonClassName} style={buttonStyle} onClick={handleSubmit} disabled={disabled || _disabled}>
        {content}
      </button>
    </div>
  )
}

SubmitButton.propTypes = {
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  style: PropTypes.object,
  buttonStyle: PropTypes.object,
  disabled: PropTypes.bool.isRequired,
  content: PropTypes.node,
  onSubmit: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  extra: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    reject: PropTypes.bool.isRequired,
    dragged: PropTypes.arrayOf(PropTypes.any).isRequired,
    accept: PropTypes.string.isRequired,
    multiple: PropTypes.bool.isRequired,
    minSizeBytes: PropTypes.number.isRequired,
    maxSizeBytes: PropTypes.number.isRequired,
    maxFiles: PropTypes.number.isRequired,
  }).isRequired,
}

export default SubmitButton
