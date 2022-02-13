"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BundleService = _interopRequireDefault(require("../../../service/BundleService"));

var _ReleaseService = _interopRequireDefault(require("../../../service/ReleaseService"));

var _typeUtil = require("../../../util/typeUtil");

var _State = require("./State");

var _ViewState = require("./ViewState");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var fetchIsInStatus = function fetchIsInStatus(fetchObject, status) {
  return _typeof(fetchObject) === 'object' && fetchObject !== null && fetchObject.status === status;
};

var fetchIsAwaitingCall = function fetchIsAwaitingCall(fetchObject) {
  return fetchIsInStatus(fetchObject, _State.FetchStatus.AWAITING_CALL);
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


  var latestRelease = (0, _typeUtil.existsNonEmpty)(releases) ? releases.find(function (r) {
    return !_ReleaseService.default.isLatestNonProv(r.release);
  }) : null;
  var fetchRelease = release || (latestRelease || {}).release; // Fetch the base product

  if (!state.fetches.product) {
    newState.fetches.product = {
      status: _State.FetchStatus.AWAITING_CALL
    };
  } // Fetch the release-specific product


  if (fetchRelease && !state.fetches.productReleases[fetchRelease]) {
    newState.fetches.productReleases[fetchRelease] = {
      status: _State.FetchStatus.AWAITING_CALL
    };
  } // Fetch all base bundle parent products


  (parentCodes || []).forEach(function (bundleParentCode) {
    if (!newState.fetches.bundleParents[bundleParentCode]) {
      newState.fetches.bundleParents[bundleParentCode] = {
        status: _State.FetchStatus.AWAITING_CALL
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
          status: _State.FetchStatus.AWAITING_CALL
        };
      }
    });
  }

  return newState;
};

var calculateAppStatus = function calculateAppStatus(state) {
  var updatedState = _extends({}, state);

  if (stateHasFetchesInStatus(state, _State.FetchStatus.AWAITING_CALL)) {
    updatedState.component.status = _State.ContextStatus.HAS_FETCHES_TO_TRIGGER;
    return updatedState;
  }

  if (stateHasFetchesInStatus(state, _State.FetchStatus.ERROR)) {
    updatedState.component.status = _State.ContextStatus.ERROR;
    return updatedState;
  }

  if (stateHasFetchesInStatus(state, _State.FetchStatus.FETCHING) || !state.neonContextState.isFinal) {
    updatedState.component.status = _State.ContextStatus.FETCHING;
    return updatedState;
  }

  updatedState.component.status = _State.ContextStatus.READY;
  return updatedState;
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
      description: r.release,
      showCitation: true,
      showDoi: true,
      showViz: true
    }));
  });
  return updatedState;
};
/**
 * Calculates the current context state based on the NeonContext state,
 * derivation of bundles, and the resulting fetch and app status.
 * @param newState The DataProductCitationState state to build on.
 * @param neonContextState The new NeonContext state to integrate.
 * @param release The release to work from.
 * @param productCode The product code to work from.
 * @return The next DataProductCitationState state.
 */


var calculateContextState = function calculateContextState(newState, neonContextState, release, productCode) {
  var isErrorState = newState.component.status === _State.ContextStatus.ERROR;
  var bundles = {
    parentCodes: [],
    doiProductCode: null
  };

  if ((0, _typeUtil.isStringNonEmpty)(productCode)) {
    bundles = _BundleService.default.determineCitationBundle(neonContextState.data.bundles, release, productCode);
  }

  var newFetchState = calculateFetches(_extends({}, newState, {
    bundle: bundles
  }));
  var newAppStatusState = calculateAppStatus(_extends({}, newFetchState, {
    neonContextState: neonContextState
  })); // If the existing app state was errored due to initialization,
  // keep the current error state.

  if (isErrorState) {
    newAppStatusState.component.status = _State.ContextStatus.ERROR;
  }

  return newAppStatusState;
};

var getReleaseObject = function getReleaseObject(releases, release) {
  return !(0, _typeUtil.isStringNonEmpty)(release) || release === _State.PROVISIONAL_RELEASE ? null : releases.find(function (r) {
    return r.release === release;
  });
};

var getReleaseDoi = function getReleaseDoi(releases, release) {
  var releaseObject = getReleaseObject(releases, release);

  if (!(0, _typeUtil.exists)(releaseObject) || !(0, _typeUtil.exists)(releaseObject.productDoi) || !(0, _typeUtil.isStringNonEmpty)(releaseObject.productDoi.url)) {
    return null;
  }

  return releaseObject.productDoi.url;
};

