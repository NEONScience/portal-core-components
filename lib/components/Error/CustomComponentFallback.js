"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var CustomComponentFallback = function CustomComponentFallback(props) {
  var FallbackComponent = props.FallbackComponent;
  return /*#__PURE__*/_react.default.createElement(FallbackComponent, props);
};
var _default = CustomComponentFallback;
exports.default = _default;