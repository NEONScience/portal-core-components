"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FullWidthVisualization;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
const _excluded = ["vizRef", "minWidth", "handleRedraw", "allowHeightResize", "deriveHeightFromWidth", "containerStyle", "children"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
/**
   Function: Generate an appropriate height for the visualization given its width.
   Maintain a more square aspect ratio for smaller widths and prefer a 16:9
   ratio for larger widths.
*/
const autoVizHeight = width => {
  const breakpoints = [0, 675, 900, 1200];
  const ratios = ['3:2', '16:9', '2:1', '2.5:1'];
  const breakIdx = breakpoints.reduce((acc, breakpoint, idx) => width >= breakpoint ? idx : acc, 0);
  const ratio = /^([\d.]+):([\d.]+)$/.exec(ratios[breakIdx]);
  const mult = (parseFloat(ratio[2], 10) || 1) / (parseFloat(ratio[1], 10) || 1);
  return Math.floor(width * mult);
};
function FullWidthVisualization(props) {
  const {
      vizRef,
      minWidth,
      handleRedraw,
      allowHeightResize,
      deriveHeightFromWidth,
      containerStyle,
      children
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const containerRef = (0, _react.useRef)(null);
  const [vizWidth, setVizWidth] = (0, _react.useState)(minWidth);
  const handleResize = (0, _react.useCallback)(() => {
    const container = containerRef.current;
    const viz = vizRef.current;
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
    const newWidth = container.clientWidth;
    setVizWidth(newWidth);
    viz.setAttribute('width', "".concat(newWidth, "px"));
    if (deriveHeightFromWidth !== null) {
      const newHeight = deriveHeightFromWidth === 'auto' ? autoVizHeight(newWidth) : deriveHeightFromWidth(newWidth, container, viz);
      viz.setAttribute('height', "".concat(newHeight, "px"));
      viz.style.height = "".concat(newHeight, "px");
    }
    if (handleRedraw) {
      handleRedraw();
    }
  }, [vizRef, containerRef, vizWidth, setVizWidth, allowHeightResize, handleRedraw, deriveHeightFromWidth]);
  (0, _react.useLayoutEffect)(() => {
    const element = vizRef.current;
    if (!element) {
      return () => {};
    }
    const parent = element.parentElement;
    handleResize();
    // Ensure resize observer is in place
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
    let resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(parent);
    return () => {
      if (!resizeObserver) {
        return;
      }
      resizeObserver.disconnect();
      resizeObserver = null;
    };
  }, [vizRef, handleResize]);
  const divProps = {
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