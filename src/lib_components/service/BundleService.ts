import { Nullable, Undef } from '../types/core';
import { BundleContext } from '../types/neonContext';
import { exists, isStringNonEmpty } from '../util/typeUtil';

const LATEST_AND_PROVISIONAL = 'LATEST_AND_PROVISIONAL';

const getProvReleaseRegex = (): RegExp => new RegExp(/^[A-Z]+$/);

export interface IBundleService {
  /**
   * Determines if the product is defined as a container or child within a bundle.
   * @param context The context to derive lookups from.
   * @param productCode The product code to search for.
   * @return True if the product is defined within bundles.
   */
  isProductDefined: (context: BundleContext, productCode: string) => boolean;
  /**
   * Determine the currently active bundle based on release.
   * @param release The release to coerce.
   * @return The applicable bundle release.
   */
  determineBundleRelease: (release: string) => string;
  /**
   * Gets the set of bundled (container) product codes for the specified release.
   * @param context The context to derive lookups from.
   * @param release The release to get the bundles for.
   */
  getBundledProductCodes: (context: BundleContext, release: string) => string[];
  /**
   * Determine if the product is in a bundle for the specified release.
   * @param context The context to derive lookups from.
   * @param release The release to get the bundles for.
   * @param productCode The product code to query with.
   * @return True if the product is in a bundle.
   */
  isProductInBundle: (
    context: BundleContext,
    release: string,
    productCode: string,
  ) => boolean;
  /**
   * Determines if the product is a bundled product for the specified release.
   * @param context The context to derive lookups from.
   * @param release The release to get bundles for.
   * @param productCode The product code to query with.
   * @return True if the product is in a bundle.
   */
  isBundledProduct: (
    context: BundleContext,
    release: string,
    productCode: string,
  ) => boolean;
  /**
   * Determines if the product is a split product for the specified release.
   * @param context The context to derive lookups from.
   * @param release The release to get bundles for.
   * @param productCode The product code to query with.
   * @return True if the product is a split product.
   */
  isSplitProduct: (
    context: BundleContext,
    release: string,
    productCode: string,
  ) => boolean;
  /**
   * Gets the bundle (container) product code for the specified bundled product.
   * @param context The context to derive lookups from.
   * @param release The release to get bundles for.
   * @param productCode The product code to query with.
   * @return The bundle product code when available.
   */
  getBundleProductCode: (
    context: BundleContext,
    release: string,
    productCode: string,
  ) => Nullable<string>;
  /**
   * Determines if the product should forward availability for the bundle.
   * @param context The context to derive lookups from.
   * @param release The release to get bundles for.
   * @param productCode The product code to query with.
   * @param bundleProductCode The bundle product code to query with.
   * @return The bundle product code when available.
   */
  shouldForwardAvailability: (
    context: BundleContext,
    release: string,
    productCode: string,
    bundleProductCode: string,
  ) => boolean;
  /**
   * Gets the owning split bundle product code.
   * @param context The context to derive lookups from.
   * @param release The release to get bundles for.
   * @param productCode The product code to query with.
   * @return The bundle product code when available.
   */
  getSplitProductBundles: (
    context: BundleContext,
    release: string,
    productCode: string,
  ) => string[];
  /**
   * Gets the set of bundled product codes for the specified bundle product.
   * @param context The context to derive lookups from.
   * @param release The release to get bundles for.
   * @param bundleProductCode The bundle product code to query with.
   * @return The bundle product code when available.
   */
  getBundledProducts: (
    context: BundleContext,
    release: string,
    bundleProductCode: string,
  ) => string[];
}

