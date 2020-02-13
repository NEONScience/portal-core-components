"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewerContainer;

var _react = _interopRequireWildcard(require("react"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _TimeSeriesViewerContext = _interopRequireDefault(require("./TimeSeriesViewerContext"));

var _TimeSeriesViewerDateRange = _interopRequireDefault(require("./TimeSeriesViewerDateRange"));

var _TimeSeriesViewerVariables = _interopRequireDefault(require("./TimeSeriesViewerVariables"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var preStyle = {
  whiteSpace: 'pre-wrap',
  border: '1px solid black',
  padding: '2px',
  overflowY: 'scroll'
};

function TimeSeriesViewerContainer() {
  var _TimeSeriesViewerCont = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont2 = _slicedToArray(_TimeSeriesViewerCont, 1),
      state = _TimeSeriesViewerCont2[0]; // Slider position is not controlled in state because doing so kills mouse drag performance.
  // Use a ref to deterministiaclly set slider position when range is changed from date pickers.


  var dateRangeSliderRef = (0, _react.useRef)(null);
  return _react.default.createElement("div", null, _react.default.createElement("b", null, state.status), _react.default.createElement("br", null), _react.default.createElement(_Grid.default, {
    container: true,
    spacing: 1
  }, _react.default.createElement(_Grid.default, {
    item: true,
    xs: 4
  }, _react.default.createElement(_Typography.default, {
    variant: "h6"
  }, "Sites and Positions"), "(...)"), _react.default.createElement(_Grid.default, {
    item: true,
    xs: 4
  }, _react.default.createElement(_Typography.default, {
    variant: "h6"
  }, "Variables"), _react.default.createElement(_TimeSeriesViewerVariables.default, null)), _react.default.createElement(_Grid.default, {
    item: true,
    xs: 4
  }, _react.default.createElement(_Typography.default, {
    variant: "h6"
  }, "Date Range"), _react.default.createElement(_TimeSeriesViewerDateRange.default, {
    dateRangeSliderRef: dateRangeSliderRef
  }))), _react.default.createElement("br", null), _react.default.createElement("pre", {
    style: _extends({}, preStyle, {
      height: '25vh'
    })
  }, JSON.stringify(state.selection, null, 2)), _react.default.createElement("pre", {
    style: _extends({}, preStyle, {
      height: '55vh'
    })
  }, JSON.stringify(state, null, 2)));
}