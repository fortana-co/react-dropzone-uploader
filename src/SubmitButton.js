"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const SubmitButton = (props) => {
    const { className, buttonClassName, style, buttonStyle, disabled, content, onSubmit, files } = props;
    const _disabled = files.some(f => ['preparing', 'getting_upload_params', 'uploading'].includes(f.meta.status)) ||
        !files.some(f => ['headers_received', 'done'].includes(f.meta.status));
    const handleSubmit = () => {
        onSubmit(files.filter(f => ['headers_received', 'done'].includes(f.meta.status)));
    };
    return (react_1.default.createElement("div", { className: className, style: style },
        react_1.default.createElement("button", { className: buttonClassName, style: buttonStyle, onClick: handleSubmit, disabled: disabled || _disabled }, content)));
};
exports.default = SubmitButton;
