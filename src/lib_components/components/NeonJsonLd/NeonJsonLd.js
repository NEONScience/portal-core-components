import { of } from 'rxjs';
import {
  map,
  catchError,
} from 'rxjs/operators';

import NeonApi from '../NeonApi/NeonApi';
import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';

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
  getJsonLdObservable: (url) => NeonApi.getJsonObservable(url),

  /**
   * Gets the repository JSON-LD endpoint observable.
   * @return The RxJS AJAX Observable.
   */
  getRepoJsonLdObservable: () => (
    NeonJsonLd.getJsonLdObservable(NeonEnvironment.getFullJsonLdApiPath('repo'))
  ),

  /**
   * Gets the product JSON-LD endpoint observable.
   * @param {string} productCode The product code to build the URL from.
   * @param {string} release The release to build the URL from.
   * @return The RxJS AJAX Observable.
   */
  getProductJsonLdObservable: (productCode, release) => {
    const hasRelease = (typeof release !== 'undefined')
      && (release !== null)
      && (typeof release === 'string')
      && (release.length > 0);
    if (hasRelease) {
      return NeonJsonLd.getJsonLdObservable(
        `${NeonEnvironment.getFullJsonLdApiPath('products')}/${productCode}?release=${release}`,
      );
    }
    return NeonJsonLd.getJsonLdObservable(
      `${NeonEnvironment.getFullJsonLdApiPath('products')}/${productCode}`,
    );
  },

  /**
   * Injects the JSON-LD object as a script block with the appropriate type
   * into the DOM head.
   * Assumes the object is a valid JSON object.
   * @param {Object|null|undefined} data The JSON-LD object to inject.
   * @param {boolean} injectReleaseMeta Optionally inject release meta tags
   */
  inject: (data, injectReleaseMeta = false) => {
    if (!data) return;
    try {
      const existingBlock = document.head.querySelector('script[type="application/ld+json"]');
      if ((typeof existingBlock !== 'undefined') && (existingBlock !== null)) {
        existingBlock.remove();
      }
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
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
   */
  injectReleaseMeta: (data) => {
    if (!data) return;
    try {
      const currentDoiBlock = document.head.querySelector('meta[name="citation_doi"]');
      const doiUrl = new URL(data.identifier);
      const doiBlock = document.createElement('meta');
      doiBlock.setAttribute('name', 'citation_doi');
      doiBlock.setAttribute('content', doiUrl.pathname.slice(1, doiUrl.pathname.length));
      if ((typeof currentDoiBlock !== 'undefined') && (currentDoiBlock !== null)) {
        document.head.replaceChild(doiBlock, currentDoiBlock);
      } else {
        document.head.appendChild(doiBlock);
      }

      const currentTitleBlock = document.head.querySelector('meta[name="citation_title"]');
      const titleBlock = document.createElement('meta');
      titleBlock.setAttribute('name', 'citation_title');
      let addTitle = false;
      if ((typeof data.name === 'string') && (data.name.length > 0)) {
        if (data.name.indexOf(NeonJsonLd.CITATION_AUTHOR) >= 0) {
          const titleContent = data.name.replace(NeonJsonLd.CITATION_AUTHOR, '').trim();
          titleBlock.setAttribute('content', titleContent);
        } else {
          titleBlock.setAttribute('content', data.name);
        }
        addTitle = true;
      }
      if (!addTitle) {
        if ((typeof currentTitleBlock !== 'undefined') && (currentTitleBlock !== null)) {
          currentTitleBlock.remove();
        }
      } else {
        if ((typeof currentTitleBlock !== 'undefined') && (currentTitleBlock !== null)) {
          document.head.replaceChild(titleBlock, currentTitleBlock);
        } else {
          document.head.appendChild(titleBlock);
        }
      }

      const currentAuthorBlock = document.head.querySelector('meta[name="citation_author"]');
      const authorBlock = document.createElement('meta');
      authorBlock.setAttribute('name', 'citation_author');
      authorBlock.setAttribute('content', NeonJsonLd.CITATION_AUTHOR);
      if ((typeof currentAuthorBlock !== 'undefined') && (currentAuthorBlock !== null)) {
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
  removeReleaseMeta: () => {
    try {
      const currentDoiBlock = document.head.querySelector('meta[name="citation_doi"]');
      if ((typeof currentDoiBlock !== 'undefined') && (currentDoiBlock !== null)) {
        currentDoiBlock.remove();
      }
      const currentTitleBlock = document.head.querySelector('meta[name="citation_title"]');
      if ((typeof currentTitleBlock !== 'undefined') && (currentTitleBlock !== null)) {
        currentTitleBlock.remove();
      }
      const currentAuthorBlock = document.head.querySelector('meta[name="citation_author"]');
      if ((typeof currentAuthorBlock !== 'undefined') && (currentAuthorBlock !== null)) {
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
  getJsonLdWithInjection: (url, injectReleaseMeta = false) => {
    const observable = NeonApi.getJsonObservable(url)
      .pipe(
        map((response) => NeonJsonLd.inject(response, injectReleaseMeta)),
        catchError((err) => {
          console.error(err); // eslint-disable-line no-console
          return of('JSON-LD not found');
        }),
      );
    observable.subscribe();
  },

  /**
   * Fetches and injects the repository JSON-LD.
   */
  injectRepo: () => (
    NeonJsonLd.getJsonLdWithInjection(NeonEnvironment.getFullJsonLdApiPath('repo'))
  ),

  /**
   * Fetches and injects the product JSON-LD based on the specified product code.
   * @param {string} productCode The product code to query with.
   * @param {string} release The release to build the URL from.
   * @param {boolean} injectReleaseMeta Optionally inject release meta tags
   * @param {boolean} onNotExistsOnly Inject only if JSON-LD is not already injected
   */
  injectProduct: (productCode, release, injectReleaseMeta = false, onNotExistsOnly = false) => {
    let shouldFetch = true;
    if (onNotExistsOnly) {
      try {
        const existingBlock = document.head.querySelector('script[type="application/ld+json"]');
        if ((typeof existingBlock !== 'undefined') && (existingBlock !== null)) {
          shouldFetch = false;
        }
      } catch (e) {
        console.error(e); // eslint-disable-line no-console
      }
    }
    if (!shouldFetch) {
      return;
    }
    const hasRelease = (typeof release !== 'undefined')
      && (release !== null)
      && (typeof release === 'string')
      && (release.length > 0);
    if (hasRelease) {
      return NeonJsonLd.getJsonLdWithInjection(
        `${NeonEnvironment.getFullJsonLdApiPath('products')}/${productCode}?release=${release}`,
        injectReleaseMeta,
      );
    }
    NeonJsonLd.removeReleaseMeta();
    return NeonJsonLd.getJsonLdWithInjection(
      `${NeonEnvironment.getFullJsonLdApiPath('products')}/${productCode}`,
    );
  },
};

Object.freeze(NeonJsonLd);

export default NeonJsonLd;
