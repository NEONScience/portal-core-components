import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';

import { getJson } from '../../util/rxUtil';

/**
 * Gets the API Token header from the environment.
 * @param {Object|undefined} headers Optional headers to build upon.
 * @return {Object} The resulting header object with API token set.
 */
const getApiTokenHeader = (headers = undefined) => {
  let appliedHeaders = headers || {};
  const apiTokenHeader = NeonEnvironment.getApiTokenHeader();
  const apiToken = NeonEnvironment.getApiToken();
  if (apiTokenHeader && (apiTokenHeader.length > 0)
      && apiToken && (apiToken.length > 0)) {
    // Only add the header when it doesn't already exist.
    if (typeof appliedHeaders[apiTokenHeader] !== 'string') {
      appliedHeaders = {
        ...appliedHeaders,
        [apiTokenHeader]: apiToken,
      };
    }
  }
  return appliedHeaders;
};

/**
 * Gets the RxJS observable for making an API request to the specified URL
 * with optional headers.
 * @param {string} url The URL to make the API request to
 * @param {Object|undefined} headers The headers to add to the request
 * @param {boolean} includeToken Option to include the API token in the request
 * @return The RxJS Ajax Observable
 */
const getJsonObservable = (url, headers = undefined, includeToken = true) => {
  if (!url.length) { return of(null); }
  let appliedHeaders = headers || {};
  if (includeToken) {
    appliedHeaders = getApiTokenHeader(appliedHeaders);
  }
  return ajax.getJSON(url, appliedHeaders);
};

/**
 * Container for supplying common NEON API request handlers.
 */
const NeonApi = {
  /**
   * Gets the API Token header from the environment.
   * @param {Object|undefined} headers Optional headers to build upon.
   * @return {Object} The resulting header object with API token set.
   */
  getApiTokenHeader: (headers = undefined) => getApiTokenHeader(headers),
  /**
   * Gets the RxJS observable for making an API request to the specified URL
   * with optional headers.
   * @param {string} url The URL to make the API request to
   * @param {Object|undefined} headers The headers to add to the request
   * @param {boolean} includeToken Option to include the API token in the request
   * @return The RxJS Ajax Observable
   */
  getJsonObservable: (url, headers = undefined, includeToken = true) => (
    getJsonObservable(url, headers, includeToken)
  ),

  /**
   * Convenience method for utiliizing the rxUtil => getJson function.
   * This will automatically add the API token header to the request.
   * @param {string} url
   * @param {any} callback
   * @param {any} errorCallback
   * @param {any} cancellationSubject$
   * @param {Object|undefined} headers
   * @return RxJS subscription
   */
  getJson: (url, callback, errorCallback, cancellationSubject$, headers = undefined) => (
    getJson(url, callback, errorCallback, cancellationSubject$, getApiTokenHeader(headers))
  ),

  /**
   * Gets the products endpoint RxJS Observable.
   * @return The RxJS Ajax Observable
   */
  getProductsObservable: () => getJsonObservable(NeonEnvironment.getFullApiPath('products')),
  /**
   * Gets the product endpoint RxJS Observable for the specified product code.
   * @param {string} productCode The product code to get for.
   * @return The RxJS Ajax Observable
   */
  getProductObservable: productCode => (
    getJsonObservable(`${NeonEnvironment.getFullApiPath('products')}/${productCode}`)
  ),

  /**
   * Gets the sites endpoint RxJS Observable.
   * @return The RxJS Ajax Observable
   */
  getSitesJsonObservable: () => getJsonObservable(NeonEnvironment.getFullApiPath('sites')),
  /**
   * Gets the sites endpoint RxJS Observable for the specified site code.
   * @param {string} siteCode The site code to get for.
   * @return The RxJS Ajax Observable
   */
  getSiteJsonObservable: siteCode => (
    getJsonObservable(`${NeonEnvironment.getFullApiPath('sites')}/${siteCode}`)
  ),
};

Object.freeze(NeonApi);

export default NeonApi;
