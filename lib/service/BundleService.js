"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ReleaseService = _interopRequireWildcard(require("./ReleaseService"));
var _typeUtil = require("../util/typeUtil");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const BundleService = {
  isProductDefined: (context, productCode) => context.allBundleProducts[productCode] === true,
  isProductDefinedForRelease: (context, productCode, release) => {
    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.bundleProducts) || !(0, _typeUtil.exists)(context.bundleProducts[release])) {
      return false;
    }
    const bundleProductCodes = Object.keys(context.bundleProducts[release]);
    if (!(0, _typeUtil.existsNonEmpty)(bundleProductCodes)) {
      return false;
    }
    if (bundleProductCodes.includes(productCode)) {
      return true;
    }
    const childCodes = bundleProductCodes.flatMap(bundleProductCode => context.bundleProducts[release][bundleProductCode]);
    return childCodes.includes(productCode);
  },
  determineBundleRelease: release => {
    const regex = _ReleaseService.default.getProvReleaseRegex();
    let isLatestProv = false;
    if (!(0, _typeUtil.isStringNonEmpty)(release) || release.localeCompare(_ReleaseService.LATEST_AND_PROVISIONAL) === 0) {
      isLatestProv = true;
    } else if (regex) {
      const matches = regex.exec(release);
      isLatestProv = (0, _typeUtil.exists)(matches) && matches.length > 0;
    }
    let appliedRelease;
    if (isLatestProv) {
      appliedRelease = 'PROVISIONAL';
    } else {
      appliedRelease = release;
    }
    return appliedRelease;
  },
  getBundledProductCodes: (context, release) => {
    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.bundleProducts) || !(0, _typeUtil.exists)(context.bundleProducts[release])) {
      return [];
    }
    return Object.keys(context.bundleProducts[release]);
  },
  isProductInBundle: (context, release, productCode) => {
    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.bundleDoiLookup) || !(0, _typeUtil.exists)(context.bundleDoiLookup[release])) {
      return false;
    }
    if (Array.isArray(context.bundleDoiLookup[release][productCode])) {
      return (0, _typeUtil.existsNonEmpty)(context.bundleDoiLookup[release][productCode]);
    }
    return (0, _typeUtil.isStringNonEmpty)(context.bundleDoiLookup[release][productCode]);
  },
  isBundledProduct: (context, release, productCode) => BundleService.getBundledProductCodes(context, release).includes(productCode),
  isSplitProduct: (context, release, productCode) => {
    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.splitProducts) || !(0, _typeUtil.exists)(context.splitProducts[release])) {
      return false;
    }
    return Array.isArray(context.splitProducts[release][productCode]);
  },
  getBundleProductCode: (context, release, productCode) => {
    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.bundleDoiLookup) || !(0, _typeUtil.exists)(context.bundleDoiLookup[release])) {
      return null;
    }
    const bundledProductCode = context.bundleDoiLookup[release][productCode];
    if (Array.isArray(bundledProductCode) && !(0, _typeUtil.existsNonEmpty)(bundledProductCode)) {
      return null;
    }
    if (!Array.isArray(bundledProductCode) && !(0, _typeUtil.isStringNonEmpty)(bundledProductCode)) {
      return null;
    }
    return bundledProductCode;
  },
  shouldForwardAvailability: (context, release, productCode, bundleProductCode) => {
    const isSplit = BundleService.isSplitProduct(context, release, productCode);
    if (isSplit) {
      if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.splitProducts) || !(0, _typeUtil.exists)(context.splitProducts[release]) || !(0, _typeUtil.exists)(context.bundleProductsForwardAvailability) || !(0, _typeUtil.exists)(context.bundleProductsForwardAvailability[release])) {
        return false;
      }
      return context.splitProducts[release][productCode].some(splitToProduct => context.bundleProductsForwardAvailability[release][splitToProduct]);
    }
    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.bundleProductsForwardAvailability) || !(0, _typeUtil.exists)(context.bundleProductsForwardAvailability[release])) {
      return false;
    }
    const bundleShouldForward = context.bundleProductsForwardAvailability[release][bundleProductCode];
    if (!(0, _typeUtil.exists)(bundleShouldForward)) {
      return false;
    }
    return bundleShouldForward;
  },
  getSplitProductBundles: (context, release, productCode) => {
    const isSplit = BundleService.isSplitProduct(context, release, productCode);
    if (!isSplit) {
      return [];
    }
    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.splitProducts) || !(0, _typeUtil.exists)(context.splitProducts[release])) {
      return [];
    }
    const bundles = context.splitProducts[release][productCode];
    if (!Array.isArray(bundles)) {
      return [];
    }
    return bundles;
  },
  getBundledProducts: (context, release, bundleProductCode) => {
    if (!(0, _typeUtil.exists)(context) || !(0, _typeUtil.exists)(context.bundleProducts) || !(0, _typeUtil.exists)(context.bundleProducts[release])) {
      return [];
    }
    const bundle = context.bundleProducts[release][bundleProductCode];
    if (!Array.isArray(bundle)) {
      return [];
    }
    return bundle;
  },
  determineCitationBundle: (context, release, productCode) => {
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
  determineAppliedBundleRelease: (context, release, productCode, doiStatus) => {
    if (!(0, _typeUtil.exists)(doiStatus)) {
      return null;
    }
    let appliedDoiStatus;
    let bundleParentCodes = null;
    if ((0, _typeUtil.exists)(context)) {
      bundleParentCodes = BundleService.getBundleProductCode(context, release, productCode);
    }
    if (!Array.isArray(doiStatus)) {
      if (!(0, _typeUtil.exists)(bundleParentCodes)) {
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
        if ((0, _typeUtil.exists)(doiStatus) && checkProductCode.localeCompare(checkDoiStatus.productCode) === 0 && release.localeCompare(checkDoiStatus.release) === 0) {
          appliedDoiStatus = doiStatus;
        }
      }
    } else if (!(0, _typeUtil.exists)(bundleParentCodes)) {
      appliedDoiStatus = doiStatus.find(ds => (0, _typeUtil.exists)(ds) && productCode.localeCompare(ds.productCode) === 0 && release.localeCompare(ds.release) === 0);
    } else {
      let checkProductCode;
      if (Array.isArray(bundleParentCodes)) {
        // eslint-disable-next-line prefer-destructuring
        checkProductCode = bundleParentCodes[0];
      } else {
        checkProductCode = bundleParentCodes;
      }
      appliedDoiStatus = doiStatus.find(ds => (0, _typeUtil.exists)(ds) && checkProductCode.localeCompare(ds.productCode) === 0 && release.localeCompare(ds.release) === 0);
    }
    return appliedDoiStatus;
  }
};
Object.freeze(BundleService);
var _default = exports.default = BundleService;