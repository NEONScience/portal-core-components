"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _ComponentErrorBoundary = _interopRequireDefault(require("../Error/ComponentErrorBoundary"));
var _Context = _interopRequireDefault(require("./DataProductCitation/Context"));
var _View = _interopRequireDefault(require("./DataProductCitation/View"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DataProductCitation = props => {
  const {
    productCode,
    release,
    showQuoteIcon,
    disableConditional,
    disableSkeleton,
    showTextOnly,
    textOnlyProps
  } = props;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ComponentErrorBoundary.default, {
    onReset: () => {/* noop for boundary reset */},
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Context.default.Provider, {
      productCode: productCode,
      release: release,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_View.default, {
        showQuoteIcon: showQuoteIcon,
        disableConditional: disableConditional,
        disableSkeleton: disableSkeleton,
        showTextOnly: showTextOnly,
        textOnlyProps: textOnlyProps
      })
    })
  });
};
DataProductCitation.defaultProps = {
  release: undefined,
  showQuoteIcon: false,
  disableConditional: false,
  disableSkeleton: false,
  showTextOnly: false,
  textOnlyProps: undefined
};
const WrappedDataProductCitation = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(DataProductCitation));
var _default = exports.default = WrappedDataProductCitation;