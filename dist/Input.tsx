import React from 'react'
import PropTypes from 'prop-types'

import { IInputProps } from './Dropzone'

const Input = (props: IInputProps) => {
  const {
    className,
    // labelClassName,
    // labelWithFilesClassName,
    style,
    labelStyle,
    labelWithFilesStyle,
    getFilesFromEvent,
    accept,
    multiple,
    disabled,
    content,
    withFilesContent,
    onFiles,
    files,
  } = props

  return (
    <div className='relative block w-full w-100 flex flex-block items-center justify-center'>
    <label
      // className={files.length > 0 ? labelWithFilesClassName : labelClassName}
      className={files.length > 0 ? "inline-flex items-center px-3 py-0.5 rounded-full bg-green-50 text-sm font-medium text-green-700 hover:bg-green-100" : "'relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"}
      style={files.length > 0 ? labelWithFilesStyle : labelStyle}
    >
      {files.length > 0 ? withFilesContent : content}
      <input
        className={className}
        style={style}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={async e => {
          const target = e.target
          const chosenFiles = await getFilesFromEvent(e)
          onFiles(chosenFiles)
          //@ts-ignore
          target.value = null
        }}
      />
    </label>
    </div>
  )
}

Input.propTypes = {
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  labelWithFilesClassName: PropTypes.string,
  style: PropTypes.object,
  labelStyle: PropTypes.object,
  labelWithFilesStyle: PropTypes.object,
  getFilesFromEvent: PropTypes.func.isRequired,
  accept: PropTypes.string.isRequired,
  multiple: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  content: PropTypes.node,
  withFilesContent: PropTypes.node,
  onFiles: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(PropTypes.any).isRequired,
  extra: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    reject: PropTypes.bool.isRequired,
    dragged: PropTypes.arrayOf(PropTypes.any).isRequired,
    accept: PropTypes.string.isRequired,
    multiple: PropTypes.bool.isRequired,
    minSizeBytes: PropTypes.number.isRequired,
    maxSizeBytes: PropTypes.number.isRequired,
    maxFiles: PropTypes.number.isRequired,
  }).isRequired,
}

export default Input
