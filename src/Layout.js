import React from 'react'
import PropTypes from 'prop-types'

const Layout = (props) => {
  const {
    input,
    previews,
    submitButton,
    dropzoneProps,
    files,
    extra: { maxFiles },
  } = props

  return (
    <div {...dropzoneProps}>
      {previews}

      {files.length < maxFiles && input}

      {files.length > 0 && submitButton}
    </div>
  )
}

Layout.propTypes = {
  input: PropTypes.node,
  previews: PropTypes.arrayOf(PropTypes.node),
  submitButton: PropTypes.node,
  dropzoneProps: PropTypes.shape({
    ref: PropTypes.any.isRequired,
    className: PropTypes.string.isRequired,
    style: PropTypes.object,
    onDragEnter: PropTypes.func.isRequired,
    onDragOver: PropTypes.func.isRequired,
    onDragLeave: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
  }).isRequired,
  files: PropTypes.arrayOf(PropTypes.any).isRequired,
  extra: PropTypes.object.isRequired,
}

export default Layout
