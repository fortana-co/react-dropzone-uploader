import React from 'react'
import PropTypes from 'prop-types'

const Input = (props) => {
  const { className, style, accept, content = 'Drop Or Pick Files', withFilesContent, onFiles, files } = props
  return (
    <React.Fragment>
      <label
        htmlFor="dropzoneInputId"
        className={className}
        style={style}
      >
        {files.length > 0 ? withFilesContent : content}
      </label>
      <input
        id="dropzoneInputId"
        className="dzu-input"
        type="file"
        multiple
        accept={accept}
        onChange={e => onFiles(Array.from(e.target.files))}
      />
    </React.Fragment>
  )
}

Input.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  accept: PropTypes.string.isRequired,
  content: PropTypes.node,
  withFilesContent: PropTypes.node,
  onFiles: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(PropTypes.any).isRequired,
  extra: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    accept: PropTypes.string.isRequired,
    minSizeBytes: PropTypes.number.isRequired,
    maxSizeBytes: PropTypes.number.isRequired,
    maxFiles: PropTypes.number.isRequired,
  }).isRequired,
}

export default Input
