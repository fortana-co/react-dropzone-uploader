import React from "react";

export type StatusValue =
  | "rejected_file_type"
  | "rejected_max_files"
  | "preparing"
  | "error_file_size"
  | "error_validation"
  | "ready"
  | "started"
  | "getting_upload_params"
  | "error_upload_params"
  | "uploading"
  | "exception_upload"
  | "aborted"
  | "restarted"
  | "removed"
  | "error_upload"
  | "headers_received"
  | "done";

export type FileWithMeta = {
  file: File;
  meta: IMeta;
  cancel(): void;
  restart(): void;
  remove(): void;
  xhr: XMLHttpRequest;
};

type DropzoneStyle =
  | React.CSSProperties
  | ((files: FileWithMeta, extra: IExtra) => React.CSSProperties);

interface IMeta {
  status: StatusValue;
  type: string; // MIME type, example: `image/*`
  name: string;
  uploadedDate: string; // ISO string
  percent: number;
  size: number; // bytes
  lastModifiedDate: string; // ISO string
  previewUrl: string;
  duration: number; // seconds
  width: number;
  height: number;
  videoWidth: number;
  videoHeight: number;
  id: number;
  validationError: any;
}

interface IExtra {
  active: boolean;
  reject: boolean;
  dragged: boolean;
  accept: string;
  multiple: boolean;
  minSizeBytes: number;
  maxSizeBytes: number;
  maxFiles: number;
}

interface IUploadParams {
  url: string;
  method?: string;
  body?: FormData;
  fields?: { [name: string]: string | Blob };
  headers?: { [name: string]: string };
  meta?: any;
}

interface IStyles {
  dropzone?: DropzoneStyle;
  dropzoneActive?: DropzoneStyle;
  dropzoneReject?: DropzoneStyle;
  dropzoneDisabled?: DropzoneStyle;
  input?: DropzoneStyle;
  inputLabel?: DropzoneStyle;
  inputLabelWithFiles?: DropzoneStyle;
  preview?: DropzoneStyle;
  previewImage?: DropzoneStyle;
  submitButtonContainer?: DropzoneStyle;
  submitButton?: DropzoneStyle;
}

interface IClassNames {
  dropzone?: string;
  dropzoneActive?: string;
  dropzoneReject?: string;
  dropzoneDisabled?: string;
  input?: string;
  inputLabel?: string;
  inputLabelWithFiles?: string;
  preview?: string;
  previewImage?: string;
  submitButtonContainer?: string;
  submitButton?: string;
}

interface IDropzoneProps {
  accept?: string;
  autoUpload?: boolean;
  classNames?: IClassNames;
  maxFiles?: number;
  maxSizeBytes?: number;
  minSizeBytes?: number;
  styles?: IStyles;
  timeout?: number;

  onChangeStatus?(
    targetFile: FileWithMeta,
    status: StatusValue,
    allFiles: FileWithMeta[]
  ): void;

  getUploadParams(file: FileWithMeta): IUploadParams | Promise<IUploadParams>;

  onSubmit?(successFiles: FileWithMeta[], allFiles: FileWithMeta[]): void;

  validate?(file: FileWithMeta): any; // usually a string, but can be anything

  inputContent?(files: FileWithMeta[], extra: IExtra): React.ReactNode;
}

export default class Dropzone extends React.Component<IDropzoneProps> {}
