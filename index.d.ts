import * as React from 'react'

export type Status = 'rejected_file_type' | 'rejected_max_files' | 'preparing' | 'error_file_size' | 'error_validation' | 'ready' | 'started' | 'getting_upload_params' | 'error_upload_params' | 'uploading' | 'exception_upload' | 'aborted' | 'restarted' | 'removed' | 'error_upload' | 'headers_received' | 'done'

export interface Meta {
  id: string
  status: Status,
  type: string
  name: string
  uploadedDate: string
  percent: string
  size: number
  lastModifiedDate: string
  previewUrl?: string
  duration?: number
  width?: number
  height?: number
  videoWidth?: number
  videoHeight?: number
}

export interface FileWithMeta {
  file: File
  meta: Meta
  cancel: () => void
  restart: () => void
  remove: () => void
  xhr?: XMLHttpRequest
}

export interface DraggedFile {
  name?: string
  type?: string
}

export interface Extra {
  active: boolean
  reject: boolean
  dragged: DraggedFile[]
  accept: string
  multiple: boolean
  minSizeBytes: number
  maxSizeBytes: number
  maxFiles: number
}

export type CustomizationFunction<T> = (files: FileWithMeta[], extra: Extra) => T

type StyleCustomizationObject<T> = {
  dropzone?: T | CustomizationFunction<T>
  dropzoneActive?: T | CustomizationFunction<T>
  dropzoneReject?: T | CustomizationFunction<T>
  dropzoneDisabled?: T | CustomizationFunction<T>
  input?: T | CustomizationFunction<T>
  inputLabel?: T | CustomizationFunction<T>
  inputLabelWithFiles?: T | CustomizationFunction<T>
  preview?: T | CustomizationFunction<T>
  previewImage?: T | CustomizationFunction<T>
  submitButtonContainer?: T | CustomizationFunction<T>
  submitButton?: T | CustomizationFunction<T>
}

export interface DropzoneProps {
  onChangeStatus?: (fileWithMeta: FileWithMeta, status: Status, files: FileWithMeta[]) => { meta: {} } | undefined
  getUploadParams?: (fileWithMeta: FileWithMeta) => { url: string, method?: 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT', body?: any, fields?: {}, headers?: {}, meta?: {} }
  onSubmit?: (files: FileWithMeta[], allFiles: FileWithMeta[]) => void

  accept?: string
  multiple?: boolean
  minSizeBytes?: number
  maxSizeBytes?: number
  maxFiles?: number

  validate: (file: FileWithMeta) => any

  autoUpload?: boolean
  timeout?: number

  /* component customization */
  disabled?: boolean | CustomizationFunction<boolean>

  canCancel: boolean | CustomizationFunction<boolean>
  canRemove: boolean | CustomizationFunction<boolean>
  canRestart: boolean | CustomizationFunction<boolean>

  inputContent: React.ReactNode | CustomizationFunction<React.ReactNode>
  inputWithFilesContent: React.ReactNode | CustomizationFunction<React.ReactNode>

  submitButtonDisabled: boolean | CustomizationFunction<boolean>
  submitButtonContent: React.ReactNode | CustomizationFunction<React.ReactNode>

  classNames?: StyleCustomizationObject<string>
  styles?: StyleCustomizationObject<{}>
  addClassNames: StyleCustomizationObject<string>

  /* component injection */
  InputComponent: () => React.ReactNode
  PreviewComponent: () => React.ReactNode
  SubmitButtonComponent: () => React.ReactNode
  LayoutComponent: () => React.ReactNode
}

declare const Dropzone: React.Component<DropzoneProps>

export default Dropzone
