"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requiredEnvironmentVars = exports.optionalEnvironmentVars = exports.default = exports.HostRegexService = exports.DEFAULT_WEB_HOST = exports.DEFAULT_BIOREPO_HOST = exports.DEFAULT_API_HOST = void 0;
var _core = require("../../types/core");
/* eslint-disable prefer-regex-literals */

// Default hosts
const DEFAULT_API_HOST = exports.DEFAULT_API_HOST = 'https://data.neonscience.org';
const DEFAULT_WEB_HOST = exports.DEFAULT_WEB_HOST = 'https://www.neonscience.org';
const DEFAULT_BIOREPO_HOST = exports.DEFAULT_BIOREPO_HOST = 'https://biorepo.neonscience.org';
const HostRegexService = exports.HostRegexService = {
  getApiHostRegex: () => new RegExp(/^(data|cert-data|int-data|local-data)[.]neonscience[.]org$/),
  getWebHostRegex: () => new RegExp(/^(www|cert-www|int-www|local-www)[.](neonscience[.]org|.+[.]us-[0-9]{1}[.]platformsh[.]site)$/),
  getBioRepoHostRegex: () => new RegExp(/^biorepo[.]neonscience[.]org$/)
};

// Names of all environment variables that MUST be explicitly defined for the
// environment to be reported as "valid". These are evnironment variables
// that are expected to be referenced by all apps. Standard vars present in all
// node environments (e.g. PORT, NODE_ENV, etc.) are not listed here.
const requiredEnvironmentVars = exports.requiredEnvironmentVars = ['REACT_APP_NEON_PATH_API', 'REACT_APP_NEON_PATH_PUBLIC_GRAPHQL', 'REACT_APP_NEON_PATH_AUTH_API', 'REACT_APP_NEON_PATH_AUTH0_API', 'REACT_APP_NEON_ROUTER_BASE', 'REACT_APP_NEON_ROUTER_BASE_HOME'];

