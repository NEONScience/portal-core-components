"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _BundleService = _interopRequireDefault(require("../../../service/BundleService"));
var _ReleaseService = _interopRequireWildcard(require("../../../service/ReleaseService"));
var _neonApi = require("../../../types/neonApi");
var _typeUtil = require("../../../util/typeUtil");
var _Actions = _interopRequireDefault(require("./Actions"));
var _State = require("./State");
var _ViewState = require("./ViewState");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var fetchIsInStatus = function fetchIsInStatus(fetchObject, status) {
  return _typeof(fetchObject) === 'object' && fetchObject !== null && fetchObject.status === status;
};
var fetchIsAwaitingCall = function fetchIsAwaitingCall(fetchObject) {
  return fetchIsInStatus(fetchObject, _State.FetchStatus.AWAITING_CALL);
};
var stateHasFetchesInStatus = function stateHasFetchesInStatus(state, status) {
  return fetchIsInStatus(state.fetches.product, status) || Object.keys(state.fetches.productReleases).some(function (f) {
    return fetchIsInStatus(state.fetches.productReleases[f], status);
  }) || Object.keys(state.fetches.productReleaseDois).some(function (f) {
    return fetchIsInStatus(state.fetches.productReleaseDois[f], status);
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
  }
  // Find the latest non-prov release definition
  var latestRelease = (0, _typeUtil.existsNonEmpty)(releases) ? releases.find(function (r) {
    return !_ReleaseService.default.isLatestNonProv(r.release);
  }) : null;
  var fetchRelease = release || (latestRelease || {}).release;
  // Fetch the base product
  if (!state.fetches.product) {
    newState.fetches.product = {
      status: _State.FetchStatus.AWAITING_CALL
    };
  }
  // Fetch the release-specific product
  if (fetchRelease && !state.fetches.productReleases[fetchRelease]) {
    newState.fetches.productReleases[fetchRelease] = {
      status: _State.FetchStatus.AWAITING_CALL
    };
  }
  // Fetch the release specific doi state
  if (fetchRelease && !state.fetches.productReleaseDois[fetchRelease]) {
    newState.fetches.productReleaseDois[fetchRelease] = {
      status: _State.FetchStatus.AWAITING_CALL
    };
  }
  // Fetch all base bundle parent products
  (parentCodes || []).forEach(function (bundleParentCode) {
    if (!newState.fetches.bundleParents[bundleParentCode]) {
      newState.fetches.bundleParents[bundleParentCode] = {
        status: _State.FetchStatus.AWAITING_CALL
      };
    }
  });
  // Fetch all release-specific bundle parent products
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
  if (stateHasFetchesInStatus(state, _State.FetchStatus.ERROR) || state.neonContextState.hasError) {
    updatedState.component.status = _State.ContextStatus.ERROR;
    return updatedState;
  }
  if (stateHasFetchesInStatus(state, _State.FetchStatus.AWAITING_CALL)) {
    updatedState.component.status = _State.ContextStatus.HAS_FETCHES_TO_TRIGGER;
    return updatedState;
  }
  if (stateHasFetchesInStatus(state, _State.FetchStatus.FETCHING) || !state.neonContextState.isFinal) {
    updatedState.component.status = _State.ContextStatus.FETCHING;
    return updatedState;
  }
  updatedState.component.status = _State.ContextStatus.READY;
  return updatedState;
};

// Idempotent function to apply releases to state.data.releases. This is the global lookup for
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
  updatedState.data.releases = _ReleaseService.default.sortReleases(updatedState.data.releases);
  return updatedState;
};
var applyDoiStatusReleaseGlobally = function applyDoiStatusReleaseGlobally(state, productCode, release, doiStatus) {
  var _updatedState$neonCon;
  if (!(0, _typeUtil.exists)(doiStatus)) {
    return state;
  }
  var updatedState = _extends({}, state);
  // eslint-disable-next-line max-len
  var appliedDoiStatus = _BundleService.default.determineAppliedBundleRelease((((_updatedState$neonCon = updatedState.neonContextState) === null || _updatedState$neonCon === void 0 ? void 0 : _updatedState$neonCon.data) || {}).bundles, release, productCode, doiStatus);
  var transformedRelease = _ReleaseService.default.transformDoiStatusRelease(appliedDoiStatus);
  if (!(0, _typeUtil.exists)(transformedRelease)) {
    return updatedState;
  }
  var citationRelease = transformedRelease;
  var hasRelease = updatedState.data.releases.some(function (value) {
    return (0, _typeUtil.exists)(value) && (0, _typeUtil.isStringNonEmpty)(value.release) && (0, _typeUtil.isStringNonEmpty)(citationRelease.release) && value.release.localeCompare(citationRelease.release) === 0;
  });
  if (!hasRelease) {
    updatedState.data.releases.push(citationRelease);
  }
  updatedState.data.releases = _ReleaseService.default.sortReleases(updatedState.data.releases);
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
  }));
  // If the existing app state was errored due to initialization,
  // keep the current error state.
  if (isErrorState) {
    newAppStatusState.component.status = _State.ContextStatus.ERROR;
  }
  return newAppStatusState;
};
var getReleaseObject = function getReleaseObject(releases, release) {
  return !(0, _typeUtil.isStringNonEmpty)(release) || release === _ReleaseService.PROVISIONAL_RELEASE ? null : releases.find(function (r) {
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
var buildCitationDownloadKey = function buildCitationDownloadKey(citationProduct, releaseCb, formatCb) {
  var provisionalCb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var key = "citation-download-".concat(citationProduct.productCode);
  if ((0, _typeUtil.isStringNonEmpty)(releaseCb)) {
    key = "".concat(key, "-").concat(releaseCb);
  } else if (provisionalCb) {
    key = "".concat(key, "-").concat(_ReleaseService.PROVISIONAL_RELEASE);
  } else {
    key = "".concat(key, "-RELEASE");
  }
  if ((0, _typeUtil.isStringNonEmpty)(formatCb)) {
    key = "".concat(key, "-").concat(formatCb);
  } else {
    key = "".concat(key, "-FORMAT");
  }
  return key;
};
var hasCitationDownloadStatus = function hasCitationDownloadStatus(citationDownloadsFetchStatus, provisionalCb, productCode, statusCb) {
  return Object.keys(citationDownloadsFetchStatus).some(function (k) {
    if (citationDownloadsFetchStatus[k]) {
      var shouldConsider = true;
      if (!k.includes(productCode) || !provisionalCb && k.includes(_ReleaseService.PROVISIONAL_RELEASE) || provisionalCb && !k.includes(_ReleaseService.PROVISIONAL_RELEASE)) {
        shouldConsider = false;
      }
      if (shouldConsider && citationDownloadsFetchStatus[k].status === statusCb) {
        return true;
      }
    }
    return false;
  });
};
var handleResetCitationDownloads = function handleResetCitationDownloads(citationDownloadsFetchStatus, provisionalCb, productCode, dispatch) {
  Object.keys(citationDownloadsFetchStatus).forEach(function (k) {
    if (citationDownloadsFetchStatus[k]) {
      var shouldReset = true;
      if (!k.includes(productCode) || !provisionalCb && k.includes(_ReleaseService.PROVISIONAL_RELEASE) || provisionalCb && !k.includes(_ReleaseService.PROVISIONAL_RELEASE)) {
        shouldReset = false;
      }
      if (shouldReset) {
        if (citationDownloadsFetchStatus[k].status !== _State.FetchStatus.IDLE) {
          if (dispatch) {
            dispatch(_Actions.default.fetchCitationDownloadReset(k));
          }
        }
      }
    }
  });
};
var useViewState = function useViewState(state, props) {
  var specifiedReleaseTag = state.release,
    bundle = state.bundle,
    status = state.component.status,
    citationDownloadsFetchStatus = state.fetches.citationDownloads,
    _state$data = state.data,
    baseProduct = _state$data.product,
    productReleases = _state$data.productReleases,
    productReleaseDois = _state$data.productReleaseDois,
    bundleParents = _state$data.bundleParents,
    bundleParentReleases = _state$data.bundleParentReleases,
    releases = _state$data.releases,
    neonContextStateData = state.neonContextState.data;
  var bundlesContext = neonContextStateData.bundles;
  var disableConditional = props.disableConditional;
  var hasReleases = (0, _typeUtil.existsNonEmpty)(releases);
  // Identify the latest release state.
  var latestReleaseObject = hasReleases ? releases.find(function (r) {
    return r.showCitation === true;
  }) : null;
  var hasLatestRelease = (0, _typeUtil.exists)(latestReleaseObject) && (0, _typeUtil.isStringNonEmpty)(latestReleaseObject.release);
  var hideLatestReleaseCitation = hasLatestRelease ? latestReleaseObject.showCitation === false : false;
  // Identify state of specified release.
  var hasSpecifiedRelease = (0, _typeUtil.isStringNonEmpty)(specifiedReleaseTag);
  var specifiedReleaseObject = hasSpecifiedRelease && hasReleases ? getReleaseObject(releases, specifiedReleaseTag) : null;
  var isSpecifiedReleaseValid = (0, _typeUtil.exists)(specifiedReleaseObject) && (0, _typeUtil.isStringNonEmpty)(specifiedReleaseObject.release);
  var isSpecifiedReleaseLatestNonProv = hasSpecifiedRelease ? _ReleaseService.default.isLatestNonProv(specifiedReleaseTag) : false;
  // Determine the release tag to render for the citation, either for the
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
  var hideAppliedReleaseCitation = (0, _typeUtil.exists)(appliedReleaseObject) && appliedReleaseObject.showCitation === false;
  // Determine tombstoned state for entire citation
  var hasProductReleaseDois = (0, _typeUtil.exists)(productReleaseDois) && (0, _typeUtil.isStringNonEmpty)(appliedRenderedReleaseTag) && (0, _typeUtil.exists)(productReleaseDois[appliedRenderedReleaseTag]);
  var dataProductDoiStatus = null;
  var isTombstoned = false;
  var determineDoiStatusTombstone = function determineDoiStatusTombstone(dpds) {
    var tsResult = false;
    if (!Array.isArray(dpds)) {
      // eslint-disable-next-line max-len
      var doiStatusType = dpds === null || dpds === void 0 ? void 0 : dpds.status;
      tsResult = (0, _typeUtil.exists)(doiStatusType) && doiStatusType === _neonApi.DoiStatusType.TOMBSTONED;
    } else {
      tsResult = dpds.every(function (ds) {
        if (!(0, _typeUtil.exists)(ds)) return false;
        return ds.status === _neonApi.DoiStatusType.TOMBSTONED;
      });
    }
    return tsResult;
  };
  if (hasProductReleaseDois) {
    dataProductDoiStatus = productReleaseDois[appliedRenderedReleaseTag];
    isTombstoned = determineDoiStatusTombstone(dataProductDoiStatus);
  }
  // Identify whether or not viewing a bundled product with applicable DOI.
  var hasBundleCode = (0, _typeUtil.existsNonEmpty)(bundle.parentCodes) && ((0, _typeUtil.isStringNonEmpty)(bundle.doiProductCode) || Array.isArray(bundle.doiProductCode) && (0, _typeUtil.existsNonEmpty)(bundle.doiProductCode));
  // Builds a citation item based on current state
  // of release, specified bundle code when applicable.
  var buildCitationItem = function buildCitationItem(bundleParentCode, bundleDpds) {
    var item = {
      releaseObject: null,
      doiUrl: null,
      citableBaseProduct: null,
      citableReleaseProduct: null,
      bundleParentCode: null,
      isTombstoned: false
    };
    var bundleProduct = null;
    if (hasBundleCode && (0, _typeUtil.isStringNonEmpty)(bundleParentCode) && (0, _typeUtil.exists)(bundleParents[bundleParentCode])) {
      bundleProduct = bundleParents[bundleParentCode];
    }
    var hasBundleProduct = (0, _typeUtil.exists)(bundleProduct);
    // Determines if the latest release has a bundle defined for this product.
    var hasLatestReleaseBundle = false;
    if (hasLatestRelease && (0, _typeUtil.exists)(baseProduct)) {
      hasLatestReleaseBundle = _BundleService.default.isProductInBundle(bundlesContext, latestReleaseObject.release, baseProduct.productCode);
    }
    // Determine if the bundle product has data for the specified release.
    var isBundleProductInRelease = true;
    if (hasBundleProduct && hasSpecifiedRelease && !isAppliedReleaseLatestNonProv) {
      var _bundleProduct;
      var bundleHasRelease = (_bundleProduct = bundleProduct) === null || _bundleProduct === void 0 ? void 0 : _bundleProduct.releases.find(function (r) {
        return r.release === appliedRenderedReleaseTag;
      });
      isBundleProductInRelease = (0, _typeUtil.exists)(bundleHasRelease);
    }
    var itemReleaseObject = appliedReleaseObject;
    var itemDoiUrl = appliedReleaseDoi;
    var itemIsTombstoned = false;
    // Determine if the citable product should be the bundle container product
    // or the currently specified product.
    // eslint-disable-next-line max-len
    var citableBaseProduct = hasBundleProduct && isBundleProductInRelease ? bundleProduct : baseProduct;
    // Determine the product to use for citing within the applicable release
    // and within the context of bundles.
    var citableReleaseProduct = null;
    if (hasAppliedReleaseDoi && !hideAppliedReleaseCitation) {
      // If we're referencing latest release and provisional, and there isn't a bundle
      // defined for the latest release, use base product for release citation.
      if (!hasSpecifiedRelease && !hasLatestReleaseBundle) {
        citableReleaseProduct = baseProduct;
      } else {
        // Has a specified release, or if not, has latest release bundle.
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
    }
    // Determine release property states from current bundle.
    if (hasBundleCode && (0, _typeUtil.isStringNonEmpty)(bundleParentCode) && (0, _typeUtil.exists)(bundleDpds)) {
      var bundleCitationRelease = _ReleaseService.default.transformDoiStatusRelease(bundleDpds);
      itemReleaseObject = bundleCitationRelease;
      itemDoiUrl = bundleCitationRelease.productDoi.url;
      itemIsTombstoned = determineDoiStatusTombstone(bundleDpds);
    }
    item.releaseObject = itemReleaseObject;
    item.doiUrl = itemDoiUrl;
    item.isTombstoned = itemIsTombstoned;
    item.citableBaseProduct = citableBaseProduct;
    item.citableReleaseProduct = citableReleaseProduct;
    item.bundleParentCode = bundleParentCode;
    return item;
  };
  // Build set of applicable citation items for product, bundle
  var items = [];
  if (!hasBundleCode) {
    var nonBundleItem = buildCitationItem();
    items.push(nonBundleItem);
  } else if ((0, _typeUtil.isStringNonEmpty)(bundle.doiProductCode)) {
    var bundleParentCode = bundle.doiProductCode;
    var singleBundleItem = buildCitationItem(bundleParentCode);
    items.push(singleBundleItem);
  } else if (Array.isArray(bundle.doiProductCode) && (0, _typeUtil.existsNonEmpty)(bundle.doiProductCode)) {
    var bundleParentCodes = bundle.doiProductCode;
    if (hasProductReleaseDois && !Array.isArray(dataProductDoiStatus)) {
      var _bundleParentCode = bundle.doiProductCode[0];
      var _singleBundleItem = buildCitationItem(_bundleParentCode);
      items.push(_singleBundleItem);
    } else {
      bundleParentCodes.forEach(function (bundleParentCode) {
        var bundleDpds;
        if (hasProductReleaseDois && Array.isArray(dataProductDoiStatus)) {
          bundleDpds = dataProductDoiStatus.find(function (ds) {
            if (!(0, _typeUtil.exists)(ds)) return false;
            return ds.productCode.localeCompare(bundleParentCode) === 0;
          });
        }
        // If we could not identify a matching DOI record for the bundle parent
        // code, it is an invalid state, do not capture.
        // This should not occur if bundles and DOIs are properly
        // configured and data come across properly in API calls.
        if ((0, _typeUtil.exists)(bundleDpds)) {
          var bundleItem = buildCitationItem(bundleParentCode, bundleDpds);
          items.push(bundleItem);
        }
      });
    }
  }
  // Determine if there's a valid product to generate the citation with.
  var hasValidProduct = items.some(function (item) {
    return (0, _typeUtil.exists)(item.citableBaseProduct);
  });
  var hasValidReleaseProduct = items.some(function (item) {
    return (0, _typeUtil.exists)(item.citableReleaseProduct);
  });
  // Verify identified release product is in the applied release.
  var isCitableReleaseProductInRelease = false;
  // If looking at latest release non provisional, consider in release.
  if (isAppliedReleaseLatestNonProv) {
    isCitableReleaseProductInRelease = true;
  } else if (hasValidReleaseProduct) {
    var productHasRelease = items.some(function (item) {
      var _item$citableReleaseP;
      var dpr = (_item$citableReleaseP = item.citableReleaseProduct) === null || _item$citableReleaseP === void 0 ? void 0 : _item$citableReleaseP.releases.find(function (r) {
        return r.release === appliedRenderedReleaseTag;
      });
      return (0, _typeUtil.exists)(dpr) || item.isTombstoned;
    });
    isCitableReleaseProductInRelease = productHasRelease || isTombstoned;
  }
  // Determine the overall citation display status.
  var appliedStatus = status;
  var displayType = _ViewState.DisplayType.CONDITIONAL;
  var isReady = status === _State.ContextStatus.READY;
  var isError = status === _State.ContextStatus.ERROR;
  var setErrorNotAvailable = function setErrorNotAvailable() {
    appliedStatus = _State.ContextStatus.ERROR;
    displayType = _ViewState.DisplayType.NOT_AVAILABLE;
  };
  if (isReady) {
    if (!hasValidProduct) {
      // If the context is ready and no product is identified, error state.
      setErrorNotAvailable();
    } else if (hasSpecifiedRelease) {
      // A release has been specified, determine validity.
      if (hideAppliedReleaseCitation && !isAppliedReleaseLatestNonProv) {
        // If a release was specified but that release is configured to
        // not show a release citation, show not available display state.
        displayType = _ViewState.DisplayType.NOT_AVAILABLE;
      } else if (hasAppliedReleaseDoi) {
        if (hasValidReleaseProduct) {
          // If the identified release product doesn't have data in the
          // release and we're viewing a specific release, report
          // as not available for that release.
          if (!isCitableReleaseProductInRelease) {
            displayType = _ViewState.DisplayType.NOT_AVAILABLE;
          } else {
            displayType = _ViewState.DisplayType.RELEASE;
          }
        } else {
          // If the component is ready and a release was specified but
          // failed to resolve the appropriate citable release product,
          // error state.
          setErrorNotAvailable();
        }
      } else if (isAppliedReleaseLatestNonProv) {
        displayType = _ViewState.DisplayType.PROVISIONAL;
      } else {
        // If no valid DOI has been identified and it's not
        // a special case, render as not available.
        displayType = _ViewState.DisplayType.NOT_AVAILABLE;
      }
    } else if (!isCitableReleaseProductInRelease) {
      // If the detected citable release product is not in the applied
      // release, then consider the display as provisional.
      displayType = _ViewState.DisplayType.PROVISIONAL;
    } else if (!hasLatestRelease || hideLatestReleaseCitation || disableConditional) {
      // If display is determined to be conditional, but we haven't identified
      // a valid latest release or it's set to hide the citation for that
      // release, then display as provisional.
      // If an override has been presented by the component, also
      // display as provisional.
      displayType = _ViewState.DisplayType.PROVISIONAL;
    } else if (!hasValidProduct || !hasValidReleaseProduct) {
      // If the component is ready and the display state is conditional
      // and a valid product and release product were not found, error state.
      setErrorNotAvailable();
    }
  } else if (isError) {
    if (hasSpecifiedRelease && isSpecifiedReleaseLatestNonProv) {
      // If the component is in error state due to a special case release,
      // convey the state of the component as not available instead of error.
      appliedStatus = _State.ContextStatus.READY;
      displayType = _ViewState.DisplayType.NOT_AVAILABLE;
    }
  }
  return {
    status: appliedStatus,
    citationItems: items,
    releases: releases,
    displayType: displayType,
    isTombstoned: isTombstoned,
    citationDownloadsFetchStatus: citationDownloadsFetchStatus
  };
};
var Service = {
  fetchIsAwaitingCall: fetchIsAwaitingCall,
  stateHasFetchesInStatus: stateHasFetchesInStatus,
  calculateFetches: calculateFetches,
  calculateAppStatus: calculateAppStatus,
  applyReleasesGlobally: applyReleasesGlobally,
  applyDoiStatusReleaseGlobally: applyDoiStatusReleaseGlobally,
  calculateContextState: calculateContextState,
  useViewState: useViewState,
  getReleaseObject: getReleaseObject,
  getReleaseDoi: getReleaseDoi,
  buildCitationDownloadKey: buildCitationDownloadKey,
  hasCitationDownloadStatus: hasCitationDownloadStatus,
  handleResetCitationDownloads: handleResetCitationDownloads
};
var _default = Service;
exports.default = _default;