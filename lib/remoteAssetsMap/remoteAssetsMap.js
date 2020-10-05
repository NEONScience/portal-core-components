"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// A structure containing local filenames and remote URLs for all remote assets used in
// portal-core-components that we want to cache updated snapshots of at every lib build
var REMOTE_ASSETS = {
  DRUPAL_THEME_CSS: {
    name: 'drupal-theme.css',
    url: 'https://preview.neonscience.org/themes/custom/neon/build/components/theme/theme.css'
  },
  DRUPAL_HEADER_JS: {
    name: 'drupal-header.js',
    url: 'https://preview.neonscience.org/themes/custom/neon/build/components/header/header.js'
  },
  DRUPAL_HEADER_HTML: {
    name: 'drupal-header.html',
    url: 'https://preview.neonscience.org/neon-assets/partial/header'
  },
  DRUPAL_FOOTER_HTML: {
    name: 'drupal-footer.html',
    url: 'https://preview.neonscience.org/neon-assets/partial/footer'
  }
}; // Replicate keys as attributes to allow for all variable references everywhere

Object.keys(REMOTE_ASSETS).forEach(function (key) {
  REMOTE_ASSETS[key].KEY = key;
});
var _default = REMOTE_ASSETS;
exports.default = _default;