"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SvgDefs = exports.JsxCell = exports.CELL_ATTRS = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _AvailabilityUtils = require("./AvailabilityUtils");
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
const _excluded = ["nudge"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /* eslint-disable import/prefer-default-export, max-len */
/**
   SVG_DEFS
*/
const DiagLinesPattern = props => {
  const {
    id,
    color,
    secondaryColor
  } = props;
  const width = _AvailabilityUtils.SVG.CELL_WIDTH;
  const height = _AvailabilityUtils.SVG.CELL_HEIGHT / 4;
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
const HalfAndHalfPattern = props => {
  const {
    id,
    color,
    secondaryColor
  } = props;
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
const DiagHalfAndHalfPattern = props => {
  const {
    id,
    color,
    diagColor,
    diagColorFillOpacity,
    secondaryDiagColor
  } = props;
  const cellW = _AvailabilityUtils.SVG.CELL_WIDTH;
  const cellH = _AvailabilityUtils.SVG.CELL_HEIGHT;
  // Extends the bounds of the applied rectangle dimensions
  // when computing coordinates. This will overlay the
  // computed coordinate such that they extend beyond the actual bounds
  // of the rectangle, to account for squared stroke end of line points
  // so that there's no gaps with a sufficiently heavy stroke width.
  // Setting this to 0 will disable to the extension and map directly
  // onto the bounding box of the rectangle.
  // When divided by 2, should result in a rational number.
  const extendBoundsPadding = 0;
  const w = _AvailabilityUtils.SVG.CELL_WIDTH + extendBoundsPadding;
  const h = _AvailabilityUtils.SVG.CELL_HEIGHT + extendBoundsPadding;
  // Nudge the half fill color to prevent background from initial
  // line from top right corner consuming the color at normal
  // viewing levels. Ensures it looks visually appropriate for half color
  // fill and half diag line pattern.
  // Will be based on initDist
  const nudgeDiagFill = 1;
  const numLines = 4;
  // Distance of the diagonal of the rectangle
  const diagLengthRaw = Math.sqrt(cellW ** 2 + cellH ** 2);
  // Distance of initial line to top right corner, as opposed to starting
  // at point (0, w)
  const initDist = diagLengthRaw * 0.18;
  // Distance of furthest potential end line to bottom left corner
  const trailingDist = diagLengthRaw * 0.1;
  // Distance of the diagonal of the rectangle
  const diagLength = diagLengthRaw - (initDist + trailingDist);
  // Distance between parallel lines
  const diagLineGap = diagLength / numLines;
  const diagLineStrokeWidth = (diagLength * 0.1).toFixed(2);
  // Compute the initial x coordinate of the first line based on specified
  // initial distance from top right corner
  // 45 degree lines means perpendicular line to top right corner
  // c^2 = a^2 + b^2 where a == b
  // Find the initial x coordinate (y == 0) to derive linear function from
  const initXCoordDist = w - Math.sqrt(2 * initDist ** 2);
  const coords = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < numLines; i++) {
    // Vertical transformation of linear function scalar value
    // As m == 1, use distance between parallel lines to compute hypotenuse
    // of equilateral triangle which will be the vertical transformation scalar
    // to apply to the linear function
    // Then scale by line index for each line
    const v = Math.sqrt(2 * diagLineGap ** 2) * i;
    // Linear functions derived from initial X coordinate, known slope
    const findY = x => x - initXCoordDist + v;
    const findX = y => y + initXCoordDist - v;
    let x1 = 0;
    let y1 = findY(x1);
    let x2 = w;
    let y2 = findY(x2);
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
  }), coords.map((coord, idx) => /*#__PURE__*/_react.default.createElement("line", {
    // eslint-disable-next-line react/no-array-index-key
    key: "DiagHalfAndHalfPatternKey-".concat(coord.x1, "-").concat(coord.y1, "-").concat(coord.x2, "-").concat(coord.y2, "-").concat(idx),
    x1: coord.x1,
    y1: coord.y1,
    x2: coord.x2,
    y2: coord.y2,
    stroke: diagColor,
    strokeWidth: diagLineStrokeWidth,
    strokeLinecap: "square"
  })), /*#__PURE__*/_react.default.createElement("polygon", {
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
const SvgDefs = () => /*#__PURE__*/_react.default.createElement("svg", {
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

/**
   CELLS
*/
exports.SvgDefs = SvgDefs;
const thinStrokeAttrs = {
  strokeWidth: '0.8px',
  width: "".concat(_AvailabilityUtils.SVG.CELL_WIDTH - 0.8, "px"),
  height: "".concat(_AvailabilityUtils.SVG.CELL_HEIGHT - 0.8, "px"),
  rx: "".concat(_AvailabilityUtils.SVG.CELL_RX * 1.5, "px"),
  nudge: 0.4
};
const midStrokeAttrs = {
  strokeWidth: '1.15px',
  width: "".concat(_AvailabilityUtils.SVG.CELL_WIDTH - 1.15, "px"),
  height: "".concat(_AvailabilityUtils.SVG.CELL_HEIGHT - 1.15, "px"),
  rx: "".concat(_AvailabilityUtils.SVG.CELL_RX * 1.25, "px"),
  nudge: 0.60
};
const fatStrokeAttrs = {
  strokeWidth: '1.5px',
  width: "".concat(_AvailabilityUtils.SVG.CELL_WIDTH - 1.5, "px"),
  height: "".concat(_AvailabilityUtils.SVG.CELL_HEIGHT - 1.5, "px"),
  rx: "".concat(_AvailabilityUtils.SVG.CELL_RX, "px"),
  nudge: 0.75
};
const noStrokeAttrs = {
  stroke: null,
  strokeWidth: null,
  width: "".concat(_AvailabilityUtils.SVG.CELL_WIDTH, "px"),
  height: "".concat(_AvailabilityUtils.SVG.CELL_HEIGHT, "px"),
  rx: "".concat(_AvailabilityUtils.SVG.CELL_RX * 2, "px"),
  nudge: 0
};
const CELL_ATTRS = exports.CELL_ATTRS = {
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
const JsxCell = props => {
  const {
    status,
    x,
    y
  } = props;
  const _CELL_ATTRS$status = CELL_ATTRS[status],
    {
      nudge = 0
    } = _CELL_ATTRS$status,
    attrs = _objectWithoutPropertiesLoose(_CELL_ATTRS$status, _excluded);
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