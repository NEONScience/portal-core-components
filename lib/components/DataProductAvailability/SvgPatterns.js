"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SvgPatternsString = void 0;
exports.default = SvgPatterns;
var _react = _interopRequireDefault(require("react"));
var _server = _interopRequireDefault(require("react-dom/server"));
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
   SVG Patterns
   Pattern shapes borrowed from https://github.com/iros/patternfills
   And edited here to be theme-colored.
*/

const svgPatternsSrc = {
  horizontalStripeSecondaryBlue2: {
    dim: 8,
    node: /*#__PURE__*/_react.default.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "8",
      height: "8"
    }, /*#__PURE__*/_react.default.createElement("rect", {
      x: "0",
      y: "0",
      width: "8",
      height: "8",
      fill: _Theme.COLORS.LIGHT_BLUE[100]
    }), /*#__PURE__*/_react.default.createElement("rect", {
      x: "0",
      y: "0",
      width: "8",
      height: "2",
      fill: _Theme.COLORS.LIGHT_BLUE[300]
    }), /*#__PURE__*/_react.default.createElement("rect", {
      x: "0",
      y: "4",
      width: "8",
      height: "2",
      fill: _Theme.COLORS.LIGHT_BLUE[300]
    }))
  },
  diagonalStripeSecondaryBlue3: {
    dim: 10,
    node: /*#__PURE__*/_react.default.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "10",
      height: "10"
    }, /*#__PURE__*/_react.default.createElement("rect", {
      x: "0",
      y: "0",
      width: "10",
      height: "10",
      fill: _Theme.COLORS.LIGHT_BLUE[100]
    }), /*#__PURE__*/_react.default.createElement("path", {
      d: "M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2",
      stroke: _Theme.default.palette.secondary.main,
      strokeWidth: "2"
    }))
  }
};
function SvgPatterns() {
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, Object.keys(svgPatternsSrc).map(pattern => {
    const {
      dim,
      node
    } = svgPatternsSrc[pattern];
    const base64 = btoa(_server.default.renderToStaticMarkup(node));
    return /*#__PURE__*/_react.default.createElement("pattern", {
      id: pattern,
      key: pattern,
      patternUnits: "userSpaceOnUse",
      width: dim,
      height: dim
    }, /*#__PURE__*/_react.default.createElement("image", {
      xlinkHref: "data:image/svg+xml;base64,".concat(base64),
      x: "0",
      y: "0",
      width: dim,
      height: dim
    }));
  }));
}
const SvgPatternsString = () => _server.default.renderToStaticMarkup(SvgPatterns());
exports.SvgPatternsString = SvgPatternsString;