import { AuthSilentType, AnyObject } from '../../types/core';

export interface ServerData {
  publicApiHost: string;
  publicApiTokenHeader: string;
  publicApiToken: string;
  authSilentType: string;
}

/**
 * Gets the window.NEON_SERVER_DATA injected from the server environment.
 * @returns {Object} The structured server data object
 */
const getNeonServerData = (): AnyObject | null => {
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
 * @returns The API host
 */
const getApiHost = (serverData: AnyObject): string => (
  (typeof serverData.NeonPublicAPIHost === 'string') ? serverData.NeonPublicAPIHost : ''
);

/**
 * Gets the API token header name
 * @param serverData The serverData object
 * @returns {string} The API token header name
 */
const getApiTokenHeader = (serverData: AnyObject): string => (
  (typeof serverData.NeonPublicAPITokenHeader === 'string') ? serverData.NeonPublicAPITokenHeader : ''
);

/**
 * Gets the API token value
 * @param serverData The serverData object
 * @returns {string} The API token value
 */
const getApiToken = (serverData: AnyObject): string => (
  (typeof serverData.NeonPublicAPIToken === 'string') ? serverData.NeonPublicAPIToken : ''
);

/**
 * Determines if the silent authentication process should be prevented
 * based on environment or browser as external dependencies are required.
 * @param serverData The serverData object
 * @returns {AuthSilentType} The silent type string
 */
const getAuthSilentType = (serverData: AnyObject): string => (
  (typeof serverData.NeonAuthSilentType === 'string'
    && serverData.NeonAuthSilentType.length > 0)
    ? serverData.NeonAuthSilentType : AuthSilentType.DISABLED
);

/**
 * Get the fully populated object containing the server data if present
 * @returns {ServerData} The populated object
 */
export const getServerData = (): ServerData => {
  const serverData = getNeonServerData();
  if (serverData === null) {
    return {
      publicApiHost: '',
      publicApiTokenHeader: '',
      publicApiToken: '',
      authSilentType: '',
    };
  }
  return {
    publicApiHost: getApiHost(serverData),
    publicApiTokenHeader: getApiTokenHeader(serverData),
    publicApiToken: getApiToken(serverData),
    authSilentType: getAuthSilentType(serverData),
  };
};
