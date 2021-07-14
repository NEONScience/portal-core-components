import { AuthSilentType, Undef } from '../../types/core';

// Default hosts
export const DEFAULT_API_HOST = 'https://data.neonscience.org';
export const DEFAULT_WEB_HOST = 'https://www.neonscience.org';

interface IHostRegexService {
  getApiHostRegex: () => RegExp;
  getWebHostRegex: () => RegExp;
  getDataCiteApiHostRegex: () => RegExp;
}
export const HostRegexService: IHostRegexService = {
  getApiHostRegex: (): RegExp => (
    new RegExp(/^(data|cert-data|int-data|local-data)[.]neonscience[.]org$/)
  ),
  getWebHostRegex: (): RegExp => (
    new RegExp(/^(www|cert-www|int-www|local-www)[.](neonscience[.]org|.+[.]us-[0-9]{1}[.]platformsh[.]site)$/)
  ),
  getDataCiteApiHostRegex: (): RegExp => (
    new RegExp(/^(api|api[.]test)[.]datacite[.]org$/)
  ),
};

// Names of all environment variables that MUST be explicitly defined for the
// environment to be reported as "valid". These are evnironment variables
// that are expected to be referenced by all apps. Standard vars present in all
// node environments (e.g. PORT, NODE_ENV, etc.) are not listed here.
export const requiredEnvironmentVars = [
  'REACT_APP_NEON_API_HOST',
  'REACT_APP_NEON_API_NAME',
  'REACT_APP_NEON_API_VERSION',
  'REACT_APP_NEON_AUTH_API',
  'REACT_APP_NEON_AUTH_WS_API',
  'REACT_APP_NEON_AUTH_WS_TOPIC_AUTH0_API',
  'REACT_APP_NEON_AUTH_LOGIN',
  'REACT_APP_NEON_AUTH_LOGOUT',
  'REACT_APP_NEON_AUTH_USERINFO',
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
  'REACT_APP_NEON_PATH_DATA_API',
  'REACT_APP_NEON_PATH_DOCUMENTS_API',
  'REACT_APP_NEON_PATH_DOWNLOAD_API',
  'REACT_APP_NEON_PATH_MANIFEST_API',
  'REACT_APP_NEON_PATH_PRODUCTS_API',
  'REACT_APP_NEON_PATH_PROTOTYPE_DATA_API',
  'REACT_APP_NEON_PATH_RELEASES_API',
  'REACT_APP_NEON_PATH_SITES_API',
  'REACT_APP_NEON_PATH_LOCATIONS_API',
  'REACT_APP_NEON_PATH_SAMPLES_API',
  'REACT_APP_NEON_SHOW_AOP_VIEWER',
  'REACT_APP_NEON_VISUS_PRODUCTS_BASE_URL',
  'REACT_APP_NEON_VISUS_IFRAME_BASE_URL',
  'REACT_APP_NEON_DEFAULT_DATA_CITE_API_HOST',
  'REACT_APP_NEON_API_HOST_OVERRIDE',
  'REACT_APP_NEON_WEB_HOST_OVERRIDE',
  'REACT_APP_NEON_WS_HOST_OVERRIDE',
  'REACT_APP_NEON_DATA_CITE_API_HOST_OVERRIDE',
  'REACT_APP_NEON_AUTH_DISABLE_WS',
  'REACT_APP_NEON_ROUTER_NEON_HOME',
  'REACT_APP_NEON_ROUTER_NEON_MYACCOUNT',
];

// Temporary paths that shouldn't need to propogate to environment files until made more permanent
const REACT_APP_NEON_PATH_ARCGIS_ASSETS_API = '/arcgis-assets';

const EnvType = {
  DEV: 'development',
  PROD: 'production',
};

export interface NeonServerData {
  NeonPublicAPIHost: Undef<string>;
  NeonWebHost: Undef<string>;
  NeonPublicAPITokenHeader: Undef<string>;
  NeonPublicAPIToken: Undef<string>;
  NeonAuthSilentType: Undef<string>;
  DataCiteAPIHost: Undef<string>;
}

