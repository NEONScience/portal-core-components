"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rxjs = require("rxjs");

var _ajax = require("rxjs/ajax");

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

var _rxUtil = require("../../util/rxUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
 * Gets the RxJS observable for making an API request to the specified URL
 * with optional headers.
 * @param {string} url The URL to make the API request to
 * @param {Object|undefined} headers The headers to add to the request
 * @param {boolean} includeToken Option to include the API token in the request
 * @return The RxJS Ajax Observable
 */


var _getJsonObservable = function getJsonObservable(url) {
  var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var includeToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (!url.length) {
    return (0, _rxjs.of)(null);
  }

  var appliedHeaders = headers || {};

  if (includeToken) {
    appliedHeaders = _getApiTokenHeader(appliedHeaders);
  }

  return _ajax.ajax.getJSON(url, appliedHeaders);
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
   * @return The RxJS Ajax Observable
   */
  getProductObservable: function getProductObservable(productCode) {
    return _getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('products'), "/").concat(productCode));
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
    return _getJsonObservable("".concat(_NeonEnvironment.default.getFullApiPath('arcgisAssets'), "/").concat(feature, "/").concat(siteCode));
  }
};
Object.freeze(NeonApi);
var _default = NeonApi;
exports.default = _default;