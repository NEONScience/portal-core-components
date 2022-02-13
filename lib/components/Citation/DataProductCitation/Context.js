"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _NeonContext = _interopRequireDefault(require("../../NeonContext/NeonContext"));

var _NeonGraphQL = _interopRequireDefault(require("../../NeonGraphQL/NeonGraphQL"));

var _Actions = _interopRequireDefault(require("./Actions"));

var _Reducer = _interopRequireDefault(require("./Reducer"));

var _Service = _interopRequireDefault(require("./Service"));

var _State = require("./State");

var _typeUtil = require("../../../util/typeUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var StateContext = /*#__PURE__*/(0, _react.createContext)((0, _State.getDefaultState)());
var DispatchContext = /*#__PURE__*/(0, _react.createContext)(undefined);

var useDataProductCitationContextState = function useDataProductCitationContextState() {
  var state = (0, _react.useContext)(StateContext);

  if (!(0, _typeUtil.exists)(state)) {
    state = (0, _State.getDefaultState)();
  }

  return state;
};

var useDataProductCitationContextDispatch = function useDataProductCitationContextDispatch() {
  var dispatchContext = (0, _react.useContext)(DispatchContext);

  if (!(0, _typeUtil.exists)(dispatchContext)) {
    throw new Error('Failed to initialize dispatch context');
  }

  return dispatchContext;
};

var buildProductQuery = function buildProductQuery(productCode, release) {
  var hasRelease = (0, _typeUtil.isStringNonEmpty)(release);
  var releaseArgument = !hasRelease ? '' : ", release: \"".concat(release, "\"");
  return "query Product {\n    product(productCode: \"".concat(productCode, "\"").concat(releaseArgument, ") {\n      productCode\n      productName\n      productDescription\n      releases {\n        release\n        generationDate\n        url\n        productDoi {\n          url\n          generationDate\n        }\n      }\n    }\n  }");
};

var verifyProductResponse = function verifyProductResponse(response) {
  return (0, _typeUtil.exists)(response) && (0, _typeUtil.exists)(response.response) && (0, _typeUtil.exists)(response.response.data) && (0, _typeUtil.exists)(response.response.data.product);
};

var Provider = function Provider(props) {
  var propsProductCode = props.productCode,
      propsRelease = props.release,
      contextControlled = props.contextControlled,
      children = props.children;

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      neonContextState = _NeonContext$useNeonC2[0];

  var neonContextIsFinal = neonContextState.isFinal,
      neonContextHasError = neonContextState.hasError;

  var initialState = _extends({}, (0, _State.getDefaultState)(), {
    productCode: propsProductCode,
    release: propsRelease
  });

  if (neonContextIsFinal && !neonContextHasError) {
    initialState.neonContextState = _extends({}, neonContextState);
  }

  var _useReducer = (0, _react.useReducer)(_Reducer.default, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var status = state.component.status,
      productCode = state.productCode,
      release = state.release,
      fetches = state.fetches;
  (0, _react.useEffect)(function () {
    if (status !== _State.ContextStatus.INITIALIZING) {
      return;
    }

    if (!(0, _typeUtil.isStringNonEmpty)(productCode)) {
      dispatch(_Actions.default.error('Data product not found'));
    }
  }, [status, productCode]); // Respond to prop changes when not context controlled

  (0, _react.useEffect)(function () {
    if (contextControlled) {
      return;
    }

    if (status !== _State.ContextStatus.READY) {
      return;
    }

    if (productCode !== propsProductCode || release !== propsRelease) {
      var initProductCode = (0, _typeUtil.isStringNonEmpty)(propsProductCode) ? propsProductCode : '';
      dispatch(_Actions.default.reinitialize(initProductCode, propsRelease));
    }
  }, [contextControlled, status, productCode, propsProductCode, release, propsRelease]);
  (0, _react.useEffect)(function () {
    if (neonContextIsFinal && !neonContextHasError) {
      dispatch(_Actions.default.storeFinalizedNeonContextState(neonContextState));
    }
  }, [neonContextState, neonContextIsFinal, neonContextHasError]); // Trigger any fetches that are awaiting call

  (0, _react.useEffect)(function () {
    // NeonContext is required to fetch data for the app due to bundles.
    if (!neonContextIsFinal) {
      return;
    }

    if (status !== _State.ContextStatus.HAS_FETCHES_TO_TRIGGER) {
      return;
    } // Base product fetch


    if (_Service.default.fetchIsAwaitingCall(fetches.product)) {
      dispatch(_Actions.default.fetchProductStarted());
      var queryProductCode = productCode;

      _NeonGraphQL.default.getGraphqlQuery(buildProductQuery(queryProductCode)).subscribe(function (response) {
        if (!verifyProductResponse(response)) {
          dispatch(_Actions.default.fetchProductFailed('Failed to fetch product'));
          return;
        }

        dispatch(_Actions.default.fetchProductSucceeded(response.response.data.product));
      }, function (error) {
        dispatch(_Actions.default.fetchProductFailed(error));
      });
    } // Product release fetches


    Object.keys(fetches.productReleases).filter(function (fetchRelease) {
      return _Service.default.fetchIsAwaitingCall(fetches.productReleases[fetchRelease]);
    }).forEach(function (fetchRelease) {
      dispatch(_Actions.default.fetchProductReleaseStarted(fetchRelease));
      var queryProductCode = productCode;
      var query = buildProductQuery(queryProductCode, fetchRelease);

      _NeonGraphQL.default.getGraphqlQuery(query).subscribe(function (response) {
        if (!verifyProductResponse(response)) {
          dispatch(_Actions.default.fetchProductReleaseFailed(fetchRelease, 'Failed to fetch product'));
          return;
        }

        dispatch(_Actions.default.fetchProductReleaseSucceeded(fetchRelease, response.response.data.product));
      }, function (error) {
        dispatch(_Actions.default.fetchProductReleaseFailed(fetchRelease, error));
      });
    }); // Bundle parent fetches

    Object.keys(fetches.bundleParents).filter(function (bundleParent) {
      return _Service.default.fetchIsAwaitingCall(fetches.bundleParents[bundleParent]);
    }).forEach(function (bundleParent) {
      dispatch(_Actions.default.fetchBundleParentStarted(bundleParent));

      _NeonGraphQL.default.getGraphqlQuery(buildProductQuery(bundleParent)).subscribe(function (response) {
        if (!verifyProductResponse(response)) {
          dispatch(_Actions.default.fetchBundleParentFailed(bundleParent, 'Failed to fetch product'));
          return;
        }

        dispatch(_Actions.default.fetchBundleParentSucceeded(bundleParent, response.response.data.product));
      }, function (error) {
        dispatch(_Actions.default.fetchBundleParentFailed(bundleParent, error));
      });
    }); // Bundle parent release fetches

    Object.keys(fetches.bundleParentReleases).forEach(function (bundleParent) {
      Object.keys(fetches.bundleParentReleases[bundleParent]).filter(function (fetchRelease) {
        return _Service.default.fetchIsAwaitingCall(fetches.bundleParentReleases[bundleParent][fetchRelease]);
      }).forEach(function (fetchRelease) {
        dispatch(_Actions.default.fetchBundleParentReleaseStarted(bundleParent, fetchRelease));
        var query = buildProductQuery(bundleParent, fetchRelease);

        _NeonGraphQL.default.getGraphqlQuery(query).subscribe(function (response) {
          if (!verifyProductResponse(response)) {
            dispatch(_Actions.default.fetchBundleParentReleaseFailed(bundleParent, fetchRelease, 'Failed to fetch product'));
            return;
          }

          dispatch(_Actions.default.fetchBundleParentReleaseSucceeded(bundleParent, fetchRelease, response.response.data.product));
        }, function (error) {
          dispatch(_Actions.default.fetchBundleParentReleaseFailed(bundleParent, fetchRelease, error));
        });
      });
    });
  }, [status, productCode, fetches, neonContextIsFinal]);
  return /*#__PURE__*/_react.default.createElement(StateContext.Provider, {
    value: state
  }, /*#__PURE__*/_react.default.createElement(DispatchContext.Provider, {
    value: dispatch
  }, children));
};

Provider.defaultProps = {
  contextControlled: false
};
var DataProductCitationContext = {
  Provider: Provider,
  useDataProductCitationContextState: useDataProductCitationContextState,
  useDataProductCitationContextDispatch: useDataProductCitationContextDispatch
};
var _default = DataProductCitationContext;
exports.default = _default;