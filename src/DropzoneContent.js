import React from 'react'
import PropTypes from 'prop-types'

const DropzoneContent = (props) => {
  const {
    instructions,
    withFilesInstructions,
    fileInput,
    filePreviews,
    submitButton,
    extra: { maxFiles },
  } = props

  return (
    <React.Fragment>
      {filePreviews.length === 0 && instructions === undefined ? null : instructions}
      {filePreviews.length > 0 && withFilesInstructions === undefined ? null : withFilesInstructions}

      {filePreviews.length > 0 && filePreviews}

      {filePreviews.length < maxFiles && fileInput}

      {submitButton}
    </React.Fragment>
  )
}

DropzoneContent.propTypes = {
  instructions: PropTypes.node,
  withFilesInstructions: PropTypes.node,
  fileInput: PropTypes.node,
  filePreviews: PropTypes.arrayOf(PropTypes.node).isRequired,
  submitButton: PropTypes.node,
  extra: PropTypes.object.isRequired,
}

export default DropzoneContent