const BundleService: IBundleService = {
  isProductDefined: (context: BundleContext, productCode: string): boolean => (
    context.allBundleProducts[productCode] === true
  ),
  determineBundleRelease: (release: string): string => {
    const regex = getProvReleaseRegex();
    let isLatestProv = false;
    if (!isStringNonEmpty(release) || (release.localeCompare(LATEST_AND_PROVISIONAL) === 0)) {
      isLatestProv = true;
    } else if (regex) {
      const matches = regex.exec(release);
      isLatestProv = exists(matches) && ((matches as RegExpExecArray).length > 0);
    }
    let appliedRelease = release;
    if (isLatestProv) {
      appliedRelease = 'PROVISIONAL';
    }
    return appliedRelease;
  },
  getBundledProductCodes: (context: BundleContext, release: string): string[] => {
    if (!exists(context)
        || !exists(context.bundleProducts)
        || !exists(context.bundleProducts[release])) {
      return [];
    }
    return Object.keys(context.bundleProducts[release]);
  },
  isProductInBundle: (
    context: BundleContext,
    release: string,
    productCode: string,
  ): boolean => {
    if (!exists(context)
        || !exists(context.bundleDoiLookup)
        || !exists(context.bundleDoiLookup[release])) {
      return false;
    }
    return isStringNonEmpty(context.bundleDoiLookup[release][productCode]);
  },
  isBundledProduct: (
    context: BundleContext,
    release: string,
    productCode: string,
  ): boolean => (
    BundleService.getBundledProductCodes(context, release).includes(productCode)
  ),
  isSplitProduct: (
    context: BundleContext,
    release: string,
    productCode: string,
  ): boolean => {
    if (!exists(context)
        || !exists(context.splitProducts)
        || !exists(context.splitProducts[release])) {
      return false;
    }
    return Array.isArray(context.splitProducts[release][productCode]);
  },
  getBundleProductCode: (
    context: BundleContext,
    release: string,
    productCode: string,
  ): Nullable<string> => {
    if (!exists(context)
        || !exists(context.bundleDoiLookup)
        || !exists(context.bundleDoiLookup[release])) {
      return null;
    }
    const bundledProductCode = context.bundleDoiLookup[release][productCode];
    if (!isStringNonEmpty(bundledProductCode)) {
      return null;
    }
    return bundledProductCode;
  },
  shouldForwardAvailability: (
    context: BundleContext,
    release: string,
    productCode: string,
    bundleProductCode: string,
  ): boolean => {
    const isSplit = BundleService.isSplitProduct(context, release, productCode);
    if (isSplit) {
      if (!exists(context)
          || !exists(context.splitProducts)
          || !exists(context.splitProducts[release])
          || !exists(context.bundleProductsForwardAvailability)
          || !exists(context.bundleProductsForwardAvailability[release])) {
        return false;
      }
      return context.splitProducts[release][productCode].every(
        (splitToProduct: string): boolean => (
          context.bundleProductsForwardAvailability[release][splitToProduct]
        ),
      );
    }
    if (!exists(context)
        || !exists(context.bundleProductsForwardAvailability)
        || !exists(context.bundleProductsForwardAvailability[release])) {
      return false;
    }
    const bundleShouldForward: Undef<boolean> = context
      .bundleProductsForwardAvailability[release][bundleProductCode];
    if (!exists(bundleShouldForward)) {
      return false;
    }
    return bundleShouldForward;
  },
  getSplitProductBundles: (
    context: BundleContext,
    release: string,
    productCode: string,
  ): string[] => {
    const isSplit = BundleService.isSplitProduct(context, release, productCode);
    if (!isSplit) {
      return [];
    }
    if (!exists(context)
        || !exists(context.splitProducts)
        || !exists(context.splitProducts[release])) {
      return [];
    }
    const bundles: Undef<string[]> = context.splitProducts[release][productCode];
    if (!Array.isArray(bundles)) {
      return [];
    }
    return bundles;
  },
  getBundledProducts: (
    context: BundleContext,
    release: string,
    bundleProductCode: string,
  ): string[] => {
    if (!exists(context)
        || !exists(context.bundleProducts)
        || !exists(context.bundleProducts[release])) {
      return [];
    }
    const bundle: Undef<string[]> = context.bundleProducts[release][bundleProductCode];
    if (!Array.isArray(bundle)) {
      return [];
    }
    return bundle;
  },
};

Object.freeze(BundleService);

export default BundleService;
