"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requiredEnvironmentVars = exports.optionalEnvironmentVars = exports.default = exports.HostRegexService = exports.DEFAULT_WEB_HOST = exports.DEFAULT_API_HOST = void 0;

var _core = require("../../types/core");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

// Default hosts
var DEFAULT_API_HOST = 'https://data.neonscience.org';
exports.DEFAULT_API_HOST = DEFAULT_API_HOST;
var DEFAULT_WEB_HOST = 'https://www.neonscience.org';
exports.DEFAULT_WEB_HOST = DEFAULT_WEB_HOST;
var HostRegexService = {
  getApiHostRegex: function getApiHostRegex() {
    return new RegExp(/^(data|cert-data|int-data|local-data)[.]neonscience[.]org$/);
  },
  getWebHostRegex: function getWebHostRegex() {
    return new RegExp(/^(www|cert-www|int-www|local-www)[.](neonscience[.]org|.+[.]us-[0-9]{1}[.]platformsh[.]site)$/);
  },
  getDataCiteApiHostRegex: function getDataCiteApiHostRegex() {
    return new RegExp(/^(api|api[.]test)[.]datacite[.]org$/);
  }
}; // Names of all environment variables that MUST be explicitly defined for the
// environment to be reported as "valid". These are evnironment variables
// that are expected to be referenced by all apps. Standard vars present in all
// node environments (e.g. PORT, NODE_ENV, etc.) are not listed here.

exports.HostRegexService = HostRegexService;
var requiredEnvironmentVars = ['REACT_APP_NEON_PATH_API', 'REACT_APP_NEON_PATH_PUBLIC_GRAPHQL', 'REACT_APP_NEON_PATH_AUTH_API', 'REACT_APP_NEON_PATH_AUTH0_API', 'REACT_APP_NEON_ROUTER_BASE', 'REACT_APP_NEON_ROUTER_BASE_HOME']; // Names of additional environment variables that may be referenced by
// this module depending on a given app's use case. Along with the above
// required list this makes a complete set of all environment variables
// this module will ever reference.

