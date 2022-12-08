import ReleaseService, { LATEST_AND_PROVISIONAL } from './ReleaseService';

import { Nullable, Undef } from '../types/core';
import { BundleContext } from '../types/neonContext';
import { exists, existsNonEmpty, isStringNonEmpty } from '../util/typeUtil';
import { CitationBundleState } from '../types/internal';

export interface IBundleService {
  /**
   * Determines if the product is defined as a container or child within a bundle.
   * @param context The context to derive lookups from.
   * @param productCode The product code to search for.
   * @return True if the product is defined within bundles.
   */
  isProductDefined: (context: BundleContext, productCode: string) => boolean;
  /**
   * Determines if the product is defined as a container or child within a bundle
   * for the specified release.
   * @param context The context to derive lookups from.
   * @param productCode The product code to search for.
   * @param release The release to lookup from.
   * @return True if the product is defined within bundles for the release.
   */
  isProductDefinedForRelease: (
    context: BundleContext,
    productCode: string,
    release: string,
  ) => boolean;
  /**
   * Determine the currently active bundle based on release.
   * @param release The release to coerce.
   * @return The applicable bundle release.
   */
  determineBundleRelease: (release: Nullable<string>) => string;
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
  /**
   * Determines the applicable bundle state for utilization in citations.
   * @param context The context to derive lookups from.
   * @param release The release to get bundles for.
   * @param productCode The product code to query with.
   * @return The applicable bundle status for citations.
   */
  determineCitationBundle: (
    context: BundleContext,
    release: Nullable<string>,
    productCode: string,
  ) => CitationBundleState;
}

const BundleService: IBundleService = {
  isProductDefined: (context: BundleContext, productCode: string): boolean => (
    context.allBundleProducts[productCode] === true
  ),
  isProductDefinedForRelease: (
    context: BundleContext,
    productCode: string,
    release: string,
  ): boolean => {
    if (!exists(context)
        || !exists(context.bundleProducts)
        || !exists(context.bundleProducts[release])) {
      return false;
    }
    const bundleProductCodes: string[] = Object.keys(context.bundleProducts[release]);
    if (!existsNonEmpty(bundleProductCodes)) {
      return false;
    }
    if (bundleProductCodes.includes(productCode)) {
      return true;
    }
    const childCodes: string[] = bundleProductCodes
      .flatMap((bundleProductCode: string): string[] => (
        context.bundleProducts[release][bundleProductCode]
      ));
    return childCodes.includes(productCode);
  },
  determineBundleRelease: (release: Nullable<string>): string => {
    const regex = ReleaseService.getProvReleaseRegex();
    let isLatestProv = false;
    if (!isStringNonEmpty(release)
        || ((release as string).localeCompare(LATEST_AND_PROVISIONAL) === 0)) {
      isLatestProv = true;
    } else if (regex) {
      const matches = regex.exec(release as string);
      isLatestProv = exists(matches) && ((matches as RegExpExecArray).length > 0);
    }
    let appliedRelease;
    if (isLatestProv) {
      appliedRelease = 'PROVISIONAL';
    } else {
      appliedRelease = release as string;
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
  determineCitationBundle: (
    context: BundleContext,
    release: Nullable<string>,
    productCode: string,
  ): CitationBundleState => {
    let bundleParentCode: Nullable<string> = null;
    let bundleParentCodes: string[] = [];
    const bundleRelease = BundleService.determineBundleRelease(release);
    const isBundleChild = BundleService.isProductInBundle(
      context,
      bundleRelease,
      productCode,
    );
    if (isBundleChild) {
      bundleParentCode = BundleService.getBundleProductCode(
        context,
        bundleRelease,
        productCode,
      );
      const hasManyParents = isBundleChild
        && BundleService.isSplitProduct(context, bundleRelease, productCode);
      if (hasManyParents) {
        bundleParentCodes = BundleService.getSplitProductBundles(
          context,
          bundleRelease,
          productCode,
        );
      } else {
        const bundleCode = BundleService.getBundleProductCode(
          context,
          bundleRelease,
          productCode,
        );
        if (exists(bundleCode)) {
          bundleParentCodes = [bundleCode as string];
        }
      }
    }
    return {
      parentCodes: bundleParentCodes,
      doiProductCode: bundleParentCode,
    };
  },
};

Object.freeze(BundleService);

export default BundleService;
