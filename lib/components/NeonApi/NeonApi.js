"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTestableItems = exports.default = void 0;
var _rxjs = require("rxjs");
var _ajax = require("rxjs/ajax");
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _rxUtil = require("../../util/rxUtil");
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Gets the API Token header from the environment.
 * @param {Object|undefined} headers Optional headers to build upon.
 * @return {Object} The resulting header object with API token set.
 */
const getApiTokenHeader = function () {
  let headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  let appliedHeaders = headers || {};
  const apiTokenHeader = _NeonEnvironment.default.getApiTokenHeader();
  const apiToken = _NeonEnvironment.default.getApiToken();
  if (apiTokenHeader && apiTokenHeader.length > 0 && apiToken && apiToken.length > 0) {
    // Only add the header when it doesn't already exist.
    if (typeof appliedHeaders[apiTokenHeader] !== 'string') {
      appliedHeaders = _extends({}, appliedHeaders, {
        [apiTokenHeader]: apiToken
      });
    }
  }
  return appliedHeaders;
};

/**
 * Convenience function to map an ajax request to response
 * to match the return signature of ajax.getJSON
 */
const mapResponse = (0, _rxjs.map)(x => x.response);
const getAppliedWithCredentials = function () {
  let withCredentials = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  let appliedWithCredentials = false;
  if (!(0, _typeUtil.exists)(withCredentials) || typeof withCredentials !== 'boolean') {
    appliedWithCredentials = _NeonEnvironment.default.requireCors();
  } else {
    appliedWithCredentials = withCredentials;
  }
  return appliedWithCredentials;
};

/**
 * Gets the RxJS GET AjaxRequest
 * @param {string} url The URL to make the API request to
 * @param {Object|undefined} headers The headers to add to the request
 * @param {boolean} includeToken Option to include the API token in the request
 * @param {boolean} withCredentials Option to include credentials with a CORS request
 * @return The RxJS GET AjaxRequest
 */
const getJsonAjaxRequest = function (url) {
  let headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  let includeToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  let withCredentials = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let appliedHeaders = headers || {};
  if (includeToken) {
    appliedHeaders = getApiTokenHeader(appliedHeaders);
  }
  const appliedWithCredentials = getAppliedWithCredentials(withCredentials);
  return {
    url,
    method: 'GET',
    responseType: 'json',
    crossDomain: true,
    withCredentials: appliedWithCredentials,
    headers: _extends({}, appliedHeaders)
  };
};

/**
 * Gets the RxJS observable for making an API request to the specified URL
 * with optional headers.
 * @param {string} url The URL to make the API request to
 * @param {Object|undefined} headers The headers to add to the request
 * @param {boolean} includeToken Option to include the API token in the request
 * @param {boolean} withCredentials Option to include credentials with a CORS request
 * @return The RxJS Ajax Observable
 */
const getJsonObservable = function (url) {
  let headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  let includeToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  let withCredentials = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  if (typeof url !== 'string' || !url.length) {
    return (0, _rxjs.of)(null);
  }
  const request = getJsonAjaxRequest(url, headers, includeToken, withCredentials);
  return mapResponse((0, _ajax.ajax)(request));
};

/**
 * Gets the RxJS HEAD AjaxRequest
 * @param {string} url The URL to make the API request to
 * @param {Object|undefined} headers The headers to add to the request
 * @param {boolean} includeToken Option to include the API token in the request
 * @param {boolean} withCredentials Option to include credentials with a CORS request
 * @return The RxJS HEAD AjaxRequest
 */
const headJsonAjaxRequest = function (url) {
  let headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  let includeToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  let withCredentials = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let appliedHeaders = headers || {};
  if (includeToken) {
    appliedHeaders = getApiTokenHeader(appliedHeaders);
  }
  const appliedWithCredentials = getAppliedWithCredentials(withCredentials);
  return {
    url,
    method: 'HEAD',
    responseType: 'json',
    crossDomain: true,
    withCredentials: appliedWithCredentials,
    headers: _extends({}, appliedHeaders)
  };
};

/**
 * Gets the RxJS observable for making an API request to the specified URL
 * with optional headers.
 * @param {string} url The URL to make the API request to
 * @param {Object|undefined} headers The headers to add to the request
 * @param {boolean} includeToken Option to include the API token in the request
 * @param {boolean} withCredentials Option to include credentials with a CORS request
 * @return The RxJS Ajax Observable
 */
