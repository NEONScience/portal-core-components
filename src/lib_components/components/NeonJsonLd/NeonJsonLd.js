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
  /**
   * Convenience wrapper for obtaining an AJAX Observable from NeonApi.
   * @param {string} url The URL to build from.
   * @return The RxJS AJAX Observable.
   */
  getJsonLdObservable: url => NeonApi.getJsonObservable(url),

  /**
   * Gets the product JSON-LD endpoint observable.
   * @param {string} productCode The product code to build the URL from.
   * @return The RxJS AJAX Observable.
   */
  getProductJsonLdObservable: productCode => (
    NeonJsonLd.getJsonLdObservable(
      `${NeonEnvironment.getFullJsonLdApiPath('products')}/${productCode}`,
    )
  ),

  /**
   * Injects the JSON-LD object as a script block with the appropriate type
   * into the DOM head.
   * Assumes the object is a valid JSON object.
   * @param {Object|null|undefined} data The JSON-LD object to inject.
   */
  inject: (data) => {
    if (!data) return;
    const block = document.createElement('script');
    block.setAttribute('type', 'application/ld+json');
    block.innerText = JSON.stringify(data);
    document.head.appendChild(block);
  },

  /**
   * Retrieves and injects the JDON-LD data from the specified URL.
   * @param {string} url The URL to query.
   */
  getJsonLdWithInjection: (url) => {
    const observable = NeonApi.getJsonObservable(url)
      .pipe(
        map(response => NeonJsonLd.inject(response)),
        catchError(err => console.error(err)), // eslint-disable-line no-console
      );
    observable.subscribe();
  },

  /**
   * Fetches and injects the product JSON-LD based on the specified product code.
   * @param {string} productCode The product code to query with.
   */
  injectProduct: productCode => (
    NeonJsonLd.getJsonLdWithInjection(
      `${NeonEnvironment.getFullJsonLdApiPath('products')}/${productCode}`,
    )
  ),
};

Object.freeze(NeonJsonLd);

export default NeonJsonLd;
