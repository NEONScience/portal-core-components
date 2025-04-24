"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRouterDom = require("react-router-dom");
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _historyUtil = _interopRequireDefault(require("../../util/historyUtil"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* eslint-disable react/require-default-props */

const NeonRouter = props => {
  const {
    cleanPath,
    disableRedirect,
    children
  } = props;
  if (cleanPath !== false) {
    _historyUtil.default.cleanPath();
  }
  const renderFallthrough = () => {
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
var _default = exports.default = NeonRouter;