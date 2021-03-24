"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.optionalEnvironmentVars = exports.requiredEnvironmentVars = void 0;

var _core = require("../../types/core");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Names of all environment variables that MUST be explicitly defined for the
// environment to be reported as "valid". These are evnironment variables
// that are expected to be referenced by all apps. Standard vars present in all
// node environments (e.g. PORT, NODE_ENV, etc.) are not listed here.
var requiredEnvironmentVars = ['REACT_APP_NEON_API_NAME', 'REACT_APP_NEON_API_VERSION', 'REACT_APP_NEON_AUTH_API', 'REACT_APP_NEON_AUTH_WS_API', 'REACT_APP_NEON_AUTH_WS_TOPIC_AUTH0_API', 'REACT_APP_NEON_AUTH_LOGIN', 'REACT_APP_NEON_AUTH_LOGOUT', 'REACT_APP_NEON_AUTH_USERINFO', 'REACT_APP_NEON_PATH_MENU_API', 'REACT_APP_NEON_PATH_PUBLIC_GRAPHQL', 'REACT_APP_NEON_ROUTER_BASE', 'REACT_APP_NEON_ROUTER_BASE_HOME', 'REACT_APP_NEON_USE_GRAPHQL']; // Names of additional environment variables that may be referenced by
// this module depending on a given app's use case. Along with the above
// required list this makes a complete set of all environment variables
// this module will ever reference.

exports.requiredEnvironmentVars = requiredEnvironmentVars;
var optionalEnvironmentVars = ['REACT_APP_NEON_PATH_LD_API', 'REACT_APP_NEON_PATH_LD_REPO_API', 'REACT_APP_NEON_PATH_AOP_DOWNLOAD_API', 'REACT_APP_NEON_PATH_DATA_API', 'REACT_APP_NEON_PATH_DOCUMENTS_API', 'REACT_APP_NEON_PATH_DOWNLOAD_API', 'REACT_APP_NEON_PATH_MANIFEST_API', 'REACT_APP_NEON_PATH_PRODUCTS_API', 'REACT_APP_NEON_PATH_PROTOTYPE_DATA_API', 'REACT_APP_NEON_PATH_RELEASES_API', 'REACT_APP_NEON_PATH_SITES_API', 'REACT_APP_NEON_PATH_LOCATIONS_API', 'REACT_APP_NEON_PATH_FILE_NAMING_CONVENTIONS', 'REACT_APP_NEON_SHOW_AOP_VIEWER', 'REACT_APP_NEON_VISUS_PRODUCTS_BASE_URL', 'REACT_APP_NEON_VISUS_IFRAME_BASE_URL', 'REACT_APP_NEON_HOST_OVERRIDE', 'REACT_APP_NEON_WS_HOST_OVERRIDE', 'REACT_APP_FOREIGN_LOCATION', 'REACT_APP_NEON_AUTH_DISABLE_WS', 'REACT_APP_NEON_ROUTER_NEON_HOME', 'REACT_APP_NEON_ROUTER_NEON_MYACCOUNT']; // Temporary paths that shouldn't need to propogate to environment files until made more permanent

