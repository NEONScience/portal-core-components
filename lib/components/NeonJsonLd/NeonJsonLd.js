"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _NeonApi = _interopRequireDefault(require("../NeonApi/NeonApi"));

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Container for supplying common NEON API JSON-LD request handlers.
 */
var NeonJsonLd = {
  /**
   * Convenience wrapper for obtaining an AJAX Observable from NeonApi.
   * @param {string} url The URL to build from.
   * @return The RxJS AJAX Observable.
   */
  getJsonLdObservable: function getJsonLdObservable(url) {
    return _NeonApi.default.getJsonObservable(url);
  },

  /**
   * Gets the repository JSON-LD endpoint observable.
   * @return The RxJS AJAX Observable.
   */
  getRepoJsonLdObservable: function getRepoJsonLdObservable() {
    return NeonJsonLd.getJsonLdObservable(_NeonEnvironment.default.getFullJsonLdApiPath('repo'));
  },

  /**
   * Gets the product JSON-LD endpoint observable.
   * @param {string} productCode The product code to build the URL from.
   * @return The RxJS AJAX Observable.
   */
  getProductJsonLdObservable: function getProductJsonLdObservable(productCode) {
    return NeonJsonLd.getJsonLdObservable("".concat(_NeonEnvironment.default.getFullJsonLdApiPath('products'), "/").concat(productCode));
  },

  /**
   * Injects the JSON-LD object as a script block with the appropriate type
   * into the DOM head.
   * Assumes the object is a valid JSON object.
   * @param {Object|null|undefined} data The JSON-LD object to inject.
   */
  inject: function inject(data) {
    if (!data) return;
    var block = document.createElement('script');
    block.setAttribute('type', 'application/ld+json');
    block.innerText = JSON.stringify(data);
    document.head.appendChild(block);
  },

  /**
   * Retrieves and injects the JDON-LD data from the specified URL.
   * @param {string} url The URL to query.
   */
  getJsonLdWithInjection: function getJsonLdWithInjection(url) {
    var observable = _NeonApi.default.getJsonObservable(url).pipe((0, _operators.map)(function (response) {
      return NeonJsonLd.inject(response);
    }), (0, _operators.catchError)(function (err) {
      console.error(err); // eslint-disable-line no-console

      return (0, _rxjs.of)('JSON-LD not found');
    }));

    observable.subscribe();
  },

  /**
   * Fetches and injects the repository JSON-LD.
   */
  injectRepo: function injectRepo() {
    return NeonJsonLd.getJsonLdWithInjection(_NeonEnvironment.default.getFullJsonLdApiPath('repo'));
  },

  /**
   * Fetches and injects the product JSON-LD based on the specified product code.
   * @param {string} productCode The product code to query with.
   */
  injectProduct: function injectProduct(productCode) {
    return NeonJsonLd.getJsonLdWithInjection("".concat(_NeonEnvironment.default.getFullJsonLdApiPath('products'), "/").concat(productCode));
  }
};
Object.freeze(NeonJsonLd);
var _default = NeonJsonLd;
exports.default = _default;