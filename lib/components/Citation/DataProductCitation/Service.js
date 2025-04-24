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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const fetchIsInStatus = (fetchObject, status) => typeof fetchObject === 'object' && fetchObject !== null && fetchObject.status === status;
const fetchIsAwaitingCall = fetchObject => fetchIsInStatus(fetchObject, _State.FetchStatus.AWAITING_CALL);
const stateHasFetchesInStatus = (state, status) => fetchIsInStatus(state.fetches.product, status) || Object.keys(state.fetches.productReleases).some(f => fetchIsInStatus(state.fetches.productReleases[f], status)) || Object.keys(state.fetches.productReleaseDois).some(f => fetchIsInStatus(state.fetches.productReleaseDois[f], status)) || Object.keys(state.fetches.bundleParents).some(f => fetchIsInStatus(state.fetches.bundleParents[f], status)) || Object.keys(state.fetches.bundleParentReleases).some(bundleParent => Object.keys(state.fetches.bundleParentReleases[bundleParent]).some(f => fetchIsInStatus(state.fetches.bundleParentReleases[bundleParent][f], status)));
const calculateFetches = state => {
  const newState = _extends({}, state);
  const {
    productCode,
    release,
    bundle: {
      parentCodes
    }
  } = state;
  const {
    releases
  } = state.data;
  if (!productCode) {
    return state;
  }
  // Find the latest non-prov release definition
  const latestRelease = (0, _typeUtil.existsNonEmpty)(releases) ? releases.find(r => !_ReleaseService.default.isLatestNonProv(r.release)) : null;
  const fetchRelease = release || (latestRelease || {}).release;
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
  (parentCodes || []).forEach(bundleParentCode => {
    if (!newState.fetches.bundleParents[bundleParentCode]) {
      newState.fetches.bundleParents[bundleParentCode] = {
        status: _State.FetchStatus.AWAITING_CALL
      };
    }
  });
  // Fetch all release-specific bundle parent products
  if (fetchRelease) {
    (parentCodes || []).forEach(parentCode => {
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
const calculateAppStatus = state => {
  const updatedState = _extends({}, state);
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
const applyReleasesGlobally = (state, releases) => {
  const updatedState = _extends({}, state);
  releases.filter(r => !Object.prototype.hasOwnProperty.call(updatedState.data.productReleases, r.release)).forEach(r => {
    updatedState.data.productReleases[r.release] = null;
  });
  releases.filter(r => updatedState.data.releases.every(existingR => r.release !== existingR.release)).forEach(r => {
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
const applyDoiStatusReleaseGlobally = (state, productCode, release, doiStatus) => {
  var _updatedState$neonCon;
  if (!(0, _typeUtil.exists)(doiStatus)) {
    return state;
  }
  const updatedState = _extends({}, state);
  // eslint-disable-next-line max-len
  const appliedDoiStatus = _BundleService.default.determineAppliedBundleRelease((((_updatedState$neonCon = updatedState.neonContextState) === null || _updatedState$neonCon === void 0 ? void 0 : _updatedState$neonCon.data) || {}).bundles, release, productCode, doiStatus);
  const transformedRelease = _ReleaseService.default.transformDoiStatusRelease(appliedDoiStatus);
  if (!(0, _typeUtil.exists)(transformedRelease)) {
    return updatedState;
  }
  const citationRelease = transformedRelease;
  const hasRelease = updatedState.data.releases.some(value => (0, _typeUtil.exists)(value) && (0, _typeUtil.isStringNonEmpty)(value.release) && (0, _typeUtil.isStringNonEmpty)(citationRelease.release) && value.release.localeCompare(citationRelease.release) === 0);
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
const calculateContextState = (newState, neonContextState, release, productCode) => {
  const isErrorState = newState.component.status === _State.ContextStatus.ERROR;
  let bundles = {
    parentCodes: [],
    doiProductCode: null
  };
  if ((0, _typeUtil.isStringNonEmpty)(productCode)) {
    bundles = _BundleService.default.determineCitationBundle(neonContextState.data.bundles, release, productCode);
  }
  const newFetchState = calculateFetches(_extends({}, newState, {
    bundle: bundles
  }));
  const newAppStatusState = calculateAppStatus(_extends({}, newFetchState, {
    neonContextState
  }));
  // If the existing app state was errored due to initialization,
  // keep the current error state.
  if (isErrorState) {
    newAppStatusState.component.status = _State.ContextStatus.ERROR;
  }
  return newAppStatusState;
};
const getReleaseObject = (releases, release) => !(0, _typeUtil.isStringNonEmpty)(release) || release === _ReleaseService.PROVISIONAL_RELEASE ? null : releases.find(r => r.release === release);
const getReleaseDoi = (releases, release) => {
  const releaseObject = getReleaseObject(releases, release);
  if (!(0, _typeUtil.exists)(releaseObject) || !(0, _typeUtil.exists)(releaseObject.productDoi) || !(0, _typeUtil.isStringNonEmpty)(releaseObject.productDoi.url)) {
    return null;
  }
  return releaseObject.productDoi.url;
};
const buildCitationDownloadKey = function (citationProduct, releaseCb, formatCb) {
  let provisionalCb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  let key = "citation-download-".concat(citationProduct.productCode);
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
const hasCitationDownloadStatus = (citationDownloadsFetchStatus, provisionalCb, productCode, statusCb) => Object.keys(citationDownloadsFetchStatus).some(k => {
  if (citationDownloadsFetchStatus[k]) {
    let shouldConsider = true;
    if (!k.includes(productCode) || !provisionalCb && k.includes(_ReleaseService.PROVISIONAL_RELEASE) || provisionalCb && !k.includes(_ReleaseService.PROVISIONAL_RELEASE)) {
      shouldConsider = false;
    }
    if (shouldConsider && citationDownloadsFetchStatus[k].status === statusCb) {
      return true;
    }
  }
  return false;
});
const handleResetCitationDownloads = (citationDownloadsFetchStatus, provisionalCb, productCode, dispatch) => {
  Object.keys(citationDownloadsFetchStatus).forEach(k => {
    if (citationDownloadsFetchStatus[k]) {
      let shouldReset = true;
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
const useViewState = (state, props) => {
  const {
    release: specifiedReleaseTag,
    bundle,
    component: {
      status
    },
    fetches: {
      citationDownloads: citationDownloadsFetchStatus
    },
    data: {
      product: baseProduct,
      productReleases,
      productReleaseDois,
      bundleParents,
      bundleParentReleases,
      releases
    },
    neonContextState: {
      data: neonContextStateData
    }
  } = state;
  const bundlesContext = neonContextStateData.bundles;
  const {
    disableConditional
  } = props;
  const hasReleases = (0, _typeUtil.existsNonEmpty)(releases);
  // Identify the latest release state.
  const latestReleaseObject = hasReleases ? releases.find(r => r.showCitation === true) : null;
  const hasLatestRelease = (0, _typeUtil.exists)(latestReleaseObject) && (0, _typeUtil.isStringNonEmpty)(latestReleaseObject.release);
  const hideLatestReleaseCitation = hasLatestRelease ? latestReleaseObject.showCitation === false : false;
  // Identify state of specified release.
  const hasSpecifiedRelease = (0, _typeUtil.isStringNonEmpty)(specifiedReleaseTag);
  const specifiedReleaseObject = hasSpecifiedRelease && hasReleases ? getReleaseObject(releases, specifiedReleaseTag) : null;
  const isSpecifiedReleaseValid = (0, _typeUtil.exists)(specifiedReleaseObject) && (0, _typeUtil.isStringNonEmpty)(specifiedReleaseObject.release);
  const isSpecifiedReleaseLatestNonProv = hasSpecifiedRelease ? _ReleaseService.default.isLatestNonProv(specifiedReleaseTag) : false;
  // Determine the release tag to render for the citation, either for the
  // currently specified release or the latest release.
  let appliedReleaseObject = null;
  let appliedRenderedReleaseTag = null;
  if (hasSpecifiedRelease) {
    if (isSpecifiedReleaseValid) {
      appliedReleaseObject = specifiedReleaseObject;
      appliedRenderedReleaseTag = specifiedReleaseObject.release;
    }
  } else if (hasLatestRelease) {
    appliedReleaseObject = latestReleaseObject;
    appliedRenderedReleaseTag = latestReleaseObject.release;
  }
  const hasAppliedRelease = (0, _typeUtil.exists)(appliedReleaseObject);
  const isAppliedReleaseLatestNonProv = (0, _typeUtil.isStringNonEmpty)(appliedRenderedReleaseTag) ? _ReleaseService.default.isLatestNonProv(appliedRenderedReleaseTag) : false;
  let appliedReleaseDoi = null;
  if (hasAppliedRelease && !isAppliedReleaseLatestNonProv) {
    const aro = appliedReleaseObject;
    if ((0, _typeUtil.exists)(aro.productDoi) && (0, _typeUtil.isStringNonEmpty)(aro.productDoi.url)) {
      appliedReleaseDoi = aro.productDoi.url;
    }
  }
  const hasAppliedReleaseDoi = (0, _typeUtil.isStringNonEmpty)(appliedReleaseDoi);
  const hideAppliedReleaseCitation = (0, _typeUtil.exists)(appliedReleaseObject) && appliedReleaseObject.showCitation === false;
  // Determine tombstoned state for entire citation
  const hasProductReleaseDois = (0, _typeUtil.exists)(productReleaseDois) && (0, _typeUtil.isStringNonEmpty)(appliedRenderedReleaseTag) && (0, _typeUtil.exists)(productReleaseDois[appliedRenderedReleaseTag]);
  let dataProductDoiStatus = null;
  let isTombstoned = false;
  const determineDoiStatusTombstone = dpds => {
    let tsResult = false;
    if (!Array.isArray(dpds)) {
      // eslint-disable-next-line max-len
      const doiStatusType = dpds === null || dpds === void 0 ? void 0 : dpds.status;
      tsResult = (0, _typeUtil.exists)(doiStatusType) && doiStatusType === _neonApi.DoiStatusType.TOMBSTONED;
    } else {
      tsResult = dpds.every(ds => {
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
  const hasBundleCode = (0, _typeUtil.existsNonEmpty)(bundle.parentCodes) && ((0, _typeUtil.isStringNonEmpty)(bundle.doiProductCode) || Array.isArray(bundle.doiProductCode) && (0, _typeUtil.existsNonEmpty)(bundle.doiProductCode));
  // Builds a citation item based on current state
  // of release, specified bundle code when applicable.
  const buildCitationItem = (bundleParentCode, bundleDpds) => {
    const item = {
      releaseObject: null,
      doiUrl: null,
      citableBaseProduct: null,
      citableReleaseProduct: null,
      bundleParentCode: null,
      isTombstoned: false
    };
    let bundleProduct = null;
    if (hasBundleCode && (0, _typeUtil.isStringNonEmpty)(bundleParentCode) && (0, _typeUtil.exists)(bundleParents[bundleParentCode])) {
      bundleProduct = bundleParents[bundleParentCode];
    }
    const hasBundleProduct = (0, _typeUtil.exists)(bundleProduct);
    // Determines if the latest release has a bundle defined for this product.
    let hasLatestReleaseBundle = false;
    if (hasLatestRelease && (0, _typeUtil.exists)(baseProduct)) {
      hasLatestReleaseBundle = _BundleService.default.isProductInBundle(bundlesContext, latestReleaseObject.release, baseProduct.productCode);
    }
    // Determine if the bundle product has data for the specified release.
    let isBundleProductInRelease = true;
    if (hasBundleProduct && hasSpecifiedRelease && !isAppliedReleaseLatestNonProv) {
      var _bundleProduct;
      const bundleHasRelease = (_bundleProduct = bundleProduct) === null || _bundleProduct === void 0 ? void 0 : _bundleProduct.releases.find(r => r.release === appliedRenderedReleaseTag);
      isBundleProductInRelease = (0, _typeUtil.exists)(bundleHasRelease);
    }
    let itemReleaseObject = appliedReleaseObject;
    let itemDoiUrl = appliedReleaseDoi;
    let itemIsTombstoned = false;
    // Determine if the citable product should be the bundle container product
    // or the currently specified product.
    // eslint-disable-next-line max-len
    const citableBaseProduct = hasBundleProduct && isBundleProductInRelease ? bundleProduct : baseProduct;
    // Determine the product to use for citing within the applicable release
    // and within the context of bundles.
    let citableReleaseProduct = null;
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
          const bpr = bundleParentReleases[bundleParentCode];
          if ((0, _typeUtil.exists)(bpr)) {
            const product = bpr[appliedRenderedReleaseTag];
            if ((0, _typeUtil.exists)(product)) {
              citableReleaseProduct = product;
            }
          }
        } else {
          const product = productReleases[appliedRenderedReleaseTag];
          if ((0, _typeUtil.exists)(product)) {
            citableReleaseProduct = product;
          }
        }
      }
    }
    // Determine release property states from current bundle.
    if (hasBundleCode && (0, _typeUtil.isStringNonEmpty)(bundleParentCode) && (0, _typeUtil.exists)(bundleDpds)) {
      const bundleCitationRelease = _ReleaseService.default.transformDoiStatusRelease(bundleDpds);
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
  const items = [];
  if (!hasBundleCode) {
    const nonBundleItem = buildCitationItem();
    items.push(nonBundleItem);
  } else if ((0, _typeUtil.isStringNonEmpty)(bundle.doiProductCode)) {
    const bundleParentCode = bundle.doiProductCode;
    const singleBundleItem = buildCitationItem(bundleParentCode);
    items.push(singleBundleItem);
  } else if (Array.isArray(bundle.doiProductCode) && (0, _typeUtil.existsNonEmpty)(bundle.doiProductCode)) {
    const bundleParentCodes = bundle.doiProductCode;
    if (hasProductReleaseDois && !Array.isArray(dataProductDoiStatus)) {
      const bundleParentCode = bundle.doiProductCode[0];
      const singleBundleItem = buildCitationItem(bundleParentCode);
      items.push(singleBundleItem);
    } else {
      bundleParentCodes.forEach(bundleParentCode => {
        let bundleDpds;
        if (hasProductReleaseDois && Array.isArray(dataProductDoiStatus)) {
          bundleDpds = dataProductDoiStatus.find(ds => {
            if (!(0, _typeUtil.exists)(ds)) return false;
            return ds.productCode.localeCompare(bundleParentCode) === 0;
          });
        }
        // If we could not identify a matching DOI record for the bundle parent
        // code, it is an invalid state, do not capture.
        // This should not occur if bundles and DOIs are properly
        // configured and data come across properly in API calls.
        if ((0, _typeUtil.exists)(bundleDpds)) {
          const bundleItem = buildCitationItem(bundleParentCode, bundleDpds);
          items.push(bundleItem);
        } else if (hasSpecifiedRelease && isAppliedReleaseLatestNonProv) {
          const bundleItem = buildCitationItem(bundleParentCode);
          items.push(bundleItem);
        }
      });
    }
  }
  // Determine if there's a valid product to generate the citation with.
  const hasValidProduct = items.some(item => (0, _typeUtil.exists)(item.citableBaseProduct));
  const hasValidReleaseProduct = items.some(item => (0, _typeUtil.exists)(item.citableReleaseProduct));
  // Verify identified release product is in the applied release.
  let isCitableReleaseProductInRelease = false;
  // If looking at latest release non provisional, consider in release.
  if (isAppliedReleaseLatestNonProv) {
    isCitableReleaseProductInRelease = true;
  } else if (hasValidReleaseProduct) {
    const productHasRelease = items.some(item => {
      var _item$citableReleaseP;
      const dpr = (_item$citableReleaseP = item.citableReleaseProduct) === null || _item$citableReleaseP === void 0 ? void 0 : _item$citableReleaseP.releases.find(r => r.release === appliedRenderedReleaseTag);
      return (0, _typeUtil.exists)(dpr) || item.isTombstoned;
    });
    isCitableReleaseProductInRelease = productHasRelease || isTombstoned;
  }
  // Determine the overall citation display status.
  let appliedStatus = status;
  let displayType = _ViewState.DisplayType.CONDITIONAL;
  const isReady = status === _State.ContextStatus.READY;
  const isError = status === _State.ContextStatus.ERROR;
  const setErrorNotAvailable = () => {
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
    releases,
    displayType,
    isTombstoned,
    citationDownloadsFetchStatus
  };
};
const Service = {
  fetchIsAwaitingCall,
  stateHasFetchesInStatus,
  calculateFetches,
  calculateAppStatus,
  applyReleasesGlobally,
  applyDoiStatusReleaseGlobally,
  calculateContextState,
  useViewState,
  getReleaseObject,
  getReleaseDoi,
  buildCitationDownloadKey,
  hasCitationDownloadStatus,
  handleResetCitationDownloads
};
var _default = exports.default = Service;