var useViewState = function useViewState(state, props) {
  var specifiedReleaseTag = state.release,
      bundle = state.bundle,
      status = state.component.status,
      _state$data = state.data,
      baseProduct = _state$data.product,
      productReleases = _state$data.productReleases,
      bundleParents = _state$data.bundleParents,
      bundleParentReleases = _state$data.bundleParentReleases,
      releases = _state$data.releases,
      neonContextStateData = state.neonContextState.data;
  var bundlesContext = neonContextStateData.bundles;
  var disableConditional = props.disableConditional;
  var hasReleases = (0, _typeUtil.existsNonEmpty)(releases); // Identify the latest release state.

  var latestReleaseObject = hasReleases ? releases.find(function (r) {
    return r.showCitation;
  }) : null;
  var hasLatestRelease = (0, _typeUtil.exists)(latestReleaseObject) && (0, _typeUtil.isStringNonEmpty)(latestReleaseObject.release);
  var hideLatestReleaseCitation = hasLatestRelease ? !latestReleaseObject.showCitation : false; // Identify state of specified release.

  var hasSpecifiedRelease = (0, _typeUtil.isStringNonEmpty)(specifiedReleaseTag);
  var specifiedReleaseObject = hasSpecifiedRelease && hasReleases ? getReleaseObject(releases, specifiedReleaseTag) : null;
  var isSpecifiedReleaseValid = (0, _typeUtil.exists)(specifiedReleaseObject) && (0, _typeUtil.isStringNonEmpty)(specifiedReleaseObject.release); // Determine the release tag to render for the citation, either for the
  // currently specified release or the latest release.

  var appliedReleaseObject = null;
  var appliedRenderedReleaseTag = null;

  if (hasSpecifiedRelease) {
    if (isSpecifiedReleaseValid) {
      appliedReleaseObject = specifiedReleaseObject;
      appliedRenderedReleaseTag = specifiedReleaseObject.release;
    }
  } else if (hasLatestRelease) {
    appliedReleaseObject = latestReleaseObject;
    appliedRenderedReleaseTag = latestReleaseObject.release;
  }

  var hasAppliedRelease = (0, _typeUtil.exists)(appliedReleaseObject);
  var isAppliedReleaseLatestNonProv = (0, _typeUtil.isStringNonEmpty)(appliedRenderedReleaseTag) ? _ReleaseService.default.isLatestNonProv(appliedRenderedReleaseTag) : false;
  var appliedReleaseDoi = null;

  if (hasAppliedRelease && !isAppliedReleaseLatestNonProv) {
    var aro = appliedReleaseObject;

    if ((0, _typeUtil.exists)(aro.productDoi) && (0, _typeUtil.isStringNonEmpty)(aro.productDoi.url)) {
      appliedReleaseDoi = aro.productDoi.url;
    }
  }

  var hasAppliedReleaseDoi = (0, _typeUtil.isStringNonEmpty)(appliedReleaseDoi);
  var hideAppliedReleaseCitation = (0, _typeUtil.exists)(appliedReleaseObject) && !appliedReleaseObject.showCitation; // Identify whether or not viewing a bundled product with applicable DOI
  // and capture the bundle DOI product code.

  var hasBundleCode = (0, _typeUtil.existsNonEmpty)(bundle.parentCodes) && (0, _typeUtil.isStringNonEmpty)(bundle.doiProductCode);
  var bundleParentCode = hasBundleCode ? bundle.doiProductCode : null;
  var bundleProduct = null;

  if (hasBundleCode && (0, _typeUtil.exists)(bundleParents[bundleParentCode])) {
    bundleProduct = bundleParents[bundleParentCode];
  }

  var hasBundleProduct = (0, _typeUtil.exists)(bundleProduct); // Determines if the latest release has a bundle defined for this product.

  var hasLatestReleaseBundle = false;

  if (hasLatestRelease && (0, _typeUtil.exists)(baseProduct)) {
    hasLatestReleaseBundle = _BundleService.default.isProductInBundle(bundlesContext, latestReleaseObject.release, baseProduct.productCode);
  } // Determine if the citable product should be the bundle container product
  // or the currently specified product.


  var citableBaseProduct = hasBundleProduct ? bundleProduct : baseProduct; // Determine the product to use for citing within the applicable release
  // and within the context of bundles.

  var citableReleaseProduct = null;

  if (hasAppliedReleaseDoi && !hideAppliedReleaseCitation) {
    // If we're referencing latest release and provisional, and there isn't a bundle
    // defined for the latest release, use base product for release citation
    if (!hasSpecifiedRelease && !hasLatestReleaseBundle) {
      citableReleaseProduct = baseProduct;
    } else {
      // When a bundled product code is available for the given release,
      // get the product for the parent code and release.
      // Otherwise, the citable product is the current product for the specified
      // release when available.
      // eslint-disable-next-line no-lonely-if
      if (hasBundleCode) {
        var bpr = bundleParentReleases[bundleParentCode];

        if ((0, _typeUtil.exists)(bpr)) {
          var product = bpr[appliedRenderedReleaseTag];

          if ((0, _typeUtil.exists)(product)) {
            citableReleaseProduct = product;
          }
        }
      } else {
        var _product = productReleases[appliedRenderedReleaseTag];

        if ((0, _typeUtil.exists)(_product)) {
          citableReleaseProduct = _product;
        }
      }
    }
  } // Determine if there's a valid product to generate the citation with.


  var hasValidProduct = (0, _typeUtil.exists)(citableBaseProduct); // Determine the overall citation display status.

  var appliedStatus = status;
  var displayType = _ViewState.DisplayType.CONDITIONAL;
  var isReady = status === _State.ContextStatus.READY;

  if (isReady && !hasValidProduct) {
    // If the context is ready and no product is identified, error state.
    appliedStatus = _State.ContextStatus.ERROR;
    displayType = _ViewState.DisplayType.NOT_AVAILABLE;
  } else if (hasSpecifiedRelease) {
    // A release has been specified, determine validity.
    if (hideAppliedReleaseCitation) {
      // If a release was specified but that release is configured to
      // not show a release citation, show not available display state.
      displayType = _ViewState.DisplayType.NOT_AVAILABLE;
    } else if (hasAppliedReleaseDoi) {
      if ((0, _typeUtil.exists)(citableReleaseProduct)) {
        displayType = _ViewState.DisplayType.RELEASE;
      } else if (isReady) {
        // If the component is ready and a release was specified but
        // failed to resolve the appropriate citable release product,
        // error state.
        appliedStatus = _State.ContextStatus.ERROR;
        displayType = _ViewState.DisplayType.NOT_AVAILABLE;
      }
    } else if (isAppliedReleaseLatestNonProv) {
      displayType = _ViewState.DisplayType.PROVISIONAL;
    } else {
      // If no valid DOI has been identified and it's not
      // a special case, render as not available.
      displayType = _ViewState.DisplayType.NOT_AVAILABLE;
    }
  } else if (!hasLatestRelease || hideLatestReleaseCitation || disableConditional) {
    // If display is determined to be conditional, but we haven't identified
    // a valid latest release or it's set to hide the citation for that
    // release, then display as provisional.
    // If an override has been presented by the component, also
    // display as provisional.
    displayType = _ViewState.DisplayType.PROVISIONAL;
  } else if (isReady && (!hasValidProduct || !(0, _typeUtil.exists)(citableReleaseProduct))) {
    // If the component is ready and the display state is conditional
    // and a valid product and release product were not found, error state.
    appliedStatus = _State.ContextStatus.ERROR;
    displayType = _ViewState.DisplayType.NOT_AVAILABLE;
  }

  return {
    status: appliedStatus,
    releaseObject: appliedReleaseObject,
    doiUrl: appliedReleaseDoi,
    releases: releases,
    citableBaseProduct: citableBaseProduct,
    citableReleaseProduct: citableReleaseProduct,
    displayType: displayType,
    bundleParentCode: bundleParentCode
  };
};

var Service = {
  fetchIsAwaitingCall: fetchIsAwaitingCall,
  stateHasFetchesInStatus: stateHasFetchesInStatus,
  calculateFetches: calculateFetches,
  calculateAppStatus: calculateAppStatus,
  applyReleasesGlobally: applyReleasesGlobally,
  calculateContextState: calculateContextState,
  useViewState: useViewState,
  getReleaseObject: getReleaseObject,
  getReleaseDoi: getReleaseDoi
};
var _default = Service;
exports.default = _default;