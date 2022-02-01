"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BundleService = _interopRequireDefault(require("../../../service/BundleService"));

var _State = require("./State");

var _typeUtil = require("../../../util/typeUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var getProvReleaseRegex = function getProvReleaseRegex() {
  return new RegExp(/^[A-Z]+$/);
};

var fetchIsInStatus = function fetchIsInStatus(fetchObject, status) {
  return _typeof(fetchObject) === 'object' && fetchObject !== null && fetchObject.status === status;
};

var fetchIsAwaitingCall = function fetchIsAwaitingCall(fetchObject) {
  return fetchIsInStatus(fetchObject, _State.FETCH_STATUS.AWAITING_CALL);
};

var stateHasFetchesInStatus = function stateHasFetchesInStatus(state, status) {
  return fetchIsInStatus(state.fetches.product, status) || Object.keys(state.fetches.productReleases).some(function (f) {
    return fetchIsInStatus(state.fetches.productReleases[f], status);
  }) || Object.keys(state.fetches.bundleParents).some(function (f) {
    return fetchIsInStatus(state.fetches.bundleParents[f], status);
  }) || Object.keys(state.fetches.bundleParentReleases).some(function (bundleParent) {
    return Object.keys(state.fetches.bundleParentReleases[bundleParent]).some(function (f) {
      return fetchIsInStatus(state.fetches.bundleParentReleases[bundleParent][f], status);
    });
  });
};

var calculateFetches = function calculateFetches(state) {
  var newState = _extends({}, state);

  var productCode = state.productCode,
      release = state.release,
      parentCodes = state.bundle.parentCodes;
  var releases = state.data.releases;

  if (!productCode) {
    return state;
  } // Find the latest non-prov release definition


  var latestRelease = releases && releases.length ? releases.find(function (r) {
    var matches = getProvReleaseRegex().exec(r.release);
    var isLatestProv = (0, _typeUtil.exists)(matches) && matches.length > 0;
    return !isLatestProv;
  }) : null;
  var fetchRelease = release || (latestRelease || {}).release; // Fetch the base product

  if (!state.fetches.product) {
    newState.fetches.product = {
      status: _State.FETCH_STATUS.AWAITING_CALL
    };
  } // Fetch the release-specific product


  if (fetchRelease && !state.fetches.productReleases[fetchRelease]) {
    newState.fetches.productReleases[fetchRelease] = {
      status: _State.FETCH_STATUS.AWAITING_CALL
    };
  } // Fetch all base bundle parent products


  (parentCodes || []).forEach(function (bundleParentCode) {
    if (!newState.fetches.bundleParents[bundleParentCode]) {
      newState.fetches.bundleParents[bundleParentCode] = {
        status: _State.FETCH_STATUS.AWAITING_CALL
      };
    }
  }); // Fetch all release-specific bundle parent products

  if (fetchRelease) {
    (parentCodes || []).forEach(function (parentCode) {
      if (!newState.fetches.bundleParentReleases[parentCode]) {
        newState.fetches.bundleParentReleases[parentCode] = {};
      }

      if (!newState.fetches.bundleParentReleases[parentCode][fetchRelease]) {
        newState.fetches.bundleParentReleases[parentCode][fetchRelease] = {
          status: _State.FETCH_STATUS.AWAITING_CALL
        };
      }
    });
  }

  return newState;
};

var calculateAppStatus = function calculateAppStatus(state) {
  var updatedState = _extends({}, state);

  if (stateHasFetchesInStatus(state, _State.FETCH_STATUS.AWAITING_CALL)) {
    updatedState.component.status = _State.CONTEXT_STATUS.HAS_FETCHES_TO_TRIGGER;
    return updatedState;
  }

  if (stateHasFetchesInStatus(state, _State.FETCH_STATUS.ERROR)) {
    updatedState.component.status = _State.CONTEXT_STATUS.ERROR;
    return updatedState;
  }

  if (stateHasFetchesInStatus(state, _State.FETCH_STATUS.FETCHING) || !state.neonContextState.isFinal) {
    updatedState.component.status = _State.CONTEXT_STATUS.FETCHING;
    return updatedState;
  }

  updatedState.component.status = _State.CONTEXT_STATUS.READY;
  return updatedState;
};

var sortReleases = function sortReleases(unsortedReleases) {
  var releases = _toConsumableArray(unsortedReleases);

  if (releases && releases.length > 1) {
    releases.sort(function (a, b) {
      return a.generationDate < b.generationDate ? 1 : -1;
    });
  }

  return releases;
};

var withContextReleases = function withContextReleases(neonContextState) {
  var _neonContextState$aut, _neonContextState$aut2, _neonContextState$aut3;

  return (neonContextState === null || neonContextState === void 0 ? void 0 : (_neonContextState$aut = neonContextState.auth) === null || _neonContextState$aut === void 0 ? void 0 : (_neonContextState$aut2 = _neonContextState$aut.userData) === null || _neonContextState$aut2 === void 0 ? void 0 : (_neonContextState$aut3 = _neonContextState$aut2.data) === null || _neonContextState$aut3 === void 0 ? void 0 : _neonContextState$aut3.releases) || [];
};