// Names of additional environment variables that may be referenced by
// this module depending on a given app's use case. Along with the above
// required list this makes a complete set of all environment variables
// this module will ever reference.
const optionalEnvironmentVars = exports.optionalEnvironmentVars = ['REACT_APP_NEON_PATH_LD_API', 'REACT_APP_NEON_PATH_DOWNLOAD_API', 'REACT_APP_NEON_AUTH_DISABLE_WS', 'REACT_APP_NEON_USE_GRAPHQL', 'REACT_APP_NEON_SHOW_AOP_VIEWER', 'REACT_APP_NEON_VISUS_PRODUCTS_BASE_URL', 'REACT_APP_NEON_VISUS_IFRAME_BASE_URL', 'REACT_APP_NEON_API_HOST_OVERRIDE', 'REACT_APP_BIOREPO_HOST_OVERRIDE', 'REACT_APP_NEON_WEB_HOST_OVERRIDE', 'REACT_APP_NEON_WS_HOST_OVERRIDE', 'REACT_APP_NEON_FETCH_DRUPAL_ASSETS'];
const EnvType = {
  DEV: 'development',
  PROD: 'production'
};
const NeonEnvironment = {
  isValid: requiredEnvironmentVars.every(envVar => typeof process.env[envVar] !== 'undefined'),
  isDevEnv: process.env.NODE_ENV === EnvType.DEV,
  isProdEnv: process.env.NODE_ENV === EnvType.PROD,
  useGraphql: process.env.REACT_APP_NEON_USE_GRAPHQL === 'true',
  showAopViewer: process.env.REACT_APP_NEON_SHOW_AOP_VIEWER === 'true',
  authDisableWs: process.env.REACT_APP_NEON_AUTH_DISABLE_WS === 'true',
  enableGlobalSignInState: process.env.REACT_APP_NEON_ENABLE_GLOBAL_SIGNIN_STATE === 'true',
  fetchDrupalAssets: process.env.REACT_APP_NEON_FETCH_DRUPAL_ASSETS !== 'false',
  getReactAppName: () => process.env.REACT_APP_NAME || '',
  getReactAppVersion: () => process.env.REACT_APP_VERSION || '',
  getRootApiPath: () => process.env.REACT_APP_NEON_PATH_API || '/api/v0',
  getRootGraphqlPath: () => process.env.REACT_APP_NEON_PATH_PUBLIC_GRAPHQL || '/graphql',
  getRootJsonLdPath: () => "".concat(NeonEnvironment.getRootApiPath()).concat(process.env.REACT_APP_NEON_PATH_LD_API),
  getRootAuthApiPath: () => process.env.REACT_APP_NEON_PATH_AUTH_API || '/api/auth/v0',
  getRootAuth0ApiPath: () => process.env.REACT_APP_NEON_PATH_AUTH0_API || '/auth0',
  getRootDownloadApiPath: () => process.env.REACT_APP_NEON_PATH_DOWNLOAD_API || '/api/download/v0',
  getApiPath: {
    data: () => '/data',
    prototype: () => '/prototype',
    documents: () => '/documents',
    quickStartGuides: () => '/documents/quick-start-guides',
    products: () => '/products',
    productBundles: () => '/products/bundles',
    releases: () => '/releases',
    sites: () => '/sites',
    locations: () => '/locations',
    samples: () => '/samples',
    taxonomy: () => '/taxonomy',
    taxonomyDownload: () => '/taxonomy/download',
    arcgisAssets: () => '/arcgis-assets',
    doiCitations: () => '/dois/citations'
  },
  getDownloadApiPath: {
    downloadStream: () => '/stream',
    manifestRollup: () => '/manifest/rollup',
    prototypeDownloadStream: () => '/prototype/stream',
    prototypeManifestRollup: () => '/prototype/manifest/rollup'
  },
  getApiLdPath: {
    repo: () => '/repository'
  },
  getAuthPath: {
    login: () => "".concat(NeonEnvironment.getRootAuth0ApiPath(), "/login"),
    logout: () => "".concat(NeonEnvironment.getRootAuth0ApiPath(), "/logout"),
    userInfo: () => "".concat(NeonEnvironment.getRootAuth0ApiPath(), "/userinfo"),
    seamlessLogin: () => "".concat(NeonEnvironment.getAuthPath.login(), "?seamless=true"),
    silentLogin: () => "".concat(NeonEnvironment.getAuthPath.login(), "?silent=true"),
    silentLogout: () => "".concat(NeonEnvironment.getAuthPath.logout(), "?silent=true"),
    notifications: () => "".concat(NeonEnvironment.getRootAuth0ApiPath(), "/liferaynotifications")
  },
  getAuthApiPath: {
    ws: () => '/ws'
  },
  authTopics: {
    getAuth0: () => '/consumer/topic/auth0'
  },
  getDataProductTaxonTypesPath: () => "".concat(NeonEnvironment.getFullApiPath('taxonomy'), "/types"),
  getTaxonTypeDataProductsPath: () => "".concat(NeonEnvironment.getFullApiPath('taxonomy'), "/products"),
  getVisusProductsBaseUrl: () => process.env.REACT_APP_NEON_VISUS_PRODUCTS_BASE_URL,
  getVisusIframeBaseUrl: () => process.env.REACT_APP_NEON_VISUS_IFRAME_BASE_URL,
  getRouterBasePath: () => process.env.REACT_APP_NEON_ROUTER_BASE || '',
  getRouterBaseHomePath: () => process.env.REACT_APP_NEON_ROUTER_BASE_HOME || '',
  getApiHostOverride: () => process.env.REACT_APP_NEON_API_HOST_OVERRIDE || DEFAULT_API_HOST,
  getBioRepoHostOverride: () => process.env.REACT_APP_BIOREPO_HOST_OVERRIDE || DEFAULT_BIOREPO_HOST,
  getWebHostOverride: () => process.env.REACT_APP_NEON_WEB_HOST_OVERRIDE || DEFAULT_WEB_HOST,
  getWsHostOverride: () => process.env.REACT_APP_NEON_WS_HOST_OVERRIDE || DEFAULT_API_HOST,
  route: {
    home: () => '/home',
    account: () => '/myaccount',
    getFullRoute: function () {
      let route = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return "".concat(NeonEnvironment.getRouterBasePath()).concat(route);
    },
    buildRouteFromHost: function () {
      let route = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return "".concat(NeonEnvironment.getApiHost()).concat(NeonEnvironment.route.getFullRoute(route));
    },
    buildHomeRoute: () => "".concat(NeonEnvironment.getWebHost()).concat(NeonEnvironment.route.home()),
    buildAccountRoute: () => // TODO: replace with web host once switch over happens
    "".concat(NeonEnvironment.getApiHost()).concat(NeonEnvironment.route.account())
  },
  /**
   * Gets the window.NEON_SERVER_DATA injected from the server environment.
   * @return {Object} The structured server data object
   */
  getNeonServerData: () => {
    /* eslint-disable */
    // @ts-ignore
    if (typeof WorkerGlobalScope === 'function') {
      // @ts-ignore
      return self.NEON_SERVER_DATA ? self.NEON_SERVER_DATA : null;
    }
    /* eslint-enable */
    if (typeof window === 'object') {
      // @ts-ignore
      return window.NEON_SERVER_DATA ? window.NEON_SERVER_DATA : null;
    }
    return null;
  },
  getNeonServerDataWebHost: () => {
    const serverData = NeonEnvironment.getNeonServerData();
    if (serverData && typeof serverData.NeonWebHost === 'string') {
      const apiHost = serverData.NeonWebHost;
      try {
        const {
          hostname: apiHostname
        } = new URL(apiHost);
        if (NeonEnvironment.isWebHostValid(apiHostname)) {
          return apiHost;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse web host as URL', [e]);
      }
    }
    return null;
  },
  getNeonServerDataApiHost: () => {
    const serverData = NeonEnvironment.getNeonServerData();
    if (serverData && typeof serverData.NeonPublicAPIHost === 'string') {
      const allowInternal = typeof serverData.NeonPublicAPIHostAllowInternal === 'boolean' ? serverData.NeonPublicAPIHostAllowInternal : false;
      const apiHost = serverData.NeonPublicAPIHost;
      try {
        const {
          hostname: apiHostname
        } = new URL(apiHost);
        if (NeonEnvironment.isApiHostValid(apiHostname) || allowInternal) {
          return apiHost;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse API host as URL', [e]);
      }
    }
    return null;
  },
  getNeonServerDataBioRepoHost: () => {
    const serverData = NeonEnvironment.getNeonServerData();
    if (serverData && typeof serverData.NeonBioRepoHost === 'string') {
      const bioRepoHost = serverData.NeonBioRepoHost;
      try {
        const {
          hostname: bioRepoHostname
        } = new URL(bioRepoHost);
        if (NeonEnvironment.isBioRepoHostValid(bioRepoHostname)) {
          return bioRepoHost;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse Biorepo host as URL', [e]);
      }
    }
    return null;
  },
  getWebHost: () => {
    // Check for local override
    if (NeonEnvironment.isDevEnv && NeonEnvironment.getWebHostOverride()) {
      return NeonEnvironment.getWebHostOverride();
    }
    // Check for server data env var
    const webHost = NeonEnvironment.getNeonServerDataWebHost();
    if (webHost !== null) {
      return webHost;
    }
    /* eslint-disable */
    // @ts-ignore
    if (typeof WorkerGlobalScope === 'function' && typeof self.location === 'object') {
      if (NeonEnvironment.isWebHostValid(self.location.host)) {
        return "".concat(self.location.protocol, "//").concat(self.location.host);
      }
      return DEFAULT_WEB_HOST;
    }
    /* eslint-enable */
    if (NeonEnvironment.isWebHostValid(window.location.host)) {
      return "".concat(window.location.protocol, "//").concat(window.location.host);
    }
    return DEFAULT_WEB_HOST;
  },
  getApiHost: () => {
    // Check for local override
    if (NeonEnvironment.isDevEnv && NeonEnvironment.getApiHostOverride()) {
      return NeonEnvironment.getApiHostOverride();
    }
    // Check for server data env var
    const apiHost = NeonEnvironment.getNeonServerDataApiHost();
    if (apiHost !== null) {
      return apiHost;
    }
    /* eslint-disable */
    // @ts-ignore
    if (typeof WorkerGlobalScope === 'function' && typeof self.location === 'object') {
      if (NeonEnvironment.isApiHostValid(self.location.host)) {
        return "".concat(self.location.protocol, "//").concat(self.location.host);
      }
      return DEFAULT_API_HOST;
    }
    /* eslint-enable */
    if (NeonEnvironment.isApiHostValid(window.location.host)) {
      return "".concat(window.location.protocol, "//").concat(window.location.host);
    }
    return DEFAULT_API_HOST;
  },
  getBioRepoHost: () => {
    // Check for local override
    if (NeonEnvironment.isDevEnv && NeonEnvironment.getBioRepoHostOverride()) {
      return NeonEnvironment.getBioRepoHostOverride();
    }
    // Check for server data env var
    const bioRepoHost = NeonEnvironment.getNeonServerDataBioRepoHost();
    if (bioRepoHost !== null) {
      return bioRepoHost;
    }
    /* eslint-disable */
    // @ts-ignore
    if (typeof WorkerGlobalScope === 'function' && typeof self.location === 'object') {
      if (NeonEnvironment.isBioRepoHostValid(self.location.host)) {
        return "".concat(self.location.protocol, "//").concat(self.location.host);
      }
      return DEFAULT_BIOREPO_HOST;
    }
    /* eslint-enable */
    if (NeonEnvironment.isBioRepoHostValid(window.location.host)) {
      return "".concat(window.location.protocol, "//").concat(window.location.host);
    }
    return DEFAULT_BIOREPO_HOST;
  },
  getWebSocketHost: () => {
    if (NeonEnvironment.isDevEnv && NeonEnvironment.getWsHostOverride()) {
      return NeonEnvironment.getWsHostOverride();
    }
    const apiHost = NeonEnvironment.getApiHost();
    const hostUrl = new URL(apiHost);
    const {
      protocol: apiProtocol,
      hostname: apiHostname
    } = hostUrl;
    return apiProtocol.startsWith('https') ? "wss://".concat(apiHostname) : "ws://".concat(apiHostname);
  },
  /**
   * Valid host names include localhost and known NEON hosts
   * @param host
   * @returns
   */
  isApiHostValid: host => {
    if (typeof host !== 'string' || host.length <= 0) {
      return false;
    }
    const regex = HostRegexService.getApiHostRegex();
    if (!regex) return false;
    const matches = regex.exec(host);
    if (!matches) return false;
    return matches.length > 0;
  },
  /**
   * Valid host names include localhost and known NEON Biorepo hosts
   * @param host
   * @returns
   */
  isBioRepoHostValid: host => {
    if (typeof host !== 'string' || host.length <= 0) {
      return false;
    }
    const regex = HostRegexService.getBioRepoHostRegex();
    if (!regex) return false;
    const matches = regex.exec(host);
    if (!matches) return false;
    return matches.length > 0;
  },
  /**
   * Valid host names include localhost and known NEON hosts
   * @param host
   * @returns
   */
  isWebHostValid: host => {
    if (typeof host !== 'string' || host.length <= 0) {
      return false;
    }
    const regex = HostRegexService.getWebHostRegex();
    if (!regex) return false;
    const matches = regex.exec(host);
    if (!matches) return false;
    return matches.length > 0;
  },
  /**
   * Gets the API token header name
   * @return {string} The API token header name
   */
  getApiTokenHeader: () => {
    const serverData = NeonEnvironment.getNeonServerData();
    if (serverData && typeof serverData.NeonPublicAPITokenHeader === 'string') {
      return serverData.NeonPublicAPITokenHeader;
    }
    return '';
  },
  /**
   * Gets the API token value
   * @return {string} The API token value
   */
  getApiToken: () => {
    const serverData = NeonEnvironment.getNeonServerData();
    if (serverData && typeof serverData.NeonPublicAPIToken === 'string') {
      return serverData.NeonPublicAPIToken;
    }
    return '';
  },
  /**
   * Determines if the silent authentication process should be prevented
   * based on environment or browser as external dependencies are required.
   * @return {AuthSilentType}
   */
  getAuthSilentType: () => {
    const serverData = NeonEnvironment.getNeonServerData();
    if (serverData && typeof serverData.NeonAuthSilentType === 'string' && serverData.NeonAuthSilentType.length > 0) {
      return serverData.NeonAuthSilentType;
    }
    return _core.AuthSilentType.DISABLED;
  },
  getFullApiPath: function () {
    let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    const host = NeonEnvironment.getApiHost();
    const root = ['download', 'manifest'].includes(path) ? '' : NeonEnvironment.getRootApiPath();
    return NeonEnvironment.getApiPath[path] ? "".concat(host).concat(root).concat(NeonEnvironment.getApiPath[path]()) : "".concat(host).concat(root);
  },
  getFullDownloadApiPath: function () {
    let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    const host = NeonEnvironment.getApiHost();
    const root = NeonEnvironment.getRootDownloadApiPath();
    return NeonEnvironment.getDownloadApiPath[path] ? "".concat(host).concat(root).concat(NeonEnvironment.getDownloadApiPath[path]()) : "".concat(host).concat(root);
  },
  getFullJsonLdApiPath: function () {
    let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    const host = NeonEnvironment.getApiHost();
    const root = NeonEnvironment.getRootJsonLdPath();
    let appliedPath = '';
    if (['products', 'prototype'].includes(path)) {
      appliedPath = NeonEnvironment.getApiPath[path]();
    } else if (typeof NeonEnvironment.getApiLdPath[path] === 'function') {
      appliedPath = NeonEnvironment.getApiLdPath[path]();
    }
    return appliedPath ? "".concat(host).concat(root).concat(appliedPath) : "".concat(host).concat(root);
  },
  /**
   * Creates the full auth path from the host and path.
   * Auth path refers to /auth0.
   * @param {string} path - The path to build from
   */
  getFullAuthPath: function () {
    let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    const host = NeonEnvironment.getApiHost();
    return NeonEnvironment.getAuthPath[path] ? "".concat(host).concat(NeonEnvironment.getAuthPath[path]()) : "".concat(host);
  },
  /**
   * Creates the full auth API path from the host and path.
   * Auth API path refers to /api/auth/v0.
   * @param {string} path - The path to build from
   * @param {boolean} useWs - Option to build a websocket path
   */
  getFullAuthApiPath: function () {
    let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let useWs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const host = useWs ? NeonEnvironment.getWebSocketHost() : NeonEnvironment.getApiHost();
    const root = NeonEnvironment.getRootAuthApiPath();
    const appliedPath = Object.keys(NeonEnvironment.getAuthApiPath).includes(path) ? NeonEnvironment.getAuthApiPath[path]() : '';
    return appliedPath ? "".concat(host).concat(root).concat(appliedPath) : "".concat(host).concat(root);
  },
  getFullGraphqlPath: () => {
    const host = NeonEnvironment.getApiHost();
    return "".concat(host).concat(NeonEnvironment.getRootGraphqlPath());
  },
  /**
   * Indicates when a CORS request is required
   * @returns
   */
  requireCors: () => {
    if (window.location.host.includes('localhost')) {
      return false;
    }
    return !NeonEnvironment.isApiHostValid(window.location.host);
  }
};
Object.freeze(NeonEnvironment);
var _default = exports.default = NeonEnvironment;