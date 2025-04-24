"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _NeonApi = _interopRequireDefault(require("../../NeonApi/NeonApi"));
var _NeonContext = _interopRequireDefault(require("../../NeonContext/NeonContext"));
var _NeonGraphQL = _interopRequireDefault(require("../../NeonGraphQL/NeonGraphQL"));
var _typeUtil = require("../../../util/typeUtil");
var _Actions = _interopRequireDefault(require("./Actions"));
var _Reducer = _interopRequireDefault(require("./Reducer"));
var _Service = _interopRequireDefault(require("./Service"));
var _State = require("./State");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /* eslint-disable react/require-default-props */
const StateContext = /*#__PURE__*/(0, _react.createContext)((0, _State.getDefaultState)());
const DispatchContext = /*#__PURE__*/(0, _react.createContext)(undefined);
const useDataProductCitationContextState = () => {
  let state = (0, _react.useContext)(StateContext);
  if (!(0, _typeUtil.exists)(state)) {
    state = (0, _State.getDefaultState)();
  }
  return state;
};
const useDataProductCitationContextDispatch = () => {
  const dispatchContext = (0, _react.useContext)(DispatchContext);
  if (!(0, _typeUtil.exists)(dispatchContext)) {
    throw new Error('Failed to initialize dispatch context');
  }
  return dispatchContext;
};
const buildProductQuery = (productCode, release) => {
  const hasRelease = (0, _typeUtil.isStringNonEmpty)(release);
  const releaseArgument = !hasRelease ? '' : ", release: \"".concat(release, "\"");
  return "query Product {\n    product(productCode: \"".concat(productCode, "\"").concat(releaseArgument, ") {\n      productCode\n      productName\n      productDescription\n      releases {\n        release\n        generationDate\n        url\n        productDoi {\n          url\n          generationDate\n        }\n      }\n    }\n  }");
};
const verifyProductResponse = response => (0, _typeUtil.exists)(response) && (0, _typeUtil.exists)(response.response) && (0, _typeUtil.exists)(response.response.data) && (0, _typeUtil.exists)(response.response.data.product);
const verifyProductReleaseDoiResponse = response => (0, _typeUtil.exists)(response);
const Provider = props => {
  const {
    productCode: propsProductCode,
    release: propsRelease,
    contextControlled,
    children
  } = props;
  const [neonContextState] = _NeonContext.default.useNeonContextState();
  const {
    isFinal: neonContextIsFinal,
    hasError: neonContextHasError
  } = neonContextState;
  const initialState = _extends({}, (0, _State.getDefaultState)(), {
    productCode: propsProductCode,
    release: propsRelease
  });
  if (neonContextIsFinal || neonContextHasError) {
    initialState.neonContextState = _extends({}, neonContextState);
  }
  const [state, dispatch] = (0, _react.useReducer)(_Reducer.default, initialState);
  const {
    component: {
      status
    },
    productCode,
    release,
    fetches
  } = state;
  (0, _react.useEffect)(() => {
    if (status !== _State.ContextStatus.INITIALIZING) {
      return;
    }
    if (!(0, _typeUtil.isStringNonEmpty)(productCode)) {
      dispatch(_Actions.default.error('Data product not found'));
    }
  }, [status, productCode]);

  // Respond to prop changes when not context controlled
  (0, _react.useEffect)(() => {
    if (contextControlled) {
      return;
    }
    if (status !== _State.ContextStatus.READY) {
      return;
    }
    if (productCode !== propsProductCode || release !== propsRelease) {
      const initProductCode = (0, _typeUtil.isStringNonEmpty)(propsProductCode) ? propsProductCode : '';
      dispatch(_Actions.default.reinitialize(initProductCode, propsRelease));
    }
  }, [contextControlled, status, productCode, propsProductCode, release, propsRelease]);
  (0, _react.useEffect)(() => {
    if (neonContextIsFinal || neonContextHasError) {
      dispatch(_Actions.default.storeFinalizedNeonContextState(neonContextState));
    }
  }, [neonContextState, neonContextIsFinal, neonContextHasError]);
  // Transform the object to a string to ensure the effect
  // fires anytime the object changes for ensure it always resolves fetches.
  const fetchesStringified = JSON.stringify(fetches);
  // Trigger any fetches that are awaiting call
  (0, _react.useEffect)(() => {
    // NeonContext is required to fetch data for the app due to bundles.
    if (!neonContextIsFinal) {
      return;
    }
    if (status !== _State.ContextStatus.HAS_FETCHES_TO_TRIGGER) {
      return;
    }
    // Base product fetch
    if (_Service.default.fetchIsAwaitingCall(fetches.product)) {
      dispatch(_Actions.default.fetchProductStarted());
      const queryProductCode = productCode;
      // eslint-disable-next-line max-len
      _NeonGraphQL.default.getGraphqlQuery(buildProductQuery(queryProductCode)).subscribe({
        next: response => {
          if (!verifyProductResponse(response)) {
            dispatch(_Actions.default.fetchProductFailed('Failed to fetch product'));
            return;
          }
          dispatch(_Actions.default.fetchProductSucceeded(response.response.data.product));
        },
        error: error => {
          dispatch(_Actions.default.fetchProductFailed(error));
        }
      });
    }
    // Product release fetches
    Object.keys(fetches.productReleases).filter(fetchRelease => _Service.default.fetchIsAwaitingCall(fetches.productReleases[fetchRelease])).forEach(fetchRelease => {
      dispatch(_Actions.default.fetchProductReleaseStarted(fetchRelease));
      const queryProductCode = productCode;
      const query = buildProductQuery(queryProductCode, fetchRelease);
      // eslint-disable-next-line max-len
      _NeonGraphQL.default.getGraphqlQuery(query).subscribe({
        next: response => {
          if (!verifyProductResponse(response)) {
            dispatch(_Actions.default.fetchProductReleaseFailed(fetchRelease, 'Failed to fetch product'));
            return;
          }
          dispatch(_Actions.default.fetchProductReleaseSucceeded(fetchRelease, response.response.data.product));
        },
        error: error => {
          dispatch(_Actions.default.fetchProductReleaseFailed(fetchRelease, error));
        }
      });
    });
    // Product release doi fetches
    Object.keys(fetches.productReleaseDois).filter(fetchRelease => _Service.default.fetchIsAwaitingCall(fetches.productReleaseDois[fetchRelease])).forEach(fetchRelease => {
      dispatch(_Actions.default.fetchProductReleaseDoiStarted(fetchRelease));
      const queryProductCode = productCode;
      // eslint-disable-next-line max-len
      _NeonApi.default.getProductDoisObservable(queryProductCode, fetchRelease).subscribe({
        next: response => {
          if (!verifyProductReleaseDoiResponse(response)) {
            dispatch(_Actions.default.fetchProductReleaseDoiFailed(fetchRelease, 'Failed to fetch product release doi status'));
            return;
          }
          dispatch(_Actions.default.fetchProductReleaseDoiSucceeded(queryProductCode, fetchRelease, response.data));
        },
        error: error => {
          dispatch(_Actions.default.fetchProductReleaseDoiFailed(fetchRelease, error));
        }
      });
    });
    // Bundle parent fetches
    Object.keys(fetches.bundleParents).filter(bundleParent => _Service.default.fetchIsAwaitingCall(fetches.bundleParents[bundleParent])).forEach(bundleParent => {
      dispatch(_Actions.default.fetchBundleParentStarted(bundleParent));
      // eslint-disable-next-line max-len
      _NeonGraphQL.default.getGraphqlQuery(buildProductQuery(bundleParent)).subscribe({
        next: response => {
          if (!verifyProductResponse(response)) {
            dispatch(_Actions.default.fetchBundleParentFailed(bundleParent, 'Failed to fetch product'));
            return;
          }
          dispatch(_Actions.default.fetchBundleParentSucceeded(bundleParent, response.response.data.product));
        },
        error: error => {
          dispatch(_Actions.default.fetchBundleParentFailed(bundleParent, error));
        }
      });
    });
    // Bundle parent release fetches
    Object.keys(fetches.bundleParentReleases).forEach(bundleParent => {
      Object.keys(fetches.bundleParentReleases[bundleParent]).filter(fetchRelease => _Service.default.fetchIsAwaitingCall(fetches.bundleParentReleases[bundleParent][fetchRelease])).forEach(fetchRelease => {
        dispatch(_Actions.default.fetchBundleParentReleaseStarted(bundleParent, fetchRelease));
        const query = buildProductQuery(bundleParent, fetchRelease);
        // eslint-disable-next-line max-len
        _NeonGraphQL.default.getGraphqlQuery(query).subscribe({
          // eslint-disable-next-line max-len
          next: response => {
            if (!verifyProductResponse(response)) {
              dispatch(_Actions.default.fetchBundleParentReleaseFailed(bundleParent, fetchRelease, 'Failed to fetch product'));
              return;
            }
            dispatch(_Actions.default.fetchBundleParentReleaseSucceeded(bundleParent, fetchRelease, response.response.data.product));
          },
          error: error => {
            dispatch(_Actions.default.fetchBundleParentReleaseFailed(bundleParent, fetchRelease, error));
          }
        });
      });
    });
  }, [status, productCode, fetches, neonContextIsFinal, fetchesStringified]);
  return /*#__PURE__*/_react.default.createElement(StateContext.Provider, {
    value: state
  }, /*#__PURE__*/_react.default.createElement(DispatchContext.Provider, {
    value: dispatch
  }, children));
};
Provider.defaultProps = {
  contextControlled: false
};
const DataProductCitationContext = {
  Provider,
  useDataProductCitationContextState,
  useDataProductCitationContextDispatch
};
var _default = exports.default = DataProductCitationContext;