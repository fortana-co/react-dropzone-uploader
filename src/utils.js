"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBytes = (b) => {
    const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0;
    let n = b;
    while (n >= 1024) {
        n /= 1024;
        l += 1;
    }
    return `${n.toFixed(n >= 10 || l < 1 ? 0 : 1)}${units[l]}`;
};
exports.formatDuration = (seconds) => {
    const date = new Date(null);
    date.setSeconds(seconds);
    const dateString = date.toISOString().slice(11, 19);
    if (seconds < 3600)
        return dateString.slice(3);
    return dateString;
};
// adapted from: https://github.com/okonet/attr-accept/blob/master/src/index.js
// returns true if file.name is empty and accept string is something like ".csv",
// because file comes from dataTransferItem for drag events, and
// dataTransferItem.name is always empty
exports.accepts = (file, accept) => {
    if (!accept || accept === '*')
        return true;
    const mimeType = file.type || '';
    const baseMimeType = mimeType.replace(/\/.*$/, '');
    return accept
        .split(',')
        .map(t => t.trim())
        .some(type => {
        if (type.charAt(0) === '.') {
            return file.name === undefined || file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        else if (type.endsWith('/*')) {
            // this is something like an image/* mime type
            return baseMimeType === type.replace(/\/.*$/, '');
        }
        return mimeType === type;
    });
};
exports.resolveValue = (value, ...args) => {
    if (typeof value === 'function')
        return value(...args);
    return value;
};
exports.defaultClassNames = {
    dropzone: 'dzu-dropzone',
    dropzoneActive: 'dzu-dropzoneActive',
    dropzoneReject: 'dzu-dropzoneActive',
    dropzoneDisabled: 'dzu-dropzoneDisabled',
    input: 'dzu-input',
    inputLabel: 'dzu-inputLabel',
    inputLabelWithFiles: 'dzu-inputLabelWithFiles',
    preview: 'dzu-previewContainer',
    previewImage: 'dzu-previewImage',
    submitButtonContainer: 'dzu-submitButtonContainer',
    submitButton: 'dzu-submitButton',
};
exports.mergeStyles = (classNames, styles, addClassNames, ...args) => {
    const resolvedClassNames = { ...exports.defaultClassNames };
    const resolvedStyles = { ...styles };
    for (const key of Object.keys(classNames)) {
        resolvedClassNames[key] = exports.resolveValue(classNames[key], ...args);
    }
    for (const key of Object.keys(addClassNames)) {
        resolvedClassNames[key] = `${resolvedClassNames[key]} ${exports.resolveValue(addClassNames[key], ...args)}`;
    }
    for (const key of Object.keys(styles)) {
        resolvedStyles[key] = exports.resolveValue(styles[key], ...args);
    }
    return { classNames: resolvedClassNames, styles: resolvedStyles };
};
exports.getFilesFromEvent = (event) => {
    let items = [];
    //@ts-ignore
    if (event.dataTransfer) {
        //@ts-ignore
        const dt = event.dataTransfer;
        // NOTE: Only the 'drop' event has access to DataTransfer.files, otherwise it will always be empty
        if (dt.files && dt.files.length) {
            items = dt.files;
        }
        else if (dt.items && dt.items.length) {
            items = dt.items;
        }
        //@ts-ignore
    }
    else if (event.target && event.target.files) {
        //@ts-ignore
        items = event.target.files;
    }
    return Array.prototype.slice.call(items);
};
