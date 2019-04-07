---
id: why-rdu
title: Why RDU?
---


React already has dropzone/uploader libraries, two of the most popular being [react-fine-uploader](https://github.com/FineUploader/react-fine-uploader) and [React-Dropzone-Component](https://github.com/felixrieseberg/React-Dropzone-Component). Why did I write this one?

1. __The others weren't really built for React__. They're wrappers around [fine-uploader](https://fineuploader.com/) and [Dropzone.js](https://www.dropzonejs.com/), file uploaders with sprawling APIs that weren't designed with React in mind. Both weigh many times more than RDU.
2. __They're not maintained__. The react-fine-uploader and fine-uploader repos were shut down in 2018. React-Dropzone-Component hasn't seen a commit to source code since 2017; [pretty much ditto](https://gitlab.com/meno/dropzone/issues/74) with Dropzone.js.

My goal with RDU was to build a lightweight, customizable dropzone and uploader with a minimal API, sensible defaults, and great support for TypeScript. __It tries to make the easy things effortless, and the hardest things possible__.


## React Dropzone
There's also the popular and solid [react-dropzone](https://react-dropzone.netlify.com/), but this library only gives you a dropzone — it has no API for managing uploads.

File uploads with status, progress, cancellation and restart are hard to get right. And they're the most common use case for a dropzone, so I thought it would be nice to build a library that gives you a dropzone AND handles file uploads.

I also wanted a friendlier rendering API and better rendering defaults. __react-dropzone doesn't help you with rendering__:

1. __It doesn't provide file previews__. You have to write them yourself, [which means lots of boilerplate for even basic previews](https://react-dropzone.netlify.com/#previews).
2. __It doesn't provide default styles__. This makes no difference if you style everything yourself, but I wanted a component, like [React Select](https://react-select.com/styles), that looks good and works well out of the box, and makes it trivial to override individual styles.
3. __It actually renders nothing by default__. To render anything you [have to pass a render prop](https://react-dropzone.netlify.com/) as a child of `Dropzone`. This means understanding `getRootProps`, `getInputProps`, and `isDragActive`, and writing 10+ lines of boilerplate.

RDU abstracts away things like `getRootProps` and `getInputProps`, which for most cases are implementation details. Of course it lets you access them and take full control of rendering using the component injection API if you want to.


## RDU vs React Dropzone
Here's a comparison of RDU and React Dropzone for implementing a dropzone that uploads files to <https://httpbin.org/post>:

__react-dropzone-uploader__: uploads files, and removes them if upload is successful.

~~~js
const DropzoneWithPreview = () => {
  return (
    <Dropzone
      getUploadParams={() => ({ url: 'https://httpbin.org/post' })}
      onChangeStatus={({ remove }, status) => { if (status === 'headers_received') remove() }}
      accept="image/*,audio/*,video/*"
    />
  )
}
~~~

__react-dropzone__ (code mostly taken from React Dropzone's docs):

Uploads files, and removes them if upload is successful. Doesn't handle upload failure. Previews have no upload progress. No active state on drag over. No reject state if dragged files have incorrect file types. Behaves incorrectly if user drags a second group of files before first group has finished uploading (bonus points if you can spot why this happens).

~~~js
const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
}
​
const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
}
​
const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
}
​
const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
}
​
class DropzoneWithPreview extends React.Component {
  constructor() {
    super()
    this.state = {
      files: []
    }
  }
​
  onDrop(files) {
    this.setState({
      files: files.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    })
    
    const uploaders = files.map(file => {
      const formData = new FormData()
      formData.append('file', file);

      return axios.post('https://httpbin.org/post', formData, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
    })

    axios.all(uploaders).then(() => {
      // remove files once they've all been uploaded
      this.setState({ files: [] })
    })
  }
​
  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    this.state.files.forEach(file => URL.revokeObjectURL(file.preview))
  }
​
  render() {
    const {files} = this.state
​
    const thumbs = files.map(file => (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img
            src={file.preview}
            style={img}
          />
        </div>
      </div>
    ))
​
    return (
      <section>
        <Dropzone
          onDrop={this.onDrop.bind(this)}
          accept="image/*,audio/*,video/*"
        >
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drop files here</p>
            </div>
          )}
        </Dropzone>
        <aside style={thumbsContainer}>
          {thumbs}
        </aside>
      </section>
    )
  }
}
~~~

10 lines of code that are production ready, vs 100 that aren't even close.


## Contributing
If you like RDU and want to make it better, read on!

Possible improvements to RDU are tracked as [GitHub issues with the "__help wanted__" tag](https://github.com/fortana-co/react-dropzone-uploader/labels/help%20wanted).

For example, I don't know much about writing tests for React components, and I know RDU would benefit from having them. I'd also like better support for older browsers.

I'd be super happy to give contributors complete control of implementing these features.


### Running Dev
Clone the project, install dependencies, and run the dev server.

~~~sh
git clone git://github.com/fortana-co/react-dropzone-uploader.git
cd react-dropzone-uploader
npm install  # or `yarn install`
npm run dev
~~~

This runs code in `examples/src/index.js`, which has many examples that use `Dropzone`. The library source code is in the `/src` directory.
