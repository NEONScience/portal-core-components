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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Gets the API Token header from the environment.
 * @param {Object|undefined} headers Optional headers to build upon.
 * @return {Object} The resulting header object with API token set.
 */
var _getApiTokenHeader = function getApiTokenHeader() {
  var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  var appliedHeaders = headers || {};

  var apiTokenHeader = _NeonEnvironment.default.getApiTokenHeader();

  var apiToken = _NeonEnvironment.default.getApiToken();

  if (apiTokenHeader && apiTokenHeader.length > 0 && apiToken && apiToken.length > 0) {
    // Only add the header when it doesn't already exist.
    if (typeof appliedHeaders[apiTokenHeader] !== 'string') {
      appliedHeaders = _extends({}, appliedHeaders, _defineProperty({}, apiTokenHeader, apiToken));
    }
  }

  return appliedHeaders;
};
/**
 * Convenience function to map an ajax request to response
 * to match the return signature of ajax.getJSON
 */


var mapResponse = (0, _rxjs.map)(function (x) {
  return x.response;
});

var getAppliedWithCredentials = function getAppliedWithCredentials() {
  var withCredentials = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  var appliedWithCredentials = false;

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


var getJsonAjaxRequest = function getJsonAjaxRequest(url) {
  var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var includeToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var withCredentials = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  var appliedHeaders = headers || {};

  if (includeToken) {
    appliedHeaders = _getApiTokenHeader(appliedHeaders);
  }

  var appliedWithCredentials = getAppliedWithCredentials(withCredentials);
  return {
    url: url,
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


var _getJsonObservable = function getJsonObservable(url) {
  var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var includeToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var withCredentials = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

  if (typeof url !== 'string' || !url.length) {
    return (0, _rxjs.of)(null);
  }

  var request = getJsonAjaxRequest(url, headers, includeToken, withCredentials);
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


var headJsonAjaxRequest = function headJsonAjaxRequest(url) {
  var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var includeToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var withCredentials = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  var appliedHeaders = headers || {};

  if (includeToken) {
    appliedHeaders = _getApiTokenHeader(appliedHeaders);
  }

  var appliedWithCredentials = getAppliedWithCredentials(withCredentials);
  return {
    url: url,
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


var _headJsonObservable = function headJsonObservable(url) {
  var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var includeToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var withCredentials = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

  if (typeof url !== 'string' || !url.length) {
    return (0, _rxjs.of)(null);
  }

  var request = headJsonAjaxRequest(url, headers, includeToken, withCredentials);
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


var _postJsonObservable = function postJsonObservable(url, body) {
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var includeToken = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var withCredentials = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

  if (typeof url !== 'string' || !url.length) {
    return (0, _rxjs.of)(null);
  }

  var appliedHeaders = headers || {};

  if (includeToken) {
    appliedHeaders = _getApiTokenHeader(appliedHeaders);
  }

  var appliedWithCredentials = getAppliedWithCredentials(withCredentials);
  return (0, _ajax.ajax)({
    url: url,
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


var NeonApi = {
  /**
   * Gets the API Token header from the environment.
   * @param {Object|undefined} headers Optional headers to build upon.
   * @return {Object} The resulting header object with API token set.
   */
  getApiTokenHeader: function getApiTokenHeader() {
    var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    return _getApiTokenHeader(headers);
  },

  /**
   * Gets the RxJS observable for making an API request to the specified URL
   * with optional headers.
   * @param {string} url The URL to make the API request to
   * @param {Object|undefined} headers The headers to add to the request
   * @param {boolean} includeToken Option to include the API token in the request
   * @return The RxJS Ajax Observable
   */
  getJsonObservable: function getJsonObservable(url) {
    var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var includeToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    return _getJsonObservable(url, headers, includeToken);
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
  postJsonObservable: function postJsonObservable(url, body) {
    var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    var includeToken = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    return _postJsonObservable(url, body, headers, includeToken);
  },

  /**
   * Gets the RxJS observable for making a HEAD API request to the specified URL
   * with optional headers.
   * @param {string} url The URL to make the API request to
   * @param {Object|undefined} headers The headers to add to the request
   * @param {boolean} includeToken Option to include the API token in the request
   * @return The RxJS Ajax Observable
   */
  headJsonObservable: function headJsonObservable(url) {
    var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var includeToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    return _headJsonObservable(url, headers, includeToken);
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
  getJson: function getJson(url, callback, errorCallback, cancellationSubject$) {
    var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
    return (0, _rxUtil.getJson)(url, callback, errorCallback, cancellationSubject$, _getApiTokenHeader(headers));
  },

  /**
   * Gets the products endpoint RxJS Observable.
   * @return The RxJS Ajax Observable
   */
  getProductsObservable: function getProductsObservable() {
    return _getJsonObservable(_NeonEnvironment.default.getFullApiPath('products'));
  },

  /**
   * Gets the product endpoint RxJS Observable for the specified product code.
   * @param {string} productCode The product code to get for.
   * @param {string} release An optional release to scope the product.
   * @return The RxJS Ajax Observable
   */
  getProductObservable: function getProductObservable(productCode) {
    var release = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var root = _NeonEnvironment.default.getFullApiPath('products');

    var path = release ? "".concat(root, "/").concat(productCode, "/").concat(release) : "".concat(root, "/").concat(productCode);
    return _getJsonObservable(path);
  },

  /**
   * Gets the product bundles endpoint RxJS Observable.
   * @param {string} release An optional release to scope the bundles.
   * @return The RxJS Ajax Observable
   */
  getProductBundlesObservable: function getProductBundlesObservable() {
    var release = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var root = _NeonEnvironment.default.getFullApiPath('productBundles');

    var path = (0, _typeUtil.isStringNonEmpty)(release) ? "".concat(root, "?release=").concat(release) : "".concat(root);
    return _getJsonObservable(path);
  },

  /**
   * Gets the prototype data endpoint RxJS Observable.
   * @return The RxJS Ajax Observable
   */
  getPrototypeDatasetsObservable: function getPrototypeDatasetsObservable() {
    return _getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('prototype'), "/datasets"));
  },
  getPrototypeDatasetObservable: function getPrototypeDatasetObservable(uuid) {
    return _getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('prototype'), "/datasets/").concat(uuid));
  },
  getPrototypeManifestRollupObservable: function getPrototypeManifestRollupObservable(uuid) {
    return (// eslint-disable-next-line max-len
      _getJsonObservable("".concat(_NeonEnvironment.default.getFullDownloadApiPath('prototypeManifestRollup'), "?uuid=").concat(uuid))
    );
  },
  getPrototypeDataFileObservable: function getPrototypeDataFileObservable(uuid, fileName) {
    return _getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('prototype'), "/data/").concat(uuid, "/").concat(fileName));
  },

  /**
   * Gets the release endpoint RxJS Observable.
   * @return The RxJS Ajax Observable
   */
  getReleasesObservable: function getReleasesObservable() {
    return _getJsonObservable(_NeonEnvironment.default.getFullApiPath('releases'));
  },

  /**
   * Gets the release endpoint RxJS Observable for the specified release.
   * @param {string} release The release tag to get
   * @return The RxJS Ajax Observable
   */
  getReleaseObservable: function getReleaseObservable(release) {
    return _getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('releases'), "/").concat(release));
  },

  /**
   * Gets the sites endpoint RxJS Observable.
   * @return The RxJS Ajax Observable
   */
  getSitesJsonObservable: function getSitesJsonObservable() {
    return _getJsonObservable(_NeonEnvironment.default.getFullApiPath('sites'));
  },

  /**
   * Gets the sites endpoint RxJS Observable for the specified site code.
   * @param {string} siteCode The site code to get for.
   * @return The RxJS Ajax Observable
   */
  getSiteJsonObservable: function getSiteJsonObservable(siteCode) {
    return _getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('sites'), "/").concat(siteCode));
  },

  /**
   * Gets the RxJS Observable for the locations endpoint for a given site hierarchy
   * @param {string} siteCode The site code to get complete hierarchy for.
   * @return The RxJS Ajax Observable
   */
  getSiteLocationHierarchyObservable: function getSiteLocationHierarchyObservable(siteCode) {
    return _getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('locations'), "/").concat(siteCode, "?hierarchy=true"));
  },

  /**
   * Gets the RxJS Observable for the locations endpoint for a given named location
   * @param {string} location The named location to fetch.
   * @return The RxJS Ajax Observable
   */
  getLocationObservable: function getLocationObservable(location) {
    return _getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('locations'), "/").concat(location));
  },

  /**
   * Gets the RxJS Observable for the ArcGIS asset endpoint for a given feature / site code combo
   * @param {string} feature
   * @param {string} siteCode
   * @return The RxJS Ajax Observable
   */
  getArcgisAssetObservable: function getArcgisAssetObservable(feature, siteCode) {
    return _getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('arcgisAssets'), "/").concat(feature, "/").concat(siteCode), undefined, true, false);
  },

  /**
   * Gets the RxJS Observable for the document HEAD endpoint for a given name
   * @param {string} name The document name
   * @return The RxJS Ajax Observable
   */
  headDocumentObservable: function headDocumentObservable(name) {
    return _headJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('documents'), "/").concat(name));
  },

  /**
   * Gets the RxJS Observable for the quick start guides endpoint for a given name
   * @param {string} name The quick start guide name
   * @param {string} version The quick start guide version
   * @return The RxJS Ajax Observable
   */
  getQuickStartGuideDetailObservable: function getQuickStartGuideDetailObservable(name, version) {
    return _getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('quickStartGuides'), "/details/").concat(name, "/").concat(version));
  },

  /**
   * Gets the RxJS Observable for the quick start guides HEAD endpoint for a given name
   * @param {string} name The document name
   * @return The RxJS Ajax Observable
   */
  headQuickStartGuideObservable: function headQuickStartGuideObservable(name) {
    return _headJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('quickStartGuides'), "/").concat(name));
  }
};
Object.freeze(NeonApi);
var _default = NeonApi; // Additional items exported for unit testing

exports.default = _default;

var getTestableItems = function getTestableItems() {
  return process.env.NODE_ENV !== 'test' ? {} : {
    getApiTokenHeader: _getApiTokenHeader,
    getJsonObservable: _getJsonObservable,
    postJsonObservable: _postJsonObservable
  };
};

exports.getTestableItems = getTestableItems;