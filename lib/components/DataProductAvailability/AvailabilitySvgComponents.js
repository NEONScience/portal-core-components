"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SvgDefs = exports.JsxCell = exports.CELL_ATTRS = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AvailabilityUtils = require("./AvailabilityUtils");

var _Theme = _interopRequireWildcard(require("../Theme/Theme"));

var _excluded = ["nudge"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
   SVG_DEFS
*/
var DiagLinesPattern = function DiagLinesPattern(props) {
  var id = props.id,
      color = props.color,
      secondaryColor = props.secondaryColor;
  var width = _AvailabilityUtils.SVG.CELL_WIDTH;
  var height = _AvailabilityUtils.SVG.CELL_HEIGHT / 4;
  return /*#__PURE__*/_react.default.createElement("pattern", {
    id: id,
    width: width,
    height: height,
    patternUnits: "userSpaceOnUse",
    patternTransform: "rotate(45)"
  }, /*#__PURE__*/_react.default.createElement("rect", {
    x: 0,
    y: 0,
    width: width,
    height: height / 2 - 0.25,
    fill: color
  }), /*#__PURE__*/_react.default.createElement("rect", {
    x: 0,
    y: height / 2 - 0.25,
    width: width,
    height: height / 2 + 0.25,
    fill: secondaryColor
  }));
};

DiagLinesPattern.propTypes = {
  id: _propTypes.default.string.isRequired,
  color: _propTypes.default.string.isRequired,
  secondaryColor: _propTypes.default.string
};
DiagLinesPattern.defaultProps = {
  secondaryColor: '#ffffff'
};

var HalfAndHalfPattern = function HalfAndHalfPattern(props) {
  var id = props.id,
      color = props.color,
      secondaryColor = props.secondaryColor;
  return /*#__PURE__*/_react.default.createElement("pattern", {
    id: id,
    width: 1,
    height: 1,
    patternContentUnits: "objectBoundingBox"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M 0 0 V 1 L 1 0 Z",
    fill: color
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M 1 1 V 0 L 0 1 Z",
    fill: secondaryColor
  }));
};

HalfAndHalfPattern.propTypes = {
  id: _propTypes.default.string.isRequired,
  color: _propTypes.default.string.isRequired,
  secondaryColor: _propTypes.default.string
};
HalfAndHalfPattern.defaultProps = {
  secondaryColor: '#ffffff'
};

var SvgDefs = function SvgDefs() {
  return /*#__PURE__*/_react.default.createElement("svg", {
    width: "0px",
    height: "0px"
  }, /*#__PURE__*/_react.default.createElement("defs", null, /*#__PURE__*/_react.default.createElement(DiagLinesPattern, {
    id: "availableProvisionalPattern",
    color: _Theme.COLORS.NEON_BLUE[700],
    secondaryColor: _Theme.COLORS.NEON_BLUE[100]
  }), /*#__PURE__*/_react.default.createElement(DiagLinesPattern, {
    id: "beingProcessedPattern",
    color: _Theme.COLORS.NEON_BLUE[700]
  }), /*#__PURE__*/_react.default.createElement(DiagLinesPattern, {
    id: "delayedPattern",
    color: _Theme.COLORS.GOLD[400]
  }), /*#__PURE__*/_react.default.createElement(DiagLinesPattern, {
    id: "partialSelectionPattern",
    color: _Theme.COLORS.LIGHT_BLUE[300],
    secondaryColor: _Theme.COLORS.LIGHT_BLUE[100]
  }), /*#__PURE__*/_react.default.createElement(HalfAndHalfPattern, {
    id: "mixedSomeAvailabilityPattern",
    color: _Theme.COLORS.NEON_BLUE[700],
    secondaryColor: _Theme.COLORS.GOLD[400]
  }), /*#__PURE__*/_react.default.createElement(HalfAndHalfPattern, {
    id: "mixedNoAvailabilityPattern",
    color: _Theme.default.palette.grey[200],
    secondaryColor: _Theme.COLORS.GOLD[400]
  })));
};
/**
   CELLS
*/


