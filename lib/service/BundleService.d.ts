import { Nullable } from '../types/core';
import { BundleContext } from '../types/neonContext';
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
    isProductInBundle: (context: BundleContext, release: string, productCode: string) => boolean;
    /**
     * Determines if the product is a bundled product for the specified release.
     * @param context The context to derive lookups from.
     * @param release The release to get bundles for.
     * @param productCode The product code to query with.
     * @return True if the product is in a bundle.
     */
    isBundledProduct: (context: BundleContext, release: string, productCode: string) => boolean;
    /**
     * Determines if the product is a split product for the specified release.
     * @param context The context to derive lookups from.
     * @param release The release to get bundles for.
     * @param productCode The product code to query with.
     * @return True if the product is a split product.
     */
    isSplitProduct: (context: BundleContext, release: string, productCode: string) => boolean;
    /**
     * Gets the bundle (container) product code for the specified bundled product.
     * @param context The context to derive lookups from.
     * @param release The release to get bundles for.
     * @param productCode The product code to query with.
     * @return The bundle product code when available.
     */
    getBundleProductCode: (context: BundleContext, release: string, productCode: string) => Nullable<string>;
    /**
     * Determines if the product should forward availability for the bundle.
     * @param context The context to derive lookups from.
     * @param release The release to get bundles for.
     * @param productCode The product code to query with.
     * @param bundleProductCode The bundle product code to query with.
     * @return The bundle product code when available.
     */
    shouldForwardAvailability: (context: BundleContext, release: string, productCode: string, bundleProductCode: string) => boolean;
    /**
     * Gets the owning split bundle product code.
     * @param context The context to derive lookups from.
     * @param release The release to get bundles for.
     * @param productCode The product code to query with.
     * @return The bundle product code when available.
     */
    getSplitProductBundles: (context: BundleContext, release: string, productCode: string) => string[];
    /**
     * Gets the set of bundled product codes for the specified bundle product.
     * @param context The context to derive lookups from.
     * @param release The release to get bundles for.
     * @param bundleProductCode The bundle product code to query with.
     * @return The bundle product code when available.
     */
    getBundledProducts: (context: BundleContext, release: string, bundleProductCode: string) => string[];
}
declare const BundleService: IBundleService;
export default BundleService;
