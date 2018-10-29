import React from 'react'
import PropTypes from 'prop-types'

import './styles.css'

const DropzoneContent = (props) => {
  const {
    className,
    withFilesClassName,
    inputClassName,
    filePreviews,
    extra: { accept, maxFiles, handleFiles },
  } = props

  const chooseFileInput = (text) => {
    return (
      <React.Fragment>
        <label
          htmlFor="dropzoneInputId"
          className={inputClassName || 'dzu-inputLabel'}
        >
          {text}
        </label>
        <input
          id="dropzoneInputId"
          className="dzu-input"
          type="file"
          multiple
          accept={accept}
          onChange={e => handleFiles(Array.from(e.target.files))}
        />
      </React.Fragment>
    )
  }

  if (filePreviews.length === 0) {
    return (
      <div className={className || 'dzu-content'}>
        <span className="dzu-largeText">Drag Files</span>

        <span className="dzu-smallText">- or -</span>

        {chooseFileInput('Choose Files')}
      </div>
    )
  }

  return (
    <div className={withFilesClassName || 'dzu-contentWithFiles'}>
      {filePreviews}

      {filePreviews.length < maxFiles && chooseFileInput('Add')}
    </div>
  )
}

DropzoneContent.propTypes = {
  className: PropTypes.string,
  withFilesClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  filePreviews: PropTypes.arrayOf(PropTypes.any).isRequired,
  extra: PropTypes.object.isRequired,
}

export default DropzoneContent
