import React from 'react'
import PropTypes from 'prop-types'

import './styles.css'

const DropzoneContent = (props) => {
  const {
    className = 'dzu-content',
    withFilesClassName = 'dzu-contentWithFiles',
    instructions,
    withFilesInstructions,
    fileInput,
    filePreviews,
    submitButton,
    extra: { maxFiles },
  } = props

  if (filePreviews.length === 0) {
    return (
      <React.Fragment>
        <div className={className}>
          {instructions === undefined ?
            <React.Fragment>
              <span className="dzu-largeText">Drop Files</span>
              <span className="dzu-smallText">- or -</span>
            </React.Fragment> : instructions
          }

          {fileInput}
        </div>
        {submitButton}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <div className={withFilesClassName}>
        {withFilesInstructions === undefined ? null : withFilesInstructions}

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
  instructions: PropTypes.any,
  withFilesInstructions: PropTypes.any,
  fileInput: PropTypes.any,
  filePreviews: PropTypes.arrayOf(PropTypes.any),
  submitButton: PropTypes.any,
  extra: PropTypes.object.isRequired,
}

export default DropzoneContent
