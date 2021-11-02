import { ReleaseDataProductBundles } from './neonApi';

/**
 * NeonContext specific utilization of bundles, derived for quick lookups
 * of key properties of bundles.
 */
export interface DataProductBundleContext {
  /**
   * Defines the set of container products that have bundled products,
   * keyed by { "RELEASE": { "BUNDLE_PRODUCT_CODE": ["PRODUCT_CODE"] } }
   */
  bundleProducts: Record<string, Record<string, string[]>>;
  /**
   * Defines the set of container products that should forward their
   * availability to bundled products,
   * keyed by { "RELEASE": { "BUNDLE_PRODUCT_CODE": true } }
   */
  bundleProductsForwardAvailability: Record<string, Record<string, boolean>>;
  /**
   * Defines the set of bundled products, to the container product
   * that should provide the DOI for the bundled product.
   * {
   *   "RELEASE": {
   *     "PRODUCT_CODE": "BUNDLE_PRODUCT_CODE",
   *   },
   * }
   * This lookup can also be utilized to determine whether or not
   * a product exists within a bundle.
   */
  bundleDoiLookup: Record<string, Record<string, string>>;
  /**
   * Defines the set of products that should be presented as "split",
   * defined as products that now exist in more than one product,
   * and are therefore defined in two or more "bundles".
   * keyed by { "RELEASE": { "SPLIT_PRODUCT_CODE": ["BUNDLED_PRODUCT_CODE"] } }
   */
  splitProducts: Record<string, Record<string, string[]>>;
  /**
   * Defines the set of products that are involved in bundles.
   */
  allBundleProducts: Record<string, boolean>;
  /**
   * The raw API response containing the full bundle definition.
   */
  apiResponse: ReleaseDataProductBundles[];
}
