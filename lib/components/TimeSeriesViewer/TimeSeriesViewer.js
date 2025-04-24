"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _TimeSeriesViewerContainer = _interopRequireDefault(require("./TimeSeriesViewerContainer"));
var _TimeSeriesViewerContext = _interopRequireDefault(require("./TimeSeriesViewerContext"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const TimeSeriesViewer = props => /*#__PURE__*/_react.default.createElement(_TimeSeriesViewerContext.default.Provider, props, /*#__PURE__*/_react.default.createElement(_TimeSeriesViewerContainer.default, null));
TimeSeriesViewer.propTypes = _TimeSeriesViewerContext.default.TimeSeriesViewerPropTypes;
TimeSeriesViewer.defaultProps = _TimeSeriesViewerContext.default.Provider.defaultProps;
const WrappedTimeSeriesViewer = _NeonContext.default.getWrappedComponent(TimeSeriesViewer);
var _default = exports.default = WrappedTimeSeriesViewer;