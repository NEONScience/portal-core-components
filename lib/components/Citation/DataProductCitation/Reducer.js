"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ReleaseService = _interopRequireDefault(require("../../../service/ReleaseService"));
var _typeUtil = require("../../../util/typeUtil");
var _Service = _interopRequireDefault(require("./Service"));
var _Actions = _interopRequireWildcard(require("./Actions"));
var _State = require("./State");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const reinitialize = (state, action) => {
  const defaultState = (0, _State.getDefaultState)();
  // Calculate new initialized state, keep relevant
  // computed values from context.
  return _Service.default.calculateContextState(_extends({}, defaultState, {
    productCode: action.productCode,
    release: action.release,
    neonContextState: state.neonContextState,
    data: _extends({}, defaultState.data, {
      releases: _ReleaseService.default.applyUserReleases(state.neonContextState, defaultState.data.releases)
    })
  }), state.neonContextState, action.release, action.productCode);
};
const isErrorTypeAction = action => 'type' in action && 'error' in action;
const resolveError = (action, state) => {
  if (!isErrorTypeAction(action)) {
    return null;
  }
  let result = null;
  if ((0, _typeUtil.exists)(action.error)) {
    if ((0, _typeUtil.isStringNonEmpty)(action.error)) {
      result = action.error;
    } else {
      const resolved = action.error;
      if ((0, _typeUtil.exists)(resolved.response)) {
        const resolvedResponse = resolved.response;
        if ((0, _typeUtil.exists)(resolvedResponse.error)) {
          const resolvedErrorResponse = resolvedResponse.error;
          if ((0, _typeUtil.exists)(resolvedErrorResponse.detail)) {
            result = resolvedErrorResponse.detail;
          }
        }
      } else if ((0, _typeUtil.isStringNonEmpty)(resolved.message)) {
        result = resolved.message;
      } else {
        result = action.error;
      }
    }
  }
  let fetchProductFailedAction;
  let fetchProductReleaseFailedAction;
  let fetchProductReleaseDoiFailedAction;
  let fetchBundleParentFailedAction;
  let fetchBundleParentReleaseFailedAction;
  let fetchCitationDownloadFailedAction;
  switch (action.type) {
    case _Actions.ActionTypes.FETCH_PRODUCT_FAILED:
      fetchProductFailedAction = action;
      result = "".concat(result, ": product code ").concat(fetchProductFailedAction.productCode);
      break;
    case _Actions.ActionTypes.FETCH_PRODUCT_RELEASE_FAILED:
      fetchProductReleaseFailedAction = action;
      result = "".concat(result, ": ").concat(fetchProductReleaseFailedAction.release);
      break;
    case _Actions.ActionTypes.FETCH_PRODUCT_RELEASE_DOI_FAILED:
      fetchProductReleaseDoiFailedAction = action;
      result = "".concat(result, ": ").concat(fetchProductReleaseDoiFailedAction.release);
      break;
    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_FAILED:
      fetchBundleParentFailedAction = action;
      result = "".concat(result, ": bundle parent product code ") + "".concat(fetchBundleParentFailedAction.bundleParent);
      break;
    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_FAILED:
      fetchBundleParentReleaseFailedAction = action;
      result = "".concat(result, ": bundle parent product code ") + "".concat(fetchBundleParentReleaseFailedAction.bundleParent, "; ") + "release ".concat(fetchBundleParentReleaseFailedAction.release);
      break;
    case _Actions.ActionTypes.FETCH_CITATION_DOWNLOAD_FAILED:
      fetchCitationDownloadFailedAction = action;
      result = "".concat(result, ": citation download key: ").concat(fetchCitationDownloadFailedAction.key);
      break;
    case _Actions.ActionTypes.ERROR:
    default:
      break;
  }
  return result;
};
const Reducer = (state, action) => {
  const newState = _extends({}, state);
  let errorResult = null;
  if (isErrorTypeAction(action)) {
    errorResult = resolveError(action, newState);
  }
  let product;
  let productReleaseDoiStatus;
  let release;
  let bundleParent;
  let fetchStatusState;
  let setProductCodeAction;
  let setReleaseAction;
  let fpSucceededAction;
  let fprStartedAction;
  let fprFailedAction;
  let fprSucceededAction;
  let fprdStartedAction;
  let fprdFailedAction;
  let fprdSucceededAction;
  let fbpStartedAction;
  let fbpFailedAction;
  let fbpSucceededAction;
  let fbprStartedAction;
  let fbprFailedAction;
  let fbprSucceededAction;
  let fcdStartedAction;
  let fcdFailedAction;
  let fcdSucceededAction;
  let fcdResetAction;
  switch (action.type) {
    case _Actions.ActionTypes.REINITIALIZE:
      // Reset the context state to default state, but keep the
      // finalized NeonContext state.
      return reinitialize(state, action);
    case _Actions.ActionTypes.ERROR:
      newState.component.status = _State.ContextStatus.ERROR;
      newState.component.error = errorResult;
      return newState;
    case _Actions.ActionTypes.SET_PRODUCT_CODE:
      setProductCodeAction = action;
      return reinitialize(state, _Actions.default.setParams(setProductCodeAction.productCode, state.release));
    case _Actions.ActionTypes.SET_RELEASE:
      setReleaseAction = action;
      return reinitialize(state, _Actions.default.setParams(state.productCode, setReleaseAction.release));
    case _Actions.ActionTypes.SET_PARAMS:
      return reinitialize(state, action);
    case _Actions.ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE:
      newState.data.releases = _ReleaseService.default.applyUserReleases(action.neonContextState, newState.data.releases);
      return _Service.default.calculateContextState(newState, action.neonContextState, newState.release, newState.productCode);
    case _Actions.ActionTypes.FETCH_PRODUCT_STARTED:
      if ((0, _typeUtil.exists)(newState.fetches.product)) {
        newState.fetches.product.status = _State.FetchStatus.FETCHING;
      }
      return _Service.default.calculateAppStatus(newState);
    case _Actions.ActionTypes.FETCH_PRODUCT_FAILED:
      if (!(0, _typeUtil.exists)(newState.fetches.product)) {
        newState.fetches.product = {
          status: _State.FetchStatus.AWAITING_CALL
        };
      }
      fetchStatusState = newState.fetches.product;
      fetchStatusState.status = _State.FetchStatus.ERROR;
      fetchStatusState.error = errorResult;
      newState.component.error = errorResult;
      return _Service.default.calculateAppStatus(newState);
    case _Actions.ActionTypes.FETCH_PRODUCT_SUCCEEDED:
      if (!(0, _typeUtil.exists)(newState.fetches.product)) {
        newState.fetches.product = {
          status: _State.FetchStatus.AWAITING_CALL
        };
      }
      fetchStatusState = newState.fetches.product;
      fetchStatusState.status = _State.FetchStatus.SUCCESS;
      fpSucceededAction = action;
      newState.data.product = fpSucceededAction.data;
      newState.data.product.releases = _ReleaseService.default.sortReleases(newState.data.product.releases);
      return _Service.default.calculateAppStatus(_Service.default.calculateFetches(_Service.default.applyReleasesGlobally(newState, newState.data.product.releases)));
    case _Actions.ActionTypes.FETCH_PRODUCT_RELEASE_STARTED:
      fprStartedAction = action;
      release = fprStartedAction.release;
      newState.fetches.productReleases[release].status = _State.FetchStatus.FETCHING;
      return _Service.default.calculateAppStatus(newState);
    case _Actions.ActionTypes.FETCH_PRODUCT_RELEASE_FAILED:
      fprFailedAction = action;
      release = fprFailedAction.release;
      newState.fetches.productReleases[release].status = _State.FetchStatus.ERROR;
      newState.fetches.productReleases[release].error = errorResult;
      newState.component.error = errorResult;
      return _Service.default.calculateAppStatus(newState);
    case _Actions.ActionTypes.FETCH_PRODUCT_RELEASE_SUCCEEDED:
      fprSucceededAction = action;
      release = fprSucceededAction.release;
      product = fprSucceededAction.data;
      newState.fetches.productReleases[release].status = _State.FetchStatus.SUCCESS;
      newState.data.productReleases[release] = product;
      return _Service.default.calculateAppStatus(newState);
    case _Actions.ActionTypes.FETCH_PRODUCT_RELEASE_DOI_STARTED:
      fprdStartedAction = action;
      release = fprdStartedAction.release;
      newState.fetches.productReleaseDois[release].status = _State.FetchStatus.FETCHING;
      return _Service.default.calculateAppStatus(newState);
    case _Actions.ActionTypes.FETCH_PRODUCT_RELEASE_DOI_FAILED:
      fprdFailedAction = action;
      release = fprdFailedAction.release;
      newState.fetches.productReleaseDois[release].status = _State.FetchStatus.ERROR;
      newState.fetches.productReleaseDois[release].error = errorResult;
      newState.component.error = errorResult;
      return _Service.default.calculateAppStatus(newState);
    case _Actions.ActionTypes.FETCH_PRODUCT_RELEASE_DOI_SUCCEEDED:
      fprdSucceededAction = action;
      release = fprdSucceededAction.release;
      productReleaseDoiStatus = fprdSucceededAction.data;
      newState.fetches.productReleaseDois[release].status = _State.FetchStatus.SUCCESS;
      if (!(0, _typeUtil.exists)(productReleaseDoiStatus)) {
        newState.data.productReleaseDois[release] = null;
      } else if (Array.isArray(productReleaseDoiStatus)) {
        if ((0, _typeUtil.existsNonEmpty)(productReleaseDoiStatus)) {
          // eslint-disable-next-line max-len
          newState.data.productReleaseDois[release] = productReleaseDoiStatus.filter(dpds => (0, _typeUtil.exists)(dpds) && (0, _typeUtil.exists)(dpds.status));
        } else {
          newState.data.productReleaseDois[release] = null;
        }
      } else if ((0, _typeUtil.exists)(productReleaseDoiStatus.status)) {
        newState.data.productReleaseDois[release] = productReleaseDoiStatus;
      } else {
        newState.data.productReleaseDois[release] = null;
      }
      return _Service.default.calculateAppStatus(_Service.default.applyDoiStatusReleaseGlobally(newState, fprdSucceededAction.productCode, release, newState.data.productReleaseDois[release]));
    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_STARTED:
      fbpStartedAction = action;
      bundleParent = fbpStartedAction.bundleParent;
      newState.fetches.bundleParents[bundleParent].status = _State.FetchStatus.FETCHING;
      return _Service.default.calculateAppStatus(newState);
    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_FAILED:
      fbpFailedAction = action;
      bundleParent = fbpFailedAction.bundleParent;
      newState.fetches.bundleParents[bundleParent].status = _State.FetchStatus.ERROR;
      newState.fetches.bundleParents[bundleParent].error = errorResult;
      newState.component.error = errorResult;
      return _Service.default.calculateAppStatus(newState);
    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_SUCCEEDED:
      fbpSucceededAction = action;
      bundleParent = fbpSucceededAction.bundleParent;
      product = fbpSucceededAction.data;
      newState.fetches.bundleParents[bundleParent].status = _State.FetchStatus.SUCCESS;
      newState.data.bundleParents[bundleParent] = product;
      newState.data.bundleParents[bundleParent].releases = _ReleaseService.default.sortReleases(product.releases);
      return _Service.default.calculateAppStatus(_Service.default.calculateFetches(_Service.default.applyReleasesGlobally(newState, newState.data.bundleParents[bundleParent].releases)));
    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_STARTED:
      fbprStartedAction = action;
      bundleParent = fbprStartedAction.bundleParent;
      release = fbprStartedAction.release;
      newState.fetches.bundleParentReleases[bundleParent][release].status = _State.FetchStatus.FETCHING;
      return _Service.default.calculateAppStatus(newState);
    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_FAILED:
      fbprFailedAction = action;
      bundleParent = fbprFailedAction.bundleParent;
      release = fbprFailedAction.release;
      newState.fetches.bundleParentReleases[bundleParent][release].status = _State.FetchStatus.ERROR;
      newState.fetches.bundleParentReleases[bundleParent][release].error = errorResult;
      newState.component.error = errorResult;
      return _Service.default.calculateAppStatus(newState);
    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED:
      fbprSucceededAction = action;
      bundleParent = fbprSucceededAction.bundleParent;
      release = fbprSucceededAction.release;
      product = fbprSucceededAction.data;
      newState.fetches.bundleParentReleases[bundleParent][release].status = _State.FetchStatus.SUCCESS;
      if (!(0, _typeUtil.exists)(newState.data.bundleParentReleases[bundleParent])) {
        newState.data.bundleParentReleases[bundleParent] = {};
      }
      newState.data.bundleParentReleases[bundleParent][release] = product;
      return _Service.default.calculateAppStatus(newState);
    case _Actions.ActionTypes.FETCH_CITATION_DOWNLOAD_STARTED:
      fcdStartedAction = action;
      newState.fetches.citationDownloads[fcdStartedAction.key] = {
        status: _State.FetchStatus.FETCHING
      };
      return newState;
    case _Actions.ActionTypes.FETCH_CITATION_DOWNLOAD_FAILED:
      fcdFailedAction = action;
      newState.fetches.citationDownloads[fcdFailedAction.key] = {
        status: _State.FetchStatus.ERROR,
        error: errorResult
      };
      return newState;
    case _Actions.ActionTypes.FETCH_CITATION_DOWNLOAD_SUCCEEDED:
      fcdSucceededAction = action;
      newState.fetches.citationDownloads[fcdSucceededAction.key] = {
        status: _State.FetchStatus.SUCCESS
      };
      return newState;
    case _Actions.ActionTypes.FETCH_CITATION_DOWNLOAD_RESET:
      fcdResetAction = action;
      newState.fetches.citationDownloads[fcdResetAction.key] = {
        status: _State.FetchStatus.IDLE
      };
      return newState;
    default:
      return state;
  }
};
var _default = exports.default = Reducer;