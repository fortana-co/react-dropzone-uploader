"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Layout_1 = __importDefault(require("./Layout"));
exports.Layout = Layout_1.default;
const Input_1 = __importDefault(require("./Input"));
exports.Input = Input_1.default;
const Preview_1 = __importDefault(require("./Preview"));
exports.Preview = Preview_1.default;
const SubmitButton_1 = __importDefault(require("./SubmitButton"));
exports.SubmitButton = SubmitButton_1.default;
const utils_1 = require("./utils");
exports.formatBytes = utils_1.formatBytes;
exports.formatDuration = utils_1.formatDuration;
exports.accepts = utils_1.accepts;
exports.defaultClassNames = utils_1.defaultClassNames;
exports.getFilesFromEvent = utils_1.getFilesFromEvent;
class Dropzone extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.forceUpdate = () => {
            if (this.mounted)
                super.forceUpdate();
        };
        this.getFilesFromEvent = () => {
            return this.props.getFilesFromEvent || utils_1.getFilesFromEvent;
        };
        this.getDataTransferItemsFromEvent = () => {
            return this.props.getDataTransferItemsFromEvent || utils_1.getFilesFromEvent;
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
            this.dragTimeoutId = setTimeout(() => this.setState({ active: false, dragged: [] }), 150);
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
            if (file.type !== 'application/x-moz-file' && !utils_1.accepts(file, accept)) {
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
            const isAudio = type.startsWith('audio/');
            const isVideo = type.startsWith('video/');
            if (!isImage && !isAudio && !isVideo)
                return;
            const objectUrl = URL.createObjectURL(file);
            const fileCallbackToPromise = (fileObj, callback) => {
                return new Promise(resolve => {
                    fileObj[callback] = resolve;
                });
            };
            try {
                if (isImage) {
                    const img = new Image();
                    img.src = objectUrl;
                    fileWithMeta.meta.previewUrl = objectUrl;
                    await fileCallbackToPromise(img, 'onload');
                    fileWithMeta.meta.width = img.width;
                    fileWithMeta.meta.height = img.height;
                }
                if (isAudio) {
                    const audio = new Audio();
                    audio.src = objectUrl;
                    await fileCallbackToPromise(audio, 'onloadedmetadata');
                    fileWithMeta.meta.duration = audio.duration;
                }
                if (isVideo) {
                    const video = document.createElement('video');
                    video.src = objectUrl;
                    await fileCallbackToPromise(video, 'onloadedmetadata');
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
            let params;
            try {
                params = await getUploadParams(fileWithMeta);
            }
            catch (e) {
                console.error('Error Upload Params', e.stack);
            }
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
        this.dropzone = react_1.default.createRef();
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
        const reject = dragged.some(file => file.type !== 'application/x-moz-file' && !utils_1.accepts(file, accept));
        const extra = { active, reject, dragged, accept, multiple, minSizeBytes, maxSizeBytes, maxFiles };
        const files = [...this.files];
        const dropzoneDisabled = utils_1.resolveValue(disabled, files, extra);
        const { classNames: { dropzone: dropzoneClassName, dropzoneActive: dropzoneActiveClassName, dropzoneReject: dropzoneRejectClassName, dropzoneDisabled: dropzoneDisabledClassName, input: inputClassName, inputLabel: inputLabelClassName, inputLabelWithFiles: inputLabelWithFilesClassName, preview: previewClassName, previewImage: previewImageClassName, submitButtonContainer: submitButtonContainerClassName, submitButton: submitButtonClassName, }, styles: { dropzone: dropzoneStyle, dropzoneActive: dropzoneActiveStyle, dropzoneReject: dropzoneRejectStyle, dropzoneDisabled: dropzoneDisabledStyle, input: inputStyle, inputLabel: inputLabelStyle, inputLabelWithFiles: inputLabelWithFilesStyle, preview: previewStyle, previewImage: previewImageStyle, submitButtonContainer: submitButtonContainerStyle, submitButton: submitButtonStyle, }, } = utils_1.mergeStyles(classNames, styles, addClassNames, files, extra);
        const Input = InputComponent || Input_1.default;
        const Preview = PreviewComponent || Preview_1.default;
        const SubmitButton = SubmitButtonComponent || SubmitButton_1.default;
        const Layout = LayoutComponent || Layout_1.default;
        let previews = null;
        if (PreviewComponent !== null) {
            previews = files.map(f => {
                return (
                //@ts-ignore
                react_1.default.createElement(Preview, { className: previewClassName, imageClassName: previewImageClassName, style: previewStyle, imageStyle: previewImageStyle, key: f.meta.id, fileWithMeta: f, meta: { ...f.meta }, isUpload: Boolean(getUploadParams), canCancel: utils_1.resolveValue(canCancel, files, extra), canRemove: utils_1.resolveValue(canRemove, files, extra), canRestart: utils_1.resolveValue(canRestart, files, extra), files: files, extra: extra }));
            });
        }
        const input = InputComponent !== null ? (
        //@ts-ignore
        react_1.default.createElement(Input, { className: inputClassName, labelClassName: inputLabelClassName, labelWithFilesClassName: inputLabelWithFilesClassName, style: inputStyle, labelStyle: inputLabelStyle, labelWithFilesStyle: inputLabelWithFilesStyle, getFilesFromEvent: this.getFilesFromEvent(), accept: accept, multiple: multiple, disabled: dropzoneDisabled, content: utils_1.resolveValue(inputContent, files, extra), withFilesContent: utils_1.resolveValue(inputWithFilesContent, files, extra), onFiles: this.handleFiles, files: files, extra: extra })) : null;
        const submitButton = onSubmit && SubmitButtonComponent !== null ? (
        //@ts-ignore
        react_1.default.createElement(SubmitButton, { className: submitButtonContainerClassName, buttonClassName: submitButtonClassName, style: submitButtonContainerStyle, buttonStyle: submitButtonStyle, disabled: utils_1.resolveValue(submitButtonDisabled, files, extra), content: utils_1.resolveValue(submitButtonContent, files, extra), onSubmit: this.handleSubmit, files: files, extra: extra })) : null;
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
        react_1.default.createElement(Layout, { input: input, previews: previews, submitButton: submitButton, dropzoneProps: {
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
// Dropzone.propTypes = {
//   onChangeStatus: PropTypes.func,
//   getUploadParams: PropTypes.func,
//   onSubmit: PropTypes.func,
//   getFilesFromEvent: PropTypes.func,
//   getDataTransferItemsFromEvent: PropTypes.func,
//   accept: PropTypes.string,
//   multiple: PropTypes.bool,
//   minSizeBytes: PropTypes.number.isRequired,
//   maxSizeBytes: PropTypes.number.isRequired,
//   maxFiles: PropTypes.number.isRequired,
//   validate: PropTypes.func,
//   autoUpload: PropTypes.bool,
//   timeout: PropTypes.number,
//   initialFiles: PropTypes.arrayOf(PropTypes.any),
//   /* component customization */
//   disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
//   canCancel: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
//   canRemove: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
//   canRestart: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
//   inputContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
//   inputWithFilesContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
//   submitButtonDisabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
//   submitButtonContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
//   classNames: PropTypes.object.isRequired,
//   styles: PropTypes.object.isRequired,
//   addClassNames: PropTypes.object.isRequired,
//   /* component injection */
//   InputComponent: PropTypes.func,
//   PreviewComponent: PropTypes.func,
//   SubmitButtonComponent: PropTypes.func,
//   LayoutComponent: PropTypes.func,
// }
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
exports.default = Dropzone;
