"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Service = _interopRequireDefault(require("./Service"));

var _Actions = _interopRequireWildcard(require("./Actions"));

var _State = require("./State");

var _ReleaseService = _interopRequireDefault(require("../../../service/ReleaseService"));

var _typeUtil = require("../../../util/typeUtil");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var reinitialize = function reinitialize(state, action) {
  var defaultState = (0, _State.getDefaultState)(); // Calculate new initialized state, keep relevant
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

var isErrorTypeAction = function isErrorTypeAction(action) {
  return 'type' in action && 'error' in action;
};

var resolveError = function resolveError(action, state) {
  if (!isErrorTypeAction(action)) {
    return null;
  }

  var result = null;

  if ((0, _typeUtil.exists)(action.error)) {
    if ((0, _typeUtil.isStringNonEmpty)(action.error)) {
      result = action.error;
    } else {
      var resolved = action.error;

      if ((0, _typeUtil.exists)(resolved.response)) {
        var resolvedResponse = resolved.response;

        if ((0, _typeUtil.exists)(resolvedResponse.error)) {
          var resolvedErrorResponse = resolvedResponse.error;

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

  var fetchProductFailedAction;
  var fetchProductReleaseFailedAction;
  var fetchBundleParentFailedAction;
  var fetchBundleParentReleaseFailedAction;

  switch (action.type) {
    case _Actions.ActionTypes.FETCH_PRODUCT_FAILED:
      fetchProductFailedAction = action;
      result = "".concat(result, ": product code ").concat(fetchProductFailedAction.productCode);
      break;

    case _Actions.ActionTypes.FETCH_PRODUCT_RELEASE_FAILED:
      fetchProductReleaseFailedAction = action;
      result = "".concat(result, ": ").concat(fetchProductReleaseFailedAction.release);
      break;

    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_FAILED:
      fetchBundleParentFailedAction = action;
      result = "".concat(result, ": bundle parent product code ") + "".concat(fetchBundleParentFailedAction.bundleParent);
      break;

    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_FAILED:
      fetchBundleParentReleaseFailedAction = action;
      result = "".concat(result, ": bundle parent product code ") + "".concat(fetchBundleParentReleaseFailedAction.bundleParent, "; ") + "release ".concat(fetchBundleParentReleaseFailedAction.release);
      break;

    case _Actions.ActionTypes.ERROR:
    default:
      break;
  }

  return result;
};

var Reducer = function Reducer(state, action) {
  var newState = _extends({}, state);

  var errorResult = null;

  if (isErrorTypeAction(action)) {
    errorResult = resolveError(action, newState);
  }

  var product;
  var release;
  var bundleParent;
  var fetchStatusState;
  var setProductCodeAction;
  var setReleaseAction;
  var fpSucceededAction;
  var fprStartedAction;
  var fprFailedAction;
  var fprSucceededAction;
  var fbpStartedAction;
  var fbpFailedAction;
  var fbpSucceededAction;
  var fbprStartedAction;
  var fbprFailedAction;
  var fbprSucceededAction;

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

    default:
      return state;
  }
};

var _default = Reducer;
exports.default = _default;