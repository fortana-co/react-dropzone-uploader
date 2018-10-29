import React from 'react'
import PropTypes from 'prop-types'

import './styles.css'

const DropzoneContent = (props) => {
  const {
    className,
    withFilesClassName,
    fileInput,
    filePreviews,
    submitButton,
    extra: { maxFiles },
  } = props

  if (filePreviews.length === 0) {
    return (
      <React.Fragment>
        <div className={className || 'dzu-content'}>
          <span className="dzu-largeText">Drag Files</span>

          <span className="dzu-smallText">- or -</span>

          {fileInput}
        </div>
        {submitButton}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <div className={withFilesClassName || 'dzu-contentWithFiles'}>
        {filePreviews}

        {filePreviews.length < maxFiles && fileInput}
      </div>
      {submitButton}
    </React.Fragment>
  )
}

DropzoneContent.propTypes = {
  className: PropTypes.string,
  withFilesClassName: PropTypes.string,
  fileInput: PropTypes.any.isRequired,
  filePreviews: PropTypes.arrayOf(PropTypes.any).isRequired,
  submitButton: PropTypes.any.isRequired,
  extra: PropTypes.object.isRequired,
}

export default DropzoneContent
