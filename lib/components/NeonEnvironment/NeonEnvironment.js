"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.optionalEnvironmentVars = exports.requiredEnvironmentVars = void 0;
// Names of all environment variables that MUST be explicitly defined for the
// environment to be reported as "valid". These are evnironment variables
// that are expected to be referenced by all apps. Standard vars present in all
// node environments (e.g. PORT, NODE_ENV, etc.) are not listed here.
var requiredEnvironmentVars = ['REACT_APP_NEON_API_NAME', 'REACT_APP_NEON_API_VERSION', 'REACT_APP_NEON_AUTH_LOGIN', 'REACT_APP_NEON_AUTH_LOGOUT', 'REACT_APP_NEON_AUTH_USERINFO', 'REACT_APP_NEON_PATH_MENU_API', 'REACT_APP_NEON_PATH_PUBLIC_GRAPHQL', 'REACT_APP_NEON_ROUTER_BASE', 'REACT_APP_NEON_ROUTER_BASE_HOME', 'REACT_APP_NEON_USE_GRAPHQL']; // Names of additional environment variables that may be referenced by
// this module depending on a given app's use case. Along with the above
// required list this makes a complete set of all environment variables
// this module will ever reference.

exports.requiredEnvironmentVars = requiredEnvironmentVars;
var optionalEnvironmentVars = ['REACT_APP_NEON_HOST_OVERRIDE', 'REACT_APP_NEON_PATH_AOP_DOWNLOAD_API', 'REACT_APP_NEON_PATH_DATA_API', 'REACT_APP_NEON_PATH_DOCUMENTS_API', 'REACT_APP_NEON_PATH_DOWNLOAD_API', 'REACT_APP_NEON_PATH_MANIFEST_API', 'REACT_APP_NEON_PATH_PRODUCTS_API', 'REACT_APP_NEON_PATH_SITES_API', 'REACT_APP_NEON_PATH_FILE_NAMING_CONVENTIONS', 'REACT_APP_NEON_SHOW_AOP_VIEWER', 'REACT_APP_NEON_VISUS_PRODUCTS_BASE_URL', 'REACT_APP_NEON_VISUS_IFRAME_BASE_URL'];
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
  isProdEnv: process.env.NODE_ENV === EnvType.DEV,
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
  }
};

NeonEnvironment.getHost = function () {
  return NeonEnvironment.isDevEnv && NeonEnvironment.getHostOverride() ? NeonEnvironment.getHostOverride() : "".concat(window.location.protocol, "//").concat(window.location.host);
};

NeonEnvironment.getFullApiPath = function () {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var host = NeonEnvironment.getHost(); // Root path (e.g. '/api/v0') doesn't apply to legacy download/manifest-related paths.

  var root = ['aopDownload', 'download', 'manifest'].includes(path) ? '' : NeonEnvironment.getRootApiPath();
  return NeonEnvironment.getApiPath[path] ? "".concat(host).concat(root).concat(NeonEnvironment.getApiPath[path]()) : "".concat(host).concat(root);
};

NeonEnvironment.getFullPagePath = function () {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var host = NeonEnvironment.getHost();
  return NeonEnvironment.getPagePath[path] ? "".concat(host).concat(NeonEnvironment.getPagePath[path]()) : "".concat(host);
};

NeonEnvironment.getFullAuthPath = function () {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var host = NeonEnvironment.getHost();
  return NeonEnvironment.getAuthPath[path] ? "".concat(host).concat(NeonEnvironment.getAuthPath[path]()) : "".concat(host);
};

NeonEnvironment.getFullGraphqlPath = function () {
  var host = NeonEnvironment.getHost();
  return "".concat(host).concat(NeonEnvironment.getRootGraphqlPath());
};

Object.freeze(NeonEnvironment);
var _default = NeonEnvironment;
exports.default = _default;