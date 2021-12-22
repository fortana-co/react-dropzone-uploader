/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const siteConfig = {
  title: 'React Dropzone Uploader', // Title for your website.
  tagline: 'The file dropzone and uploader for React',
  url: 'https://react-dropzone-uploader.js.org', // Your website URL
  baseUrl: '/', // Base URL for your project */

  // Used for publishing and more
  projectName: 'react-dropzone-uploader',
  organizationName: 'fortana-co',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'quick-start', label: 'Quick Start' },
    { doc: 'api', label: 'API' },
    { doc: 'why-rdu', label: 'Why RDU?' },
    { doc: 'examples', label: 'Live Examples' },
    { search: true },
  ],

  users: [],

  /* path to images for header/footer */
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#2484FF',
    secondaryColor: '#333333',
  },

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Fortana`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/favicon.png',
  twitterImage: 'img/favicon.png',

  cname: 'react-dropzone-uploader.js.org',
  algolia: {
    apiKey: 'b81e773a58e72b7db35eb2cb18cf36ae',
    indexName: 'react-dropzone-uploader',
  },

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  repoUrl: 'https://github.com/fortana-co/react-dropzone-uploader',

  usePrism: ['js', 'jsx'],
}

module.exports = siteConfig
