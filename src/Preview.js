"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const utils_1 = require("./utils");
//@ts-ignore
const cancel_svg_1 = __importDefault(require("./assets/cancel.svg"));
//@ts-ignore
const remove_svg_1 = __importDefault(require("./assets/remove.svg"));
//@ts-ignore
const restart_svg_1 = __importDefault(require("./assets/restart.svg"));
const iconByFn = {
    cancel: { backgroundImage: `url(${cancel_svg_1.default})` },
    remove: { backgroundImage: `url(${remove_svg_1.default})` },
    restart: { backgroundImage: `url(${restart_svg_1.default})` },
};
class Preview extends react_1.default.PureComponent {
    render() {
        const { className, imageClassName, style, imageStyle, fileWithMeta: { cancel, remove, restart }, meta: { name = '', percent = 0, size = 0, previewUrl, status, duration, validationError }, isUpload, canCancel, canRemove, canRestart, extra: { minSizeBytes }, } = this.props;
        let title = `${name || '?'}, ${utils_1.formatBytes(size)}`;
        if (duration)
            title = `${title}, ${utils_1.formatDuration(duration)}`;
        if (status === 'error_file_size' || status === 'error_validation') {
            return (react_1.default.createElement("div", { className: className, style: style },
                react_1.default.createElement("span", { className: "dzu-previewFileNameError" }, title),
                status === 'error_file_size' && react_1.default.createElement("span", null, size < minSizeBytes ? 'File too small' : 'File too big'),
                status === 'error_validation' && react_1.default.createElement("span", null, String(validationError)),
                canRemove && react_1.default.createElement("span", { className: "dzu-previewButton", style: iconByFn.remove, onClick: remove })));
        }
        if (status === 'error_upload_params' || status === 'exception_upload' || status === 'error_upload') {
            title = `${title} (upload failed)`;
        }
        if (status === 'aborted')
            title = `${title} (cancelled)`;
        return (react_1.default.createElement("div", { className: className, style: style },
            previewUrl && react_1.default.createElement("img", { className: imageClassName, style: imageStyle, src: previewUrl, alt: title, title: title }),
            !previewUrl && react_1.default.createElement("span", { className: "dzu-previewFileName" }, title),
            react_1.default.createElement("div", { className: "dzu-previewStatusContainer" },
                isUpload && (react_1.default.createElement("progress", { max: 100, value: status === 'done' || status === 'headers_received' ? 100 : percent })),
                status === 'uploading' && canCancel && (react_1.default.createElement("span", { className: "dzu-previewButton", style: iconByFn.cancel, onClick: cancel })),
                status !== 'preparing' && status !== 'getting_upload_params' && status !== 'uploading' && canRemove && (react_1.default.createElement("span", { className: "dzu-previewButton", style: iconByFn.remove, onClick: remove })),
                ['error_upload_params', 'exception_upload', 'error_upload', 'aborted', 'ready'].includes(status) &&
                    canRestart && react_1.default.createElement("span", { className: "dzu-previewButton", style: iconByFn.restart, onClick: restart }))));
    }
}
exports.default = Preview;
