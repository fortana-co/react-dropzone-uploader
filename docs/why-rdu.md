---
id: why-rdu
title: Why RDU?
---


React already has dropzone/uploader libraries (the most popular being [react-fine-uploader](https://github.com/FineUploader/react-fine-uploader) and [React-Dropzone-Component](https://github.com/felixrieseberg/React-Dropzone-Component)) so you might be wondering why I wrote this one.

1. __They weren't really built for React__. They're wrappers around [fine-uploader](https://fineuploader.com/) and [Dropzone.js](https://www.dropzonejs.com/), file uploaders with sprawling APIs that weren't designed with React in mind. Both weigh many times more than RDU.
2. __They're not maintained__. The react-fine-uploader and fine-uploader repos were archived in 2018. React-Dropzone-Component hasn't seen a commit to source code since 2017; [pretty much ditto](https://gitlab.com/meno/dropzone/issues/74) with Dropzone.js.

---

There's also the popular and solid [react-dropzone](https://react-dropzone.netlify.com/), but this library only gives you a dropzone -- it has no API for managing uploads.

Uploading files, especially with status, progress, cancellation and restart, is hard to get right. And it's the most common use case for a dropzone, so I thought it would be nice to have a good library that handles both.

I also wanted a friendlier rendering API and better rendering defaults. __react-dropzone doesn't help you with rendering__:

1. __It doesn't provide file previews__. You have to write them yourself, [which means lots of boilerplate for even basic previews](https://react-dropzone.netlify.com/#previews).
2. __It doesn't provide default styles__. This makes no difference if you style everything yourself, but I wanted a component, like [React Select](https://react-select.com/styles), that looks good and works well out of the box, and makes it trivial to override individual styles.
3. __It actually renders nothing by default__. To render anything you [have to pass a render prop](https://react-dropzone.netlify.com/) as a child of `Dropzone`. This means understanding `getRootProps`, `getInputProps`, and `isDragActive`, and writing 10+ lines of boilerplate.

RDU abstracts away things like `getRootProps` and `getInputProps`, which for most cases are implementation details. Of course it lets you access them and take full control of rendering using the component injection API if you need to.

---

My goal with RDU was to build a lightweight, customizable dropzone and uploader with a minimal API and sensible defaults. __It tries to make the easy things effortless, and the hardest things possible__.


## Contributing
If you like RDU and want to make it better, read on!

Possible improvements to RDU are tracked as [GitHub issues with the "__help wanted__" tag](https://github.com/fortana-co/react-dropzone-uploader/labels/help%20wanted).

For example, I know nothing about writing tests for React components, and I know RDU would benefit from having them. I'd also like to add TypeScript annotations, and better support for older browsers.

I would be super happy to give contributors complete control of implementing these features.
