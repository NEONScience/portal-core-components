"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _Service = _interopRequireDefault(require("./Service"));

var _Actions = _interopRequireWildcard(require("./Actions"));

var _State = require("./State");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var reinitialize = function reinitialize(state, action) {
  return _Service.default.calculateContextState(_extends({}, (0, _cloneDeep.default)(_State.DEFAULT_STATE), {
    productCode: action.productCode,
    release: action.release,
    neonContextState: state.neonContextState
  }), state.neonContextState, action.release, action.productCode);
};

var Reducer = function Reducer(state, action) {
  var newState = _extends({}, state);

  var errorDetail = !action.error ? null : ((action.error.response || {}).error || {}).detail || action.error.message || null;

  switch (action.type) {
    case _Actions.ActionTypes.REINITIALIZE:
      // Reset the context state to default state, but keep the
      // finalized NeonContext state.
      return reinitialize(state, action);

    case _Actions.ActionTypes.ERROR:
      newState.component.status = _State.CONTEXT_STATUS.ERROR;
      newState.component.error = action.error;
      return newState;

    case _Actions.ActionTypes.SET_PRODUCT_CODE:
      return reinitialize(state, _Actions.default.setParams(action.productCode, state.release));

    case _Actions.ActionTypes.SET_RELEASE:
      return reinitialize(state, _Actions.default.setParams(state.productCode, action.release));

    case _Actions.ActionTypes.SET_PARAMS:
      return reinitialize(state, action);

    case _Actions.ActionTypes.STORE_FINALIZED_NEON_CONTEXT_STATE:
      _Service.default.applyUserRelease(newState.data.releases, _Service.default.withContextReleases(action.neonContextState));

      return _Service.default.calculateContextState(newState, action.neonContextState, newState.release, newState.productCode);

    case _Actions.ActionTypes.FETCH_PRODUCT_STARTED:
      newState.fetches.product.status = _State.FETCH_STATUS.FETCHING;
      return _Service.default.calculateAppStatus(newState);

    case _Actions.ActionTypes.FETCH_PRODUCT_FAILED:
      newState.fetches.product.status = _State.FETCH_STATUS.ERROR;
      newState.fetches.product.error = action.error;
      newState.component.error = "".concat(errorDetail, ": product code ").concat(state.productCode);
      return _Service.default.calculateAppStatus(newState);

    case _Actions.ActionTypes.FETCH_PRODUCT_SUCCEEDED:
      newState.fetches.product.status = _State.FETCH_STATUS.SUCCESS;
      newState.data.product = action.data;
      newState.data.product.releases = _Service.default.sortReleases(newState.data.product.releases);
      return _Service.default.calculateAppStatus(_Service.default.calculateFetches(_Service.default.applyReleasesGlobally(newState, newState.data.product.releases)));

    case _Actions.ActionTypes.FETCH_PRODUCT_RELEASE_STARTED:
      newState.fetches.productReleases[action.release].status = _State.FETCH_STATUS.FETCHING;
      return _Service.default.calculateAppStatus(newState);

    case _Actions.ActionTypes.FETCH_PRODUCT_RELEASE_FAILED:
      newState.fetches.productReleases[action.release].status = _State.FETCH_STATUS.ERROR;
      newState.fetches.productReleases[action.release].error = action.error; // eslint-disable-next-line max-len

      newState.component.error = "".concat(errorDetail, ": ").concat(action.release);
      return _Service.default.calculateAppStatus(newState);

    case _Actions.ActionTypes.FETCH_PRODUCT_RELEASE_SUCCEEDED:
      newState.fetches.productReleases[action.release].status = _State.FETCH_STATUS.SUCCESS;
      newState.data.productReleases[action.release] = action.data;
      return _Service.default.calculateAppStatus(newState);

    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_STARTED:
      newState.fetches.bundleParents[action.bundleParent].status = _State.FETCH_STATUS.FETCHING;
      return _Service.default.calculateAppStatus(newState);

    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_FAILED:
      newState.fetches.bundleParents[action.bundleParent].status = _State.FETCH_STATUS.ERROR;
      newState.fetches.bundleParents[action.bundleParent].error = action.error;
      newState.component.error = "".concat(errorDetail, ": bundle parent product code ").concat(action.bundleParent);
      return _Service.default.calculateAppStatus(newState);

    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_SUCCEEDED:
      newState.fetches.bundleParents[action.bundleParent].status = _State.FETCH_STATUS.SUCCESS;
      newState.data.bundleParents[action.bundleParent] = action.data; // eslint-disable-next-line max-len

      newState.data.bundleParents[action.bundleParent].releases = _Service.default.sortReleases(action.data.releases);
      return _Service.default.calculateAppStatus(_Service.default.calculateFetches( // eslint-disable-next-line max-len
      _Service.default.applyReleasesGlobally(newState, newState.data.bundleParents[action.bundleParent].releases)));

    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_STARTED:
      /* eslint-disable max-len */
      newState.fetches.bundleParentReleases[action.bundleParent][action.release].status = _State.FETCH_STATUS.FETCHING;
      /* eslint-enable max-len */

      return _Service.default.calculateAppStatus(newState);

    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_FAILED:
      /* eslint-disable max-len */
      newState.fetches.bundleParentReleases[action.bundleParent][action.release].status = _State.FETCH_STATUS.ERROR;
      newState.fetches.bundleParentReleases[action.bundleParent][action.release].error = action.error;
      newState.component.error = errorDetail;
      newState.component.error = "".concat(errorDetail, ": bundle parent product code ").concat(action.bundleParent, "; release ").concat(action.release);
      /* eslint-enable max-len */

      return _Service.default.calculateAppStatus(newState);

    case _Actions.ActionTypes.FETCH_BUNDLE_PARENT_RELEASE_SUCCEEDED:
      // eslint-disable-next-line max-len
      newState.fetches.bundleParentReleases[action.bundleParent][action.release].status = _State.FETCH_STATUS.SUCCESS;

      if (!newState.data.bundleParentReleases[action.bundleParent]) {
        newState.data.bundleParentReleases[action.bundleParent] = {};
      }

      newState.data.bundleParentReleases[action.bundleParent][action.release] = action.data;
      return _Service.default.calculateAppStatus(newState);

    default:
      return state;
  }
};

var _default = Reducer;
exports.default = _default;