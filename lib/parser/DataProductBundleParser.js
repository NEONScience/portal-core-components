"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeUtil = require("../util/typeUtil");

var DataProductBundleParser = {
  parseBundlesResponse: function parseBundlesResponse(response) {
    if (!(0, _typeUtil.exists)(response)) {
      return [];
    }

    var data = (0, _typeUtil.resolveAny)(response, 'data');

    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  },
  parseContext: function parseContext(bundlesResponse) {
    var bundles = {
      bundleProducts: {},
      bundleProductsForwardAvailability: {},
      bundleDoiLookup: {},
      splitProducts: {},
      allBundleProducts: {},
      apiResponse: []
    };

    if (!(0, _typeUtil.existsNonEmpty)(bundlesResponse)) {
      return bundles;
    }

    bundles.apiResponse = bundlesResponse;
    bundles.apiResponse.forEach(function (releaseBundles) {
      var bundleProducts = {};
      var bundleProductForwardAvailability = {};
      var doiLookup = {};
      var splitLookup = {};
      var release = releaseBundles.release,
          dataProductBundles = releaseBundles.dataProductBundles;
      dataProductBundles.forEach(function (bundle) {
        var bundleProductCode = bundle.productCode,
            forwardAvailability = bundle.forwardAvailability,
            bundledProducts = bundle.bundledProducts;
        bundles.allBundleProducts[bundleProductCode] = true;

        if (forwardAvailability) {
          bundleProductForwardAvailability[bundleProductCode] = true;
        }

        bundleProducts[bundleProductCode] = [];
        bundledProducts.forEach(function (bundledProduct) {
          var productCode = bundledProduct.productCode,
              isPrimaryBundle = bundledProduct.isPrimaryBundle;
          bundles.allBundleProducts[productCode] = true;
          bundleProducts[bundleProductCode].push(productCode);

          if (!(0, _typeUtil.exists)(isPrimaryBundle)) {
            doiLookup[productCode] = bundleProductCode;
          } else if (isPrimaryBundle === true) {
            // Type check guard for positive boolean value, not non falsey
            doiLookup[productCode] = bundleProductCode;
          } // Indicate we've seen this product in more than one bundle
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
      Object.keys(splitLookup).forEach(function (key) {
        if (Array.isArray(splitLookup[key]) && splitLookup[key].length > 1) {
          bundles.splitProducts[release][key] = splitLookup[key];
        }
      });
    });
    return bundles;
  }
};
Object.freeze(DataProductBundleParser);
var _default = DataProductBundleParser;
exports.default = _default;