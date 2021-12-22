/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function docUrl(doc, language) {
  return `${siteConfig.baseUrl}docs/${language ? `${language}/` : ""}${doc}`;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: "_self"
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const ProjectTitle = () => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>
      <MarkdownBlock>
        {siteConfig.tagline}
      </MarkdownBlock>
    </small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    const language = this.props.language || "";
    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl("quick-start")}>
              Quick Start
            </Button>

            <Button href="https://github.com/fortana-co/react-dropzone-uploader">
              Github
            </Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Features = () => (
  <div className="productShowcaseSection" style={{ textAlign: 'unset', display: 'flex', flexDirection: 'column' }}>
    <h2>Features</h2>
    <ul style={{ alignSelf: 'center' }}>
      <li>Detailed file metadata and previews, especially for image, video and audio files</li>
      <li>Upload status and progress, upload cancellation and restart</li>
      <li>Easily set auth headers and additional upload fields</li>
      <li>Customize styles using CSS or JS</li>
      <li>Take full control of rendering with component injection props</li>
      <li>Take control of upload lifecycle</li>
      <li>Modular design; use as standalone dropzone, file input, or file uploader</li>
      <li>Cross-browser support, mobile friendly, including direct uploads from camera</li>
      <li>Lightweight and fast</li>
      <li>Excellent TypeScript definitions</li>
    </ul>
  </div>
);

const Installation = () => (
  <div className="productShowcaseSection paddingBottom">
    <h2>Installation</h2>
    <MarkdownBlock>React Dropzone Uploader requires **React 16.2.0 or later.**</MarkdownBlock>
    <MarkdownBlock>```npm install --save react-dropzone-uploader```</MarkdownBlock>
  </div>
);

class Index extends React.Component {
  render() {
    const language = this.props.language || "";

    return (
      <div>
        <HomeSplash language={language} />

        <Features />

        <img
          className="gif"
          style={{ marginTop: 48, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          src="https://raw.githubusercontent.com/fortana-co/react-dropzone-uploader/master/rdu.gif"
          alt="rdu.gif"
        />

        <div className="mainContainer">
          <Installation />
        </div>
      </div>
    );
  }
}

module.exports = Index;