export interface INeonEnvironment {
  isValid: boolean;
  isDevEnv: boolean;
  isProdEnv: boolean;
  useGraphql: boolean;
  showAopViewer: boolean;
  authDisableWs: boolean;

  getApiName: () => Undef<string>;
  getApiVersion: () => Undef<string>;
  getRootApiPath: () => string;
  getRootGraphqlPath: () => Undef<string>;
  getRootJsonLdPath: () => string;
  getRootAuthApiPath: () => Undef<string>;

  getApiPath: Record<string, () => string>;
  getApiLdPath: Record<string, () => string>;
  getAuthApiPath: Record<string, () => string>;

  getAuthPath: Record<string, () => string>;

  authTopics: Record<string, () => string>;

  getVisusProductsBaseUrl: () => Undef<string>;
  getVisusIframeBaseUrl: () => Undef<string>;
  getDataCiteApiHostDefault: () => string;

  getRouterBasePath: () => string;
  getRouterBaseHomePath: () => string;

  getApiHostOverride: () => string;
  getWebHostOverride: () => string;
  getWsHostOverride: () => string;
  getDataCiteApiHostOverride: () => Undef<string>;

  route: Record<string, (p?: string) => string>;

  getNeonServerData: () => NeonServerData|null;
  getNeonServerDataWebHost: () => string|null;
  getNeonServerDataApiHost: () => string|null;
  getNeonServerDataDataCiteApiHost: () => string|null;
  getWebHost: () => string;
  getApiHost: () => string;
  getWebSocketHost: () => string;
  getDataCiteApiHost: () => string;

  isApiHostValid: (host: string) => boolean;
  isWebHostValid: (host: string) => boolean;
  isDataCiteApiHostValid: (host: string) => boolean;

  getApiTokenHeader: () => string;
  getApiToken: () => string;
  getAuthSilentType: () => AuthSilentType;

  getFullApiPath: (path: string) => string;
  getFullJsonLdApiPath: (path: string) => string;
  getFullAuthApiPath: (path: string, useWs: boolean) => string;
  getFullGraphqlPath: () => string;

  getFullAuthPath: (path: string) => string;
}

