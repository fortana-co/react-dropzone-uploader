import * as React from 'react'

export type StatusValue =
  | 'rejected_file_type'
  | 'rejected_max_files'
  | 'preparing'
  | 'error_file_size'
  | 'error_validation'
  | 'ready'
  | 'started'
  | 'getting_upload_params'
  | 'error_upload_params'
  | 'uploading'
  | 'exception_upload'
  | 'aborted'
  | 'restarted'
  | 'removed'
  | 'error_upload'
  | 'headers_received'
  | 'done'

export type MethodValue =
  | 'delete'
  | 'get'
  | 'head'
  | 'options'
  | 'patch'
  | 'post'
  | 'put'
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PUT'

export interface IMeta {
  id: string
  status: StatusValue
  type: string // MIME type, example: `image/*`
  name: string
  uploadedDate: string // ISO string
  percent: string
  size: number // bytes
  lastModifiedDate: string // ISO string
  previewUrl?: string // from URL.createObjectURL
  duration?: number // seconds
  width?: number
  height?: number
  videoWidth?: number
  videoHeight?: number
  validationError?: any
}

export interface IFileWithMeta {
  file: File
  meta: IMeta
  cancel: () => void
  restart: () => void
  remove: () => void
  xhr?: XMLHttpRequest
}

export interface IDraggedFile {
  name?: string
  type?: string
}

export interface IExtra {
  active: boolean
  reject: boolean
  dragged: IDraggedFile[]
  accept: string
  multiple: boolean
  minSizeBytes: number
  maxSizeBytes: number
  maxFiles: number
}

interface IUploadParams {
  url: string
  method?: MethodValue
  body?: string | FormData | ArrayBuffer | Blob | File | URLSearchParams
  fields?: { [name: string]: string | Blob }
  headers?: { [name: string]: string }
  meta?: { [name: string]: any }
}

export type CustomizationFunction<T> = (allFiles: IFileWithMeta[], extra: IExtra) => T

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

interface ICommonProps {
  allFiles: IFileWithMeta[]
  extra: IExtra
  [others: string]: any // fix this
}

export interface IDropzoneProps {
  onChangeStatus?(file: IFileWithMeta, status: StatusValue, allFiles: IFileWithMeta[]): { meta: { [name: string]: any } } | undefined
  getUploadParams?(file: IFileWithMeta): IUploadParams | Promise<IUploadParams>
  onSubmit?(successFiles: IFileWithMeta[], allFiles: IFileWithMeta[]): void

  accept?: string
  multiple?: boolean
  minSizeBytes?: number
  maxSizeBytes?: number
  maxFiles?: number

  validate?(file: IFileWithMeta): any // usually a string, but can be anything

  autoUpload?: boolean
  timeout?: number

  /* component customization */
  disabled?: boolean | CustomizationFunction<boolean>

  canCancel?: boolean | CustomizationFunction<boolean>
  canRemove?: boolean | CustomizationFunction<boolean>
  canRestart?: boolean | CustomizationFunction<boolean>

  inputContent?: React.ReactNode | CustomizationFunction<React.ReactNode>
  inputWithFilesContent?: React.ReactNode | CustomizationFunction<React.ReactNode>

  submitButtonDisabled?: boolean | CustomizationFunction<boolean>
  submitButtonContent?: React.ReactNode | CustomizationFunction<React.ReactNode>

  classNames?: StyleCustomizationObject<string>
  styles?: StyleCustomizationObject<React.CSSProperties>
  addClassNames?: StyleCustomizationObject<string>

  /* component injection */
  InputComponent?(props: ICommonProps): React.ReactNode
  PreviewComponent?(props: ICommonProps): React.ReactNode
  SubmitButtonComponent?(props: ICommonProps): React.ReactNode
  LayoutComponent?(props: ICommonProps): React.ReactNode
}

export default class Dropzone extends React.Component<IDropzoneProps> {}

export class Layout extends React.Component<ICommonProps> {}
export class Input extends React.Component<ICommonProps> {}
export class Preview extends React.Component<ICommonProps> {}
export class SubmitButton extends React.Component<ICommonProps> {}

export function formatBytes(bytes: number): string
export function formatDuration(seconds: number): string
export function accepts(file: IDraggedFile, accept?: string): boolean

export const defaultClassNames: { [name: string]: string }
