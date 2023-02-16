"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _styles = require("@material-ui/core/styles");
var _DocumentService = _interopRequireDefault(require("../../service/DocumentService"));
var _ErrorCard = _interopRequireDefault(require("../Card/ErrorCard"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _WarningCard = _interopRequireDefault(require("../Card/WarningCard"));
var _typeUtil = require("../../util/typeUtil");
var _PdfDocumentViewer = _interopRequireDefault(require("./PdfDocumentViewer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var useStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (
    // eslint-disable-next-line implicit-arrow-linebreak
    (0, _styles.createStyles)({
      container: {
        width: '100%'
      },
      iframe: {
        border: 'none'
      }
    })
  );
});
var noop = function noop() {/* NOOP */};
var breakpoints = [0, 675, 900, 1200];
var ratios = ['8:11', '3:4', '4:4', '4:3'];
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
    width = props.width,
    fullUrlPath = props.fullUrlPath;
  var appliedUrlPath = (0, _typeUtil.isStringNonEmpty)(fullUrlPath) ? fullUrlPath : _NeonEnvironment.default.getFullApiPath('documents');
  var dataUrl = "".concat(appliedUrlPath, "/").concat(document.name, "?inline=true&fallback=html");
  var isViewerDeviceSupported = _DocumentService.default.isViewerDeviceSupported();
  var isPdfViewerSupported = _DocumentService.default.isPdfViewerSupported(document);
  var isDocSupported = isViewerDeviceSupported || isPdfViewerSupported;
  var containerRef = (0, _react.useRef)();
  var iframeRef = (0, _react.useRef)();
  var _useState = (0, _react.useState)(width),
    _useState2 = _slicedToArray(_useState, 2),
    viewerWidth = _useState2[0],
    setViewerWidth = _useState2[1];
  var handleResizeCb = (0, _react.useCallback)(function () {
    var container = containerRef.current;
    var iframeElement = iframeRef.current;
    if (!container || !iframeElement) {
      return;
    }
    if (container.offsetParent === null || iframeElement.offsetParent === null) {
      return;
    }
    if (container.clientWidth === viewerWidth) {
      return;
    }
    var newWidth = container.clientWidth;
    setViewerWidth(newWidth);
    iframeElement.setAttribute('width', "".concat(newWidth));
    iframeElement.setAttribute('height', "".concat(calcAutoHeight(newWidth)));
  }, [containerRef, iframeRef, viewerWidth, setViewerWidth]);
  (0, _react.useLayoutEffect)(function () {
    var element = iframeRef.current;
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
  }, [iframeRef, handleResizeCb]);
  if (!isDocSupported) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.container
    }, /*#__PURE__*/_react.default.createElement(_WarningCard.default, {
      title: "This document type is not supported"
    }));
  }
  if (!isViewerDeviceSupported && isPdfViewerSupported) {
    return /*#__PURE__*/_react.default.createElement(_PdfDocumentViewer.default, props);
  }
  var renderObject = function renderObject() {
    if (!_DocumentService.default.isViewerSupported(document)) {
      return /*#__PURE__*/_react.default.createElement(_ErrorCard.default, {
        title: "Document Error",
        message: "This document type is not supported or could not be displayed"
      });
    }
    return /*#__PURE__*/_react.default.createElement("iframe", {
      ref: iframeRef,
      src: dataUrl,
      "aria-label": document.description,
      title: document.description,
      width: viewerWidth,
      height: calcAutoHeight(viewerWidth),
      className: classes.iframe
    });
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: containerRef,
    className: classes.container
  }, renderObject());
};
DocumentViewer.defaultProps = {
  fullUrlPath: undefined
};
var _default = DocumentViewer;
exports.default = _default;