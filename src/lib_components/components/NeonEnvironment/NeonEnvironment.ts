/* eslint-disable prefer-regex-literals */
import { AuthSilentType, Undef } from '../../types/core';

// Default hosts
export const DEFAULT_API_HOST = 'https://data.neonscience.org';
export const DEFAULT_WEB_HOST = 'https://www.neonscience.org';
export const DEFAULT_BIOREPO_HOST = 'https://biorepo.neonscience.org';

interface IHostRegexService {
  getApiHostRegex: () => RegExp;
  getWebHostRegex: () => RegExp;
  getBioRepoHostRegex: () => RegExp;
}
export const HostRegexService: IHostRegexService = {
  getApiHostRegex: (): RegExp => (
    new RegExp(/^(data|cert-data|int-data|local-data)[.]neonscience[.]org$/)
  ),
  getWebHostRegex: (): RegExp => (
    new RegExp(/^(www|cert-www|int-www|local-www)[.](neonscience[.]org|.+[.]us-[0-9]{1}[.]platformsh[.]site)$/)
  ),
  getBioRepoHostRegex: (): RegExp => (
    new RegExp(/^biorepo[.]neonscience[.]org$/)
  ),
};

// Names of all environment variables that MUST be explicitly defined for the
// environment to be reported as "valid". These are evnironment variables
// that are expected to be referenced by all apps. Standard vars present in all
// node environments (e.g. PORT, NODE_ENV, etc.) are not listed here.
export const requiredEnvironmentVars = [
  'REACT_APP_NEON_PATH_API',
  'REACT_APP_NEON_PATH_PUBLIC_GRAPHQL',
  'REACT_APP_NEON_PATH_AUTH_API',
  'REACT_APP_NEON_PATH_AUTH0_API',
  'REACT_APP_NEON_ROUTER_BASE',
  'REACT_APP_NEON_ROUTER_BASE_HOME',
];

// Names of additional environment variables that may be referenced by
// this module depending on a given app's use case. Along with the above
// required list this makes a complete set of all environment variables
// this module will ever reference.
export const optionalEnvironmentVars = [
  'REACT_APP_NEON_PATH_LD_API',
  'REACT_APP_NEON_PATH_DOWNLOAD_API',
  'REACT_APP_NEON_AUTH_DISABLE_WS',
  'REACT_APP_NEON_USE_GRAPHQL',
  'REACT_APP_NEON_SHOW_AOP_VIEWER',
  'REACT_APP_NEON_VISUS_PRODUCTS_BASE_URL',
  'REACT_APP_NEON_VISUS_IFRAME_BASE_URL',
  'REACT_APP_NEON_API_HOST_OVERRIDE',
  'REACT_APP_BIOREPO_HOST_OVERRIDE',
  'REACT_APP_NEON_WEB_HOST_OVERRIDE',
  'REACT_APP_NEON_WS_HOST_OVERRIDE',
  'REACT_APP_NEON_FETCH_DRUPAL_ASSETS',
];

const EnvType = {
  DEV: 'development',
  PROD: 'production',
};

export interface NeonServerData {
  NeonPublicAPIHost: Undef<string>;
  NeonPublicAPIHostAllowInternal: Undef<boolean>;
  NeonWebHost: Undef<string>;
  NeonBioRepoHost: Undef<string>;
  NeonPublicAPITokenHeader: Undef<string>;
  NeonPublicAPIToken: Undef<string>;
  NeonAuthSilentType: Undef<string>;
}

export interface INeonEnvironment {
  isValid: boolean;
  isDevEnv: boolean;
  isProdEnv: boolean;
  useGraphql: boolean;
  showAopViewer: boolean;
  authDisableWs: boolean;
  enableGlobalSignInState: boolean;
  fetchDrupalAssets: boolean;

  getReactAppName: () => string;
  getReactAppVersion: () => string;

  getRootApiPath: () => string;
  getRootGraphqlPath: () => string;
  getRootJsonLdPath: () => string;
  getRootAuthApiPath: () => string;
  getRootAuth0ApiPath: () => string;
  getRootDownloadApiPath: () => string;

  getApiPath: Record<string, () => string>;
  getApiLdPath: Record<string, () => string>;
  getAuthApiPath: Record<string, () => string>;
  getDownloadApiPath: Record<string, () => string>;

  getDataProductTaxonTypesPath: () => string;
  getTaxonTypeDataProductsPath: () => string;

