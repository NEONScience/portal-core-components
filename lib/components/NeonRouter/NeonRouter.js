"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRouterDom = require("react-router-dom");
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _historyUtil = _interopRequireDefault(require("../../util/historyUtil"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable react/require-default-props */

var NeonRouter = function NeonRouter(props) {
  var cleanPath = props.cleanPath,
    disableRedirect = props.disableRedirect,
    children = props.children;
  if (cleanPath !== false) {
    _historyUtil.default.cleanPath();
  }
  var renderFallthrough = function renderFallthrough() {
    if (disableRedirect === true) {
      return children;
    }
    return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Navigate, {
      to: _NeonEnvironment.default.getRouterBaseHomePath()
    });
  };
  return /*#__PURE__*/_react.default.createElement(_reactRouterDom.BrowserRouter, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Routes, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: _NeonEnvironment.default.getRouterBaseHomePath(),
    element: children
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: "*",
    element: renderFallthrough()
  })));
};
var _default = NeonRouter;
exports.default = _default;