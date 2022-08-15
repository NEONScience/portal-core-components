// A structure containing local filenames and remote URLs for all remote assets used in

// eslint-disable-next-line import/extensions
import NeonEnvironment from '../components/NeonEnvironment/NeonEnvironment.ts';
// eslint-disable-next-line import/extensions
import { REMOTE_ASSET_PATHS, REMOTE_ASSET_NAMES } from './remoteAssets.js';

// portal-core-components that we want to cache updated snapshots of at every lib build
const REMOTE_ASSETS = {
  DRUPAL_THEME_CSS: {
    name: REMOTE_ASSET_NAMES.DRUPAL_THEME_CSS,
    url: `${NeonEnvironment.getWebHost()}${REMOTE_ASSET_PATHS.DRUPAL_THEME_CSS}`,
  },
  DRUPAL_HEADER_JS: {
    name: REMOTE_ASSET_NAMES.DRUPAL_HEADER_JS,
    url: `${NeonEnvironment.getWebHost()}${REMOTE_ASSET_PATHS.DRUPAL_HEADER_JS}`,
  },
  DRUPAL_HEADER_HTML: {
    name: REMOTE_ASSET_NAMES.DRUPAL_HEADER_HTML,
    url: `${NeonEnvironment.getWebHost()}${REMOTE_ASSET_PATHS.DRUPAL_HEADER_HTML}`,
  },
  DRUPAL_FOOTER_HTML: {
    name: REMOTE_ASSET_NAMES.DRUPAL_FOOTER_HTML,
    url: `${NeonEnvironment.getWebHost()}${REMOTE_ASSET_PATHS.DRUPAL_FOOTER_HTML}`,
  },
};

// Replicate keys as attributes to allow for all variable references everywhere
Object.keys(REMOTE_ASSETS).forEach((key) => { REMOTE_ASSETS[key].KEY = key; });

export default REMOTE_ASSETS;
