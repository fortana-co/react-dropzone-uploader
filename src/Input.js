"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const Input = (props) => {
    const { className, labelClassName, labelWithFilesClassName, style, labelStyle, labelWithFilesStyle, getFilesFromEvent, accept, multiple, disabled, content, withFilesContent, onFiles, files, } = props;
    return (react_1.default.createElement("label", { className: files.length > 0 ? labelWithFilesClassName : labelClassName, style: files.length > 0 ? labelWithFilesStyle : labelStyle },
        files.length > 0 ? withFilesContent : content,
        react_1.default.createElement("input", { className: className, style: style, type: "file", accept: accept, multiple: multiple, disabled: disabled, onChange: async (e) => {
                const chosenFiles = await getFilesFromEvent(e);
                onFiles(chosenFiles);
                e.target.value = null;
            } })));
};
Input.propTypes = {
    className: prop_types_1.default.string,
    labelClassName: prop_types_1.default.string,
    labelWithFilesClassName: prop_types_1.default.string,
    style: prop_types_1.default.object,
    labelStyle: prop_types_1.default.object,
    labelWithFilesStyle: prop_types_1.default.object,
    getFilesFromEvent: prop_types_1.default.func.isRequired,
    accept: prop_types_1.default.string.isRequired,
    multiple: prop_types_1.default.bool.isRequired,
    disabled: prop_types_1.default.bool.isRequired,
    content: prop_types_1.default.node,
    withFilesContent: prop_types_1.default.node,
    onFiles: prop_types_1.default.func.isRequired,
    files: prop_types_1.default.arrayOf(prop_types_1.default.any).isRequired,
    extra: prop_types_1.default.shape({
        active: prop_types_1.default.bool.isRequired,
        reject: prop_types_1.default.bool.isRequired,
        dragged: prop_types_1.default.arrayOf(prop_types_1.default.any).isRequired,
        accept: prop_types_1.default.string.isRequired,
        multiple: prop_types_1.default.bool.isRequired,
        minSizeBytes: prop_types_1.default.number.isRequired,
        maxSizeBytes: prop_types_1.default.number.isRequired,
        maxFiles: prop_types_1.default.number.isRequired,
    }).isRequired,
};
exports.default = Input;