exports.optionalEnvironmentVars = optionalEnvironmentVars;
var REACT_APP_NEON_PATH_ARCGIS_ASSETS_API = '/arcgis-assets';
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
  isForeignEnv: process.env.REACT_APP_FOREIGN_LOCATION === 'true',
  useGraphql: process.env.REACT_APP_NEON_USE_GRAPHQL === 'true',
  showAopViewer: process.env.REACT_APP_NEON_SHOW_AOP_VIEWER === 'true',
  authDisableWs: process.env.REACT_APP_NEON_AUTH_DISABLE_WS === 'true',
  getApiName: function getApiName() {
    return process.env.REACT_APP_NEON_API_NAME;
  },
  getApiVersion: function getApiVersion() {
    return process.env.REACT_APP_NEON_API_VERSION;
  },
  getRootApiPath: function getRootApiPath() {
    return "/".concat(process.env.REACT_APP_NEON_API_NAME, "/").concat(process.env.REACT_APP_NEON_API_VERSION);
  },
  getRootGraphqlPath: function getRootGraphqlPath() {
    return process.env.REACT_APP_NEON_PATH_PUBLIC_GRAPHQL;
  },
  getRootJsonLdPath: function getRootJsonLdPath() {
    return "".concat(NeonEnvironment.getRootApiPath()).concat(process.env.REACT_APP_NEON_PATH_LD_API);
  },
  getRootAuthApiPath: function getRootAuthApiPath() {
    return process.env.REACT_APP_NEON_AUTH_API;
  },
  getApiPath: {
    aopDownload: function aopDownload() {
      return process.env.REACT_APP_NEON_PATH_AOP_DOWNLOAD_API;
    },
    data: function data() {
      return process.env.REACT_APP_NEON_PATH_DATA_API;
    },
    prototype: function prototype() {
      return process.env.REACT_APP_NEON_PATH_PROTOTYPE_DATA_API;
    },
    documents: function documents() {
      return process.env.REACT_APP_NEON_PATH_DOCUMENTS_API;
    },
    download: function download() {
      return process.env.REACT_APP_NEON_PATH_DOWNLOAD_API;
    },
    manifest: function manifest() {
      return process.env.REACT_APP_NEON_PATH_MANIFEST_API;
    },
    menu: function menu() {
      return process.env.REACT_APP_NEON_PATH_MENU_API;
    },
    products: function products() {
      return process.env.REACT_APP_NEON_PATH_PRODUCTS_API;
    },
    releases: function releases() {
      return process.env.REACT_APP_NEON_PATH_RELEASES_API;
    },
    sites: function sites() {
      return process.env.REACT_APP_NEON_PATH_SITES_API;
    },
    locations: function locations() {
      return process.env.REACT_APP_NEON_PATH_LOCATIONS_API;
    },
    arcgisAssets: function arcgisAssets() {
      return REACT_APP_NEON_PATH_ARCGIS_ASSETS_API;
    }
  },
  getApiLdPath: {
    repo: function repo() {
      return process.env.REACT_APP_NEON_PATH_LD_REPO_API;
    }
  },
  getPagePath: {
    fileNamingConventions: function fileNamingConventions() {
      return process.env.REACT_APP_NEON_PATH_FILE_NAMING_CONVENTIONS;
    }
  },
  getAuthPath: {
    login: function login() {
      return process.env.REACT_APP_NEON_AUTH_LOGIN;
    },
    logout: function logout() {
      return process.env.REACT_APP_NEON_AUTH_LOGOUT;
    },
    userInfo: function userInfo() {
      return process.env.REACT_APP_NEON_AUTH_USERINFO;
    },
    seamlessLogin: function seamlessLogin() {
      return "".concat(NeonEnvironment.getAuthPath.login(), "?seamless=true");
    },
    silentLogin: function silentLogin() {
      return "".concat(NeonEnvironment.getAuthPath.login(), "?silent=true");
    },
    silentLogout: function silentLogout() {
      return "".concat(NeonEnvironment.getAuthPath.logout(), "?silent=true");
    }
  },
  getAuthApiPath: {
    ws: function ws() {
      return process.env.REACT_APP_NEON_AUTH_WS_API;
    }
  },
  authTopics: {
    getAuth0: function getAuth0() {
      return process.env.REACT_APP_NEON_AUTH_WS_TOPIC_AUTH0_API;
    }
  },
  getVisusProductsBaseUrl: function getVisusProductsBaseUrl() {
    return process.env.REACT_APP_NEON_VISUS_PRODUCTS_BASE_URL;
  },
  getVisusIframeBaseUrl: function getVisusIframeBaseUrl() {
    return process.env.REACT_APP_NEON_VISUS_IFRAME_BASE_URL;
  },
  getRouterBasePath: function getRouterBasePath() {
    return process.env.REACT_APP_NEON_ROUTER_BASE;
  },
  getRouterBaseHomePath: function getRouterBaseHomePath() {
    return process.env.REACT_APP_NEON_ROUTER_BASE_HOME;
  },
  getHostOverride: function getHostOverride() {
    return process.env.REACT_APP_NEON_HOST_OVERRIDE;
  },
  getWsHostOverride: function getWsHostOverride() {
    return process.env.REACT_APP_NEON_WS_HOST_OVERRIDE;
  },
  route: {
    home: function home() {
      return process.env.REACT_APP_NEON_ROUTER_NEON_HOME || '/home';
    },
    account: function account() {
      return process.env.REACT_APP_NEON_ROUTER_NEON_MYACCOUNT || '/myaccount';
    },
    getFullRoute: function getFullRoute() {
      var route = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return "".concat(NeonEnvironment.getRouterBasePath()).concat(route);
    },
    buildRouteFromHost: function buildRouteFromHost() {
      var route = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return "".concat(NeonEnvironment.getHost()).concat(NeonEnvironment.route.getFullRoute(route));
    },
    buildHomeRoute: function buildHomeRoute() {
      return "".concat(NeonEnvironment.getHost()).concat(NeonEnvironment.route.home());
    },
    buildAccountRoute: function buildAccountRoute() {
      return "".concat(NeonEnvironment.getHost()).concat(NeonEnvironment.route.account());
    }
  },

  /**
   * Gets the window.NEON_SERVER_DATA injected from the server environment.
   * @return {Object} The structured server data object
   */
  getNeonServerData: function getNeonServerData() {
    /* eslint-disable */
    if (typeof WorkerGlobalScope === 'function') {
      return self.NEON_SERVER_DATA ? self.NEON_SERVER_DATA : null;
    }
    /* eslint-enable */


    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
      return window.NEON_SERVER_DATA ? window.NEON_SERVER_DATA : null;
    }

    return null;
  },
  getHost: function getHost() {
    if ((NeonEnvironment.isDevEnv || NeonEnvironment.isForeignEnv) && NeonEnvironment.getHostOverride()) {
      return NeonEnvironment.getHostOverride();
    }
    /* eslint-disable */


    if (typeof WorkerGlobalScope === 'function' && _typeof(self.location) === 'object') {
      return "".concat(self.location.protocol, "//").concat(self.location.host);
    }
    /* eslint-enable */


    return "".concat(window.location.protocol, "//").concat(window.location.host);
  },
  getWebSocketHost: function getWebSocketHost() {
    if ((NeonEnvironment.isDevEnv || NeonEnvironment.isForeignEnv) && NeonEnvironment.getWsHostOverride()) {
      return NeonEnvironment.getWsHostOverride();
    }

    return window.location.protocol.startsWith('https') ? "wss://".concat(window.location.host) : "ws://".concat(window.location.host);
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
    var host = NeonEnvironment.getHost(); // Root path (e.g. '/api/v0') doesn't apply to legacy download/manifest-related paths.

    var root = ['aopDownload', 'download', 'manifest'].includes(path) ? '' : NeonEnvironment.getRootApiPath();
    return NeonEnvironment.getApiPath[path] ? "".concat(host).concat(root).concat(NeonEnvironment.getApiPath[path]()) : "".concat(host).concat(root);
  },
  getFullJsonLdApiPath: function getFullJsonLdApiPath() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var host = NeonEnvironment.getHost();
    var root = NeonEnvironment.getRootJsonLdPath();
    var appliedPath = '';

    if (['products', 'prototype'].includes(path)) {
      appliedPath = NeonEnvironment.getApiPath[path]();
    } else if (typeof NeonEnvironment.getApiLdPath[path] === 'function') {
      appliedPath = NeonEnvironment.getApiLdPath[path]();
    }

    return appliedPath ? "".concat(host).concat(root).concat(appliedPath) : "".concat(host).concat(root);
  },
  getFullPagePath: function getFullPagePath() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var host = NeonEnvironment.getHost();
    return NeonEnvironment.getPagePath[path] ? "".concat(host).concat(NeonEnvironment.getPagePath[path]()) : "".concat(host);
  },

  /**
   * Creates the full auth path from the host and path.
   * Auth path refers to /auth0.
   * @param {string} path - The path to build from
   */
  getFullAuthPath: function getFullAuthPath() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var host = NeonEnvironment.getHost();
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
    var host = useWs ? NeonEnvironment.getWebSocketHost() : NeonEnvironment.getHost();
    var root = NeonEnvironment.getRootAuthApiPath();
    var appliedPath = Object.keys(NeonEnvironment.getAuthApiPath).includes(path) ? NeonEnvironment.getAuthApiPath[path]() : '';
    return appliedPath ? "".concat(host).concat(root).concat(appliedPath) : "".concat(host).concat(root);
  },
  getFullGraphqlPath: function getFullGraphqlPath() {
    var host = NeonEnvironment.getHost();
    return "".concat(host).concat(NeonEnvironment.getRootGraphqlPath());
  }
};
Object.freeze(NeonEnvironment);
var _default = NeonEnvironment;
exports.default = _default;