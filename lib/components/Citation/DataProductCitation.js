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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var DataProductCitation = function DataProductCitation(props) {
  var productCode = props.productCode,
    release = props.release,
    showQuoteIcon = props.showQuoteIcon,
    disableConditional = props.disableConditional,
    disableSkeleton = props.disableSkeleton,
    showTextOnly = props.showTextOnly,
    textOnlyProps = props.textOnlyProps;
  return /*#__PURE__*/_react.default.createElement(_ComponentErrorBoundary.default, {
    onReset: function onReset() {/* noop for boundary reset */}
  }, /*#__PURE__*/_react.default.createElement(_Context.default.Provider, {
    productCode: productCode,
    release: release
  }, /*#__PURE__*/_react.default.createElement(_View.default, {
    showQuoteIcon: showQuoteIcon,
    disableConditional: disableConditional,
    disableSkeleton: disableSkeleton,
    showTextOnly: showTextOnly,
    textOnlyProps: textOnlyProps
  })));
};
DataProductCitation.defaultProps = {
  release: undefined,
  showQuoteIcon: false,
  disableConditional: false,
  disableSkeleton: false,
  showTextOnly: false,
  textOnlyProps: undefined
};
var WrappedDataProductCitation = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(DataProductCitation));
var _default = WrappedDataProductCitation;
exports.default = _default;