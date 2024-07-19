"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const CustomComponentFallback = props => {
  const {
    FallbackComponent
  } = props;
  return /*#__PURE__*/_react.default.createElement(FallbackComponent, props);
};
var _default = exports.default = CustomComponentFallback;