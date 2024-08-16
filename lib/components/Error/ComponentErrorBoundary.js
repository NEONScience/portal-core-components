"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactErrorBoundary = require("react-error-boundary");
var _ComponentFallback = _interopRequireDefault(require("./ComponentFallback"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const ComponentErrorBoundary = props => {
  const {
    children,
    onReset,
    onError,
    fallbackComponent
  } = props;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactErrorBoundary.ErrorBoundary, {
    FallbackComponent: fallbackComponent || _ComponentFallback.default,
    onReset: onReset,
    onError: onError,
    children: children
  });
};
ComponentErrorBoundary.defaultProps = {
  onReset: function () {},
  onError: (error, info) => {},
  fallbackComponent: undefined
};
var _default = exports.default = ComponentErrorBoundary;