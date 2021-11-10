import { AjaxResponse } from 'rxjs/ajax';

import { BundledDataProduct, DataProductBundle, ReleaseDataProductBundles } from '../types/neonApi';
import { BundleContext } from '../types/neonContext';
import { exists, existsNonEmpty, resolveAny } from '../util/typeUtil';

export interface IBundleParser {
  /**
   * Parse the NEON API response to typed internal interface.
   * @param response The AJAX response to parse from.
   * @return The types internal representation of the API response shape.
   */
  parseBundlesResponse: (response: AjaxResponse) => ReleaseDataProductBundles[];
  /**
   * Parse the NEON API response shape to the context specific shape
   * with helper lookups.
   * @param bundles The NEON API bundle response shape.
   * @return The context shape for storing bundle information.
   */
  parseContext: (bundles: ReleaseDataProductBundles[]) => BundleContext;
}

const BundleParser: IBundleParser = {
  parseBundlesResponse: (response: AjaxResponse): ReleaseDataProductBundles[] => {
    if (!exists(response)) {
      return [];
    }
    const data: unknown = resolveAny(response as never, 'data') as unknown;
    if (!Array.isArray(data)) {
      return [];
    }
    return data as ReleaseDataProductBundles[];
  },
  parseContext: (bundlesResponse: ReleaseDataProductBundles[]): BundleContext => {
    const bundles: BundleContext = {
      bundleProducts: {},
      bundleProductsForwardAvailability: {},
      bundleDoiLookup: {},
      splitProducts: {},
      allBundleProducts: {},
      apiResponse: [],
    };
    if (!existsNonEmpty(bundlesResponse)) {
      return bundles;
    }
    bundles.apiResponse = bundlesResponse;
    bundles.apiResponse.forEach((releaseBundles: ReleaseDataProductBundles): void => {
      const bundleProducts: Record<string, string[]> = {};
      const bundleProductForwardAvailability: Record<string, boolean> = {};
      const doiLookup: Record<string, string> = {};
      const splitLookup: Record<string, string[]> = {};
      const { release, dataProductBundles } = releaseBundles;
      dataProductBundles.forEach((bundle: DataProductBundle): void => {
        const {
          productCode: bundleProductCode,
          forwardAvailability,
          bundledProducts,
        } = bundle;
        bundles.allBundleProducts[bundleProductCode] = true;
        if (forwardAvailability) {
          bundleProductForwardAvailability[bundleProductCode] = true;
        }
        bundleProducts[bundleProductCode] = [];
        bundledProducts.forEach((bundledProduct: BundledDataProduct): void => {
          const { productCode, isPrimaryBundle } = bundledProduct;
          bundles.allBundleProducts[productCode] = true;
          bundleProducts[bundleProductCode].push(productCode);
          if (!exists(isPrimaryBundle)) {
            doiLookup[productCode] = bundleProductCode;
          } else if (isPrimaryBundle === true) {
            // Type check guard for positive boolean value, not non falsey
            doiLookup[productCode] = bundleProductCode;
          }
          // Indicate we've seen this product in more than one bundle
          // Must contain a previous entry that's set to false.
          if (Array.isArray(splitLookup[productCode])) {
            splitLookup[productCode].push(bundleProductCode);
          } else {
            splitLookup[productCode] = [bundleProductCode];
          }
        });
      });
      bundles.bundleProducts[release] = bundleProducts;
      bundles.bundleProductsForwardAvailability[release] = bundleProductForwardAvailability;
      bundles.bundleDoiLookup[release] = doiLookup;
      bundles.splitProducts[release] = {};
      Object.keys(splitLookup).forEach((key: string): void => {
        if (Array.isArray(splitLookup[key]) && (splitLookup[key].length > 1)) {
          bundles.splitProducts[release][key] = splitLookup[key];
        }
      });
    });
    return bundles;
  },
};

Object.freeze(BundleParser);

export default BundleParser;
