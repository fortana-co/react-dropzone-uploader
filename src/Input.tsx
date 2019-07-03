import React from 'react'
import { IInputProps } from './types'

const Input = (props: IInputProps) => {
  const {
    className,
    labelClassName,
    labelWithFilesClassName,
    style,
    labelStyle,
    labelWithFilesStyle,
    getFilesFromEvent,
    accept,
    multiple,
    disabled,
    content,
    withFilesContent,
    onFiles,
    files,
  } = props

  return (
    <label
      className={files.length > 0 ? labelWithFilesClassName : labelClassName}
      style={files.length > 0 ? labelWithFilesStyle : labelStyle}
    >
      {files.length > 0 ? withFilesContent : content}
      <input
        className={className}
        style={style}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={async e => {
          const target = e.target
          const chosenFiles = await getFilesFromEvent(e)
          onFiles(chosenFiles)
          target.value = null
        }}
      />
    </label>
  )
}

export default Input
