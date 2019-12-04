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
  'REACT_APP_NEON_HOST_OVERRIDE',
  'REACT_APP_NEON_PATH_AOP_DOWNLOAD_API',
  'REACT_APP_NEON_PATH_DATA_API',
  'REACT_APP_NEON_PATH_DOCUMENTS_API',
  'REACT_APP_NEON_PATH_DOWNLOAD_API',
  'REACT_APP_NEON_PATH_MANIFEST_API',
  'REACT_APP_NEON_PATH_PRODUCTS_API',
  'REACT_APP_NEON_PATH_SITES_API',
  'REACT_APP_NEON_PATH_FILE_NAMING_CONVENTIONS',
  'REACT_APP_NEON_SHOW_AOP_VIEWER',
  'REACT_APP_NEON_VISUS_PRODUCTS_BASE_URL',
  'REACT_APP_NEON_VISUS_IFRAME_BASE_URL',
];

const EnvType = {
  DEV: 'development',
  PROD: 'production',
};

const NeonEnvironment = {
  isValid: requiredEnvironmentVars.every(envVar => typeof process.env[envVar] !== 'undefined'),
  isDevEnv: process.env.NODE_ENV === EnvType.DEV,
  isProdEnv: process.env.NODE_ENV === EnvType.DEV,
  useGraphql: process.env.REACT_APP_NEON_USE_GRAPHQL === 'true',
  showAopViewer: process.env.REACT_APP_NEON_SHOW_AOP_VIEWER === 'true',

  getApiName: () => process.env.REACT_APP_NEON_API_NAME,
  getApiVersion: () => process.env.REACT_APP_NEON_API_VERSION,
  getRootApiPath: () => `/${process.env.REACT_APP_NEON_API_NAME}/${process.env.REACT_APP_NEON_API_VERSION}`,
  getRootGraphqlPath: () => process.env.REACT_APP_NEON_PATH_PUBLIC_GRAPHQL,

  getApiPath: {
    aopDownload: () => process.env.REACT_APP_NEON_PATH_AOP_DOWNLOAD_API,
    data: () => process.env.REACT_APP_NEON_PATH_DATA_API,
    documents: () => process.env.REACT_APP_NEON_PATH_DOCUMENTS_API,
    download: () => process.env.REACT_APP_NEON_PATH_DOWNLOAD_API,
    manifest: () => process.env.REACT_APP_NEON_PATH_MANIFEST_API,
    menu: () => process.env.REACT_APP_NEON_PATH_MENU_API,
    products: () => process.env.REACT_APP_NEON_PATH_PRODUCTS_API,
    sites: () => process.env.REACT_APP_NEON_PATH_SITES_API,
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
};

NeonEnvironment.getHost = () => (
  NeonEnvironment.isDevEnv && NeonEnvironment.getHostOverride()
    ? NeonEnvironment.getHostOverride()
    : `${window.location.protocol}//${window.location.host}`
);

NeonEnvironment.getFullApiPath = (path = '') => {
  const host = NeonEnvironment.getHost();
  // Root path (e.g. '/api/v0') doesn't apply to legacy download/manifest-related paths.
  const root = ['aopDownload', 'download', 'manifest'].includes(path) ? '' : NeonEnvironment.getRootApiPath();
  return NeonEnvironment.getApiPath[path]
    ? `${host}${root}${NeonEnvironment.getApiPath[path]()}`
    : `${host}${root}`;
};

NeonEnvironment.getFullPagePath = (path = '') => {
  const host = NeonEnvironment.getHost();
  return NeonEnvironment.getPagePath[path]
    ? `${host}${NeonEnvironment.getPagePath[path]()}`
    : `${host}`;
};

NeonEnvironment.getFullAuthPath = (path = '') => {
  const host = NeonEnvironment.getHost();
  return NeonEnvironment.getAuthPath[path]
    ? `${host}${NeonEnvironment.getAuthPath[path]()}`
    : `${host}`;
};

NeonEnvironment.getFullGraphqlPath = () => {
  const host = NeonEnvironment.getHost();
  return `${host}${NeonEnvironment.getRootGraphqlPath()}`;
};

Object.freeze(NeonEnvironment);

export default NeonEnvironment;
