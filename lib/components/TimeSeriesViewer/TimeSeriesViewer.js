"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _TimeSeriesViewerContainer = _interopRequireDefault(require("./TimeSeriesViewerContainer"));
var _TimeSeriesViewerContext = _interopRequireWildcard(require("./TimeSeriesViewerContext"));
var _defaultProps = require("../../util/defaultProps");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const TimeSeriesViewer = inProps => {
  const props = (0, _defaultProps.resolveProps)(_TimeSeriesViewerContext.defaultProps, inProps);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_TimeSeriesViewerContext.default.Provider, {
    ...props,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_TimeSeriesViewerContainer.default, {})
  });
};
TimeSeriesViewer.propTypes = _TimeSeriesViewerContext.default.TimeSeriesViewerPropTypes;
const WrappedTimeSeriesViewer = _NeonContext.default.getWrappedComponent(TimeSeriesViewer);
var _default = exports.default = WrappedTimeSeriesViewer;