const NeonEnvironment: INeonEnvironment = {
  isValid: requiredEnvironmentVars.every((envVar) => typeof process.env[envVar] !== 'undefined'),
  isDevEnv: process.env.NODE_ENV === EnvType.DEV,
  isProdEnv: process.env.NODE_ENV === EnvType.PROD,
  useGraphql: process.env.REACT_APP_NEON_USE_GRAPHQL === 'true',
  showAopViewer: process.env.REACT_APP_NEON_SHOW_AOP_VIEWER === 'true',
  authDisableWs: process.env.REACT_APP_NEON_AUTH_DISABLE_WS === 'true',

  getApiName: () => process.env.REACT_APP_NEON_API_NAME,
  getApiVersion: () => process.env.REACT_APP_NEON_API_VERSION,
  getRootApiPath: () => `/${process.env.REACT_APP_NEON_API_NAME}/${process.env.REACT_APP_NEON_API_VERSION}`,
  getRootGraphqlPath: () => process.env.REACT_APP_NEON_PATH_PUBLIC_GRAPHQL,
  getRootJsonLdPath: () => `${NeonEnvironment.getRootApiPath()}${process.env.REACT_APP_NEON_PATH_LD_API}`,
  getRootAuthApiPath: () => process.env.REACT_APP_NEON_AUTH_API,

  getApiPath: {
    data: (): string => process.env.REACT_APP_NEON_PATH_DATA_API || '',
    prototype: (): string => process.env.REACT_APP_NEON_PATH_PROTOTYPE_DATA_API || '',
    documents: (): string => process.env.REACT_APP_NEON_PATH_DOCUMENTS_API || '',
    download: (): string => process.env.REACT_APP_NEON_PATH_DOWNLOAD_API || '',
    manifest: (): string => process.env.REACT_APP_NEON_PATH_MANIFEST_API || '',
    products: (): string => process.env.REACT_APP_NEON_PATH_PRODUCTS_API || '',
    releases: (): string => process.env.REACT_APP_NEON_PATH_RELEASES_API || '',
    sites: (): string => process.env.REACT_APP_NEON_PATH_SITES_API || '',
    locations: (): string => process.env.REACT_APP_NEON_PATH_LOCATIONS_API || '',
    samples: (): string => process.env.REACT_APP_NEON_PATH_SAMPLES_API || '',
    arcgisAssets: (): string => REACT_APP_NEON_PATH_ARCGIS_ASSETS_API || '',
  },

  getApiLdPath: {
    repo: (): string => process.env.REACT_APP_NEON_PATH_LD_REPO_API || '',
  },

  getAuthPath: {
    login: () => process.env.REACT_APP_NEON_AUTH_LOGIN || '',
    logout: () => process.env.REACT_APP_NEON_AUTH_LOGOUT || '',
    userInfo: () => process.env.REACT_APP_NEON_AUTH_USERINFO || '',
    seamlessLogin: () => `${NeonEnvironment.getAuthPath.login()}?seamless=true`,
    silentLogin: () => `${NeonEnvironment.getAuthPath.login()}?silent=true`,
    silentLogout: () => `${NeonEnvironment.getAuthPath.logout()}?silent=true`,
    notifications: () => '/auth0/liferaynotifications',
  },
  getAuthApiPath: {
    ws: () => process.env.REACT_APP_NEON_AUTH_WS_API || '',
  },
  authTopics: {
    getAuth0: () => process.env.REACT_APP_NEON_AUTH_WS_TOPIC_AUTH0_API || '',
  },

  getVisusProductsBaseUrl: (): Undef<string> => process.env.REACT_APP_NEON_VISUS_PRODUCTS_BASE_URL,
  getVisusIframeBaseUrl: (): Undef<string> => process.env.REACT_APP_NEON_VISUS_IFRAME_BASE_URL,

  getDataCiteApiHostDefault: (): string => (
    process.env.REACT_APP_NEON_DEFAULT_DATA_CITE_API_HOST || ''
  ),

  getRouterBasePath: (): string => process.env.REACT_APP_NEON_ROUTER_BASE || '',
  getRouterBaseHomePath: (): string => process.env.REACT_APP_NEON_ROUTER_BASE_HOME || '',

  getApiHostOverride: (): string => (
    process.env.REACT_APP_NEON_API_HOST_OVERRIDE || DEFAULT_API_HOST
  ),
  getWebHostOverride: (): string => (
    process.env.REACT_APP_NEON_WEB_HOST_OVERRIDE || DEFAULT_WEB_HOST
  ),
  getWsHostOverride: (): string => (
    process.env.REACT_APP_NEON_WS_HOST_OVERRIDE || DEFAULT_API_HOST
  ),
  getDataCiteApiHostOverride: (): Undef<string> => (
    process.env.REACT_APP_NEON_DATA_CITE_API_HOST_OVERRIDE
  ),

  route: {
    home: () => process.env.REACT_APP_NEON_ROUTER_NEON_HOME || '/home',
    account: () => process.env.REACT_APP_NEON_ROUTER_NEON_MYACCOUNT || '/myaccount',
    getFullRoute: (route = '') => `${NeonEnvironment.getRouterBasePath()}${route}`,
    buildRouteFromHost: (route = '') => (
      `${NeonEnvironment.getWebHost()}${NeonEnvironment.route.getFullRoute(route)}`
    ),
    buildHomeRoute: () => (
      `${NeonEnvironment.getWebHost()}${NeonEnvironment.route.home()}`
    ),
    buildAccountRoute: () => (
      `${NeonEnvironment.getWebHost()}${NeonEnvironment.route.account()}`
    ),
  },

  /**
   * Gets the window.NEON_SERVER_DATA injected from the server environment.
   * @return {Object} The structured server data object
   */
  getNeonServerData: (): NeonServerData|null => {
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

  getNeonServerDataWebHost: (): string|null => {
    const serverData = NeonEnvironment.getNeonServerData();
    if (serverData && (typeof serverData.NeonWebHost === 'string')) {
      const apiHost = serverData.NeonWebHost;
      try {
        const { hostname: apiHostname } = new URL(apiHost);
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

  getNeonServerDataApiHost: (): string|null => {
    const serverData = NeonEnvironment.getNeonServerData();
    if (serverData && (typeof serverData.NeonPublicAPIHost === 'string')) {
      const apiHost = serverData.NeonPublicAPIHost;
      try {
        const { hostname: apiHostname } = new URL(apiHost);
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

  getNeonServerDataDataCiteApiHost: (): string|null => {
    const serverData = NeonEnvironment.getNeonServerData();
    if (serverData && (typeof serverData.DataCiteAPIHost === 'string')) {
      const apiHost = serverData.DataCiteAPIHost;
      try {
        const { hostname: apiHostname } = new URL(apiHost);
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

  getWebHost: (): string => {
    // Check for local override
    if (NeonEnvironment.isDevEnv && NeonEnvironment.getWebHostOverride()) {
      return NeonEnvironment.getWebHostOverride();
    }
    // Check for server data env var
    const webHost: string|null = NeonEnvironment.getNeonServerDataWebHost();
    if (webHost !== null) {
      return webHost;
    }
    /* eslint-disable */
    // @ts-ignore
    if (typeof WorkerGlobalScope === 'function' && typeof self.location === 'object') {
      if (NeonEnvironment.isWebHostValid(self.location.host)) {
        return `${self.location.protocol}//${self.location.host}`;
      }
      return DEFAULT_WEB_HOST;
    }
    /* eslint-enable */
    if (NeonEnvironment.isWebHostValid(window.location.host)) {
      return `${window.location.protocol}//${window.location.host}`;
    }
    return DEFAULT_WEB_HOST;
  },

  getApiHost: (): string => {
    // Check for local override
    if (NeonEnvironment.isDevEnv && NeonEnvironment.getApiHostOverride()) {
      return NeonEnvironment.getApiHostOverride();
    }
    // Check for server data env var
    const apiHost: string|null = NeonEnvironment.getNeonServerDataApiHost();
    if (apiHost !== null) {
      return apiHost;
    }
    /* eslint-disable */
    // @ts-ignore
    if (typeof WorkerGlobalScope === 'function' && typeof self.location === 'object') {
      if (NeonEnvironment.isApiHostValid(self.location.host)) {
        return `${self.location.protocol}//${self.location.host}`;
      }
      return DEFAULT_API_HOST;
    }
    /* eslint-enable */
    if (NeonEnvironment.isApiHostValid(window.location.host)) {
      return `${window.location.protocol}//${window.location.host}`;
    }
    return DEFAULT_API_HOST;
  },

  getWebSocketHost: (): string => {
    if (NeonEnvironment.isDevEnv && NeonEnvironment.getWsHostOverride()) {
      return NeonEnvironment.getWsHostOverride();
    }
    const apiHost = NeonEnvironment.getApiHost();
    const hostUrl = new URL(apiHost);
    const { protocol: apiProtocol, hostname: apiHostname } = hostUrl;
    return apiProtocol.startsWith('https')
      ? `wss://${apiHostname}`
      : `ws://${apiHostname}`;
  },

  getDataCiteApiHost: (): string => {
    // Check for local override
    if (NeonEnvironment.isDevEnv && NeonEnvironment.getDataCiteApiHostOverride()) {
      return NeonEnvironment.getDataCiteApiHostOverride() as string;
    }
    // Check for server data env var
    const apiHost: string|null = NeonEnvironment.getNeonServerDataDataCiteApiHost();
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
  isApiHostValid: (host: string): boolean => {
    if ((typeof host !== 'string') || (host.length <= 0)) {
      return false;
    }
    const regex = HostRegexService.getApiHostRegex();
    if (!regex) return false;
    const matches = regex.exec(host);
    if (!matches) return false;
    return (matches.length > 0);
  },

  /**
   * Valid host names include localhost and known NEON hosts
   * @param host
   * @returns
   */
  isWebHostValid: (host: string): boolean => {
    if ((typeof host !== 'string') || (host.length <= 0)) {
      return false;
    }
    const regex = HostRegexService.getWebHostRegex();
    if (!regex) return false;
    const matches = regex.exec(host);
    if (!matches) return false;
    return (matches.length > 0);
  },

  /**
   * Validate the data cite API host
   * @param host
   * @returns
   */
  isDataCiteApiHostValid: (host: string): boolean => {
    if ((typeof host !== 'string') || (host.length <= 0)) {
      return false;
    }
    const regex = HostRegexService.getDataCiteApiHostRegex();
    if (!regex) return false;
    const matches = regex.exec(host);
    if (!matches) return false;
    return (matches.length > 0);
  },

  /**
   * Gets the API token header name
   * @return {string} The API token header name
   */
  getApiTokenHeader: (): string => {
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
  getApiToken: (): string => {
    const serverData = NeonEnvironment.getNeonServerData();
    if (serverData && (typeof serverData.NeonPublicAPIToken === 'string')) {
      return serverData.NeonPublicAPIToken;
    }
    return '';
  },

  /**
   * Determines if the silent authentication process should be prevented
   * based on environment or browser as external dependencies are required.
   * @return {AuthSilentType}
   */
  getAuthSilentType: (): AuthSilentType => {
    const serverData = NeonEnvironment.getNeonServerData();
    if (serverData
        && (typeof serverData.NeonAuthSilentType === 'string')
        && (serverData.NeonAuthSilentType.length > 0)) {
      return serverData.NeonAuthSilentType as AuthSilentType;
    }
    return AuthSilentType.DISABLED;
  },

  getFullApiPath: (path: string = ''): string => {
    const host = NeonEnvironment.getApiHost();
    const root = ['download', 'manifest'].includes(path)
      ? ''
      : NeonEnvironment.getRootApiPath();
    return NeonEnvironment.getApiPath[path]
      ? `${host}${root}${NeonEnvironment.getApiPath[path]()}`
      : `${host}${root}`;
  },

  getFullJsonLdApiPath: (path: string = ''): string => {
    const host = NeonEnvironment.getApiHost();
    const root = NeonEnvironment.getRootJsonLdPath();
    let appliedPath = '';
    if (['products', 'prototype'].includes(path)) {
      appliedPath = NeonEnvironment.getApiPath[path]();
    } else if (typeof NeonEnvironment.getApiLdPath[path] === 'function') {
      appliedPath = NeonEnvironment.getApiLdPath[path]();
    }
    return appliedPath
      ? `${host}${root}${appliedPath}`
      : `${host}${root}`;
  },

  /**
   * Creates the full auth path from the host and path.
   * Auth path refers to /auth0.
   * @param {string} path - The path to build from
   */
  getFullAuthPath: (path: string = ''): string => {
    const host = NeonEnvironment.getApiHost();
    return NeonEnvironment.getAuthPath[path]
      ? `${host}${NeonEnvironment.getAuthPath[path]()}`
      : `${host}`;
  },

  /**
   * Creates the full auth API path from the host and path.
   * Auth API path refers to /api/auth/v0.
   * @param {string} path - The path to build from
   * @param {boolean} useWs - Option to build a websocket path
   */
  getFullAuthApiPath: (path: string = '', useWs: boolean = false): string => {
    const host = useWs
      ? NeonEnvironment.getWebSocketHost()
      : NeonEnvironment.getApiHost();
    const root = NeonEnvironment.getRootAuthApiPath();
    const appliedPath = Object.keys(NeonEnvironment.getAuthApiPath).includes(path)
      ? NeonEnvironment.getAuthApiPath[path]()
      : '';
    return appliedPath
      ? `${host}${root}${appliedPath}`
      : `${host}${root}`;
  },

  getFullGraphqlPath: (): string => {
    const host = NeonEnvironment.getApiHost();
    return `${host}${NeonEnvironment.getRootGraphqlPath()}`;
  },
};

Object.freeze(NeonEnvironment);

export default NeonEnvironment;
