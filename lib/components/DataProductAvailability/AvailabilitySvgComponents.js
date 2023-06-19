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
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable import/prefer-default-export, max-len */
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
var DiagHalfAndHalfPattern = function DiagHalfAndHalfPattern(props) {
  var id = props.id,
    color = props.color,
    diagColor = props.diagColor,
    diagColorFillOpacity = props.diagColorFillOpacity,
    secondaryDiagColor = props.secondaryDiagColor;
  var cellW = _AvailabilityUtils.SVG.CELL_WIDTH;
  var cellH = _AvailabilityUtils.SVG.CELL_HEIGHT;
  // Extends the bounds of the applied rectangle dimensions
  // when computing coordinates. This will overlay the
  // computed coordinate such that they extend beyond the actual bounds
  // of the rectangle, to account for squared stroke end of line points
  // so that there's no gaps with a sufficiently heavy stroke width.
  // Setting this to 0 will disable to the extension and map directly
  // onto the bounding box of the rectangle.
  // When divided by 2, should result in a rational number.
  var extendBoundsPadding = 0;
  var w = _AvailabilityUtils.SVG.CELL_WIDTH + extendBoundsPadding;
  var h = _AvailabilityUtils.SVG.CELL_HEIGHT + extendBoundsPadding;
  // Nudge the half fill color to prevent background from initial
  // line from top right corner consuming the color at normal
  // viewing levels. Ensures it looks visually appropriate for half color
  // fill and half diag line pattern.
  // Will be based on initDist
  var nudgeDiagFill = 1;
  var numLines = 4;
  // Distance of the diagonal of the rectangle
  var diagLengthRaw = Math.sqrt(Math.pow(cellW, 2) + Math.pow(cellH, 2));
  // Distance of initial line to top right corner, as opposed to starting
  // at point (0, w)
  var initDist = diagLengthRaw * 0.18;
  // Distance of furthest potential end line to bottom left corner
  var trailingDist = diagLengthRaw * 0.1;
  // Distance of the diagonal of the rectangle
  var diagLength = diagLengthRaw - (initDist + trailingDist);
  // Distance between parallel lines
  var diagLineGap = diagLength / numLines;
  var diagLineStrokeWidth = (diagLength * 0.1).toFixed(2);
  // Compute the initial x coordinate of the first line based on specified
  // initial distance from top right corner
  // 45 degree lines means perpendicular line to top right corner
  // c^2 = a^2 + b^2 where a == b
  // Find the initial x coordinate (y == 0) to derive linear function from
  var initXCoordDist = w - Math.sqrt(2 * Math.pow(initDist, 2));
  var coords = [];
  // eslint-disable-next-line no-plusplus
  var _loop = function _loop() {
    // Vertical transformation of linear function scalar value
    // As m == 1, use distance between parallel lines to compute hypotenuse
    // of equilateral triangle which will be the vertical transformation scalar
    // to apply to the linear function
    // Then scale by line index for each line
    var v = Math.sqrt(2 * Math.pow(diagLineGap, 2)) * i;
    // Linear functions derived from initial X coordinate, known slope
    var findY = function findY(x) {
      return x - initXCoordDist + v;
    };
    var findX = function findX(y) {
      return y + initXCoordDist - v;
    };
    var x1 = 0;
    var y1 = findY(x1);
    var x2 = w;
    var y2 = findY(x2);
    // Snap coordinates to bounding box
    if (y1 < 0) {
      x1 = findX(0);
      y1 = 0;
    }
    if (y2 > h) {
      x2 = findX(h);
      y2 = h;
    }
    coords.push({
      x1: (x1 - extendBoundsPadding / 2).toFixed(2),
      y1: (y1 - extendBoundsPadding / 2).toFixed(2),
      x2: (x2 - extendBoundsPadding / 2).toFixed(2),
      y2: (y2 - extendBoundsPadding / 2).toFixed(2)
    });
  };
  for (var i = 0; i < numLines; i++) {
    _loop();
  }
  return /*#__PURE__*/_react.default.createElement("pattern", {
    id: id,
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    patternUnits: "objectBoundingBox",
    patternContentUnits: "userSpaceOnUse"
  }, /*#__PURE__*/_react.default.createElement("polygon", {
    points: "0,0 0,1 1,1 1,0",
    fill: secondaryDiagColor,
    fillOpacity: diagColorFillOpacity
  }), coords.map(function (coord, idx) {
    return /*#__PURE__*/_react.default.createElement("line", {
      // eslint-disable-next-line react/no-array-index-key
      key: "DiagHalfAndHalfPatternKey-".concat(coord.x1, "-").concat(coord.y1, "-").concat(coord.x2, "-").concat(coord.y2, "-").concat(idx),
      x1: coord.x1,
      y1: coord.y1,
      x2: coord.x2,
      y2: coord.y2,
      stroke: diagColor,
      strokeWidth: diagLineStrokeWidth,
      strokeLinecap: "square"
    });
  }), /*#__PURE__*/_react.default.createElement("polygon", {
    points: "0,0 ".concat(cellW - nudgeDiagFill, ",0 ", 0, ",").concat(cellH),
    fill: color
  }));
};
DiagHalfAndHalfPattern.propTypes = {
  id: _propTypes.default.string.isRequired,
  color: _propTypes.default.string.isRequired,
  diagColor: _propTypes.default.string.isRequired,
  diagColorFillOpacity: _propTypes.default.number.isRequired,
  secondaryDiagColor: _propTypes.default.string
};
DiagHalfAndHalfPattern.defaultProps = {
  secondaryDiagColor: '#ffffff'
};
var SvgDefs = function SvgDefs() {
  return /*#__PURE__*/_react.default.createElement("svg", {
    width: "0px",
    height: "0px"
  }, /*#__PURE__*/_react.default.createElement("defs", null, /*#__PURE__*/_react.default.createElement(DiagLinesPattern, {
    id: "availableProvisionalPattern",
    color: _Theme.COLORS.NEON_BLUE[700],
    secondaryColor: _Theme.COLORS.NEON_BLUE[50]
  }), /*#__PURE__*/_react.default.createElement(DiagHalfAndHalfPattern, {
    id: "mixedAvailableProvisionalPattern",
    color: _Theme.COLORS.NEON_BLUE[700],
    diagColor: _Theme.COLORS.NEON_BLUE[700],
    diagColorFillOpacity: 0.25,
    secondaryDiagColor: _Theme.COLORS.NEON_BLUE[50]
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
var midStrokeAttrs = {
  strokeWidth: '1.15px',
  width: "".concat(_AvailabilityUtils.SVG.CELL_WIDTH - 1.15, "px"),
  height: "".concat(_AvailabilityUtils.SVG.CELL_HEIGHT - 1.15, "px"),
  rx: "".concat(_AvailabilityUtils.SVG.CELL_RX * 1.25, "px"),
  nudge: 0.60
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
  }, midStrokeAttrs),
  'mixed-available-provisional': _extends({
    fill: 'url(#mixedAvailableProvisionalPattern)',
    stroke: _Theme.COLORS.NEON_BLUE[700]
  }, thinStrokeAttrs),
  'not available': _extends({
    fill: _Theme.default.palette.grey[200]
  }, noStrokeAttrs),
  tombstoned: _extends({
    // #708090 slate gray
    // #5A6673 darker slate gray
    // #727C8C more modified hue towards gray
    // #272727 greyscale of available blue color (rgba(39, 39, 39, 0.9))
    // Theme.palette.grey[500]
    fill: 'rgba(39, 39, 39, 0.9)'
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