'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = FullWidthVisualization;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function FullWidthVisualization(props) {
  var vizRef = props.vizRef,
      minWidth = props.minWidth,
      handleRedraw = props.handleRedraw,
      deriveHeightFromWidth = props.deriveHeightFromWidth,
      children = props.children,
      other = _objectWithoutProperties(props, ['vizRef', 'minWidth', 'handleRedraw', 'deriveHeightFromWidth', 'children']);

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
    if (container.clientWidth === vizWidth) {
      return;
    }
    var newWidth = container.clientWidth;
    setVizWidth(newWidth);
    viz.setAttribute('width', newWidth + 'px');
    if (deriveHeightFromWidth) {
      var newHeight = deriveHeightFromWidth(newWidth);
      viz.setAttribute('height', newHeight + 'px');
      viz.style.height = newHeight + 'px';
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
  }, [vizRef, handleResize, handleRedraw]);

  var divProps = {
    ref: containerRef,
    style: { width: '100%', minWidth: minWidth + 'px' }
  };
  if (other['data-selenium']) {
    divProps['data-selenium'] = other['data-selenium'];
  }

  return _react2.default.createElement(
    'div',
    divProps,
    children
  );
}

FullWidthVisualization.propTypes = {
  vizRef: _propTypes2.default.shape({
    current: _propTypes2.default.instanceOf(Element)
  }).isRequired,
  minWidth: _propTypes2.default.number,
  handleRedraw: _propTypes2.default.func,
  deriveHeightFromWidth: _propTypes2.default.func,
  children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.string])), _propTypes2.default.node, _propTypes2.default.string]).isRequired
};

FullWidthVisualization.defaultProps = {
  minWidth: 1,
  handleRedraw: null,
  deriveHeightFromWidth: null
};