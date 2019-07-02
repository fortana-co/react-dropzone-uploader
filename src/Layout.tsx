import React from 'react'
import { ILayoutProps } from './types'

const Layout = (props: ILayoutProps) => {
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

export default Layout
