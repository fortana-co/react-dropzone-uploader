import React from 'react';
import PropTypes from 'prop-types';
import LayoutDefault from './Layout';
import InputDefault from './Input';
import PreviewDefault from './Preview';
import SubmitButtonDefault from './SubmitButton';
import { formatBytes, formatDuration, accepts, resolveValue, mergeStyles, defaultClassNames, getFilesFromEvent as defaultGetFilesFromEvent, } from './utils';
class Dropzone extends React.Component {
    constructor(props) {
        super(props);
        this.forceUpdate = () => {
            if (this.mounted)
                super.forceUpdate();
        };
        this.getFilesFromEvent = () => {
            return this.props.getFilesFromEvent || defaultGetFilesFromEvent;
        };
        this.getDataTransferItemsFromEvent = () => {
            return this.props.getDataTransferItemsFromEvent || defaultGetFilesFromEvent;
        };
        this.handleDragEnter = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const dragged = (await this.getDataTransferItemsFromEvent()(e));
            this.setState({ active: true, dragged });
        };
        this.handleDragOver = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            clearTimeout(this.dragTimeoutId);
            const dragged = await this.getDataTransferItemsFromEvent()(e);
            this.setState({ active: true, dragged });
        };
        this.handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            // prevents repeated toggling of `active` state when file is dragged over children of uploader
            // see: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
            this.dragTimeoutId = window.setTimeout(() => this.setState({ active: false, dragged: [] }), 150);
        };
        this.handleDrop = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.setState({ active: false, dragged: [] });
            const files = (await this.getFilesFromEvent()(e));
            this.handleFiles(files);
        };
        this.handleDropDisabled = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.setState({ active: false, dragged: [] });
        };
        this.handleChangeStatus = (fileWithMeta) => {
            if (!this.props.onChangeStatus)
                return;
            const { meta = {} } = this.props.onChangeStatus(fileWithMeta, fileWithMeta.meta.status, this.files) || {};
            if (meta) {
                delete meta.status;
                fileWithMeta.meta = { ...fileWithMeta.meta, ...meta };
                this.forceUpdate();
            }
        };
        this.handleSubmit = (files) => {
            if (this.props.onSubmit)
                this.props.onSubmit(files, [...this.files]);
        };
        this.handleCancel = (fileWithMeta) => {
            if (fileWithMeta.meta.status !== 'uploading')
                return;
            fileWithMeta.meta.status = 'aborted';
            if (fileWithMeta.xhr)
                fileWithMeta.xhr.abort();
            this.handleChangeStatus(fileWithMeta);
            this.forceUpdate();
        };
        this.handleRemove = (fileWithMeta) => {
            const index = this.files.findIndex(f => f === fileWithMeta);
            if (index !== -1) {
                URL.revokeObjectURL(fileWithMeta.meta.previewUrl || '');
                fileWithMeta.meta.status = 'removed';
                this.handleChangeStatus(fileWithMeta);
                this.files.splice(index, 1);
                this.forceUpdate();
            }
        };
        this.handleRestart = (fileWithMeta) => {
            if (!this.props.getUploadParams)
                return;
            if (fileWithMeta.meta.status === 'ready')
                fileWithMeta.meta.status = 'started';
            else
                fileWithMeta.meta.status = 'restarted';
            this.handleChangeStatus(fileWithMeta);
            fileWithMeta.meta.status = 'getting_upload_params';
            fileWithMeta.meta.percent = 0;
            this.handleChangeStatus(fileWithMeta);
            this.forceUpdate();
            this.uploadFile(fileWithMeta);
        };
        // expects an array of File objects
        this.handleFiles = (files) => {
            files.forEach((f, i) => this.handleFile(f, `${new Date().getTime()}-${i}`));
            const { current } = this.dropzone;
            if (current)
                setTimeout(() => current.scroll({ top: current.scrollHeight, behavior: 'smooth' }), 150);
        };
        this.handleFile = async (file, id) => {
            const { name, size, type, lastModified } = file;
            const { minSizeBytes, maxSizeBytes, maxFiles, accept, getUploadParams, autoUpload, validate } = this.props;
            const uploadedDate = new Date().toISOString();
            const lastModifiedDate = lastModified && new Date(lastModified).toISOString();
            const fileWithMeta = {
                file,
                meta: { name, size, type, lastModifiedDate, uploadedDate, percent: 0, id },
            };
            // firefox versions prior to 53 return a bogus mime type for file drag events,
            // so files with that mime type are always accepted
            if (file.type !== 'application/x-moz-file' && !accepts(file, accept)) {
                fileWithMeta.meta.status = 'rejected_file_type';
                this.handleChangeStatus(fileWithMeta);
                return;
            }
            if (this.files.length >= maxFiles) {
                fileWithMeta.meta.status = 'rejected_max_files';
                this.handleChangeStatus(fileWithMeta);
                return;
            }
            fileWithMeta.cancel = () => this.handleCancel(fileWithMeta);
            fileWithMeta.remove = () => this.handleRemove(fileWithMeta);
            fileWithMeta.restart = () => this.handleRestart(fileWithMeta);
            fileWithMeta.meta.status = 'preparing';
            this.files.push(fileWithMeta);
            this.handleChangeStatus(fileWithMeta);
            this.forceUpdate();
            if (size < minSizeBytes || size > maxSizeBytes) {
                fileWithMeta.meta.status = 'error_file_size';
                this.handleChangeStatus(fileWithMeta);
                this.forceUpdate();
                return;
            }
            await this.generatePreview(fileWithMeta);
            if (validate) {
                const error = validate(fileWithMeta);
                if (error) {
                    fileWithMeta.meta.status = 'error_validation';
                    fileWithMeta.meta.validationError = error; // usually a string, but doesn't have to be
                    this.handleChangeStatus(fileWithMeta);
                    this.forceUpdate();
                    return;
                }
            }
            if (getUploadParams) {
                if (autoUpload) {
                    this.uploadFile(fileWithMeta);
                    fileWithMeta.meta.status = 'getting_upload_params';
                }
                else {
                    fileWithMeta.meta.status = 'ready';
                }
            }
            else {
                fileWithMeta.meta.status = 'done';
            }
            this.handleChangeStatus(fileWithMeta);
            this.forceUpdate();
        };
        this.generatePreview = async (fileWithMeta) => {
            const { meta: { type }, file, } = fileWithMeta;
            const isImage = type.startsWith('image/');
            const isTiff = type.startsWith('image/tiff');
            const isAudio = type.startsWith('audio/');
            const isVideo = type.startsWith('video/');
            if ((!isImage && !isAudio && !isVideo) || isTiff)
                return;
            const objectUrl = URL.createObjectURL(file);
            const fileCallbackToPromise = (fileObj) => {
                return new Promise(resolve => {
                    if (fileObj instanceof HTMLImageElement)
                        fileObj.onload = resolve;
                    else
                        fileObj.onloadedmetadata = resolve;
                });
            };
            try {
                if (isImage) {
                    const img = new Image();
                    img.src = objectUrl;
                    fileWithMeta.meta.previewUrl = objectUrl;
                    await fileCallbackToPromise(img);
                    fileWithMeta.meta.width = img.width;
                    fileWithMeta.meta.height = img.height;
                }
                if (isAudio) {
                    const audio = new Audio();
                    audio.src = objectUrl;
                    await fileCallbackToPromise(audio);
                    fileWithMeta.meta.duration = audio.duration;
                }
                if (isVideo) {
                    const video = document.createElement('video');
                    video.src = objectUrl;
                    await fileCallbackToPromise(video);
                    fileWithMeta.meta.duration = video.duration;
                    fileWithMeta.meta.videoWidth = video.videoWidth;
                    fileWithMeta.meta.videoHeight = video.videoHeight;
                }
                if (!isImage)
                    URL.revokeObjectURL(objectUrl);
            }
            catch (e) {
                URL.revokeObjectURL(objectUrl);
            }
            this.forceUpdate();
        };
        this.uploadFile = async (fileWithMeta) => {
            const { getUploadParams } = this.props;
            if (!getUploadParams)
                return;
            let params = null;
            try {
                params = await getUploadParams(fileWithMeta);
            }
            catch (e) {
                console.error('Error Upload Params', e.stack);
            }
            if (params === null)
                return;
            const { url, method = 'POST', body, fields = {}, headers = {}, meta: extraMeta = {} } = params;
            delete extraMeta.status;
            if (!url) {
                fileWithMeta.meta.status = 'error_upload_params';
                this.handleChangeStatus(fileWithMeta);
                this.forceUpdate();
                return;
            }
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            xhr.open(method, url, true);
            for (const field of Object.keys(fields))
                formData.append(field, fields[field]);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            for (const header of Object.keys(headers))
                xhr.setRequestHeader(header, headers[header]);
            fileWithMeta.meta = { ...fileWithMeta.meta, ...extraMeta };
            // update progress (can be used to show progress indicator)
            xhr.upload.addEventListener('progress', e => {
                fileWithMeta.meta.percent = (e.loaded * 100.0) / e.total || 100;
                this.forceUpdate();
            });
            xhr.addEventListener('readystatechange', () => {
                // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
                if (xhr.readyState !== 2 && xhr.readyState !== 4)
                    return;
                if (xhr.status === 0 && fileWithMeta.meta.status !== 'aborted') {
                    fileWithMeta.meta.status = 'exception_upload';
                    this.handleChangeStatus(fileWithMeta);
                    this.forceUpdate();
                }
                if (xhr.status > 0 && xhr.status < 400) {
                    fileWithMeta.meta.percent = 100;
                    if (xhr.readyState === 2)
                        fileWithMeta.meta.status = 'headers_received';
                    if (xhr.readyState === 4)
                        fileWithMeta.meta.status = 'done';
                    this.handleChangeStatus(fileWithMeta);
                    this.forceUpdate();
                }
                if (xhr.status >= 400 && fileWithMeta.meta.status !== 'error_upload') {
                    fileWithMeta.meta.status = 'error_upload';
                    this.handleChangeStatus(fileWithMeta);
                    this.forceUpdate();
                }
            });
            formData.append('file', fileWithMeta.file);
            if (this.props.timeout)
                xhr.timeout = this.props.timeout;
            xhr.send(body || formData);
            fileWithMeta.xhr = xhr;
            fileWithMeta.meta.status = 'uploading';
            this.handleChangeStatus(fileWithMeta);
            this.forceUpdate();
        };
        this.state = {
            active: false,
            dragged: [],
        };
        this.files = [];
        this.mounted = true;
        this.dropzone = React.createRef();
    }
    componentDidMount() {
        if (this.props.initialFiles)
            this.handleFiles(this.props.initialFiles);
    }
    componentWillUnmount() {
        this.mounted = false;
        for (const fileWithMeta of this.files)
            this.handleCancel(fileWithMeta);
    }
    render() {
        const { accept, multiple, maxFiles, minSizeBytes, maxSizeBytes, onSubmit, getUploadParams, disabled, canCancel, canRemove, canRestart, inputContent, inputWithFilesContent, submitButtonDisabled, submitButtonContent, classNames, styles, addClassNames, InputComponent, PreviewComponent, SubmitButtonComponent, LayoutComponent, } = this.props;
        const { active, dragged } = this.state;
        const reject = dragged.some(file => file.type !== 'application/x-moz-file' && !accepts(file, accept));
        const extra = { active, reject, dragged, accept, multiple, minSizeBytes, maxSizeBytes, maxFiles };
        const files = [...this.files];
        const dropzoneDisabled = resolveValue(disabled, files, extra);
        const { classNames: { dropzone: dropzoneClassName, dropzoneActive: dropzoneActiveClassName, dropzoneReject: dropzoneRejectClassName, dropzoneDisabled: dropzoneDisabledClassName, input: inputClassName, inputLabel: inputLabelClassName, inputLabelWithFiles: inputLabelWithFilesClassName, preview: previewClassName, previewImage: previewImageClassName, submitButtonContainer: submitButtonContainerClassName, submitButton: submitButtonClassName, }, styles: { dropzone: dropzoneStyle, dropzoneActive: dropzoneActiveStyle, dropzoneReject: dropzoneRejectStyle, dropzoneDisabled: dropzoneDisabledStyle, input: inputStyle, inputLabel: inputLabelStyle, inputLabelWithFiles: inputLabelWithFilesStyle, preview: previewStyle, previewImage: previewImageStyle, submitButtonContainer: submitButtonContainerStyle, submitButton: submitButtonStyle, }, } = mergeStyles(classNames, styles, addClassNames, files, extra);
        const Input = InputComponent || InputDefault;
        const Preview = PreviewComponent || PreviewDefault;
        const SubmitButton = SubmitButtonComponent || SubmitButtonDefault;
        const Layout = LayoutComponent || LayoutDefault;
        let previews = null;
        if (PreviewComponent !== null) {
            previews = files.map(f => {
                return (
                //@ts-ignore
                React.createElement(Preview, { className: previewClassName, imageClassName: previewImageClassName, style: previewStyle, imageStyle: previewImageStyle, key: f.meta.id, fileWithMeta: f, meta: { ...f.meta }, isUpload: Boolean(getUploadParams), canCancel: resolveValue(canCancel, files, extra), canRemove: resolveValue(canRemove, files, extra), canRestart: resolveValue(canRestart, files, extra), files: files, extra: extra }));
            });
        }
        const input = InputComponent !== null ? (
        //@ts-ignore
        React.createElement(Input, { className: inputClassName, labelClassName: inputLabelClassName, labelWithFilesClassName: inputLabelWithFilesClassName, style: inputStyle, labelStyle: inputLabelStyle, labelWithFilesStyle: inputLabelWithFilesStyle, getFilesFromEvent: this.getFilesFromEvent(), accept: accept, multiple: multiple, disabled: dropzoneDisabled, content: resolveValue(inputContent, files, extra), withFilesContent: resolveValue(inputWithFilesContent, files, extra), onFiles: this.handleFiles, files: files, extra: extra })) : null;
        const submitButton = onSubmit && SubmitButtonComponent !== null ? (
        //@ts-ignore
        React.createElement(SubmitButton, { className: submitButtonContainerClassName, buttonClassName: submitButtonClassName, style: submitButtonContainerStyle, buttonStyle: submitButtonStyle, disabled: resolveValue(submitButtonDisabled, files, extra), content: resolveValue(submitButtonContent, files, extra), onSubmit: this.handleSubmit, files: files, extra: extra })) : null;
        let className = dropzoneClassName;
        let style = dropzoneStyle;
        if (dropzoneDisabled) {
            className = `${className} ${dropzoneDisabledClassName}`;
            style = { ...(style || {}), ...(dropzoneDisabledStyle || {}) };
        }
        else if (reject) {
            className = `${className} ${dropzoneRejectClassName}`;
            style = { ...(style || {}), ...(dropzoneRejectStyle || {}) };
        }
        else if (active) {
            className = `${className} ${dropzoneActiveClassName}`;
            style = { ...(style || {}), ...(dropzoneActiveStyle || {}) };
        }
        return (
        //@ts-ignore
        React.createElement(Layout, { input: input, previews: previews, submitButton: submitButton, dropzoneProps: {
                ref: this.dropzone,
                className,
                style: style,
                onDragEnter: this.handleDragEnter,
                onDragOver: this.handleDragOver,
                onDragLeave: this.handleDragLeave,
                onDrop: dropzoneDisabled ? this.handleDropDisabled : this.handleDrop,
            }, files: files, extra: {
                ...extra,
                onFiles: this.handleFiles,
                onCancelFile: this.handleCancel,
                onRemoveFile: this.handleRemove,
                onRestartFile: this.handleRestart,
            } }));
    }
}
Dropzone.defaultProps = {
    accept: '*',
    multiple: true,
    minSizeBytes: 0,
    maxSizeBytes: Number.MAX_SAFE_INTEGER,
    maxFiles: Number.MAX_SAFE_INTEGER,
    autoUpload: true,
    disabled: false,
    canCancel: true,
    canRemove: true,
    canRestart: true,
    inputContent: 'Drag Files or Click to Browse',
    inputWithFilesContent: 'Add Files',
    submitButtonDisabled: false,
    submitButtonContent: 'Submit',
    classNames: {},
    styles: {},
    addClassNames: {},
};
// @ts-ignore
Dropzone.propTypes = {
    onChangeStatus: PropTypes.func,
    getUploadParams: PropTypes.func,
    onSubmit: PropTypes.func,
    getFilesFromEvent: PropTypes.func,
    getDataTransferItemsFromEvent: PropTypes.func,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    minSizeBytes: PropTypes.number.isRequired,
    maxSizeBytes: PropTypes.number.isRequired,
    maxFiles: PropTypes.number.isRequired,
    validate: PropTypes.func,
    autoUpload: PropTypes.bool,
    timeout: PropTypes.number,
    initialFiles: PropTypes.arrayOf(PropTypes.any),
    /* component customization */
    disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    canCancel: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    canRemove: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    canRestart: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    inputContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    inputWithFilesContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    submitButtonDisabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    submitButtonContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    classNames: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    addClassNames: PropTypes.object.isRequired,
    /* component injection */
    InputComponent: PropTypes.func,
    PreviewComponent: PropTypes.func,
    SubmitButtonComponent: PropTypes.func,
    LayoutComponent: PropTypes.func,
};
export default Dropzone;
export { LayoutDefault as Layout, InputDefault as Input, PreviewDefault as Preview, SubmitButtonDefault as SubmitButton, formatBytes, formatDuration, accepts, defaultClassNames, defaultGetFilesFromEvent as getFilesFromEvent, };
