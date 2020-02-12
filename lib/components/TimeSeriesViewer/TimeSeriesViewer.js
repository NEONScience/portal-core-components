"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewer;

var _react = _interopRequireDefault(require("react"));

var _TimeSeriesViewerContainer = _interopRequireDefault(require("./TimeSeriesViewerContainer"));

var _TimeSeriesViewerContext = _interopRequireDefault(require("./TimeSeriesViewerContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TimeSeriesViewer(props) {
  return _react.default.createElement(_TimeSeriesViewerContext.default.Provider, props, _react.default.createElement(_TimeSeriesViewerContainer.default, null));
}

TimeSeriesViewer.propTypes = _TimeSeriesViewerContext.default.TimeSeriesViewerPropTypes;
TimeSeriesViewer.defaultProps = _TimeSeriesViewerContext.default.Provider.defaultProps;