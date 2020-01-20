"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FullWidthVisualization;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function FullWidthVisualization(props) {
  var vizRef = props.vizRef,
      minWidth = props.minWidth,
      handleRedraw = props.handleRedraw,
      deriveHeightFromWidth = props.deriveHeightFromWidth,
      children = props.children,
      other = _objectWithoutProperties(props, ["vizRef", "minWidth", "handleRedraw", "deriveHeightFromWidth", "children"]);

  var containerRef = (0, _react.useRef)(null);

  var _useState = (0, _react.useState)(minWidth),
      _useState2 = _slicedToArray(_useState, 2),
      vizWidth = _useState2[0],
      setVizWidth = _useState2[1];

  var handleResize = (0, _react.useCallback)(function () {
    var container = containerRef.current;
    var viz = vizRef.current; // Do nothing if either container or viz references fail ot point to a DOM node

    if (!container || !viz) {
      return;
    } // Do nothing if either refs have no offset parent
    // (meaning they're hidden from rendering anyway)


    if (container.offsetParent === null || viz.offsetParent === null) {
      return;
    } // Do nothing if container and viz have the same width
    // (resize event fired but no actual resize necessary)


    if (container.clientWidth === vizWidth) {
      return;
    }

    var newWidth = container.clientWidth;
    setVizWidth(newWidth);
    viz.setAttribute('width', "".concat(newWidth, "px"));

    if (deriveHeightFromWidth) {
      var newHeight = deriveHeightFromWidth(newWidth);
      viz.setAttribute('height', "".concat(newHeight, "px"));
      viz.style.height = "".concat(newHeight, "px");
    }

    if (handleRedraw) {
      handleRedraw();
    }
  }, [vizRef, containerRef, vizWidth, setVizWidth, handleRedraw, deriveHeightFromWidth]);
  (0, _react.useLayoutEffect)(function () {
    var element = vizRef.current;

    if (!element) {
      return function () {};
    }

    var parent = element.parentElement;
    handleResize(); // Ensure resize observer is in place

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
  }, [vizRef, handleResize, handleRedraw]);
  var divProps = {
    ref: containerRef,
    style: {
      width: '100%',
      minWidth: "".concat(minWidth, "px")
    }
  };

  if (other['data-selenium']) {
    divProps['data-selenium'] = other['data-selenium'];
  }

  return _react.default.createElement("div", divProps, children);
}

FullWidthVisualization.propTypes = {
  vizRef: _propTypes.default.shape({
    current: _propTypes.default.instanceOf(Element)
  }).isRequired,
  minWidth: _propTypes.default.number,
  handleRedraw: _propTypes.default.func,
  deriveHeightFromWidth: _propTypes.default.func,
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]).isRequired
};
FullWidthVisualization.defaultProps = {
  minWidth: 1,
  handleRedraw: null,
  deriveHeightFromWidth: null
};