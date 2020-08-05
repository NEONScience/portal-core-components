/* eslint-disable no-restricted-globals */
/* global window, self */

// Names of all environment variables that MUST be explicitly defined for the
// environment to be reported as "valid". These are evnironment variables
// that are expected to be referenced by all apps. Standard vars present in all
// node environments (e.g. PORT, NODE_ENV, etc.) are not listed here.
export const requiredEnvironmentVars = [
  'REACT_APP_NEON_API_NAME',
  'REACT_APP_NEON_API_VERSION',
  'REACT_APP_NEON_AUTH_LOGIN',
  'REACT_APP_NEON_AUTH_LOGOUT',
  'REACT_APP_NEON_AUTH_USERINFO',
  'REACT_APP_NEON_PATH_MENU_API',
  'REACT_APP_NEON_PATH_PUBLIC_GRAPHQL',
  'REACT_APP_NEON_ROUTER_BASE',
  'REACT_APP_NEON_ROUTER_BASE_HOME',
  'REACT_APP_NEON_USE_GRAPHQL',
];

// Names of additional environment variables that may be referenced by
// this module depending on a given app's use case. Along with the above
// required list this makes a complete set of all environment variables
// this module will ever reference.
export const optionalEnvironmentVars = [
  'REACT_APP_NEON_PATH_LD_API',
  'REACT_APP_NEON_PATH_LD_REPO_API',
  'REACT_APP_NEON_PATH_AOP_DOWNLOAD_API',
  'REACT_APP_NEON_PATH_DATA_API',
  'REACT_APP_NEON_PATH_DOCUMENTS_API',
  'REACT_APP_NEON_PATH_DOWNLOAD_API',
  'REACT_APP_NEON_PATH_MANIFEST_API',
  'REACT_APP_NEON_PATH_PRODUCTS_API',
  'REACT_APP_NEON_PATH_SITES_API',
  'REACT_APP_NEON_PATH_LOCATIONS_API',
  'REACT_APP_NEON_PATH_ARCGIS_ASSETS_API',
  'REACT_APP_NEON_PATH_FILE_NAMING_CONVENTIONS',
  'REACT_APP_NEON_SHOW_AOP_VIEWER',
  'REACT_APP_NEON_VISUS_PRODUCTS_BASE_URL',
  'REACT_APP_NEON_VISUS_IFRAME_BASE_URL',
  'REACT_APP_NEON_HOST_OVERRIDE',
  'REACT_APP_FOREIGN_LOCATION',
];

const EnvType = {
  DEV: 'development',
  PROD: 'production',
};