const headJsonObservable = function (url) {
  let headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  let includeToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  let withCredentials = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  if (typeof url !== 'string' || !url.length) {
    return (0, _rxjs.of)(null);
  }
  const request = headJsonAjaxRequest(url, headers, includeToken, withCredentials);
  return (0, _ajax.ajax)(request);
};

/**
 * Gets the RxJS observable for making a POST API request to the specified URL
 * with body and optional headers.
 * @param {string} url The URL to make the API request to
 * @param {any} body The body to send with the POST request
 * @param {Object|undefined} headers The headers to add to the request
 * @param {boolean} includeToken Option to include the API token in the request
 * @param {boolean} withCredentials Option to include credentials with a CORS request
 * @return The RxJS Ajax Observable
 */
const postJsonObservable = function (url, body) {
  let headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  let includeToken = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  let withCredentials = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  if (typeof url !== 'string' || !url.length) {
    return (0, _rxjs.of)(null);
  }
  let appliedHeaders = headers || {};
  if (includeToken) {
    appliedHeaders = getApiTokenHeader(appliedHeaders);
  }
  const appliedWithCredentials = getAppliedWithCredentials(withCredentials);
  return (0, _ajax.ajax)({
    url,
    method: 'POST',
    responseType: 'json',
    crossDomain: true,
    withCredentials: appliedWithCredentials,
    headers: _extends({}, appliedHeaders, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(body || {})
  });
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
  getApiTokenHeader: function () {
    let headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    return getApiTokenHeader(headers);
  },
  /**
   * Gets the RxJS observable for making an API request to the specified URL
   * with optional headers.
   * @param {string} url The URL to make the API request to
   * @param {Object|undefined} headers The headers to add to the request
   * @param {boolean} includeToken Option to include the API token in the request
   * @return The RxJS Ajax Observable
   */
  getJsonObservable: function (url) {
    let headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    let includeToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    return getJsonObservable(url, headers, includeToken);
  },
  /**
   * Gets the RxJS observable for making a POST API request to the specified URL
   * with body and optional headers.
   * @param {string} url The URL to make the API request to
   * @param {any} body The body to send with the POST request
   * @param {Object|undefined} headers The headers to add to the request
   * @param {boolean} includeToken Option to include the API token in the request
   * @return The RxJS Ajax Observable
   */
  postJsonObservable: function (url, body) {
    let headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    let includeToken = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    return postJsonObservable(url, body, headers, includeToken);
  },
  /**
   * Gets the RxJS observable for making a HEAD API request to the specified URL
   * with optional headers.
   * @param {string} url The URL to make the API request to
   * @param {Object|undefined} headers The headers to add to the request
   * @param {boolean} includeToken Option to include the API token in the request
   * @return The RxJS Ajax Observable
   */
  headJsonObservable: function (url) {
    let headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    let includeToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    return headJsonObservable(url, headers, includeToken);
  },
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
  getJson: function (url, callback, errorCallback, cancellationSubject$) {
    let headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
    return (0, _rxUtil.getJson)(url, callback, errorCallback, cancellationSubject$, getApiTokenHeader(headers));
  },
  /**
   * Gets the products endpoint RxJS Observable.
   * @return The RxJS Ajax Observable
   */
  getProductsObservable: () => getJsonObservable(_NeonEnvironment.default.getFullApiPath('products')),
  /**
   * Gets the product endpoint RxJS Observable for the specified product code.
   * @param {string} productCode The product code to get for.
   * @param {string} release An optional release to scope the product.
   * @return The RxJS Ajax Observable
   */
  getProductObservable: function (productCode) {
    let release = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const root = _NeonEnvironment.default.getFullApiPath('products');
    const path = release ? "".concat(root, "/").concat(productCode, "/").concat(release) : "".concat(root, "/").concat(productCode);
    return getJsonObservable(path);
  },
  /**
   * Gets the product tombstone availability endpoint
   * RxJS Observable for the specified product code and release.
   * @param {string} productCode The product code to get for.
   * @param {string} release A release to scope the product.
   * @return The RxJS Ajax Observable
   */
  getProductTombstoneAvailabilityObservable: (productCode, release) => {
    const root = _NeonEnvironment.default.getFullApiPath('products');
    const path = "".concat(root, "/").concat(productCode, "/").concat(release, "/tombstone-data-availability");
    return getJsonObservable(path);
  },
  /**
   * Gets the product DOI endpoint RxJS Observable for the specified product code and release.
   * @param {string} productCode The product code to get for.
   * @param {string} release An optional release to scope the product DOI.
   * @return The RxJS Ajax Observable
   */
  getProductDoisObservable: (productCode, release) => {
    const root = _NeonEnvironment.default.getFullApiPath('products');
    const path = "".concat(root, "/").concat(productCode, "/dois/").concat(release);
    return getJsonObservable(path);
  },
  /**
   * Gets the product bundles endpoint RxJS Observable.
   * @param {string} release An optional release to scope the bundles.
   * @return The RxJS Ajax Observable
   */
  getProductBundlesObservable: function () {
    let release = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    const root = _NeonEnvironment.default.getFullApiPath('productBundles');
    const path = (0, _typeUtil.isStringNonEmpty)(release) ? "".concat(root, "?release=").concat(release) : "".concat(root);
    return getJsonObservable(path);
  },
  /**
   * Gets the prototype data endpoint RxJS Observable.
   * @return The RxJS Ajax Observable
   */
  getPrototypeDatasetsObservable: () => getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('prototype'), "/datasets")),
  getPrototypeDatasetObservable: uuid => getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('prototype'), "/datasets/").concat(uuid)),
  getPrototypeManifestRollupObservable: uuid =>
  // eslint-disable-next-line max-len
  getJsonObservable("".concat(_NeonEnvironment.default.getFullDownloadApiPath('prototypeManifestRollup'), "?uuid=").concat(uuid)),
  getPrototypeDataFileObservable: (uuid, fileName) => getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('prototype'), "/data/").concat(uuid, "/").concat(fileName)),
  /**
   * Gets the release endpoint RxJS Observable.
   * @return The RxJS Ajax Observable
   */
  getReleasesObservable: () => getJsonObservable(_NeonEnvironment.default.getFullApiPath('releases')),
  /**
   * Gets the release endpoint RxJS Observable for the specified release.
   * @param {string} release The release tag to get
   * @return The RxJS Ajax Observable
   */
  getReleaseObservable: release => getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('releases'), "/").concat(release)),
  /**
   * Gets the sites endpoint RxJS Observable.
   * @return The RxJS Ajax Observable
   */
  getSitesJsonObservable: () => getJsonObservable(_NeonEnvironment.default.getFullApiPath('sites')),
  /**
   * Gets the sites endpoint RxJS Observable for the specified site code.
   * @param {string} siteCode The site code to get for.
   * @return The RxJS Ajax Observable
   */
  getSiteJsonObservable: siteCode => getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('sites'), "/").concat(siteCode)),
  /**
   * Gets the RxJS Observable for the locations endpoint for a given site hierarchy
   * @param {string} siteCode The site code to get complete hierarchy for.
   * @return The RxJS Ajax Observable
   */
  getSiteLocationHierarchyObservable: siteCode => getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('locations'), "/").concat(siteCode, "?hierarchy=true")),
  /**
   * Gets the RxJS Observable for the locations endpoint for a given named location
   * @param {string} location The named location to fetch.
   * @return The RxJS Ajax Observable
   */
  getLocationObservable: location => getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('locations'), "/").concat(location)),
  /**
   * Gets the RxJS Observable for the ArcGIS asset endpoint for a given feature / site code combo
   * @param {string} feature
   * @param {string} siteCode
   * @return The RxJS Ajax Observable
   */
  getArcgisAssetObservable: (feature, siteCode) => getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('arcgisAssets'), "/").concat(feature, "/").concat(siteCode), undefined, true, false),
  /**
   * Gets the RxJS Observable for the document HEAD endpoint for a given name
   * @param {string} name The document name
   * @return The RxJS Ajax Observable
   */
  headDocumentObservable: name => headJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('documents'), "/").concat(name)),
  /**
   * Gets the RxJS Observable for the quick start guides endpoint for a given name
   * @param {string} name The quick start guide name
   * @param {string} version The quick start guide version
   * @return The RxJS Ajax Observable
   */
  getQuickStartGuideDetailObservable: (name, version) => getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('quickStartGuides'), "/details/").concat(name, "/").concat(version)),
  /**
   * Gets the RxJS Observable for the quick start guides HEAD endpoint for a given name
   * @param {string} name The document name
   * @return The RxJS Ajax Observable
   */
  headQuickStartGuideObservable: name => headJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('quickStartGuides'), "/").concat(name))
};
Object.freeze(NeonApi);
var _default = exports.default = NeonApi; // Additional items exported for unit testing
const getTestableItems = () => process.env.NODE_ENV !== 'test' ? {} : {
  getApiTokenHeader,
  getJsonObservable,
  postJsonObservable
};
exports.getTestableItems = getTestableItems;