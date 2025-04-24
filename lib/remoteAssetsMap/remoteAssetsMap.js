"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _NeonEnvironment = _interopRequireDefault(require("../components/NeonEnvironment/NeonEnvironment"));
var _remoteAssets = require("./remoteAssets.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// A structure containing local filenames and remote URLs for all remote assets used in

// eslint-disable-next-line import/extensions

// portal-core-components that we want to cache updated snapshots of at every lib build
const REMOTE_ASSETS = {
  DRUPAL_THEME_CSS: {
    name: _remoteAssets.REMOTE_ASSET_NAMES.DRUPAL_THEME_CSS,
    url: "".concat(_NeonEnvironment.default.getWebHost()).concat(_remoteAssets.REMOTE_ASSET_PATHS.DRUPAL_THEME_CSS)
  },
  DRUPAL_HEADER_JS: {
    name: _remoteAssets.REMOTE_ASSET_NAMES.DRUPAL_HEADER_JS,
    url: "".concat(_NeonEnvironment.default.getWebHost()).concat(_remoteAssets.REMOTE_ASSET_PATHS.DRUPAL_HEADER_JS)
  },
  DRUPAL_HEADER_HTML: {
    name: _remoteAssets.REMOTE_ASSET_NAMES.DRUPAL_HEADER_HTML,
    url: "".concat(_NeonEnvironment.default.getWebHost()).concat(_remoteAssets.REMOTE_ASSET_PATHS.DRUPAL_HEADER_HTML)
  },
  DRUPAL_FOOTER_HTML: {
    name: _remoteAssets.REMOTE_ASSET_NAMES.DRUPAL_FOOTER_HTML,
    url: "".concat(_NeonEnvironment.default.getWebHost()).concat(_remoteAssets.REMOTE_ASSET_PATHS.DRUPAL_FOOTER_HTML)
  }
};

// Replicate keys as attributes to allow for all variable references everywhere
Object.keys(REMOTE_ASSETS).forEach(key => {
  REMOTE_ASSETS[key].KEY = key;
});
var _default = exports.default = REMOTE_ASSETS;