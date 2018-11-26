---
id: customization
title: Customization
---


Notice the __"Drag Files or Click to Browse"__ text that appears by default in an empty dropzone? This is likely something you'll want to change. You can use the `inputContent` and `inputWithFilesContent` props to render any string or JSX you want. The latter is for the content that's rendered if the dropzone has files. If you'd rather not render file input content, just pass `null`.

Want to change `submitButtonContent` from its default value of __"Submit"__? Just pass a new string or JSX for this prop. To kill this text, just pass an empty string or null.

See all of the customization props in the __Props__ section.


## Custom Styles
RDU's default styles are defined using CSS. They can be overridden using the `classNames` and `styles` props, which expose RDU's simple, flexible styling framework.

Both `classNames` and `styles` should be objects containing a subset of the following keys:

- `dropzone`
  + wrapper for dropzone
- `dropzoneWithFiles`
  + wrapper for dropzone if dropzone has files
- `dropzoneActive`
  + wrapper for dropzone on drag over; this is __added__ to the __dropzone__ or __dropzoneWithFiles__ class
- `dropzoneReject`
  + wrapper for dropzone on drag over if file MIME types in [DataTransfer.items](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/items) don't match `accept` prop; this is __added__ to the __dropzone__ or __dropzoneWithFiles__ class
- `input`
  + input
- `inputLabel`
  + input label
- `inputLabelWithFiles`
  + input label if dropzone has files
- `preview`
  + wrapper for preview div
- `previewImage`
  + preview image
- `submitButtonContainer`
  + wrapper for submit button div
- `submitButton`
  + submit button

Each key points to a [CSS class in the default stylesheet](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/styles.css). A class can be overridden by pointing its key to a different class name, or it can be removed by pointing its key to the empty string `''`.

If you prefer to use style object literals instead of CSS classes, point a key to a style object. The style object is passed to the target component's `style` prop, which means it takes precedence over its default class, but doesn't overwrite it.

To overwrite it, you can remove the default class by passing an empty string inside the `classNames` prop.

>As with any React component, declaring your `styles` object inside your render method can hurt performance, because it will cause RDU components that use these styles to re-render even if their props haven't changed.


### Adding To Default Classes
If you want to merge your class names with RDU's default classes, use the `addClassNames` prop. Added class names work like `classNames`, except instead of overwriting default classes they are added (concatenated) to them.

You can use both `classNames` and `addClassNames` if you want to overwrite some classes and add to others.

>Use `addClassNames` to override individual default styles, such as `border`, with your own styles. As long as you import RDU's default stylesheet at the top of your app's root component, you won't have to use `!important`.


## Component Injection
If no combination of props controlling styles and content achieves the look and feel you want, RDU provides a component injection API as an escape hatch. The `InputComponent`, `PreviewComponent`, `SubmitButtonComponent`, `LayoutComponent` props can each be used to override their corresponding default component. These components receive the props they need to react to the current state of the dropzone and its files.

`null`ing these props removes their corresponding components, except for `LayoutComponent`.

The file input and submit button are simple, and it's usually easy to get the right look and feel with the content and style props. For the file preview, these props might not be enough. In this case you can pass a custom `PreviewComponent`, which should be a React component. The custom component receives the same props that would have been passed to the default component.


### Default Components
If you're going to write your own component, it makes sense to start with the default component and modify it.

- [InputComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Input.js)
- [PreviewComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Preview.js)
- [SubmitButtonComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/SubmitButton.js)
- [LayoutComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Layout.js)


### Custom Layout
By default, RDU's layout component renders previews, file input and submit button as children of a dropzone div that responds to drag and drop events.

If you want to change this layout, e.g. to render the previews and submit button outside of your dropzone, you'll need to pass your own `LayoutComponent`.

If this sounds daunting you probably haven't looked at [Layout](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Layout.js) yet. Layout gets pre-rendered `input`, `previews`, and `submitButton` props, which makes changing RDU's layout trivial.

>`LayoutComponent` receives an `extra` prop, an object containing nearly every callback and piece of state managed by `Dropzone`. Using this object is the ultimate escape hatch, but also unnecessary except in rare cases. Log it to the console to see what's inside.
