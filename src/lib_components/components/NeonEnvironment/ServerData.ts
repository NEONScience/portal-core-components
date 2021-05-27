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
 * Get a fully populated object containing the server data
 * @returns {ServerData} The populated object
 */
export const getServerData = (): ServerData => {
  const serverData = getNeonServerData();
  return {
    publicApiHost:
      (serverData && typeof serverData.NeonPublicAPIHost === 'string')
        ? serverData.NeonPublicAPIHost : '',
    publicApiTokenHeader:
      (serverData && typeof serverData.NeonPublicAPITokenHeader === 'string')
        ? serverData.NeonPublicAPITokenHeader : '',
    publicApiToken:
      (serverData && typeof serverData.NeonPublicAPIToken === 'string')
        ? serverData.NeonPublicAPIToken : '',
    authSilentType:
      (serverData && typeof serverData.NeonAuthSilentType === 'string'
        && serverData.NeonAuthSilentType.length > 0)
        ? serverData.NeonAuthSilentType : AuthSilentType.DISABLED,
  };
};
