---
id: quick-start
title: Quick Start
---


React Dropzone Uploader is a customizable file dropzone and uploader for React.


## Installation
`npm install --save react-dropzone-uploader`

Import default styles in your app.

~~~js
import 'react-dropzone-uploader/dist/styles.css'
~~~


## `Dropzone`
RDU handles common use cases with almost no config. The following code gives you a dropzone and clickable file input that accepts image, audio and video files. It uploads files to `https://httpbin.org/post`, and renders a button to submit files that are done uploading.

>You can edit code for this example __and see changes live__. Open your browser's console to see how RDU manages file metadata and the upload lifecycle.

<div id="rsg-root"></div>


## Browser Support
| Chrome | Firefox | Edge | Safari | IE | iOS Safari | Chrome for Android |
| --- | --- | --- | --- | --- | --- | --- |
| ✔ | ✔ | ✔ | 10+, 9\* | 11\* | ✔ | ✔ |

\* requires `Promise` polyfill, e.g. [@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill)
<script type="text/javascript" src="./assets/styleguide-quickstart/build/bundle.4e191a10.js" async="true"></script>
