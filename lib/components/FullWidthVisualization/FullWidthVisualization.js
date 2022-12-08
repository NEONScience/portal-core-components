"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FullWidthVisualization;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _excluded = ["vizRef", "minWidth", "handleRedraw", "allowHeightResize", "deriveHeightFromWidth", "containerStyle", "children"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
/**
   Function: Generate an appropriate height for the visualization given its width.
   Maintain a more square aspect ratio for smaller widths and prefer a 16:9
   ratio for larger widths.
*/
var autoVizHeight = function autoVizHeight(width) {
  var breakpoints = [0, 675, 900, 1200];
  var ratios = ['3:2', '16:9', '2:1', '2.5:1'];
  var breakIdx = breakpoints.reduce(function (acc, breakpoint, idx) {
    return width >= breakpoint ? idx : acc;
  }, 0);
  var ratio = /^([\d.]+):([\d.]+)$/.exec(ratios[breakIdx]);
  var mult = (parseFloat(ratio[2], 10) || 1) / (parseFloat(ratio[1], 10) || 1);
  return Math.floor(width * mult);
};
function FullWidthVisualization(props) {
  var vizRef = props.vizRef,
    minWidth = props.minWidth,
    handleRedraw = props.handleRedraw,
    allowHeightResize = props.allowHeightResize,
    deriveHeightFromWidth = props.deriveHeightFromWidth,
    containerStyle = props.containerStyle,
    children = props.children,
    other = _objectWithoutProperties(props, _excluded);
  var containerRef = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(minWidth),
    _useState2 = _slicedToArray(_useState, 2),
    vizWidth = _useState2[0],
    setVizWidth = _useState2[1];
  var handleResize = (0, _react.useCallback)(function () {
    var container = containerRef.current;
    var viz = vizRef.current;
    // Do nothing if either container or viz references fail ot point to a DOM node
    if (!container || !viz) {
      return;
    }
    // Do nothing if either refs have no offset parent
    // (meaning they're hidden from rendering anyway)
    if (container.offsetParent === null || viz.offsetParent === null) {
      return;
    }
    // Do nothing if container and viz have the same width
    // (resize event fired but no actual resize necessary)
    if (container.clientWidth === vizWidth && !allowHeightResize) {
      return;
    }
    var newWidth = container.clientWidth;
    setVizWidth(newWidth);
    viz.setAttribute('width', "".concat(newWidth, "px"));
    if (deriveHeightFromWidth !== null) {
      var newHeight = deriveHeightFromWidth === 'auto' ? autoVizHeight(newWidth) : deriveHeightFromWidth(newWidth, container, viz);
      viz.setAttribute('height', "".concat(newHeight, "px"));
      viz.style.height = "".concat(newHeight, "px");
    }
    if (handleRedraw) {
      handleRedraw();
    }
  }, [vizRef, containerRef, vizWidth, setVizWidth, allowHeightResize, handleRedraw, deriveHeightFromWidth]);
  (0, _react.useLayoutEffect)(function () {
    var element = vizRef.current;
    if (!element) {
      return function () {};
    }
    var parent = element.parentElement;
    handleResize();
    // Ensure resize observer is in place
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', handleResize);
      return function () {
        window.removeEventListener('resize', handleResize);
      };
    }
    var resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(parent);
    return function () {
      if (!resizeObserver) {
        return;
      }
      resizeObserver.disconnect();
      resizeObserver = null;
    };
  }, [vizRef, handleResize]);
  var divProps = {
    ref: containerRef,
    style: {
      width: '100%',
      minWidth: "".concat(minWidth, "px")
    }
  };
  if (containerStyle) {
    divProps.style = containerStyle;
  }
  if (other['data-selenium']) {
    divProps['data-selenium'] = other['data-selenium'];
  }
  return /*#__PURE__*/_react.default.createElement("div", divProps, children);
}
FullWidthVisualization.propTypes = {
  vizRef: _propTypes.default.shape({
    current: _propTypes.default.instanceOf(Element)
  }).isRequired,
  minWidth: _propTypes.default.number,
  handleRedraw: _propTypes.default.func,
  allowHeightResize: _propTypes.default.bool,
  deriveHeightFromWidth: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.oneOf(['auto'])]),
  containerStyle: _propTypes.default.objectOf(_propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])),
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]).isRequired
};
FullWidthVisualization.defaultProps = {
  minWidth: 1,
  handleRedraw: null,
  deriveHeightFromWidth: null,
  allowHeightResize: false,
  containerStyle: null
};