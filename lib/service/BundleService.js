import ReleaseService, { LATEST_AND_PROVISIONAL } from './ReleaseService';
import { exists, existsNonEmpty, isStringNonEmpty } from '../util/typeUtil';
const BundleService = {
    isProductDefined: (context, productCode)=>context.allBundleProducts[productCode] === true,
    isProductDefinedForRelease: (context, productCode, release)=>{
        if (!exists(context) || !exists(context.bundleProducts) || !exists(context.bundleProducts[release])) {
            return false;
        }
        const bundleProductCodes = Object.keys(context.bundleProducts[release]);
        if (!existsNonEmpty(bundleProductCodes)) {
            return false;
        }
        if (bundleProductCodes.includes(productCode)) {
            return true;
        }
        const childCodes = bundleProductCodes.flatMap((bundleProductCode)=>context.bundleProducts[release][bundleProductCode]);
        return childCodes.includes(productCode);
    },
    determineBundleRelease: (release)=>{
        const regex = ReleaseService.getProvReleaseRegex();
        let isLatestProv = false;
        if (!isStringNonEmpty(release) || release.localeCompare(LATEST_AND_PROVISIONAL) === 0) {
            isLatestProv = true;
        } else if (regex) {
            const matches = regex.exec(release);
            isLatestProv = exists(matches) && matches.length > 0;
        }
        let appliedRelease;
        if (isLatestProv) {
            appliedRelease = 'PROVISIONAL';
        } else {
            appliedRelease = release;
        }
        return appliedRelease;
    },
    getBundledProductCodes: (context, release)=>{
        if (!exists(context) || !exists(context.bundleProducts) || !exists(context.bundleProducts[release])) {
            return [];
        }
        return Object.keys(context.bundleProducts[release]);
    },
    isProductInBundle: (context, release, productCode)=>{
        if (!exists(context) || !exists(context.bundleDoiLookup) || !exists(context.bundleDoiLookup[release])) {
            return false;
        }
        if (Array.isArray(context.bundleDoiLookup[release][productCode])) {
            return existsNonEmpty(context.bundleDoiLookup[release][productCode]);
        }
        return isStringNonEmpty(context.bundleDoiLookup[release][productCode]);
    },
    isBundledProduct: (context, release, productCode)=>BundleService.getBundledProductCodes(context, release).includes(productCode),
    isSplitProduct: (context, release, productCode)=>{
        if (!exists(context) || !exists(context.splitProducts) || !exists(context.splitProducts[release])) {
            return false;
        }
        return Array.isArray(context.splitProducts[release][productCode]);
    },
    getBundleProductCode: (context, release, productCode)=>{
        if (!exists(context) || !exists(context.bundleDoiLookup) || !exists(context.bundleDoiLookup[release])) {
            return null;
        }
        const bundledProductCode = context.bundleDoiLookup[release][productCode];
        if (Array.isArray(bundledProductCode) && !existsNonEmpty(bundledProductCode)) {
            return null;
        }
        if (!Array.isArray(bundledProductCode) && !isStringNonEmpty(bundledProductCode)) {
            return null;
        }
        return bundledProductCode;
    },
    shouldForwardAvailability: (context, release, productCode, bundleProductCode)=>{
        const isSplit = BundleService.isSplitProduct(context, release, productCode);
        if (isSplit) {
            if (!exists(context) || !exists(context.splitProducts) || !exists(context.splitProducts[release]) || !exists(context.bundleProductsForwardAvailability) || !exists(context.bundleProductsForwardAvailability[release])) {
                return false;
            }
            return context.splitProducts[release][productCode].some((splitToProduct)=>context.bundleProductsForwardAvailability[release][splitToProduct]);
        }
        if (!exists(context) || !exists(context.bundleProductsForwardAvailability) || !exists(context.bundleProductsForwardAvailability[release])) {
            return false;
        }
        const bundleShouldForward = context.bundleProductsForwardAvailability[release][bundleProductCode];
        if (!exists(bundleShouldForward)) {
            return false;
        }
        return bundleShouldForward;
    },
    getSplitProductBundles: (context, release, productCode)=>{
        const isSplit = BundleService.isSplitProduct(context, release, productCode);
        if (!isSplit) {
            return [];
        }
        if (!exists(context) || !exists(context.splitProducts) || !exists(context.splitProducts[release])) {
            return [];
        }
        const bundles = context.splitProducts[release][productCode];
        if (!Array.isArray(bundles)) {
            return [];
        }
        return bundles;
    },
    getBundledProducts: (context, release, bundleProductCode)=>{
        if (!exists(context) || !exists(context.bundleProducts) || !exists(context.bundleProducts[release])) {
            return [];
        }
        const bundle = context.bundleProducts[release][bundleProductCode];
        if (!Array.isArray(bundle)) {
            return [];
        }
        return bundle;
    },
    determineCitationBundle: (context, release, productCode)=>{
        let bundleParentCode = null;
        let bundleParentCodes = [];
        const bundleRelease = BundleService.determineBundleRelease(release);
        const isBundleChild = BundleService.isProductInBundle(context, bundleRelease, productCode);
        if (isBundleChild) {
            bundleParentCode = BundleService.getBundleProductCode(context, bundleRelease, productCode);
            const hasManyParents = BundleService.isSplitProduct(context, bundleRelease, productCode);
            if (hasManyParents) {
                bundleParentCodes = BundleService.getSplitProductBundles(context, bundleRelease, productCode);
            } else {
                const bundleCode = BundleService.getBundleProductCode(context, bundleRelease, productCode);
                if (exists(bundleCode)) {
                    bundleParentCodes = [
                        bundleCode
                    ];
                }
            }
        }
        return {
            parentCodes: bundleParentCodes,
            doiProductCode: bundleParentCode
        };
    },
    determineAppliedBundleRelease: (context, release, productCode, doiStatus)=>{
        if (!exists(doiStatus)) {
            return null;
        }
        let appliedDoiStatus;
        let bundleParentCodes = null;
        if (exists(context)) {
            bundleParentCodes = BundleService.getBundleProductCode(context, release, productCode);
        }
        if (!Array.isArray(doiStatus)) {
            if (!exists(bundleParentCodes)) {
                appliedDoiStatus = doiStatus;
            } else {
                let checkProductCode;
                if (Array.isArray(bundleParentCodes)) {
                    // eslint-disable-next-line prefer-destructuring
                    checkProductCode = bundleParentCodes[0];
                } else {
                    checkProductCode = bundleParentCodes;
                }
                const checkDoiStatus = doiStatus;
                if (exists(doiStatus) && checkProductCode.localeCompare(checkDoiStatus.productCode) === 0 && release.localeCompare(checkDoiStatus.release) === 0) {
                    appliedDoiStatus = doiStatus;
                }
            }
        } else if (!exists(bundleParentCodes)) {
            appliedDoiStatus = doiStatus.find((ds)=>exists(ds) && productCode.localeCompare(ds.productCode) === 0 && release.localeCompare(ds.release) === 0);
        } else {
            let checkProductCode;
            if (Array.isArray(bundleParentCodes)) {
                // eslint-disable-next-line prefer-destructuring
                checkProductCode = bundleParentCodes[0];
            } else {
                checkProductCode = bundleParentCodes;
            }
            appliedDoiStatus = doiStatus.find((ds)=>exists(ds) && checkProductCode.localeCompare(ds.productCode) === 0 && release.localeCompare(ds.release) === 0);
        }
        return appliedDoiStatus;
    }
};
Object.freeze(BundleService);
export default BundleService;
