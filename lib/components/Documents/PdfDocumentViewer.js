"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var PDFJSViewer = _interopRequireWildcard(require("pdfjs-dist/legacy/web/pdf_viewer"));

var _styles = require("@material-ui/core/styles");

var _DocumentService = _interopRequireDefault(require("../../service/DocumentService"));

var _ErrorCard = _interopRequireDefault(require("../Card/ErrorCard"));

var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _typeUtil = require("../../util/typeUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Pull in PDF JS and set up a reference to the worker source
var pdfjs = require('pdfjs-dist/legacy/build/pdf'); // eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved


var PdfjsWorker = require('worker-loader?esModule=false&filename=static/js/workers/[name].[contenthash].js!pdfjs-dist/legacy/build/pdf.worker');

pdfjs.GlobalWorkerOptions.workerPort = new PdfjsWorker();
var useStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (// eslint-disable-next-line implicit-arrow-linebreak
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
    })
  );
});

var noop = function noop() {};

var MIN_PDF_VIEWER_WIDTH = 800;
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

var PdfDocumentViewer = function PdfDocumentViewer(props) {
  var classes = useStyles(_Theme.default);
  var document = props.document,
      width = props.width,
      fullUrlPath = props.fullUrlPath;
  var appliedUrlPath = (0, _typeUtil.isStringNonEmpty)(fullUrlPath) ? fullUrlPath : _NeonEnvironment.default.getFullApiPath('documents');
  var dataUrl = "".concat(appliedUrlPath, "/").concat(document.name, "?inline=true&fallback=html");
  var containerRef = (0, _react.useRef)();
  var pdfContainerRef = (0, _react.useRef)();
  var pdfViewerRef = (0, _react.useRef)();

  var _useState = (0, _react.useState)(width),
      _useState2 = _slicedToArray(_useState, 2),
      viewerWidth = _useState2[0],
      setViewerWidth = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isErrorState = _useState4[0],
      setIsErrorState = _useState4[1];

  var handleResizeCb = (0, _react.useCallback)(function () {
    var container = containerRef.current;
    var pdfContainerElement = pdfContainerRef.current;

    if (!container || !pdfContainerElement) {
      return;
    }

    var parent = container.parentElement;

    if (!parent) {
      return;
    }

    if (parent.clientWidth === viewerWidth) {
      return;
    }

    var newWidth = parent.clientWidth;
    setViewerWidth(newWidth);
    container.style.width = "".concat(newWidth, "px");
    container.style.height = "".concat(calcAutoHeight(newWidth), "px");
    pdfContainerElement.style.width = "".concat(newWidth, "px");
    pdfContainerElement.style.height = "".concat(calcAutoHeight(newWidth), "px");

    if (pdfViewerRef.current && newWidth >= MIN_PDF_VIEWER_WIDTH) {
      pdfViewerRef.current.currentScaleValue = 'page-width';
    }
  }, [containerRef, pdfContainerRef, viewerWidth, setViewerWidth]);
  var handleSetErrorStateCb = (0, _react.useCallback)(function (isErrorStateCb) {
    setIsErrorState(isErrorStateCb);
  }, [setIsErrorState]);
  (0, _react.useLayoutEffect)(function () {
    var element = containerRef.current;

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
  }, [containerRef, handleResizeCb]);
  (0, _react.useEffect)(function () {
    if (isErrorState) {
      return;
    }

    var pdfContainerElement = pdfContainerRef.current;

    if (!pdfContainerElement) {
      return;
    }

    var config = {
      url: dataUrl
    };
    var eventBus = new PDFJSViewer.EventBus();
    var pdfLinkServiceOptions = {
      eventBus: eventBus
    };
    var pdfLinkService = new PDFJSViewer.PDFLinkService(pdfLinkServiceOptions);
    var pdfViewerOptions = {
      container: pdfContainerElement,
      linkService: pdfLinkService,
      l10n: PDFJSViewer.NullL10n,
      textLayerMode: 0,
      eventBus: eventBus
    };
    pdfViewerRef.current = new PDFJSViewer.PDFViewer(pdfViewerOptions);
    eventBus.on('pagesinit', function () {
      if (pdfViewerRef.current) {
        pdfViewerRef.current.currentScaleValue = 'page-width';
      }
    });
    var loadingTask = pdfjs.getDocument(config);
    loadingTask.promise.then(function (doc) {
      if (pdfViewerRef.current) {
        pdfViewerRef.current.setDocument(doc);
      }

      pdfLinkService.setDocument(doc, null);
      handleSetErrorStateCb(false);
    }, function (reason) {
      // eslint-disable-next-line no-console
      console.error("Error during ".concat(dataUrl, " loading: ").concat(reason));
      handleSetErrorStateCb(true);
    });
  }, [dataUrl, pdfContainerRef, isErrorState, handleSetErrorStateCb]);

  if (isErrorState || !_DocumentService.default.isPdfViewerSupported(document)) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.parentContainer
    }, /*#__PURE__*/_react.default.createElement(_ErrorCard.default, {
      title: "Document Error",
      message: "This document type is not supported or could not be displayed"
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
var _default = PdfDocumentViewer;
exports.default = _default;