var applyUserRelease = function applyUserRelease(current, userReleases) {
  if (!Array.isArray(current) || !Array.isArray(userReleases)) {
    return;
  }

  userReleases.forEach(function (userRelease) {
    var hasRelease = current.some(function (value) {
      var _value$release;

      return (value === null || value === void 0 ? void 0 : (_value$release = value.release) === null || _value$release === void 0 ? void 0 : _value$release.localeCompare(userRelease.releaseTag)) === 0 || false;
    });

    if (!hasRelease) {
      current.push(_extends({}, userRelease, {
        showCitation: true,
        showDoi: false,
        showViz: true,
        release: userRelease.releaseTag,
        description: userRelease.description,
        generationDate: userRelease.generationDate ? new Date(userRelease.generationDate).toISOString() : new Date().toISOString()
      }));
    }
  });
}; // Idempotent function to apply releases to state.data.releases. This is the global lookup for
// all releases applicable to this product. It's separate, and must be populated in this way,
// because the backend currently has no concept of bundles or metadata inheritance. As such a bundle
// child may not show as being in any release though the parent is (if the bundle is one that
// forwards availability). In such a case this will be called when the bundle parent is fetched
// and will thus populate the global releases object (and so the ReleaseFilter).


var applyReleasesGlobally = function applyReleasesGlobally(state, releases) {
  var updatedState = _extends({}, state);

  releases.filter(function (r) {
    return !Object.prototype.hasOwnProperty.call(updatedState.data.productReleases, r.release);
  }).forEach(function (r) {
    updatedState.data.productReleases[r.release] = null;
  });
  releases.filter(function (r) {
    return updatedState.data.releases.every(function (existingR) {
      return r.release !== existingR.release;
    });
  }).forEach(function (r) {
    updatedState.data.releases.push(_extends({}, r, {
      showCitation: true,
      showDoi: true,
      showViz: true
    }));
  });
  return updatedState;
};
/**
 * Calculates the bundle state for DataProductContext based on the bundle context
 * state stored in NeonContext.
 * @param bundlesCtx The NeonContext bundle state.
 * @param release The release derive bundles for.
 * @param productCode The product code to derive bundles for.
 * @return The new DataProductContext bundle state.
 */


var calculateBundles = function calculateBundles(bundlesCtx, release, productCode) {
  var bundleParentCode = null;
  var bundleParentCodes = [];
  var bundleForwardAvailabilityFromParent = null;

  var bundleRelease = _BundleService.default.determineBundleRelease(release);

  var isBundleChild = _BundleService.default.isProductInBundle(bundlesCtx, bundleRelease, productCode);

  if (isBundleChild) {
    bundleParentCode = _BundleService.default.getBundleProductCode(bundlesCtx, bundleRelease, productCode);
    bundleForwardAvailabilityFromParent = _BundleService.default.shouldForwardAvailability(bundlesCtx, bundleRelease, productCode, bundleParentCode);

    var hasManyParents = isBundleChild && _BundleService.default.isSplitProduct(bundlesCtx, bundleRelease, productCode);

    if (hasManyParents) {
      bundleParentCodes = _BundleService.default.getSplitProductBundles(bundlesCtx, bundleRelease, productCode);
    } else {
      var bundleCode = _BundleService.default.getBundleProductCode(bundlesCtx, bundleRelease, productCode);

      if ((0, _typeUtil.exists)(bundleCode)) {
        bundleParentCodes = [bundleCode];
      }
    }
  }

  return {
    parentCodes: bundleParentCodes,
    doiProductCode: bundleParentCode,
    forwardAvailabilityFromParent: bundleForwardAvailabilityFromParent
  };
};
/**
 * Calculates the current context state based on the NeonContext state,
 * derivation of bundles, and the resulting fetch and app status.
 * @param newState The DataProductContext state to build on.
 * @param neonContextState The new NeonContext state to integrate.
 * @param release The release to work from.
 * @param productCode The product code to work from.
 * @return The next DataProductContext state.
 */


var calculateContextState = function calculateContextState(newState, neonContextState, release, productCode) {
  var isErrorState = newState.component.status === _State.CONTEXT_STATUS.ERROR;
  var bundles = calculateBundles(neonContextState.data.bundles, release, productCode);
  var newFetchState = calculateFetches(_extends({}, newState, {
    bundle: bundles
  }));
  var newAppStatusState = calculateAppStatus(_extends({}, newFetchState, {
    neonContextState: neonContextState
  })); // If the existing app state was errored due to initialization,
  // keep the current error state.

  if (isErrorState) {
    newAppStatusState.component.status = _State.CONTEXT_STATUS.ERROR;
  }

  return newAppStatusState;
};

var Service = {
  getProvReleaseRegex: getProvReleaseRegex,
  fetchIsAwaitingCall: fetchIsAwaitingCall,
  stateHasFetchesInStatus: stateHasFetchesInStatus,
  calculateFetches: calculateFetches,
  calculateAppStatus: calculateAppStatus,
  sortReleases: sortReleases,
  withContextReleases: withContextReleases,
  applyUserRelease: applyUserRelease,
  applyReleasesGlobally: applyReleasesGlobally,
  calculateBundles: calculateBundles,
  calculateContextState: calculateContextState
};
var _default = Service;
exports.default = _default;