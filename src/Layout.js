import React from 'react'
import PropTypes from 'prop-types'

const Layout = (props) => {
  const {
    input,
    previews,
    submitButton,
    dropzoneProps,
    extra: { maxFiles, onSubmit },
  } = props

  return (
    <div {...dropzoneProps}>
      {previews.length > 0 && previews}

      {previews.length < maxFiles && input}

      {previews.length > 0 && onSubmit && submitButton}
    </div>
  )
}

Layout.propTypes = {
  input: PropTypes.node,
  previews: PropTypes.arrayOf(PropTypes.node).isRequired,
  submitButton: PropTypes.node,
  dropzoneProps: PropTypes.shape({
    ref: PropTypes.any.isRequired,
    className: PropTypes.string.isRequired,
    style: PropTypes.object,
    onDragEnter: PropTypes.func.isRequired,
    onDragOver: PropTypes.func.isRequired,
    onDragLeave: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    xhr: PropTypes.any,
  }).isRequired,
  extra: PropTypes.object.isRequired,
}

export default Layout