exports.requiredEnvironmentVars = requiredEnvironmentVars;
var optionalEnvironmentVars = ['REACT_APP_NEON_PATH_LD_API', 'REACT_APP_NEON_PATH_DOWNLOAD_API', 'REACT_APP_NEON_AUTH_DISABLE_WS', 'REACT_APP_NEON_USE_GRAPHQL', 'REACT_APP_NEON_SHOW_AOP_VIEWER', 'REACT_APP_NEON_VISUS_PRODUCTS_BASE_URL', 'REACT_APP_NEON_VISUS_IFRAME_BASE_URL', 'REACT_APP_NEON_DEFAULT_DATA_CITE_API_HOST', 'REACT_APP_NEON_API_HOST_OVERRIDE', 'REACT_APP_NEON_WEB_HOST_OVERRIDE', 'REACT_APP_NEON_WS_HOST_OVERRIDE', 'REACT_APP_NEON_DATA_CITE_API_HOST_OVERRIDE'];
exports.optionalEnvironmentVars = optionalEnvironmentVars;
var EnvType = {
  DEV: 'development',
  PROD: 'production'
};
var NeonEnvironment = {
  isValid: requiredEnvironmentVars.every(function (envVar) {
    return typeof process.env[envVar] !== 'undefined';
  }),
  isDevEnv: process.env.NODE_ENV === EnvType.DEV,
  isProdEnv: process.env.NODE_ENV === EnvType.PROD,
  useGraphql: process.env.REACT_APP_NEON_USE_GRAPHQL === 'true',
  showAopViewer: process.env.REACT_APP_NEON_SHOW_AOP_VIEWER === 'true',
  authDisableWs: process.env.REACT_APP_NEON_AUTH_DISABLE_WS === 'true',
  enableGlobalSignInState: process.env.REACT_APP_NEON_ENABLE_GLOBAL_SIGNIN_STATE === 'true',
  getRootApiPath: function getRootApiPath() {
    return process.env.REACT_APP_NEON_PATH_API || '/api/v0';
  },
  getRootGraphqlPath: function getRootGraphqlPath() {
    return process.env.REACT_APP_NEON_PATH_PUBLIC_GRAPHQL || '/graphql';
  },
  getRootJsonLdPath: function getRootJsonLdPath() {
    return "".concat(NeonEnvironment.getRootApiPath()).concat(process.env.REACT_APP_NEON_PATH_LD_API);
  },
  getRootAuthApiPath: function getRootAuthApiPath() {
    return process.env.REACT_APP_NEON_PATH_AUTH_API || '/api/auth/v0';
  },
  getRootAuth0ApiPath: function getRootAuth0ApiPath() {
    return process.env.REACT_APP_NEON_PATH_AUTH0_API || '/auth0';
  },
  getRootDownloadApiPath: function getRootDownloadApiPath() {
    return process.env.REACT_APP_NEON_PATH_DOWNLOAD_API || '/api/download/v0';
  },
  getApiPath: {
    data: function data() {
      return '/data';
    },
    prototype: function prototype() {
      return '/prototype';
    },
    documents: function documents() {
      return '/documents';
    },
    quickStartGuides: function quickStartGuides() {
      return '/documents/quick-start-guides';
    },
    products: function products() {
      return '/products';
    },
    productBundles: function productBundles() {
      return '/products/bundles';
    },
    releases: function releases() {
      return '/releases';
    },
    sites: function sites() {
      return '/sites';
    },
    locations: function locations() {
      return '/locations';
    },
    samples: function samples() {
      return '/samples';
    },
    taxonomy: function taxonomy() {
      return '/taxonomy';
    },
    taxonomyDownload: function taxonomyDownload() {
      return '/taxonomy/download';
    },
    arcgisAssets: function arcgisAssets() {
      return '/arcgis-assets';
    }
  },
  getDownloadApiPath: {
    downloadStream: function downloadStream() {
      return '/stream';
    },
    manifestRollup: function manifestRollup() {
      return '/manifest/rollup';
    },
    prototypeDownloadStream: function prototypeDownloadStream() {
      return '/prototype/stream';
    },
    prototypeManifestRollup: function prototypeManifestRollup() {
      return '/prototype/manifest/rollup';
    }
  },
  getApiLdPath: {
    repo: function repo() {
      return '/repository';
    }
  },
  getAuthPath: {
    login: function login() {
      return "".concat(NeonEnvironment.getRootAuth0ApiPath(), "/login");
    },
    logout: function logout() {
      return "".concat(NeonEnvironment.getRootAuth0ApiPath(), "/logout");
    },
    userInfo: function userInfo() {
      return "".concat(NeonEnvironment.getRootAuth0ApiPath(), "/userinfo");
    },
    seamlessLogin: function seamlessLogin() {
      return "".concat(NeonEnvironment.getAuthPath.login(), "?seamless=true");
    },
    silentLogin: function silentLogin() {
      return "".concat(NeonEnvironment.getAuthPath.login(), "?silent=true");
    },
    silentLogout: function silentLogout() {
      return "".concat(NeonEnvironment.getAuthPath.logout(), "?silent=true");
    },
    notifications: function notifications() {
      return "".concat(NeonEnvironment.getRootAuth0ApiPath(), "/liferaynotifications");
    }
  },
  getAuthApiPath: {
    ws: function ws() {
      return '/ws';
    }
  },
  authTopics: {
    getAuth0: function getAuth0() {
      return '/consumer/topic/auth0';
    }
  },
  getDataProductTaxonTypesPath: function getDataProductTaxonTypesPath() {
    return "".concat(NeonEnvironment.getFullApiPath('taxonomy'), "/types");
  },
  getTaxonTypeDataProductsPath: function getTaxonTypeDataProductsPath() {
    return "".concat(NeonEnvironment.getFullApiPath('taxonomy'), "/products");
  },
  getVisusProductsBaseUrl: function getVisusProductsBaseUrl() {
    return process.env.REACT_APP_NEON_VISUS_PRODUCTS_BASE_URL;
  },
  getVisusIframeBaseUrl: function getVisusIframeBaseUrl() {
    return process.env.REACT_APP_NEON_VISUS_IFRAME_BASE_URL;
  },
  getDataCiteApiHostDefault: function getDataCiteApiHostDefault() {
    return process.env.REACT_APP_NEON_DEFAULT_DATA_CITE_API_HOST || '';
  },
  getRouterBasePath: function getRouterBasePath() {
    return process.env.REACT_APP_NEON_ROUTER_BASE || '';
  },
  getRouterBaseHomePath: function getRouterBaseHomePath() {
    return process.env.REACT_APP_NEON_ROUTER_BASE_HOME || '';
  },
  getApiHostOverride: function getApiHostOverride() {
    return process.env.REACT_APP_NEON_API_HOST_OVERRIDE || DEFAULT_API_HOST;
  },
  getWebHostOverride: function getWebHostOverride() {
    return process.env.REACT_APP_NEON_WEB_HOST_OVERRIDE || DEFAULT_WEB_HOST;
  },
  getWsHostOverride: function getWsHostOverride() {
    return process.env.REACT_APP_NEON_WS_HOST_OVERRIDE || DEFAULT_API_HOST;
  },
  getDataCiteApiHostOverride: function getDataCiteApiHostOverride() {
    return process.env.REACT_APP_NEON_DATA_CITE_API_HOST_OVERRIDE;
  },
  route: {
    home: function home() {
      return '/home';
    },
    account: function account() {
      return '/myaccount';
    },
    getFullRoute: function getFullRoute() {
      var route = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return "".concat(NeonEnvironment.getRouterBasePath()).concat(route);
    },
    buildRouteFromHost: function buildRouteFromHost() {
      var route = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return "".concat(NeonEnvironment.getApiHost()).concat(NeonEnvironment.route.getFullRoute(route));
    },
    buildHomeRoute: function buildHomeRoute() {
      return "".concat(NeonEnvironment.getWebHost()).concat(NeonEnvironment.route.home());
    },
    buildAccountRoute: function buildAccountRoute() {
      return (// TODO: replace with web host once switch over happens
        "".concat(NeonEnvironment.getApiHost()).concat(NeonEnvironment.route.account())
      );
    }
  },

  /**
   * Gets the window.NEON_SERVER_DATA injected from the server environment.
   * @return {Object} The structured server data object
   */
  getNeonServerData: function getNeonServerData() {
    /* eslint-disable */
    // @ts-ignore
    if (typeof WorkerGlobalScope === 'function') {
      // @ts-ignore
      return self.NEON_SERVER_DATA ? self.NEON_SERVER_DATA : null;
    }
    /* eslint-enable */


    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
      // @ts-ignore
      return window.NEON_SERVER_DATA ? window.NEON_SERVER_DATA : null;
    }

    return null;
  },
  getNeonServerDataWebHost: function getNeonServerDataWebHost() {
    var serverData = NeonEnvironment.getNeonServerData();

    if (serverData && typeof serverData.NeonWebHost === 'string') {
      var apiHost = serverData.NeonWebHost;

      try {
        var _URL = new URL(apiHost),
            apiHostname = _URL.hostname;

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
  getNeonServerDataApiHost: function getNeonServerDataApiHost() {
    var serverData = NeonEnvironment.getNeonServerData();

    if (serverData && typeof serverData.NeonPublicAPIHost === 'string') {
      var apiHost = serverData.NeonPublicAPIHost;

      try {
        var _URL2 = new URL(apiHost),
            apiHostname = _URL2.hostname;

        if (NeonEnvironment.isApiHostValid(apiHostname)) {
          return apiHost;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse API host as URL', [e]);
      }
    }

    return null;
  },
  getNeonServerDataDataCiteApiHost: function getNeonServerDataDataCiteApiHost() {
    var serverData = NeonEnvironment.getNeonServerData();

    if (serverData && typeof serverData.DataCiteAPIHost === 'string') {
      var apiHost = serverData.DataCiteAPIHost;

      try {
        var _URL3 = new URL(apiHost),
            apiHostname = _URL3.hostname;

        if (NeonEnvironment.isDataCiteApiHostValid(apiHostname)) {
          return apiHost;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse DataCite API host as URL', [e]);
      }
    }

    return null;
  },
  getWebHost: function getWebHost() {
    // Check for local override
    if (NeonEnvironment.isDevEnv && NeonEnvironment.getWebHostOverride()) {
      return NeonEnvironment.getWebHostOverride();
    } // Check for server data env var


    var webHost = NeonEnvironment.getNeonServerDataWebHost();

    if (webHost !== null) {
      return webHost;
    }
    /* eslint-disable */
    // @ts-ignore


    if (typeof WorkerGlobalScope === 'function' && _typeof(self.location) === 'object') {
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
  getApiHost: function getApiHost() {
    // Check for local override
    if (NeonEnvironment.isDevEnv && NeonEnvironment.getApiHostOverride()) {
      return NeonEnvironment.getApiHostOverride();
    } // Check for server data env var


    var apiHost = NeonEnvironment.getNeonServerDataApiHost();

    if (apiHost !== null) {
      return apiHost;
    }
    /* eslint-disable */
    // @ts-ignore


    if (typeof WorkerGlobalScope === 'function' && _typeof(self.location) === 'object') {
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
  getWebSocketHost: function getWebSocketHost() {
    if (NeonEnvironment.isDevEnv && NeonEnvironment.getWsHostOverride()) {
      return NeonEnvironment.getWsHostOverride();
    }

    var apiHost = NeonEnvironment.getApiHost();
    var hostUrl = new URL(apiHost);
    var apiProtocol = hostUrl.protocol,
        apiHostname = hostUrl.hostname;
    return apiProtocol.startsWith('https') ? "wss://".concat(apiHostname) : "ws://".concat(apiHostname);
  },
  getDataCiteApiHost: function getDataCiteApiHost() {
    // Check for local override
    if (NeonEnvironment.isDevEnv && NeonEnvironment.getDataCiteApiHostOverride()) {
      return NeonEnvironment.getDataCiteApiHostOverride();
    } // Check for server data env var


    var apiHost = NeonEnvironment.getNeonServerDataDataCiteApiHost();

    if (apiHost !== null) {
      return apiHost;
    }

    return NeonEnvironment.getDataCiteApiHostDefault();
  },

  /**
   * Valid host names include localhost and known NEON hosts
   * @param host
   * @returns
   */
  isApiHostValid: function isApiHostValid(host) {
    if (typeof host !== 'string' || host.length <= 0) {
      return false;
    }

    var regex = HostRegexService.getApiHostRegex();
    if (!regex) return false;
    var matches = regex.exec(host);
    if (!matches) return false;
    return matches.length > 0;
  },

  /**
   * Valid host names include localhost and known NEON hosts
   * @param host
   * @returns
   */
  isWebHostValid: function isWebHostValid(host) {
    if (typeof host !== 'string' || host.length <= 0) {
      return false;
    }

    var regex = HostRegexService.getWebHostRegex();
    if (!regex) return false;
    var matches = regex.exec(host);
    if (!matches) return false;
    return matches.length > 0;
  },

  /**
   * Validate the data cite API host
   * @param host
   * @returns
   */
  isDataCiteApiHostValid: function isDataCiteApiHostValid(host) {
    if (typeof host !== 'string' || host.length <= 0) {
      return false;
    }

    var regex = HostRegexService.getDataCiteApiHostRegex();
    if (!regex) return false;
    var matches = regex.exec(host);
    if (!matches) return false;
    return matches.length > 0;
  },

  /**
   * Gets the API token header name
   * @return {string} The API token header name
   */
  getApiTokenHeader: function getApiTokenHeader() {
    var serverData = NeonEnvironment.getNeonServerData();

    if (serverData && typeof serverData.NeonPublicAPITokenHeader === 'string') {
      return serverData.NeonPublicAPITokenHeader;
    }

    return '';
  },

  /**
   * Gets the API token value
   * @return {string} The API token value
   */
  getApiToken: function getApiToken() {
    var serverData = NeonEnvironment.getNeonServerData();

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
  getAuthSilentType: function getAuthSilentType() {
    var serverData = NeonEnvironment.getNeonServerData();

    if (serverData && typeof serverData.NeonAuthSilentType === 'string' && serverData.NeonAuthSilentType.length > 0) {
      return serverData.NeonAuthSilentType;
    }

    return _core.AuthSilentType.DISABLED;
  },
  getFullApiPath: function getFullApiPath() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var host = NeonEnvironment.getApiHost();
    var root = ['download', 'manifest'].includes(path) ? '' : NeonEnvironment.getRootApiPath();
    return NeonEnvironment.getApiPath[path] ? "".concat(host).concat(root).concat(NeonEnvironment.getApiPath[path]()) : "".concat(host).concat(root);
  },
  getFullDownloadApiPath: function getFullDownloadApiPath() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var host = NeonEnvironment.getApiHost();
    var root = NeonEnvironment.getRootDownloadApiPath();
    return NeonEnvironment.getDownloadApiPath[path] ? "".concat(host).concat(root).concat(NeonEnvironment.getDownloadApiPath[path]()) : "".concat(host).concat(root);
  },
  getFullJsonLdApiPath: function getFullJsonLdApiPath() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var host = NeonEnvironment.getApiHost();
    var root = NeonEnvironment.getRootJsonLdPath();
    var appliedPath = '';

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
  getFullAuthPath: function getFullAuthPath() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var host = NeonEnvironment.getApiHost();
    return NeonEnvironment.getAuthPath[path] ? "".concat(host).concat(NeonEnvironment.getAuthPath[path]()) : "".concat(host);
  },

  /**
   * Creates the full auth API path from the host and path.
   * Auth API path refers to /api/auth/v0.
   * @param {string} path - The path to build from
   * @param {boolean} useWs - Option to build a websocket path
   */
  getFullAuthApiPath: function getFullAuthApiPath() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var useWs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var host = useWs ? NeonEnvironment.getWebSocketHost() : NeonEnvironment.getApiHost();
    var root = NeonEnvironment.getRootAuthApiPath();
    var appliedPath = Object.keys(NeonEnvironment.getAuthApiPath).includes(path) ? NeonEnvironment.getAuthApiPath[path]() : '';
    return appliedPath ? "".concat(host).concat(root).concat(appliedPath) : "".concat(host).concat(root);
  },
  getFullGraphqlPath: function getFullGraphqlPath() {
    var host = NeonEnvironment.getApiHost();
    return "".concat(host).concat(NeonEnvironment.getRootGraphqlPath());
  },

  /**
   * Indicates when a CORS request is required
   * @returns
   */
  requireCors: function requireCors() {
    if (window.location.host.includes('localhost')) {
      return false;
    }

    return !NeonEnvironment.isApiHostValid(window.location.host);
  }
};
Object.freeze(NeonEnvironment);
var _default = NeonEnvironment;
exports.default = _default;