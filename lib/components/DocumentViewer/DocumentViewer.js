"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styles = require("@material-ui/core/styles");

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (// eslint-disable-next-line implicit-arrow-linebreak
    (0, _styles.createStyles)({
      container: {
        width: '100%',
        margin: muiTheme.spacing(3, 3, 3, 3)
      }
    })
  );
});

var noop = function noop() {};

var breakpoints = [0, 675, 900, 1200];
var ratios = ['8:11', '3:4', '3:4', '3:4'];

var calcAutoHeight = function calcAutoHeight(width) {
  var breakIdx = breakpoints.reduce(function (acc, breakpoint, idx) {
    return width >= breakpoint ? idx : acc;
  }, 0);
  var ratio = /^([\d.]+):([\d.]+)$/.exec(ratios[breakIdx]);
  var mult = 4 / 3;

  if (ratio) {
    mult = (parseFloat(ratio[2]) || 1) / (parseFloat(ratio[1]) || 1);
  }

  return Math.floor(width * mult);
};

var DocumentViewer = function DocumentViewer(props) {
  var classes = useStyles(_Theme.default);
  var document = props.document,
      width = props.width;
  var containerRef = (0, _react.useRef)();
  var embedRef = (0, _react.useRef)();

  var _useState = (0, _react.useState)(width),
      _useState2 = _slicedToArray(_useState, 2),
      viewerWidth = _useState2[0],
      setViewerWidth = _useState2[1];

  var handleResizeCb = (0, _react.useCallback)(function () {
    var container = containerRef.current;
    var embed = embedRef.current; // Do nothing if either container or viz references fail ot point to a DOM node

    if (!container || !embed) {
      return;
    } // Do nothing if either refs have no offset parent
    // (meaning they're hidden from rendering anyway)


    if (container.offsetParent === null || embed.offsetParent === null) {
      return;
    } // Do nothing if container and viz have the same width
    // (resize event fired but no actual resize necessary)


    if (container.clientWidth === viewerWidth) {
      return;
    }

    var newWidth = container.clientWidth;
    setViewerWidth(newWidth);
    embed.setAttribute('width', "".concat(newWidth));
    embed.setAttribute('height', "".concat(calcAutoHeight(newWidth)));
  }, [containerRef, embedRef, viewerWidth, setViewerWidth]);
  (0, _react.useLayoutEffect)(function () {
    var element = embedRef.current;

    if (!element) {
      return noop;
    }

    var parent = element.parentElement;

    if (!parent) {
      return noop;
    }

    handleResizeCb();

    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', handleResizeCb);
      return function () {
        window.removeEventListener('resize', handleResizeCb);
      };
    }

    var resizeObserver = new ResizeObserver(handleResizeCb);
    resizeObserver.observe(parent);
    return function () {
      if (!resizeObserver) {
        return;
      }

      resizeObserver.disconnect();
      resizeObserver = null;
    };
  }, [embedRef, handleResizeCb]);
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: containerRef,
    className: classes.container
  }, /*#__PURE__*/_react.default.createElement("embed", {
    ref: embedRef,
    type: document.type,
    src: "".concat(_NeonEnvironment.default.getFullApiPath('documents'), "/").concat(document.name, "?inline=true"),
    title: document.description,
    width: viewerWidth,
    height: calcAutoHeight(viewerWidth)
  }));
};

var _default = DocumentViewer;
exports.default = _default;