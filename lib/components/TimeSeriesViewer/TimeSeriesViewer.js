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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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