"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeUtil = require("../util/typeUtil");

var LATEST_AND_PROVISIONAL = 'LATEST_AND_PROVISIONAL';

var getProvReleaseRegex = function getProvReleaseRegex() {
  return new RegExp(/^[A-Z]+$/);
};

var BundleService = {
  isProductDefined: function isProductDefined(context, productCode) {
    return context.allBundleProducts[productCode] === true;
  },
  determineBundleRelease: function determineBundleRelease(release) {
    var regex = getProvReleaseRegex();
    var isLatestProv = false;

    if (!(0, _typeUtil.isStringNonEmpty)(release) || release.localeCompare(LATEST_AND_PROVISIONAL) === 0) {
      isLatestProv = true;
    } else if (regex) {
      var matches = regex.exec(release);
      isLatestProv = (0, _typeUtil.exists)(matches) && matches.length > 0;
    }

    var appliedRelease = release;

    if (isLatestProv) {
      appliedRelease = 'PROVISIONAL';
    }

    return appliedRelease;
  },
  getBundledProductCodes: function getBundledProductCodes(context, release) {
    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.bundleProducts) || !(0, _typeUtil.exists)(context.bundleProducts[release])) {
      return [];
    }

    return Object.keys(context.bundleProducts[release]);
  },
  isProductInBundle: function isProductInBundle(context, release, productCode) {
    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.bundleDoiLookup) || !(0, _typeUtil.exists)(context.bundleDoiLookup[release])) {
      return false;
    }

    return (0, _typeUtil.isStringNonEmpty)(context.bundleDoiLookup[release][productCode]);
  },
  isBundledProduct: function isBundledProduct(context, release, productCode) {
    return BundleService.getBundledProductCodes(context, release).includes(productCode);
  },
  isSplitProduct: function isSplitProduct(context, release, productCode) {
    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.splitProducts) || !(0, _typeUtil.exists)(context.splitProducts[release])) {
      return false;
    }

    return Array.isArray(context.splitProducts[release][productCode]);
  },
  getBundleProductCode: function getBundleProductCode(context, release, productCode) {
    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.bundleDoiLookup) || !(0, _typeUtil.exists)(context.bundleDoiLookup[release])) {
      return null;
    }

    var bundledProductCode = context.bundleDoiLookup[release][productCode];

    if (!(0, _typeUtil.isStringNonEmpty)(bundledProductCode)) {
      return null;
    }

    return bundledProductCode;
  },
  shouldForwardAvailability: function shouldForwardAvailability(context, release, productCode, bundleProductCode) {
    var isSplit = BundleService.isSplitProduct(context, release, productCode);

    if (isSplit) {
      if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.splitProducts) || !(0, _typeUtil.exists)(context.splitProducts[release]) || !(0, _typeUtil.exists)(context.bundleProductsForwardAvailability) || !(0, _typeUtil.exists)(context.bundleProductsForwardAvailability[release])) {
        return false;
      }

      return context.splitProducts[release][productCode].every(function (splitToProduct) {
        return context.bundleProductsForwardAvailability[release][splitToProduct];
      });
    }

    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.bundleProductsForwardAvailability) || !(0, _typeUtil.exists)(context.bundleProductsForwardAvailability[release])) {
      return false;
    }

    var bundleShouldForward = context.bundleProductsForwardAvailability[release][bundleProductCode];

    if (!(0, _typeUtil.exists)(bundleShouldForward)) {
      return false;
    }

    return bundleShouldForward;
  },
  getSplitProductBundles: function getSplitProductBundles(context, release, productCode) {
    var isSplit = BundleService.isSplitProduct(context, release, productCode);

    if (!isSplit) {
      return [];
    }

    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.splitProducts) || !(0, _typeUtil.exists)(context.splitProducts[release])) {
      return [];
    }

    var bundles = context.splitProducts[release][productCode];

    if (!Array.isArray(bundles)) {
      return [];
    }

    return bundles;
  },
  getBundledProducts: function getBundledProducts(context, release, bundleProductCode) {
    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.bundleProducts) || !(0, _typeUtil.exists)(context.bundleProducts[release])) {
      return [];
    }

    var bundle = context.bundleProducts[release][bundleProductCode];

    if (!Array.isArray(bundle)) {
      return [];
    }

    return bundle;
  }
};
Object.freeze(BundleService);
var _default = BundleService;
exports.default = _default;