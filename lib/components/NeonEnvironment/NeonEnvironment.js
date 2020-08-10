"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.optionalEnvironmentVars = exports.requiredEnvironmentVars = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-disable no-restricted-globals */

/* global window, self */
// Names of all environment variables that MUST be explicitly defined for the
// environment to be reported as "valid". These are evnironment variables
// that are expected to be referenced by all apps. Standard vars present in all
// node environments (e.g. PORT, NODE_ENV, etc.) are not listed here.
var requiredEnvironmentVars = ['REACT_APP_NEON_API_NAME', 'REACT_APP_NEON_API_VERSION', 'REACT_APP_NEON_AUTH_LOGIN', 'REACT_APP_NEON_AUTH_LOGOUT', 'REACT_APP_NEON_AUTH_USERINFO', 'REACT_APP_NEON_PATH_MENU_API', 'REACT_APP_NEON_PATH_PUBLIC_GRAPHQL', 'REACT_APP_NEON_ROUTER_BASE', 'REACT_APP_NEON_ROUTER_BASE_HOME', 'REACT_APP_NEON_USE_GRAPHQL']; // Names of additional environment variables that may be referenced by
// this module depending on a given app's use case. Along with the above
// required list this makes a complete set of all environment variables
// this module will ever reference.

exports.requiredEnvironmentVars = requiredEnvironmentVars;
var optionalEnvironmentVars = ['REACT_APP_NEON_PATH_LD_API', 'REACT_APP_NEON_PATH_LD_REPO_API', 'REACT_APP_NEON_PATH_AOP_DOWNLOAD_API', 'REACT_APP_NEON_PATH_DATA_API', 'REACT_APP_NEON_PATH_DOCUMENTS_API', 'REACT_APP_NEON_PATH_DOWNLOAD_API', 'REACT_APP_NEON_PATH_MANIFEST_API', 'REACT_APP_NEON_PATH_PRODUCTS_API', 'REACT_APP_NEON_PATH_SITES_API', 'REACT_APP_NEON_PATH_LOCATIONS_API', 'REACT_APP_NEON_PATH_FILE_NAMING_CONVENTIONS', 'REACT_APP_NEON_SHOW_AOP_VIEWER', 'REACT_APP_NEON_VISUS_PRODUCTS_BASE_URL', 'REACT_APP_NEON_VISUS_IFRAME_BASE_URL', 'REACT_APP_NEON_HOST_OVERRIDE', 'REACT_APP_FOREIGN_LOCATION']; // Temporary paths that shouldn't need to propogate to environment files until made more permanent

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
  getApiPath: {
    aopDownload: function aopDownload() {
      return process.env.REACT_APP_NEON_PATH_AOP_DOWNLOAD_API;
    },
    data: function data() {
      return process.env.REACT_APP_NEON_PATH_DATA_API;
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

  /**
   * Gets the window.NEON_SERVER_DATA injected from the server environment.
   * @return {Object} The structured server data object
   */
  getNeonServerData: function getNeonServerData() {
    if (typeof WorkerGlobalScope === 'function') {
      return self.NEON_SERVER_DATA ? self.NEON_SERVER_DATA : null;
    }

    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
      return window.NEON_SERVER_DATA ? window.NEON_SERVER_DATA : null;
    }

    return null;
  },
  getHost: function getHost() {
    if ((NeonEnvironment.isDevEnv || NeonEnvironment.isForeignEnv) && NeonEnvironment.getHostOverride()) {
      return NeonEnvironment.getHostOverride();
    }

    if (typeof WorkerGlobalScope === 'function' && _typeof(self.location) === 'object') {
      return "".concat(self.location.protocol, "//").concat(self.location.host);
    }

    return "".concat(window.location.protocol, "//").concat(window.location.host);
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
    var appliedPath = ['products'].includes(path) ? NeonEnvironment.getApiPath[path]() : NeonEnvironment.getApiLdPath[path]();
    return appliedPath ? "".concat(host).concat(root).concat(appliedPath) : "".concat(host).concat(root);
  },
  getFullPagePath: function getFullPagePath() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var host = NeonEnvironment.getHost();
    return NeonEnvironment.getPagePath[path] ? "".concat(host).concat(NeonEnvironment.getPagePath[path]()) : "".concat(host);
  },
  getFullAuthPath: function getFullAuthPath() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var host = NeonEnvironment.getHost();
    return NeonEnvironment.getAuthPath[path] ? "".concat(host).concat(NeonEnvironment.getAuthPath[path]()) : "".concat(host);
  },
  getFullGraphqlPath: function getFullGraphqlPath() {
    var host = NeonEnvironment.getHost();
    return "".concat(host).concat(NeonEnvironment.getRootGraphqlPath());
  }
};
Object.freeze(NeonEnvironment);
var _default = NeonEnvironment;
exports.default = _default;