exports.SvgDefs = SvgDefs;
var thinStrokeAttrs = {
  strokeWidth: '0.8px',
  width: "".concat(_AvailabilityUtils.SVG.CELL_WIDTH - 0.8, "px"),
  height: "".concat(_AvailabilityUtils.SVG.CELL_HEIGHT - 0.8, "px"),
  rx: "".concat(_AvailabilityUtils.SVG.CELL_RX * 1.5, "px"),
  nudge: 0.4
};
var fatStrokeAttrs = {
  strokeWidth: '1.5px',
  width: "".concat(_AvailabilityUtils.SVG.CELL_WIDTH - 1.5, "px"),
  height: "".concat(_AvailabilityUtils.SVG.CELL_HEIGHT - 1.5, "px"),
  rx: "".concat(_AvailabilityUtils.SVG.CELL_RX, "px"),
  nudge: 0.75
};
var noStrokeAttrs = {
  stroke: null,
  strokeWidth: null,
  width: "".concat(_AvailabilityUtils.SVG.CELL_WIDTH, "px"),
  height: "".concat(_AvailabilityUtils.SVG.CELL_HEIGHT, "px"),
  rx: "".concat(_AvailabilityUtils.SVG.CELL_RX * 2, "px"),
  nudge: 0
};
var CELL_ATTRS = {
  available: _extends({
    fill: _Theme.COLORS.NEON_BLUE[700]
  }, noStrokeAttrs),
  'available-provisional': _extends({
    fill: 'url(#availableProvisionalPattern)',
    stroke: _Theme.COLORS.NEON_BLUE[700]
  }, fatStrokeAttrs),
  'not available': _extends({
    fill: _Theme.default.palette.grey[200]
  }, noStrokeAttrs),
  'not collected': _extends({
    fill: _Theme.COLORS.GOLD[400]
  }, noStrokeAttrs),
  expected: _extends({
    fill: '#ffffff',
    stroke: _Theme.COLORS.NEON_BLUE[700]
  }, fatStrokeAttrs),
  tentative: _extends({
    fill: '#ffffff',
    stroke: _Theme.COLORS.BROWN[300]
  }, fatStrokeAttrs),
  'not expected': _extends({
    fill: '#ffffff',
    stroke: _Theme.default.palette.grey[200]
  }, fatStrokeAttrs),
  'being processed': _extends({
    fill: 'url(#beingProcessedPattern)',
    stroke: _Theme.COLORS.NEON_BLUE[700]
  }, fatStrokeAttrs),
  delayed: _extends({
    fill: 'url(#delayedPattern)',
    stroke: _Theme.COLORS.GOLD[400]
  }, fatStrokeAttrs),
  'mixed some availability': _extends({
    fill: 'url(#mixedSomeAvailabilityPattern)',
    stroke: _Theme.COLORS.NEON_BLUE[700]
  }, thinStrokeAttrs),
  'mixed no availability': _extends({
    fill: 'url(#mixedNoAvailabilityPattern)',
    stroke: _Theme.COLORS.GOLD[400]
  }, thinStrokeAttrs)
};
exports.CELL_ATTRS = CELL_ATTRS;

var JsxCell = function JsxCell(props) {
  var status = props.status,
      x = props.x,
      y = props.y;

  var _CELL_ATTRS$status = CELL_ATTRS[status],
      _CELL_ATTRS$status$nu = _CELL_ATTRS$status.nudge,
      nudge = _CELL_ATTRS$status$nu === void 0 ? 0 : _CELL_ATTRS$status$nu,
      attrs = _objectWithoutProperties(_CELL_ATTRS$status, _excluded);

  return /*#__PURE__*/_react.default.createElement("rect", _extends({
    x: x + nudge,
    y: y + nudge,
    rx: "".concat(_AvailabilityUtils.SVG.CELL_RX, "px")
  }, attrs));
};

exports.JsxCell = JsxCell;
JsxCell.propTypes = {
  status: _propTypes.default.oneOf(Object.keys(_AvailabilityUtils.VALID_ENHANCED_STATUSES)).isRequired,
  x: _propTypes.default.number,
  y: _propTypes.default.number
};
JsxCell.defaultProps = {
  x: 0,
  y: 0
};