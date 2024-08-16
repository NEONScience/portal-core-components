"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _TimeSeriesViewerContainer = _interopRequireDefault(require("./TimeSeriesViewerContainer"));
var _TimeSeriesViewerContext = _interopRequireDefault(require("./TimeSeriesViewerContext"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const TimeSeriesViewer = props => /*#__PURE__*/(0, _jsxRuntime.jsx)(_TimeSeriesViewerContext.default.Provider, {
  ...props,
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_TimeSeriesViewerContainer.default, {})
});
TimeSeriesViewer.propTypes = _TimeSeriesViewerContext.default.TimeSeriesViewerPropTypes;
TimeSeriesViewer.defaultProps = _TimeSeriesViewerContext.default.Provider.defaultProps;
const WrappedTimeSeriesViewer = _NeonContext.default.getWrappedComponent(TimeSeriesViewer);
var _default = exports.default = WrappedTimeSeriesViewer;