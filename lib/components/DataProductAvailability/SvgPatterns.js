"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SvgPatternsString = void 0;
exports.default = SvgPatterns;
var _react = _interopRequireDefault(require("react"));
var _server = _interopRequireDefault(require("react-dom/server"));
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
   SVG Patterns
   Pattern shapes borrowed from https://github.com/iros/patternfills
   And edited here to be theme-colored.
*/

var svgPatternsSrc = {
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
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, Object.keys(svgPatternsSrc).map(function (pattern) {
    var _svgPatternsSrc$patte = svgPatternsSrc[pattern],
      dim = _svgPatternsSrc$patte.dim,
      node = _svgPatternsSrc$patte.node;
    var base64 = btoa(_server.default.renderToStaticMarkup(node));
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
var SvgPatternsString = function SvgPatternsString() {
  return _server.default.renderToStaticMarkup(SvgPatterns());
};
exports.SvgPatternsString = SvgPatternsString;