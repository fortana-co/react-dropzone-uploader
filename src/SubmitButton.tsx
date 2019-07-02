import React from 'react'
import { ISubmitButtonProps } from './types'

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

export default SubmitButton