  getAuthPath: Record<string, () => string>;

  authTopics: Record<string, () => string>;

  getVisusProductsBaseUrl: () => Undef<string>;
  getVisusIframeBaseUrl: () => Undef<string>;

  getRouterBasePath: () => string;
  getRouterBaseHomePath: () => string;

  getApiHostOverride: () => string;
  getWebHostOverride: () => string;
  getBioRepoHostOverride: () => string;
  getWsHostOverride: () => string;

  route: Record<string, (p?: string) => string>;

  getNeonServerData: () => NeonServerData|null;
  getNeonServerDataWebHost: () => string|null;
  getNeonServerDataApiHost: () => string|null;
  getNeonServerDataBioRepoHost: () => string|null;
  getWebHost: () => string;
  getApiHost: () => string;
  getWebSocketHost: () => string;
  getBioRepoHost: () => string;

  isApiHostValid: (host: string) => boolean;
  isWebHostValid: (host: string) => boolean;
  isBioRepoHostValid: (host: string) => boolean;

  getApiTokenHeader: () => string;
  getApiToken: () => string;
  getAuthSilentType: () => AuthSilentType;

  getFullApiPath: (path: string) => string;
  getFullJsonLdApiPath: (path: string) => string;
  getFullAuthApiPath: (path: string, useWs: boolean) => string;
  getFullGraphqlPath: () => string;
  getFullDownloadApiPath: (path: string) => string;

  getFullAuthPath: (path: string) => string;

  requireCors: () => boolean;
}

