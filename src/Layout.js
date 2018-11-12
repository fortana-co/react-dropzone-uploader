import React from 'react'
import PropTypes from 'prop-types'

const Layout = (props) => {
  const {
    content,
    withFilesContent,
    input,
    previews,
    submitButton,
    extra: { maxFiles },
  } = props

  return (
    <React.Fragment>
      {previews.length === 0 && content === undefined ? null : content}
      {previews.length > 0 && withFilesContent === undefined ? null : withFilesContent}

      {previews.length > 0 && previews}

      {previews.length < maxFiles && input}

      {submitButton}
    </React.Fragment>
  )
}

Layout.propTypes = {
  content: PropTypes.node,
  withFilesContent: PropTypes.node,
  input: PropTypes.node,
  previews: PropTypes.arrayOf(PropTypes.node).isRequired,
  submitButton: PropTypes.node,
  extra: PropTypes.object.isRequired,
}

export default Layout
