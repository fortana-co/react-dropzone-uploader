import React from 'react';
import PropTypes from 'prop-types';
import { formatBytes, formatDuration } from './utils';
//@ts-ignore
import cancelImg from './assets/cancel.svg';
//@ts-ignore
import removeImg from './assets/remove.svg';
//@ts-ignore
import restartImg from './assets/restart.svg';
const iconByFn = {
    cancel: { backgroundImage: `url(${cancelImg})` },
    remove: { backgroundImage: `url(${removeImg})` },
    restart: { backgroundImage: `url(${restartImg})` },
};
class Preview extends React.PureComponent {
    render() {
        const { className, imageClassName, style, imageStyle, fileWithMeta: { cancel, remove, restart }, meta: { name = '', percent = 0, size = 0, previewUrl, status, duration, validationError }, isUpload, canCancel, canRemove, canRestart, extra: { minSizeBytes }, } = this.props;
        let title = `${name || '?'}, ${formatBytes(size)}`;
        if (duration)
            title = `${title}, ${formatDuration(duration)}`;
        if (status === 'error_file_size' || status === 'error_validation') {
            return (React.createElement("div", { className: className, style: style },
                React.createElement("span", { className: "dzu-previewFileNameError" }, title),
                status === 'error_file_size' && React.createElement("span", null, size < minSizeBytes ? 'File too small' : 'File too big'),
                status === 'error_validation' && React.createElement("span", null, String(validationError)),
                canRemove && React.createElement("span", { className: "dzu-previewButton", style: iconByFn.remove, onClick: remove })));
        }
        if (status === 'error_upload_params' || status === 'exception_upload' || status === 'error_upload') {
            title = `${title} (upload failed)`;
        }
        if (status === 'aborted')
            title = `${title} (cancelled)`;
        return (React.createElement("div", { className: className, style: style },
            previewUrl && React.createElement("img", { className: imageClassName, style: imageStyle, src: previewUrl, alt: title, title: title }),
            !previewUrl && React.createElement("span", { className: "dzu-previewFileName" }, title),
            React.createElement("div", { className: "dzu-previewStatusContainer" },
                isUpload && (React.createElement("progress", { max: 100, value: status === 'done' || status === 'headers_received' ? 100 : percent })),
                status === 'uploading' && canCancel && (React.createElement("span", { className: "dzu-previewButton", style: iconByFn.cancel, onClick: cancel })),
                status !== 'preparing' && status !== 'getting_upload_params' && status !== 'uploading' && canRemove && (React.createElement("span", { className: "dzu-previewButton", style: iconByFn.remove, onClick: remove })),
                ['error_upload_params', 'exception_upload', 'error_upload', 'aborted', 'ready'].includes(status) &&
                    canRestart && React.createElement("span", { className: "dzu-previewButton", style: iconByFn.restart, onClick: restart }))));
    }
}
// @ts-ignore
Preview.propTypes = {
    className: PropTypes.string,
    imageClassName: PropTypes.string,
    style: PropTypes.object,
    imageStyle: PropTypes.object,
    fileWithMeta: PropTypes.shape({
        file: PropTypes.any.isRequired,
        meta: PropTypes.object.isRequired,
        cancel: PropTypes.func.isRequired,
        restart: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
        xhr: PropTypes.any,
    }).isRequired,
    // copy of fileWithMeta.meta, won't be mutated
    meta: PropTypes.shape({
        status: PropTypes.oneOf([
            'preparing',
            'error_file_size',
            'error_validation',
            'ready',
            'getting_upload_params',
            'error_upload_params',
            'uploading',
            'exception_upload',
            'aborted',
            'error_upload',
            'headers_received',
            'done',
        ]).isRequired,
        type: PropTypes.string.isRequired,
        name: PropTypes.string,
        uploadedDate: PropTypes.string.isRequired,
        percent: PropTypes.number,
        size: PropTypes.number,
        lastModifiedDate: PropTypes.string,
        previewUrl: PropTypes.string,
        duration: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
        videoWidth: PropTypes.number,
        videoHeight: PropTypes.number,
        validationError: PropTypes.any,
    }).isRequired,
    isUpload: PropTypes.bool.isRequired,
    canCancel: PropTypes.bool.isRequired,
    canRemove: PropTypes.bool.isRequired,
    canRestart: PropTypes.bool.isRequired,
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
};
export default Preview;
