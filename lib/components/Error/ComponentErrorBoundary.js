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
  var children = props.children;
  return /*#__PURE__*/_react.default.createElement(_reactErrorBoundary.ErrorBoundary, {
    FallbackComponent: _ComponentFallback.default
  }, children);
};

var _default = ComponentErrorBoundary;
exports.default = _default;