"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ReleaseService = _interopRequireWildcard(require("./ReleaseService"));
var _typeUtil = require("../util/typeUtil");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var BundleService = {
  isProductDefined: function isProductDefined(context, productCode) {
    return context.allBundleProducts[productCode] === true;
  },
  isProductDefinedForRelease: function isProductDefinedForRelease(context, productCode, release) {
    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.bundleProducts) || !(0, _typeUtil.exists)(context.bundleProducts[release])) {
      return false;
    }
    var bundleProductCodes = Object.keys(context.bundleProducts[release]);
    if (!(0, _typeUtil.existsNonEmpty)(bundleProductCodes)) {
      return false;
    }
    if (bundleProductCodes.includes(productCode)) {
      return true;
    }
    var childCodes = bundleProductCodes.flatMap(function (bundleProductCode) {
      return context.bundleProducts[release][bundleProductCode];
    });
    return childCodes.includes(productCode);
  },
  determineBundleRelease: function determineBundleRelease(release) {
    var regex = _ReleaseService.default.getProvReleaseRegex();
    var isLatestProv = false;
    if (!(0, _typeUtil.isStringNonEmpty)(release) || release.localeCompare(_ReleaseService.LATEST_AND_PROVISIONAL) === 0) {
      isLatestProv = true;
    } else if (regex) {
      var matches = regex.exec(release);
      isLatestProv = (0, _typeUtil.exists)(matches) && matches.length > 0;
    }
    var appliedRelease;
    if (isLatestProv) {
      appliedRelease = 'PROVISIONAL';
    } else {
      appliedRelease = release;
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
    if (Array.isArray(context.bundleDoiLookup[release][productCode])) {
      return (0, _typeUtil.existsNonEmpty)(context.bundleDoiLookup[release][productCode]);
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
    if (Array.isArray(bundledProductCode) && !(0, _typeUtil.existsNonEmpty)(bundledProductCode)) {
      return null;
    }
    if (!Array.isArray(bundledProductCode) && !(0, _typeUtil.isStringNonEmpty)(bundledProductCode)) {
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
      return context.splitProducts[release][productCode].some(function (splitToProduct) {
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
  },
  determineCitationBundle: function determineCitationBundle(context, release, productCode) {
    var bundleParentCode = null;
    var bundleParentCodes = [];
    var bundleRelease = BundleService.determineBundleRelease(release);
    var isBundleChild = BundleService.isProductInBundle(context, bundleRelease, productCode);
    if (isBundleChild) {
      bundleParentCode = BundleService.getBundleProductCode(context, bundleRelease, productCode);
      var hasManyParents = BundleService.isSplitProduct(context, bundleRelease, productCode);
      if (hasManyParents) {
        bundleParentCodes = BundleService.getSplitProductBundles(context, bundleRelease, productCode);
      } else {
        var bundleCode = BundleService.getBundleProductCode(context, bundleRelease, productCode);
        if ((0, _typeUtil.exists)(bundleCode)) {
          bundleParentCodes = [bundleCode];
        }
      }
    }
    return {
      parentCodes: bundleParentCodes,
      doiProductCode: bundleParentCode
    };
  },
  determineAppliedBundleRelease: function determineAppliedBundleRelease(context, release, productCode, doiStatus) {
    if (!(0, _typeUtil.exists)(doiStatus)) {
      return null;
    }
    var appliedDoiStatus;
    var bundleParentCodes = null;
    if ((0, _typeUtil.exists)(context)) {
      bundleParentCodes = BundleService.getBundleProductCode(context, release, productCode);
    }
    if (!Array.isArray(doiStatus)) {
      if (!(0, _typeUtil.exists)(bundleParentCodes)) {
        appliedDoiStatus = doiStatus;
      } else {
        var checkProductCode;
        if (Array.isArray(bundleParentCodes)) {
          // eslint-disable-next-line prefer-destructuring
          checkProductCode = bundleParentCodes[0];
        } else {
          checkProductCode = bundleParentCodes;
        }
        var checkDoiStatus = doiStatus;
        if ((0, _typeUtil.exists)(doiStatus) && checkProductCode.localeCompare(checkDoiStatus.productCode) === 0 && release.localeCompare(checkDoiStatus.release) === 0) {
          appliedDoiStatus = doiStatus;
        }
      }
    } else if (!(0, _typeUtil.exists)(bundleParentCodes)) {
      appliedDoiStatus = doiStatus.find(function (ds) {
        return (0, _typeUtil.exists)(ds) && productCode.localeCompare(ds.productCode) === 0 && release.localeCompare(ds.release) === 0;
      });
    } else {
      var _checkProductCode;
      if (Array.isArray(bundleParentCodes)) {
        // eslint-disable-next-line prefer-destructuring
        _checkProductCode = bundleParentCodes[0];
      } else {
        _checkProductCode = bundleParentCodes;
      }
      appliedDoiStatus = doiStatus.find(function (ds) {
        return (0, _typeUtil.exists)(ds) && _checkProductCode.localeCompare(ds.productCode) === 0 && release.localeCompare(ds.release) === 0;
      });
    }
    return appliedDoiStatus;
  }
};
Object.freeze(BundleService);
var _default = BundleService;
exports.default = _default;