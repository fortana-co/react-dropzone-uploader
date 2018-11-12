export const formatBytes = (b) => {
  const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let l = 0
  let n = b

  while (n >= 1024) {
    n /= 1024
    l += 1
  }

  return `${n.toFixed(n >= 10 || l < 1 ? 0 : 1)}${units[l]}`
}

export const formatDuration = (seconds) => {
  const date = new Date(null)
  date.setSeconds(seconds)
  const dateString = date.toISOString().slice(11, 19)
  if (seconds < 3600) return dateString.slice(3)
  return dateString
}

// adapted from: https://github.com/okonet/attr-accept/blob/master/src/index.js
export const accepts = (file, accept) => {
  if (!file || !accept || accept === '*') return true

  const fileName = file.name || ''
  const mimeType = file.type || ''
  const baseMimeType = mimeType.replace(/\/.*$/, '')

  return accept.split(',').map(t => t.trim()).some((type) => {
    if (type.charAt(0) === '.') {
      return fileName.toLowerCase().endsWith(type.toLowerCase())
    } else if (type.endsWith('/*')) {
      // this is something like an image/* mime type
      return baseMimeType === type.replace(/\/.*$/, '')
    }
    return mimeType === type
  })
}

export const defaultClassNames = {
  dropzone: 'dzu-dropzone',
  dropzoneActive: 'dzu-dropzoneActive',
  input: 'dzu-inputLabel',
  preview: 'dzu-previewContainer',
  previewImage: 'dzu-previewImage',
  submitButtonContainer: 'dzu-submitButtonContainer',
  submitButton: 'dzu-submitButton',
}

export const mergeStyles = (classNames, styles, addClassNames) => {
  const mergedClassNames = { ...defaultClassNames, ...classNames }
  for (const key of Object.keys(addClassNames)) {
    mergedClassNames[key] = `${mergedClassNames[key]} ${addClassNames[key]}`
  }

  return { classNames: mergedClassNames, styles }
}
