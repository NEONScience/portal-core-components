import { exists, existsNonEmpty, resolveAny } from '../util/typeUtil';
const BundleParser = {
    parseBundlesResponse: (response)=>{
        if (!exists(response)) {
            return [];
        }
        const data = resolveAny(response, 'data');
        if (!Array.isArray(data)) {
            return [];
        }
        return data;
    },
    parseContext: (bundlesResponse)=>{
        const bundles = {
            bundleProducts: {},
            bundleProductsForwardAvailability: {},
            bundleDoiLookup: {},
            splitProducts: {},
            allBundleProducts: {},
            apiResponse: []
        };
        if (!existsNonEmpty(bundlesResponse)) {
            return bundles;
        }
        bundles.apiResponse = bundlesResponse;
        bundles.apiResponse.forEach((releaseBundles)=>{
            const bundleProducts = {};
            const bundleProductForwardAvailability = {};
            const doiLookup = {};
            const splitLookup = {};
            const { release, dataProductBundles } = releaseBundles;
            dataProductBundles.forEach((bundle)=>{
                const { productCode: bundleProductCode, forwardAvailability, bundledProducts } = bundle;
                bundles.allBundleProducts[bundleProductCode] = true;
                if (forwardAvailability) {
                    bundleProductForwardAvailability[bundleProductCode] = true;
                }
                bundleProducts[bundleProductCode] = [];
                bundledProducts.forEach((bundledProduct)=>{
                    const { productCode, isPrimaryBundle } = bundledProduct;
                    bundles.allBundleProducts[productCode] = true;
                    bundleProducts[bundleProductCode].push(productCode);
                    if (!exists(isPrimaryBundle)) {
                        doiLookup[productCode] = bundleProductCode;
                    } else {
                        // Type check guard for positive boolean value, not non falsey
                        const primary = isPrimaryBundle === true;
                        let bundleParents = [];
                        if (exists(doiLookup[productCode]) && Array.isArray(doiLookup[productCode])) {
                            bundleParents = doiLookup[productCode];
                            if (primary) {
                                bundleParents.unshift(bundleProductCode);
                            } else {
                                bundleParents.push(bundleProductCode);
                            }
                        } else {
                            bundleParents.push(bundleProductCode);
                        }
                        doiLookup[productCode] = bundleParents;
                    }
                    // Indicate we've seen this product in more than one bundle
                    // Must contain a previous entry that's set to false.
                    if (Array.isArray(splitLookup[productCode])) {
                        splitLookup[productCode].push(bundleProductCode);
                    } else {
                        splitLookup[productCode] = [
                            bundleProductCode
                        ];
                    }
                });
            });
            bundles.bundleProducts[release] = bundleProducts;
            bundles.bundleProductsForwardAvailability[release] = bundleProductForwardAvailability;
            bundles.bundleDoiLookup[release] = doiLookup;
            bundles.splitProducts[release] = {};
            Object.keys(splitLookup).forEach((key)=>{
                if (Array.isArray(splitLookup[key]) && splitLookup[key].length > 1) {
                    bundles.splitProducts[release][key] = splitLookup[key];
                }
            });
        });
        return bundles;
    }
};
Object.freeze(BundleParser);
export default BundleParser;