const NeonEnvironment = {
  isValid: requiredEnvironmentVars.every(envVar => typeof process.env[envVar] !== 'undefined'),
  isDevEnv: process.env.NODE_ENV === EnvType.DEV,
  isProdEnv: process.env.NODE_ENV === EnvType.PROD,
  isForeignEnv: process.env.REACT_APP_FOREIGN_LOCATION === 'true',
  useGraphql: process.env.REACT_APP_NEON_USE_GRAPHQL === 'true',
  showAopViewer: process.env.REACT_APP_NEON_SHOW_AOP_VIEWER === 'true',

  getApiName: () => process.env.REACT_APP_NEON_API_NAME,
  getApiVersion: () => process.env.REACT_APP_NEON_API_VERSION,
  getRootApiPath: () => `/${process.env.REACT_APP_NEON_API_NAME}/${process.env.REACT_APP_NEON_API_VERSION}`,
  getRootGraphqlPath: () => process.env.REACT_APP_NEON_PATH_PUBLIC_GRAPHQL,
  getRootJsonLdPath: () => `${NeonEnvironment.getRootApiPath()}${process.env.REACT_APP_NEON_PATH_LD_API}`,

  getApiPath: {
    aopDownload: () => process.env.REACT_APP_NEON_PATH_AOP_DOWNLOAD_API,
    data: () => process.env.REACT_APP_NEON_PATH_DATA_API,
    documents: () => process.env.REACT_APP_NEON_PATH_DOCUMENTS_API,
    download: () => process.env.REACT_APP_NEON_PATH_DOWNLOAD_API,
    manifest: () => process.env.REACT_APP_NEON_PATH_MANIFEST_API,
    menu: () => process.env.REACT_APP_NEON_PATH_MENU_API,
    products: () => process.env.REACT_APP_NEON_PATH_PRODUCTS_API,
    sites: () => process.env.REACT_APP_NEON_PATH_SITES_API,
    locations: () => process.env.REACT_APP_NEON_PATH_LOCATIONS_API,
    arcgisAssets: () => process.env.REACT_APP_NEON_PATH_ARCGIS_ASSETS_API,
  },

  getApiLdPath: {
    repo: () => process.env.REACT_APP_NEON_PATH_LD_REPO_API,
  },

  getPagePath: {
    fileNamingConventions: () => process.env.REACT_APP_NEON_PATH_FILE_NAMING_CONVENTIONS,
  },

  getAuthPath: {
    login: () => process.env.REACT_APP_NEON_AUTH_LOGIN,
    logout: () => process.env.REACT_APP_NEON_AUTH_LOGOUT,
    userInfo: () => process.env.REACT_APP_NEON_AUTH_USERINFO,
  },

  getVisusProductsBaseUrl: () => process.env.REACT_APP_NEON_VISUS_PRODUCTS_BASE_URL,
  getVisusIframeBaseUrl: () => process.env.REACT_APP_NEON_VISUS_IFRAME_BASE_URL,

  getRouterBasePath: () => process.env.REACT_APP_NEON_ROUTER_BASE,
  getRouterBaseHomePath: () => process.env.REACT_APP_NEON_ROUTER_BASE_HOME,
  getHostOverride: () => process.env.REACT_APP_NEON_HOST_OVERRIDE,

  /**
   * Gets the window.NEON_SERVER_DATA injected from the server environment.
   * @return {Object} The structured server data object
   */
  getNeonServerData: () => {
    if (typeof WorkerGlobalScope === 'function') {
      return self.NEON_SERVER_DATA ? self.NEON_SERVER_DATA : null;
    }
    if (typeof window === 'object') {
      return window.NEON_SERVER_DATA ? window.NEON_SERVER_DATA : null;
    }
    return null;
  },

  getHost: () => {
    if (
      (NeonEnvironment.isDevEnv || NeonEnvironment.isForeignEnv)
        && NeonEnvironment.getHostOverride()) {
      return NeonEnvironment.getHostOverride();
    }
    if (typeof WorkerGlobalScope === 'function' && typeof self.location === 'object') {
      return `${self.location.protocol}//${self.location.host}`;
    }
    return `${window.location.protocol}//${window.location.host}`;
  },

  /**
   * Gets the API token header name
   * @return {string} The API token header name
   */
  getApiTokenHeader: () => {
    const serverData = NeonEnvironment.getNeonServerData();
    if (serverData && (typeof serverData.NeonPublicAPITokenHeader === 'string')) {
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
    if (serverData && (typeof serverData.NeonPublicAPIToken === 'string')) {
      return serverData.NeonPublicAPIToken;
    }
    return '';
  },

  getFullApiPath: (path = '') => {
    const host = NeonEnvironment.getHost();
    // Root path (e.g. '/api/v0') doesn't apply to legacy download/manifest-related paths.
    const root = ['aopDownload', 'download', 'manifest'].includes(path) ? '' : NeonEnvironment.getRootApiPath();
    return NeonEnvironment.getApiPath[path]
      ? `${host}${root}${NeonEnvironment.getApiPath[path]()}`
      : `${host}${root}`;
  },

  getFullJsonLdApiPath: (path = '') => {
    const host = NeonEnvironment.getHost();
    const root = NeonEnvironment.getRootJsonLdPath();
    const appliedPath = ['products'].includes(path)
      ? NeonEnvironment.getApiPath[path]()
      : NeonEnvironment.getApiLdPath[path]();
    return appliedPath
      ? `${host}${root}${appliedPath}`
      : `${host}${root}`;
  },

  getFullPagePath: (path = '') => {
    const host = NeonEnvironment.getHost();
    return NeonEnvironment.getPagePath[path]
      ? `${host}${NeonEnvironment.getPagePath[path]()}`
      : `${host}`;
  },

  getFullAuthPath: (path = '') => {
    const host = NeonEnvironment.getHost();
    return NeonEnvironment.getAuthPath[path]
      ? `${host}${NeonEnvironment.getAuthPath[path]()}`
      : `${host}`;
  },

  getFullGraphqlPath: () => {
    const host = NeonEnvironment.getHost();
    return `${host}${NeonEnvironment.getRootGraphqlPath()}`;
  },
};

Object.freeze(NeonEnvironment);

export default NeonEnvironment;
