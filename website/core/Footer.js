/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return `${baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>

          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('api')}>API Reference</a>

            <a href={this.docUrl('why-rdu')}>Why RDU?</a>

            <a href={this.docUrl('examples')}>Live Examples</a>
          </div>

          <div>
            <h5>Community</h5>
            <a
              href="http://stackoverflow.com/questions/tagged/react-dropzone-uploader"
              target="_blank"
              rel="noreferrer noopener"
            >
              Stack Overflow
            </a>

            <a
              href={this.props.config.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub
            </a>

            <a
              href={`${this.props.config.repoUrl}/labels/help%20wanted`}
              target="_blank"
              rel="noreferrer noopener"
            >
              Contribute
            </a>

            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/fortana-co/react-dropzone-uploader/stargazers"
              data-show-count="true"
              data-count-aria-label="Stargazers on GitHub"
              aria-label="Star this project on GitHub"
            >
              Star
            </a>
          </div>

          <div>
            <h5>Built With</h5>
            <a href="https://docusaurus.io/">Docusaurus for website generation</a>

            <a href="https://pages.github.com/">GitHub Pages for hosting</a>

            <a href="https://js.org/">js.org for the domain name</a>

            <a href="https://community.algolia.com/docsearch/">Algolia for search</a>
          </div>
        </section>

        <a
          href="https://code.facebook.com/projects/"
          target="_blank"
          rel="noreferrer noopener"
          className="fbOpenSource">
          <img
            src={`${this.props.config.baseUrl}img/oss_logo.png`}
            alt="Facebook Open Source"
            width="170"
            height="45"
          />
        </a>
        <section className="copyright">
          Copyright &copy; {new Date().getFullYear()}{' '}
          <a href="https://fortana.co">
            Fortana
          </a>.
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
