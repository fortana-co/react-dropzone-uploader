import React from 'react'
import PropTypes from 'prop-types'

import { IInputProps } from './Dropzone'

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
          //@ts-ignore
          target.value = null
        }}
      />
    </label>
  )
}

Input.propTypes = {
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  labelWithFilesClassName: PropTypes.string,
  style: PropTypes.object,
  labelStyle: PropTypes.object,
  labelWithFilesStyle: PropTypes.object,
  getFilesFromEvent: PropTypes.func.isRequired,
  accept: PropTypes.string.isRequired,
  multiple: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  content: PropTypes.node,
  withFilesContent: PropTypes.node,
  onFiles: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(PropTypes.any).isRequired,
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

export default Input
