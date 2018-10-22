import React from 'react'
import PropTypes from 'prop-types'

import './FileUploader.css'

const DropzoneContent = ({ className, accept, maxFiles, handleFiles, files }) => {
  const chooseFileInput = (text) => {
    return (
      <React.Fragment>
        <label
          htmlFor="fileUploaderInputId"
          className="uploader-inputLabel"
        >
          {text}
        </label>
        <input
          id="fileUploaderInputId"
          className="uploader-input"
          type="file"
          multiple
          accept={accept}
          onChange={e => handleFiles(Array.from(e.target.files))}
        />
      </React.Fragment>
    )
  }

  if (files.length === 0) {
    return (
      <div className={className || 'uploader-dropzoneInstructions'}>
        <span className="uploader-largeText">
          {maxFiles === 1 ? 'Drag a File' : 'Drag Files'}
        </span>

        <span className="uploader-smallText">- or you can -</span>

        {chooseFileInput(maxFiles === 1 ? 'Choose a File' : 'Choose Files')}
      </div>
    )
  }

  return (
    <div className={className || 'uploader-previewListContainer'}>
      {files}
      {files.length < maxFiles &&
        <div className="uploader-addFiles">{chooseFileInput('Add')}</div>
      }
    </div>
  )
}

DropzoneContent.propTypes = {
  className: PropTypes.string,
  accept: PropTypes.string.isRequired,
  maxFiles: PropTypes.number.isRequired,
  handleFiles: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default DropzoneContent
