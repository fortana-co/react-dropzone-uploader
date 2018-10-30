import React from 'react'
import PropTypes from 'prop-types'

import './styles.css'

const FileInput = (props) => {
  const { accept, className, style, text = 'Choose Files', withFilesText = 'Add', onFiles, files } = props
  return (
    <React.Fragment>
      <label
        htmlFor="dropzoneInputId"
        className={className}
        style={style}
      >
        {files.length > 0 ? withFilesText : text}
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

FileInput.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  accept: PropTypes.string.isRequired,
  text: PropTypes.string,
  withFilesText: PropTypes.string,
  onFiles: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default FileInput
