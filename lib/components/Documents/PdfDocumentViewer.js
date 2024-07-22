"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var pdfjs = _interopRequireWildcard(require("pdfjs-dist"));
var PDFJSViewer = _interopRequireWildcard(require("pdfjs-dist/web/pdf_viewer.mjs"));
var _styles = require("@material-ui/core/styles");
var _DocumentService = _interopRequireDefault(require("../../service/DocumentService"));
var _ErrorCard = _interopRequireDefault(require("../Card/ErrorCard"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _WarningCard = _interopRequireDefault(require("../Card/WarningCard"));
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// Pull in PDF JS and set up a reference to the worker source
pdfjs.GlobalWorkerOptions.workerPort = new Worker(new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url), {
  type: 'module'
});
const useStyles = (0, _styles.makeStyles)(muiTheme =>
// eslint-disable-next-line implicit-arrow-linebreak
(0, _styles.createStyles)({
  parentContainer: {
    width: '100%'
  },
  container: {
    width: '100%',
    position: 'relative'
  },
  pdfViewerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'auto',
    backgroundColor: 'rgb(82, 86, 89, 0.9)',
    '& .pdfViewer > .page': {
      margin: '20px',
      boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%),\n          0px 1px 1px 0px rgb(0 0 0 / 14%),\n          0px 1px 3px 0px rgb(0 0 0 / 12%)"
    }
  }
}));
const noop = () => {/* NOOP */};
const MIN_PDF_VIEWER_WIDTH = 800;
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
const PdfDocumentViewer = props => {
  const classes = useStyles(_Theme.default);
  const {
    document,
    width,
    fullUrlPath
  } = props;
  const appliedUrlPath = (0, _typeUtil.isStringNonEmpty)(fullUrlPath) ? fullUrlPath : _NeonEnvironment.default.getFullApiPath('documents');
  const dataUrl = "".concat(appliedUrlPath, "/").concat(document.name, "?inline=true&fallback=html");
  const containerRef = (0, _react.useRef)();
  const pdfContainerRef = (0, _react.useRef)();
  const pdfViewerRef = (0, _react.useRef)();
  const [viewerWidth, setViewerWidth] = (0, _react.useState)(width);
  const [isErrorState, setIsErrorState] = (0, _react.useState)(false);
  const handleResizeCb = (0, _react.useCallback)(() => {
    const container = containerRef.current;
    const pdfContainerElement = pdfContainerRef.current;
    if (!container || !pdfContainerElement) {
      return;
    }
    const parent = container.parentElement;
    if (!parent) {
      return;
    }
    if (parent.clientWidth === viewerWidth) {
      return;
    }
    const newWidth = parent.clientWidth;
    setViewerWidth(newWidth);
    container.style.width = "".concat(newWidth, "px");
    container.style.height = "".concat(calcAutoHeight(newWidth), "px");
    pdfContainerElement.style.width = "".concat(newWidth, "px");
    pdfContainerElement.style.height = "".concat(calcAutoHeight(newWidth), "px");
    if (pdfViewerRef.current && newWidth >= MIN_PDF_VIEWER_WIDTH) {
      pdfViewerRef.current.currentScaleValue = 'page-width';
    }
  }, [containerRef, pdfContainerRef, viewerWidth, setViewerWidth]);
  const handleSetErrorStateCb = (0, _react.useCallback)(isErrorStateCb => {
    setIsErrorState(isErrorStateCb);
  }, [setIsErrorState]);
  (0, _react.useLayoutEffect)(() => {
    const element = containerRef.current;
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
  }, [containerRef, handleResizeCb]);
  (0, _react.useEffect)(() => {
    if (isErrorState) {
      return;
    }
    const pdfContainerElement = pdfContainerRef.current;
    if (!pdfContainerElement) {
      return;
    }
    const config = {
      url: dataUrl
    };
    const eventBus = new PDFJSViewer.EventBus();
    const pdfLinkServiceOptions = {
      eventBus
    };
    const pdfLinkService = new PDFJSViewer.PDFLinkService(pdfLinkServiceOptions);
    const pdfViewerOptions = {
      container: pdfContainerElement,
      linkService: pdfLinkService,
      textLayerMode: 0,
      eventBus
    };
    pdfViewerRef.current = new PDFJSViewer.PDFViewer(pdfViewerOptions);
    pdfLinkService.setViewer(pdfViewerRef.current);
    eventBus.on('pagesinit', () => {
      if (pdfViewerRef.current) {
        pdfViewerRef.current.currentScaleValue = 'page-width';
      }
    });
    const loadingTask = pdfjs.getDocument(config);
    loadingTask.promise.then(doc => {
      if (pdfViewerRef.current) {
        pdfViewerRef.current.setDocument(doc);
      }
      pdfLinkService.setDocument(doc, null);
      handleSetErrorStateCb(false);
    }, reason => {
      // eslint-disable-next-line no-console
      console.error("Error during ".concat(dataUrl, " loading: ").concat(reason));
      handleSetErrorStateCb(true);
    });
  }, [dataUrl, pdfContainerRef, isErrorState, handleSetErrorStateCb]);
  if (isErrorState) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.parentContainer
    }, /*#__PURE__*/_react.default.createElement(_ErrorCard.default, {
      title: "Document Error",
      message: "This document type is not supported or could not be displayed"
    }));
  }
  if (!_DocumentService.default.isPdfViewerSupported(document)) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.parentContainer
    }, /*#__PURE__*/_react.default.createElement(_WarningCard.default, {
      title: "This document type is not supported"
    }));
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes.parentContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    ref: containerRef,
    className: classes.container
  }, /*#__PURE__*/_react.default.createElement("div", {
    ref: pdfContainerRef,
    className: "".concat(classes.pdfViewerContainer)
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "pdfViewer"
  }))));
};
PdfDocumentViewer.defaultProps = {
  fullUrlPath: undefined
};
var _default = exports.default = PdfDocumentViewer;