"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _rxjs = require("rxjs");
var _NeonApi = _interopRequireDefault(require("../NeonApi/NeonApi"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Container for supplying common NEON API JSON-LD request handlers.
 */
const NeonJsonLd = {
  CITATION_AUTHOR: 'NEON (National Ecological Observatory Network)',
  /**
   * Convenience wrapper for obtaining an AJAX Observable from NeonApi.
   * @param {string} url The URL to build from.
   * @return The RxJS AJAX Observable.
   */
  getJsonLdObservable: url => _NeonApi.default.getJsonObservable(url),
  /**
   * Gets the repository JSON-LD endpoint observable.
   * @return The RxJS AJAX Observable.
   */
  getRepoJsonLdObservable: () => NeonJsonLd.getJsonLdObservable(_NeonEnvironment.default.getFullJsonLdApiPath('repo')),
  /**
   * Gets the product JSON-LD endpoint observable.
   * @param {string} productCode The product code to build the URL from.
   * @param {string} release The release to build the URL from.
   * @return The RxJS AJAX Observable.
   */
  getProductJsonLdObservable: (productCode, release) => {
    const hasRelease = typeof release !== 'undefined' && release !== null && typeof release === 'string' && release.length > 0;
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
  inject: function (data) {
    let injectReleaseMeta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!data) return;
    NeonJsonLd.removeJsonLdScript();
    if (injectReleaseMeta) {
      NeonJsonLd.injectReleaseMeta(data);
    }
    const block = document.createElement('script');
    block.setAttribute('type', 'application/ld+json');
    block.innerText = JSON.stringify(data);
    document.head.appendChild(block);
  },
  /**
   * Injects the release meta tags into the DOM head from the supplied
   * JSON-LD object.
   * Assumes the object is a valid JSON object.
   * @param {Object|null|undefined} data The JSON-LD object to inject.
   * @param {boolean|undefined} metadataUseMultiParent Optionally inject multi
   *  parent DOIs.
   */
  injectReleaseMeta: function (data) {
    let metadataUseMultiParent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!data) return;
    try {
      let metadataObjects = [];
      if (Array.isArray(data)) {
        if (!metadataUseMultiParent && data.length >= 1) {
          metadataObjects = [data[0]];
        } else {
          metadataObjects = data;
        }
      } else {
        metadataObjects = [data];
      }
      NeonJsonLd.removeReleaseMeta();
      metadataObjects.forEach(metadataObject => {
        const doiUrl = new URL(metadataObject.identifier);
        const doiBlock = document.createElement('meta');
        doiBlock.setAttribute('name', 'citation_doi');
        doiBlock.setAttribute('content', doiUrl.pathname.slice(1, doiUrl.pathname.length));
        const titleBlock = document.createElement('meta');
        titleBlock.setAttribute('name', 'citation_title');
        let addTitle = false;
        if (typeof metadataObject.name === 'string' && metadataObject.name.length > 0) {
          if (metadataObject.name.indexOf(NeonJsonLd.CITATION_AUTHOR) >= 0) {
            const titleContent = metadataObject.name.replace(NeonJsonLd.CITATION_AUTHOR, '').trim();
            titleBlock.setAttribute('content', titleContent);
          } else {
            titleBlock.setAttribute('content', metadataObject.name);
          }
          addTitle = true;
        }
        const authorBlock = document.createElement('meta');
        authorBlock.setAttribute('name', 'citation_author');
        authorBlock.setAttribute('content', NeonJsonLd.CITATION_AUTHOR);
        document.head.appendChild(doiBlock);
        if (addTitle) {
          document.head.appendChild(titleBlock);
        }
        document.head.appendChild(authorBlock);
      });
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  },
  /**
   * Removes all JSON-LD based metadata
   */
  removeAllMetadata: () => {
    NeonJsonLd.removeJsonLdScript();
    NeonJsonLd.removeReleaseMeta();
  },
  /**
   * Removes the JDON-LD script block when present
   */
  removeJsonLdScript: () => {
    try {
      const existingBlock = document.head.querySelector('script[type="application/ld+json"]');
      if (typeof existingBlock !== 'undefined' && existingBlock !== null) {
        existingBlock.remove();
      }
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  },
  /**
   * Removes the release meta tags from the DOM head element when exists.
   */
  removeReleaseMeta: () => {
    try {
      const currentDoiBlocks = document.head.querySelectorAll('meta[name="citation_doi"]');
      if (typeof currentDoiBlocks !== 'undefined' && currentDoiBlocks !== null) {
        currentDoiBlocks.forEach(currentDoiBlock => currentDoiBlock === null || currentDoiBlock === void 0 ? void 0 : currentDoiBlock.remove());
      }
      const currentTitleBlocks = document.head.querySelectorAll('meta[name="citation_title"]');
      if (typeof currentTitleBlocks !== 'undefined' && currentTitleBlocks !== null) {
        currentTitleBlocks.forEach(currentTitleBlock => currentTitleBlock === null || currentTitleBlock === void 0 ? void 0 : currentTitleBlock.remove());
      }
      const currentAuthorBlocks = document.head.querySelectorAll('meta[name="citation_author"]');
      if (typeof currentAuthorBlocks !== 'undefined' && currentAuthorBlocks !== null) {
        currentAuthorBlocks.forEach(currentAuthorBlock => currentAuthorBlock === null || currentAuthorBlock === void 0 ? void 0 : currentAuthorBlock.remove());
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
  getJsonLdWithInjection: function (url) {
    let injectReleaseMeta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const observable = _NeonApi.default.getJsonObservable(url).pipe((0, _rxjs.map)(response => NeonJsonLd.inject(response, injectReleaseMeta)), (0, _rxjs.catchError)(err => {
      console.error(err); // eslint-disable-line no-console
      return (0, _rxjs.of)('JSON-LD not found');
    }));
    observable.subscribe();
  },
  /**
   * Fetches and injects the repository JSON-LD.
   */
  injectRepo: () => NeonJsonLd.getJsonLdWithInjection(_NeonEnvironment.default.getFullJsonLdApiPath('repo')),
  /**
   * Fetches and injects the product JSON-LD based on the specified product code.
   * @param {string} productCode The product code to query with.
   * @param {string} release The release to build the URL from.
   * @param {boolean} injectReleaseMeta Optionally inject release meta tags
   * @param {boolean} onNotExistsOnly Inject only if JSON-LD is not already injected
   */
  injectProduct: function (productCode, release) {
    let injectReleaseMeta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let onNotExistsOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    let shouldFetch = true;
    if (onNotExistsOnly) {
      try {
        const existingBlock = document.head.querySelector('script[type="application/ld+json"]');
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
    const hasRelease = typeof release !== 'undefined' && release !== null && typeof release === 'string' && release.length > 0;
    if (hasRelease) {
      return NeonJsonLd.getJsonLdWithInjection("".concat(_NeonEnvironment.default.getFullJsonLdApiPath('products'), "/").concat(productCode, "?release=").concat(release), injectReleaseMeta);
    }
    NeonJsonLd.removeReleaseMeta();
    return NeonJsonLd.getJsonLdWithInjection("".concat(_NeonEnvironment.default.getFullJsonLdApiPath('products'), "/").concat(productCode));
  },
  /**
   * Fetches and injects the prototype dataset JSON-LD based on the specified UUID.
   * @param {string} uuid The dataset UUID to query with.
   * @param {boolean} onNotExistsOnly Inject only if JSON-LD is not already injected
   */
  injectPrototypeDataset: function (uuid) {
    let onNotExistsOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let shouldFetch = true;
    if (onNotExistsOnly) {
      try {
        const existingBlock = document.head.querySelector('script[type="application/ld+json"]');
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
    return NeonJsonLd.getJsonLdWithInjection("".concat(_NeonEnvironment.default.getFullJsonLdApiPath('prototype'), "/datasets/").concat(uuid), true);
  }
};
Object.freeze(NeonJsonLd);
var _default = exports.default = NeonJsonLd;