const NeonEnvironment: INeonEnvironment = {
  isValid: requiredEnvironmentVars.every((envVar) => typeof process.env[envVar] !== 'undefined'),
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
  getRootJsonLdPath: () => `${NeonEnvironment.getRootApiPath()}${process.env.REACT_APP_NEON_PATH_LD_API}`,
  getRootAuthApiPath: () => process.env.REACT_APP_NEON_PATH_AUTH_API || '/api/auth/v0',
  getRootAuth0ApiPath: () => process.env.REACT_APP_NEON_PATH_AUTH0_API || '/auth0',
  getRootDownloadApiPath: () => process.env.REACT_APP_NEON_PATH_DOWNLOAD_API || '/api/download/v0',

  getApiPath: {
    data: (): string => '/data',
    prototype: (): string => '/prototype',
    documents: (): string => '/documents',
    quickStartGuides: (): string => '/documents/quick-start-guides',
    products: (): string => '/products',
    productBundles: (): string => '/products/bundles',
    releases: (): string => '/releases',
    sites: (): string => '/sites',
    locations: (): string => '/locations',
    samples: (): string => '/samples',
    taxonomy: (): string => '/taxonomy',
    taxonomyDownload: (): string => '/taxonomy/download',
    arcgisAssets: (): string => '/arcgis-assets',
    doiCitations: (): string => '/dois/citations',
  },

  getDownloadApiPath: {
    downloadStream: (): string => '/stream',
    manifestRollup: (): string => '/manifest/rollup',
    prototypeDownloadStream: (): string => '/prototype/stream',
    prototypeManifestRollup: (): string => '/prototype/manifest/rollup',
  },

  getApiLdPath: {
    repo: (): string => '/repository',
  },

  getAuthPath: {
    login: () => `${NeonEnvironment.getRootAuth0ApiPath()}/login`,
    logout: () => `${NeonEnvironment.getRootAuth0ApiPath()}/logout`,
    userInfo: () => `${NeonEnvironment.getRootAuth0ApiPath()}/userinfo`,
    seamlessLogin: () => `${NeonEnvironment.getAuthPath.login()}?seamless=true`,
    silentLogin: () => `${NeonEnvironment.getAuthPath.login()}?silent=true`,
    silentLogout: () => `${NeonEnvironment.getAuthPath.logout()}?silent=true`,
    notifications: () => `${NeonEnvironment.getRootAuth0ApiPath()}/liferaynotifications`,
  },
  getAuthApiPath: {
    ws: () => '/ws',
  },
  authTopics: {
    getAuth0: () => '/consumer/topic/auth0',
  },

  getDataProductTaxonTypesPath: (): string => `${NeonEnvironment.getFullApiPath('taxonomy')}/types`,
  getTaxonTypeDataProductsPath: (): string => `${NeonEnvironment.getFullApiPath('taxonomy')}/products`,

  getVisusProductsBaseUrl: (): Undef<string> => process.env.REACT_APP_NEON_VISUS_PRODUCTS_BASE_URL,
  getVisusIframeBaseUrl: (): Undef<string> => process.env.REACT_APP_NEON_VISUS_IFRAME_BASE_URL,

  getRouterBasePath: (): string => process.env.REACT_APP_NEON_ROUTER_BASE || '',
  getRouterBaseHomePath: (): string => process.env.REACT_APP_NEON_ROUTER_BASE_HOME || '',

  getApiHostOverride: (): string => (
    process.env.REACT_APP_NEON_API_HOST_OVERRIDE || DEFAULT_API_HOST
  ),
  getBioRepoHostOverride: (): string => (
    process.env.REACT_APP_BIOREPO_HOST_OVERRIDE || DEFAULT_BIOREPO_HOST
  ),
  getWebHostOverride: (): string => (
    process.env.REACT_APP_NEON_WEB_HOST_OVERRIDE || DEFAULT_WEB_HOST
  ),
  getWsHostOverride: (): string => (
    process.env.REACT_APP_NEON_WS_HOST_OVERRIDE || DEFAULT_API_HOST
  ),

  route: {
    home: () => '/home',
    account: () => '/myaccount',
    getFullRoute: (route = '') => `${NeonEnvironment.getRouterBasePath()}${route}`,
    buildRouteFromHost: (route = '') => (
      `${NeonEnvironment.getApiHost()}${NeonEnvironment.route.getFullRoute(route)}`
    ),
    buildHomeRoute: () => (
      `${NeonEnvironment.getWebHost()}${NeonEnvironment.route.home()}`
    ),
    buildAccountRoute: () => (
      // TODO: replace with web host once switch over happens
      `${NeonEnvironment.getApiHost()}${NeonEnvironment.route.account()}`
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
      const allowInternal = (typeof serverData.NeonPublicAPIHostAllowInternal === 'boolean')
        ? serverData.NeonPublicAPIHostAllowInternal as boolean
        : false;
      const apiHost = serverData.NeonPublicAPIHost;
      try {
        const { hostname: apiHostname } = new URL(apiHost);
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

  getNeonServerDataBioRepoHost: (): string | null => {
    const serverData = NeonEnvironment.getNeonServerData();
    if (serverData && (typeof serverData.NeonBioRepoHost === 'string')) {
      const bioRepoHost = serverData.NeonBioRepoHost;
      try {
        const { hostname: bioRepoHostname } = new URL(bioRepoHost);
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

  getBioRepoHost: (): string => {
    // Check for local override
    if (NeonEnvironment.isDevEnv && NeonEnvironment.getBioRepoHostOverride()) {
      return NeonEnvironment.getBioRepoHostOverride();
    }
    // Check for server data env var
    const bioRepoHost: string | null = NeonEnvironment.getNeonServerDataBioRepoHost();
    if (bioRepoHost !== null) {
      return bioRepoHost;
    }
    /* eslint-disable */
    // @ts-ignore
    if (typeof WorkerGlobalScope === 'function' && typeof self.location === 'object') {
      if (NeonEnvironment.isBioRepoHostValid(self.location.host)) {
        return `${self.location.protocol}//${self.location.host}`;
      }
      return DEFAULT_BIOREPO_HOST;
    }
    /* eslint-enable */
    if (NeonEnvironment.isBioRepoHostValid(window.location.host)) {
      return `${window.location.protocol}//${window.location.host}`;
    }
    return DEFAULT_BIOREPO_HOST;
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
   * Valid host names include localhost and known NEON Biorepo hosts
   * @param host
   * @returns
   */
  isBioRepoHostValid: (host: string): boolean => {
    if ((typeof host !== 'string') || (host.length <= 0)) {
      return false;
    }
    const regex = HostRegexService.getBioRepoHostRegex();
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

  getFullDownloadApiPath: (path: string = ''): string => {
    const host = NeonEnvironment.getApiHost();
    const root = NeonEnvironment.getRootDownloadApiPath();
    return NeonEnvironment.getDownloadApiPath[path]
      ? `${host}${root}${NeonEnvironment.getDownloadApiPath[path]()}`
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

  /**
   * Indicates when a CORS request is required
   * @returns
   */
  requireCors: (): boolean => {
    if (window.location.host.includes('localhost')) {
      return false;
    }
    return !NeonEnvironment.isApiHostValid(window.location.host);
  },
};

Object.freeze(NeonEnvironment);

export default NeonEnvironment;
