import { AuthSilentType, AnyObject } from '../../types/core';

export interface ServerData {
  publicApiHost: string;
  publicApiTokenHeader: string;
  publicApiToken: string;
  authSilentType: string;
}

/**
 * Gets the window.NEON_SERVER_DATA injected into the index.html page from the server environment.
 * @return {Object} The structured server data object
 */
const readServerData = (): AnyObject | null => {
  // @ts-ignore: Cannot find name
  if (typeof WorkerGlobalScope === 'function') {
    /* eslint-disable */
    // @ts-ignore: Property does not exist on type
    return self.NEON_SERVER_DATA ? self.NEON_SERVER_DATA : null;
  }
  /* eslint-enable */
  if (typeof window === 'object') {
    // @ts-ignore: Property does not exist on type
    return window.NEON_SERVER_DATA ? window.NEON_SERVER_DATA : null;
  }
  return null;
};

/**
 * Gets the API host
 * @param serverData The serverData object
 * @returns
 */
const getApiHost = (serverData: AnyObject | null): string => {
  if (serverData && (typeof serverData.NeonPublicAPIHost === 'string')) {
    return serverData.NeonPublicAPIHost;
  }
  return '';
};

/**
 * Gets the API token header name
 * @return {string} The API token header name
 */
const getApiTokenHeader = (serverData: AnyObject | null): string => {
  if (serverData && (typeof serverData.NeonPublicAPITokenHeader === 'string')) {
    return serverData.NeonPublicAPITokenHeader;
  }
  return '';
};

/**
 * Gets the API token value
 * @return {string} The API token value
 */
const getApiToken = (serverData: AnyObject | null): string => {
  if (serverData && (typeof serverData.NeonPublicAPIToken === 'string')) {
    return serverData.NeonPublicAPIToken;
  }
  return '';
};

/**
 * Determines if the silent authentication process should be prevented
 * based on environment or browser as external dependencies are required.
 * @return {AuthSilentType}
 */
const getAuthSilentType = (serverData: AnyObject | null): string => {
  if (serverData
    && (typeof serverData.NeonAuthSilentType === 'string')
    && (serverData.NeonAuthSilentType.length > 0)) {
    return serverData.NeonAuthSilentType;
  }
  return AuthSilentType.DISABLED;
};

export const getServerData = (): ServerData => {
  const data = readServerData();
  const publicApiHost = getApiHost(data);
  const publicApiTokenHeader = getApiTokenHeader(data);
  const publicApiToken = getApiToken(data);
  const authSilentType = getAuthSilentType(data);
  return {
    publicApiHost,
    publicApiTokenHeader,
    publicApiToken,
    authSilentType,
  };
};
