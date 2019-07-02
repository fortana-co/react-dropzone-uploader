"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Layout = (props) => {
    const { input, previews, submitButton, dropzoneProps, files, extra: { maxFiles }, } = props;
    return (react_1.default.createElement("div", Object.assign({}, dropzoneProps),
        previews,
        files.length < maxFiles && input,
        files.length > 0 && submitButton));
};
exports.default = Layout;
