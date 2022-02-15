"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactErrorBoundary = require("react-error-boundary");

var _ComponentFallback = _interopRequireDefault(require("./ComponentFallback"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ComponentErrorBoundary = function ComponentErrorBoundary(props) {
  var children = props.children,
      onReset = props.onReset,
      onError = props.onError;
  return /*#__PURE__*/_react.default.createElement(_reactErrorBoundary.ErrorBoundary, {
    FallbackComponent: _ComponentFallback.default,
    onReset: onReset,
    onError: onError
  }, children);
};

ComponentErrorBoundary.defaultProps = {
  onReset: function onReset() {},
  onError: function onError(error, info) {}
};
var _default = ComponentErrorBoundary;
exports.default = _default;