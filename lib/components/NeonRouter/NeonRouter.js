"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRouterDom = require("react-router-dom");
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _historyUtil = _interopRequireDefault(require("../../util/historyUtil"));
var _jsxRuntime = require("react/jsx-runtime");
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
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.Navigate, {
      to: _NeonEnvironment.default.getRouterBaseHomePath()
    });
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.BrowserRouter, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactRouterDom.Routes, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.Route, {
        path: _NeonEnvironment.default.getRouterBaseHomePath(),
        element: children
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.Route, {
        path: "*",
        element: renderFallthrough()
      })]
    })
  });
};
var _default = exports.default = NeonRouter;