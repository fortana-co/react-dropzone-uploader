---
id: customization
title: Customization
---


Notice the __"Drag Files or Click to Browse"__ text that appears by default in an empty dropzone? This is likely something you'll want to change. You can use the `inputContent` and `inputWithFilesContent` props to render any string or JSX you want. The latter is for the content that's rendered if the dropzone has files. If you'd rather not render file input content, just pass `null`.

Want to change `submitButtonContent` from its default value of __"Submit"__? Just pass a new string or JSX for this prop. To kill this text, pass an empty string or null.

See the rest of the component customization props [here](props.md#component-customization-props).


## Custom Styles
RDU's default styles are defined using CSS. They can be overridden using the `classNames` and `styles` props, which expose RDU's simple, flexible styling framework.

Both `classNames` and `styles` should be objects containing a subset of the following keys:

- `dropzone`
  + dropzone wrapper
- `dropzoneActive`
  + dropzone wrapper on drag over; __added__ to the __dropzone__ class
- `dropzoneReject`
  + dropzone wrapper on drag over if file MIME types in [DataTransfer.items](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/items) don't match `accept` prop; __added__ to the __dropzone__ class
- `dropzoneDisabled`
  + dropzone wrapper if dropzone is disabled; __added__ to the __dropzone__ class
- `input`
  + input (set to `display: none;` by default)
- `inputLabel`
  + input label
- `inputLabelWithFiles`
  + input label if dropzone has files
- `preview`
  + preview wrapper
- `previewImage`
  + preview image
- `submitButtonContainer`
  + submit button wrapper
- `submitButton`
  + submit button

Each key points to a [CSS class in the default stylesheet](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/styles.css). A class can be overridden by pointing its key to a different class name, or it can be removed by pointing its key to the empty string `''`. Note that RDU exports a `defaultClassNames` object, a map from these keys to the CSS class names in the default stylesheet.

If you prefer to use style object literals instead of CSS classes, point a key to a style object. The style object is passed to the target component's `style` prop, which means it takes precedence over its default class, but doesn't overwrite it.

To overwrite it, you can remove the default class by passing an empty string inside the `classNames` prop.

>As with any React component, declaring your `styles` object inside your render method may hurt performance, because it will cause RDU components that use these styles to re-render even if their props haven't changed.


### Adding To Default Classes
If you want to merge your class names with RDU's default classes, use the `addClassNames` prop. Added class names work like `classNames`, except instead of overwriting default classes they are added (concatenated) to them.

You can use both `classNames` and `addClassNames` if you want to overwrite some classes and add to others.

>Use `addClassNames` to override individual default styles, such as `border`, with your own styles. As long as you import RDU's default stylesheet at the top of your app's root component, you won't have to use `!important`.


## Component Customization As A Function Of State
[Component customization props](props.md#component-customization-props), including the strings and object literals in the custom styles props, can also be passed as functions that __react to the state of the dropzone__.

If, for example, you pass a __func__ instead of a __node__ for `inputContent`, this function receives `(files, extra)`, and should return the __node__ to be rendered.

`files` is the array of `fileWithMeta` objects tracked by the dropzone, and `extra` is an object with other dropzone state and props. `extra` contains the following keys: `{ active, reject, dragged, accept, multiple, minSizeBytes, maxSizeBytes, maxFiles }`.


## Component Injection
If no combination of component customization props achieves the look and feel you want, RDU provides a component injection API as an escape hatch. The API is a variation on the render props pattern, and allows you to take complete control over RDU's UX.

The `InputComponent`, `PreviewComponent`, `SubmitButtonComponent`, `LayoutComponent` props can each be used to override their corresponding default component.

These components receive the props they need to react to the current state of the dropzone and its files, including the `files` and `extra` props mentioned above.

`null`ing these props removes their corresponding components, except for `LayoutComponent`.

The file input and submit button are simple, and it's usually easy to get the right look and feel without component injection. For the file preview these props might not be enough. In this case you can pass a custom `PreviewComponent`, which should be a React component. The custom component receives the same props that would have been passed to the default component.


### Default Components
If you use the component injection API, you'll probably want to copy the default component and modify it.

You'll also need to know which props are passed to your injected components. Scroll to the bottom of the following files to see their prop types. Or, [if you're using TypeScript](https://react-dropzone-uploader.js.org/docs/typescript), add a type definition to the props received by your custom component and inspect away.

- [InputComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Input.js)
- [PreviewComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Preview.js)
- [SubmitButtonComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/SubmitButton.js)
- [LayoutComponent](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Layout.js)


### Custom Layout
By default, RDU's layout component renders previews, file input and submit button as children of a dropzone div that responds to drag and drop events.

If you want to change this layout, e.g. to render the previews and submit button outside of your dropzone, you'll need to pass your own `LayoutComponent`.

If this sounds daunting you probably haven't looked at [Layout](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Layout.js) yet. Layout gets pre-rendered `input`, `previews`, and `submitButton` props, which makes changing RDU's layout trivial.


### Pass Additional Props To Injected Components
Component injection props can be [function or class components](https://reactjs.org/docs/components-and-props.html#function-and-class-components).

A function component is literally a function that accepts a props argument and returns a React element. So, if you want to pass additional props to your injected component, just do something like this:

~~~js
<Dropzone
  PreviewComponent={props => <MyCustomPreview {...props} extraProp={10} />}
/>
~~~
