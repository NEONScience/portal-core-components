"use strict";

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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const useStyles = (0, _styles.makeStyles)(muiTheme =>
// eslint-disable-next-line implicit-arrow-linebreak
(0, _styles.createStyles)({
  container: {
    width: '100%'
  },
  iframe: {
    border: 'none'
  }
}));
const noop = () => {/* NOOP */};
const breakpoints = [0, 675, 900, 1200];
const ratios = ['8:11', '3:4', '4:4', '4:3'];
const calcAutoHeight = width => {
  const breakIdx = breakpoints.reduce((acc, breakpoint, idx) => width >= breakpoint ? idx : acc, 0);
  const ratio = /^([\d.]+):([\d.]+)$/.exec(ratios[breakIdx]);
  let mult = 4 / 3;
  if (ratio) {
    mult = (parseFloat(ratio[2]) || 1) / (parseFloat(ratio[1]) || 1);
  }
  return Math.floor(width * mult);
};
const DocumentViewer = props => {
  const classes = useStyles(_Theme.default);
  const {
    document,
    width,
    fullUrlPath
  } = props;
  const appliedUrlPath = (0, _typeUtil.isStringNonEmpty)(fullUrlPath) ? fullUrlPath : _NeonEnvironment.default.getFullApiPath('documents');
  const dataUrl = "".concat(appliedUrlPath, "/").concat(document.name, "?inline=true&fallback=html");
  const isViewerDeviceSupported = _DocumentService.default.isViewerDeviceSupported();
  const isPdfViewerSupported = _DocumentService.default.isPdfViewerSupported(document);
  const isDocSupported = isViewerDeviceSupported || isPdfViewerSupported;
  const containerRef = (0, _react.useRef)();
  const iframeRef = (0, _react.useRef)();
  const [viewerWidth, setViewerWidth] = (0, _react.useState)(width);
  const handleResizeCb = (0, _react.useCallback)(() => {
    const container = containerRef.current;
    const iframeElement = iframeRef.current;
    if (!container || !iframeElement) {
      return;
    }
    if (container.offsetParent === null || iframeElement.offsetParent === null) {
      return;
    }
    if (container.clientWidth === viewerWidth) {
      return;
    }
    const newWidth = container.clientWidth;
    setViewerWidth(newWidth);
    iframeElement.setAttribute('width', "".concat(newWidth));
    iframeElement.setAttribute('height', "".concat(calcAutoHeight(newWidth)));
  }, [containerRef, iframeRef, viewerWidth, setViewerWidth]);
  (0, _react.useLayoutEffect)(() => {
    const element = iframeRef.current;
    if (!element) {
      return noop;
    }
    const parent = element.parentElement;
    if (!parent) {
      return noop;
    }
    handleResizeCb();
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', handleResizeCb);
      return () => {
        window.removeEventListener('resize', handleResizeCb);
      };
    }
    let resizeObserver = new ResizeObserver(handleResizeCb);
    resizeObserver.observe(parent);
    return () => {
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
  const renderObject = () => {
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
var _default = exports.default = DocumentViewer;