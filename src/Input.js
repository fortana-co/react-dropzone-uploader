import React from 'react'
import PropTypes from 'prop-types'

const Input = (props) => {
  const {
    className,
    labelClassName,
    labelWithFilesClassName,
    style,
    labelStyle,
    labelWithFilesStyle,
    accept,
    multiple,
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
        multiple={multiple}
        accept={accept}
        onChange={e => onFiles(Array.from(e.target.files))}
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
  accept: PropTypes.string.isRequired,
  multiple: PropTypes.bool.isRequired,
  content: PropTypes.node,
  withFilesContent: PropTypes.node,
  onFiles: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(PropTypes.any).isRequired,
  extra: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    accept: PropTypes.string.isRequired,
    multiple: PropTypes.bool.isRequired,
    minSizeBytes: PropTypes.number.isRequired,
    maxSizeBytes: PropTypes.number.isRequired,
    maxFiles: PropTypes.number.isRequired,
  }).isRequired,
}

export default Input
