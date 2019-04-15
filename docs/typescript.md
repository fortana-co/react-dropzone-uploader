---
id: typescript
title: TypeScript
---


RDU [ships with precise TypeScript definitions](https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/Dropzone.d.ts) for just about everything in the library.

RDU has a flexible and powerful API. Using TypeScript will help you use it properly, and help you get a handle on everything it can do.

It makes it especially easy to see and inspect the props passed to injected components, and the arguments passed to function props. 🚀

~~~js
import Dropzone, { IDropzoneProps, ILayoutProps } from 'react-dropzone-uploader'

// add type defs to custom LayoutComponent prop to easily inspect props passed to injected components
const Layout = ({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles } }: ILayoutProps) => {
  return (
    <div>
      {previews}

      <div {...dropzoneProps}>{files.length < maxFiles && input}</div>

      {files.length > 0 && submitButton}
    </div>
  )
}

const CustomLayout = () => {
  // add type defs to function props to get TS support inside function bodies,
  // and not just where functions are passed as props into Dropzone
  const getUploadParams: IDropzoneProps['getUploadParams'] = () => ({ url: 'https://httpbin.org/post' })

  const handleSubmit: IDropzoneProps['onSubmit'] = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      LayoutComponent={Layout}
      onSubmit={handleSubmit}
      classNames={{ inputLabelWithFiles: defaultClassNames.inputLabel }}
      inputContent="Drop Files (Custom Layout)"
    />
  )
}
~~~

If you want more examples, [check out the ones used to test RDU's TypeScript definitions](https://github.com/fortana-co/react-dropzone-uploader/blob/master/examples/src/index.tsx).
