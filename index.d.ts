import React from 'react'

type Status = 'rejected_file_type' | 'rejected_max_files' | 'preparing' | 'error_file_size' | 'error_validation' | 'ready' | 'started' | 'getting_upload_params' | 'error_upload_params' | 'uploading' | 'exception_upload' | 'aborted' | 'restarted' | 'removed' | 'error_upload' | 'headers_received' | 'done'

type Method = 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT'

export interface Meta {
  id: string
  status: Status
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

export interface DropzoneProps {
  onChangeStatus?: (fileWithMeta: FileWithMeta, status: Status, files: FileWithMeta[]) => ?{ meta?: {} }
  getUploadParams?: (fileWithMeta: FileWithMeta) => { url: string, method?: Method, body?: any, fields?: {}, headers?: {}, meta?: {} }
  onSubmit: PropTypes.func;

  accept: PropTypes.string;
  multiple: PropTypes.bool;
  minSizeBytes: PropTypes.number.isRequired;
  maxSizeBytes: PropTypes.number.isRequired;
  maxFiles: PropTypes.number.isRequired;

  validate: PropTypes.func;

  autoUpload: PropTypes.bool;
  timeout: PropTypes.number;

  /* component customization */
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]);

  canCancel: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]);
  canRemove: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]);
  canRestart: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]);

  inputContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]);
  inputWithFilesContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]);

  submitButtonDisabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]);
  submitButtonContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]);

  classNames: PropTypes.object.isRequired;
  styles: PropTypes.object.isRequired;
  addClassNames: PropTypes.object.isRequired;

  /* component injection */
  InputComponent: PropTypes.func;
  PreviewComponent: PropTypes.func;
  SubmitButtonComponent: PropTypes.func;
  LayoutComponent: PropTypes.func;
}

declare const Dropzone: React.SFC<DropzoneProps>

export default Dropzone
