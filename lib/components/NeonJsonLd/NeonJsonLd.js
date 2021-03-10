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
  CITATION_AUTHOR: 'NEON (National Ecological Observatory Network)',

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
   * @param {string} release The release to build the URL from.
   * @return The RxJS AJAX Observable.
   */
  getProductJsonLdObservable: function getProductJsonLdObservable(productCode, release) {
    var hasRelease = typeof release !== 'undefined' && release !== null && typeof release === 'string' && release.length > 0;

    if (hasRelease) {
      return NeonJsonLd.getJsonLdObservable("".concat(_NeonEnvironment.default.getFullJsonLdApiPath('products'), "/").concat(productCode, "?release=").concat(release));
    }

    return NeonJsonLd.getJsonLdObservable("".concat(_NeonEnvironment.default.getFullJsonLdApiPath('products'), "/").concat(productCode));
  },

  /**
   * Injects the JSON-LD object as a script block with the appropriate type
   * into the DOM head.
   * Assumes the object is a valid JSON object.
   * @param {Object|null|undefined} data The JSON-LD object to inject.
   * @param {boolean} injectReleaseMeta Optionally inject release meta tags
   */
  inject: function inject(data) {
    var injectReleaseMeta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!data) return;

    try {
      var existingBlock = document.head.querySelector('script[type="application/ld+json"]');

      if (typeof existingBlock !== 'undefined' && existingBlock !== null) {
        existingBlock.remove();
      }
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }

    if (injectReleaseMeta) {
      NeonJsonLd.injectReleaseMeta(data);
    }

    var block = document.createElement('script');
    block.setAttribute('type', 'application/ld+json');
    block.innerText = JSON.stringify(data);
    document.head.appendChild(block);
  },

  /**
   * Injects the release meta tags into the DOM head from the supplied
   * JSON-LD object.
   * Assumes the object is a valid JSON object.
   * @param {Object|null|undefined} data The JSON-LD object to inject.
   */
  injectReleaseMeta: function injectReleaseMeta(data) {
    if (!data) return;

    try {
      var currentDoiBlock = document.head.querySelector('meta[name="citation_doi"]');
      var doiUrl = new URL(data.identifier);
      var doiBlock = document.createElement('meta');
      doiBlock.setAttribute('name', 'citation_doi');
      doiBlock.setAttribute('content', doiUrl.pathname.slice(1, doiUrl.pathname.length));

      if (typeof currentDoiBlock !== 'undefined' && currentDoiBlock !== null) {
        document.head.replaceChild(doiBlock, currentDoiBlock);
      } else {
        document.head.appendChild(doiBlock);
      }

      var currentTitleBlock = document.head.querySelector('meta[name="citation_title"]');
      var titleBlock = document.createElement('meta');
      titleBlock.setAttribute('name', 'citation_title');
      var addTitle = false;

      if (typeof data.name === 'string' && data.name.length > 0) {
        if (data.name.indexOf(NeonJsonLd.CITATION_AUTHOR) >= 0) {
          var titleContent = data.name.replace(NeonJsonLd.CITATION_AUTHOR, '').trim();
          titleBlock.setAttribute('content', titleContent);
        } else {
          titleBlock.setAttribute('content', data.name);
        }

        addTitle = true;
      }

      if (!addTitle) {
        if (typeof currentTitleBlock !== 'undefined' && currentTitleBlock !== null) {
          currentTitleBlock.remove();
        }
      } else if (typeof currentTitleBlock !== 'undefined' && currentTitleBlock !== null) {
        document.head.replaceChild(titleBlock, currentTitleBlock);
      } else {
        document.head.appendChild(titleBlock);
      }

      var currentAuthorBlock = document.head.querySelector('meta[name="citation_author"]');
      var authorBlock = document.createElement('meta');
      authorBlock.setAttribute('name', 'citation_author');
      authorBlock.setAttribute('content', NeonJsonLd.CITATION_AUTHOR);

      if (typeof currentAuthorBlock !== 'undefined' && currentAuthorBlock !== null) {
        document.head.replaceChild(authorBlock, currentAuthorBlock);
      } else {
        document.head.appendChild(authorBlock);
      }
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  },

  /**
   * Removes the release meta tags from the DOM head element when exists.
   */
  removeReleaseMeta: function removeReleaseMeta() {
    try {
      var currentDoiBlock = document.head.querySelector('meta[name="citation_doi"]');

      if (typeof currentDoiBlock !== 'undefined' && currentDoiBlock !== null) {
        currentDoiBlock.remove();
      }

      var currentTitleBlock = document.head.querySelector('meta[name="citation_title"]');

      if (typeof currentTitleBlock !== 'undefined' && currentTitleBlock !== null) {
        currentTitleBlock.remove();
      }

      var currentAuthorBlock = document.head.querySelector('meta[name="citation_author"]');

      if (typeof currentAuthorBlock !== 'undefined' && currentAuthorBlock !== null) {
        currentAuthorBlock.remove();
      }
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  },

  /**
   * Retrieves and injects the JDON-LD data from the specified URL.
   * @param {string} url The URL to query.
   * @param {boolean} injectReleaseMeta Optionally inject release meta tags
   */
  getJsonLdWithInjection: function getJsonLdWithInjection(url) {
    var injectReleaseMeta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var observable = _NeonApi.default.getJsonObservable(url).pipe((0, _operators.map)(function (response) {
      return NeonJsonLd.inject(response, injectReleaseMeta);
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
   * @param {string} release The release to build the URL from.
   * @param {boolean} injectReleaseMeta Optionally inject release meta tags
   * @param {boolean} onNotExistsOnly Inject only if JSON-LD is not already injected
   */
  injectProduct: function injectProduct(productCode, release) {
    var injectReleaseMeta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var onNotExistsOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var shouldFetch = true;

    if (onNotExistsOnly) {
      try {
        var existingBlock = document.head.querySelector('script[type="application/ld+json"]');

        if (typeof existingBlock !== 'undefined' && existingBlock !== null) {
          shouldFetch = false;
        }
      } catch (e) {
        console.error(e); // eslint-disable-line no-console
      }
    }

    if (!shouldFetch) {
      return null;
    }

    var hasRelease = typeof release !== 'undefined' && release !== null && typeof release === 'string' && release.length > 0;

    if (hasRelease) {
      return NeonJsonLd.getJsonLdWithInjection("".concat(_NeonEnvironment.default.getFullJsonLdApiPath('products'), "/").concat(productCode, "?release=").concat(release), injectReleaseMeta);
    }

    NeonJsonLd.removeReleaseMeta();
    return NeonJsonLd.getJsonLdWithInjection("".concat(_NeonEnvironment.default.getFullJsonLdApiPath('products'), "/").concat(productCode));
  }
};
Object.freeze(NeonJsonLd);
var _default = NeonJsonLd;
exports.default = _default;