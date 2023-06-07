"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@material-ui/core/styles");
var _Dialog = _interopRequireDefault(require("@material-ui/core/Dialog"));
var _DialogTitle = _interopRequireDefault(require("@material-ui/core/DialogTitle"));
var _DialogContent = _interopRequireDefault(require("@material-ui/core/DialogContent"));
var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));
var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Close = _interopRequireDefault(require("@material-ui/icons/Close"));
var _HelpOutline = _interopRequireDefault(require("@material-ui/icons/HelpOutline"));
var _AvailabilityUtils = require("./AvailabilityUtils");
var _AvailabilitySvgComponents = require("./AvailabilitySvgComponents");
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    legendContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      marginTop: theme.spacing(1),
      width: '100%'
    },
    legendTitle: {
      fontSize: '0.95rem',
      display: 'inline-flex'
    },
    legendTitleIcon: {
      marginTop: theme.spacing(-0.25)
    },
    legendTitleContainer: {
      margin: theme.spacing(-1, 1, 0.5, 0)
    },
    legendElement: {
      margin: theme.spacing(0, 0, 0, 0)
    },
    legendElementText: {
      textAnchor: 'start',
      whiteSpace: 'pre',
      fontFamily: '"Cutive Mono","Lucida Console",Monaco,monospace',
      fontWeight: 400,
      fontSize: "".concat(_AvailabilityUtils.SVG.LABEL_FONT_SIZE, "px"),
      fill: _Theme.default.palette.grey[700]
    }
  };
});
var CONTAINER_WIDTH_BREAKPOINT_XS_FLEX_COL = 250;
var CONTAINER_WIDTH_BREAKPOINT_XS = 345;
var CONTAINER_WIDTH_BREAKPOINT_XS_SELECTION = 200;
var CONTAINER_WIDTH_BREAKPOINT_SM_SELECTION = 425;
var ALL_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then all sites rolled into a given row are selected';
var SOME_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then one or more but not all of the sites rolled into a given row are selected';
var StatusLegendElement = function StatusLegendElement(props) {
  var classes = useStyles(_Theme.default);
  var status = props.status,
    dialog = props.dialog;
  if (!(0, _typeUtil.exists)(status) || !_AvailabilityUtils.VALID_ENHANCED_STATUSES[status]) {
    return null;
  }
  var statusSvgHeight = _AvailabilityUtils.SVG.CELL_HEIGHT + 2;
  var labelLetterWidth = 8;
  var labelY = _AvailabilityUtils.SVG.LABEL_FONT_SIZE - _AvailabilityUtils.SVG.CELL_PADDING + 2;
  var statusLabelX = _AvailabilityUtils.SVG.CELL_WIDTH + 2 * _AvailabilityUtils.SVG.CELL_PADDING;
  var _VALID_ENHANCED_STATU = _AvailabilityUtils.VALID_ENHANCED_STATUSES[status],
    title = _VALID_ENHANCED_STATU.title,
    description = _VALID_ENHANCED_STATU.description;
  var statusSvgWidth = title.length * labelLetterWidth + statusLabelX;
  return dialog ? /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginBottom: _Theme.default.spacing(2.5)
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement("svg", {
    width: Math.ceil(_AvailabilityUtils.SVG.CELL_WIDTH * 1.25),
    height: Math.ceil(_AvailabilityUtils.SVG.CELL_HEIGHT * 1.25),
    viewBox: "0 0 ".concat(_AvailabilityUtils.SVG.CELL_WIDTH, " ").concat(_AvailabilityUtils.SVG.CELL_HEIGHT),
    style: {
      marginRight: _Theme.default.spacing(1)
    }
  }, /*#__PURE__*/_react.default.createElement(_AvailabilitySvgComponents.JsxCell, {
    status: status
  })), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle2",
    style: {
      fontSize: '0.95rem',
      marginTop: '2px'
    }
  }, title)), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2"
  }, description)) : /*#__PURE__*/_react.default.createElement("div", {
    className: classes.legendElement,
    title: description
  }, /*#__PURE__*/_react.default.createElement("svg", {
    width: statusSvgWidth,
    height: statusSvgHeight
  }, /*#__PURE__*/_react.default.createElement(_AvailabilitySvgComponents.JsxCell, {
    status: status
  }), /*#__PURE__*/_react.default.createElement("text", {
    className: classes.legendElementText,
    x: statusLabelX,
    y: labelY
  }, title)));
};
StatusLegendElement.propTypes = {
  status: _propTypes.default.oneOf(Object.keys(_AvailabilityUtils.VALID_ENHANCED_STATUSES)),
  dialog: _propTypes.default.bool
};
StatusLegendElement.defaultProps = {
  status: null,
  dialog: false
};
var SelectionLegendElement = function SelectionLegendElement(props) {
  var classes = useStyles(_Theme.default);
  var variant = props.variant,
    dialog = props.dialog;
  if (!['all', 'some'].includes(variant)) {
    return null;
  }
  var statusSvgHeight = _AvailabilityUtils.SVG.CELL_HEIGHT + 2;
  var labelLetterWidth = 8;
  var labelY = _AvailabilityUtils.SVG.LABEL_FONT_SIZE - _AvailabilityUtils.SVG.CELL_PADDING + 2;
  var selectionSvgHeight = _AvailabilityUtils.SVG.CELL_HEIGHT + 2;
  var label = variant === 'all' ? 'All sites selected' : 'Some sites selected';
  var fill = variant === 'all' ? _Theme.default.palette.primary.main : _Theme.COLORS.LIGHT_BLUE[200];
  var description = variant === 'all' ? ALL_SELECTED_TITLE : SOME_SELECTED_TITLE;
  var selectionWidth = 30;
  var selectionLabelX = selectionWidth + 3 * _AvailabilityUtils.SVG.CELL_PADDING;
  var selectionSvgWidth = label.length * labelLetterWidth + selectionLabelX;
  var handleAttribs = {
    width: _AvailabilityUtils.SVG.DATE_RANGE_HANDLE_WIDTH,
    height: _AvailabilityUtils.SVG.CELL_HEIGHT,
    fill: _Theme.COLORS.LIGHT_BLUE[300],
    stroke: _Theme.default.palette.primary.main,
    strokeWidth: 1.5
  };
  var graphic = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("rect", {
    x: 0.5,
    y: 1.5,
    width: selectionWidth,
    height: _AvailabilityUtils.SVG.CELL_HEIGHT - 2,
    fill: fill
  }), /*#__PURE__*/_react.default.createElement("rect", _extends({
    x: 0.5,
    y: 0.5
  }, handleAttribs)), /*#__PURE__*/_react.default.createElement("rect", _extends({
    x: selectionWidth - _AvailabilityUtils.SVG.DATE_RANGE_HANDLE_WIDTH,
    y: 0.5
  }, handleAttribs)));
  return dialog ? /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginBottom: _Theme.default.spacing(2)
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement("svg", {
    width: Math.ceil(selectionWidth * 1.25),
    height: Math.ceil(selectionSvgHeight * 1.25),
    viewBox: "0 0 ".concat(selectionWidth, " ").concat(selectionSvgHeight),
    style: {
      marginRight: _Theme.default.spacing(1)
    }
  }, graphic), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle2",
    style: {
      fontSize: '1.05rem'
    }
  }, label)), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2"
  }, description)) : /*#__PURE__*/_react.default.createElement("div", {
    className: classes.legendElement,
    title: description
  }, /*#__PURE__*/_react.default.createElement("svg", {
    width: selectionSvgWidth,
    height: statusSvgHeight
  }, graphic, /*#__PURE__*/_react.default.createElement("text", {
    className: classes.legendElementText,
    x: selectionLabelX,
    y: labelY
  }, label)));
};
SelectionLegendElement.propTypes = {
  variant: _propTypes.default.oneOf(['all', 'some']).isRequired,
  dialog: _propTypes.default.bool
};
SelectionLegendElement.defaultProps = {
  dialog: false
};
var LegendDialog = function LegendDialog(props) {
  var dialogOpen = props.dialogOpen,
    setDialogOpen = props.setDialogOpen,
    selectionEnabled = props.selectionEnabled,
    delineateRelease = props.delineateRelease,
    availabilityStatusType = props.availabilityStatusType;
  return /*#__PURE__*/_react.default.createElement(_Dialog.default, {
    open: dialogOpen,
    maxWidth: "md",
    onClose: function onClose() {
      return setDialogOpen(false);
    },
    "aria-labelledby": "availability-key-dialog-title"
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react.default.createElement(_DialogTitle.default, {
    id: "availability-key-dialog-title"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      fontSize: '1.4rem',
      fontWeight: '600'
    }
  }, "Data Availability Chart Key")), /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    title: "Close",
    "aria-label": "Close",
    onClick: function onClick() {
      return setDialogOpen(false);
    },
    style: {
      marginRight: _Theme.default.spacing(1)
    }
  }, /*#__PURE__*/_react.default.createElement(_Close.default, {
    fontSize: "inherit"
  }))), /*#__PURE__*/_react.default.createElement(_DialogContent.default, {
    style: {
      marginBottom: _Theme.default.spacing(2)
    }
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    container: true,
    spacing: 2
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 6
  }, /*#__PURE__*/_react.default.createElement(StatusLegendElement, {
    status: availabilityStatusType,
    dialog: true
  })), !delineateRelease ? null : /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 6
  }, /*#__PURE__*/_react.default.createElement(StatusLegendElement, {
    status: "available-provisional",
    dialog: true
  })), /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 6
  }, /*#__PURE__*/_react.default.createElement(StatusLegendElement, {
    status: "not available",
    dialog: true
  })), !delineateRelease ? null : /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 6
  }, /*#__PURE__*/_react.default.createElement(StatusLegendElement, {
    status: "mixed-available-provisional",
    dialog: true
  })), !selectionEnabled ? null : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 6
  }, /*#__PURE__*/_react.default.createElement(SelectionLegendElement, {
    variant: "all",
    dialog: true
  })), /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 6
  }, /*#__PURE__*/_react.default.createElement(SelectionLegendElement, {
    variant: "some",
    dialog: true
  }))))));
};
LegendDialog.propTypes = {
  dialogOpen: _propTypes.default.bool.isRequired,
  setDialogOpen: _propTypes.default.func.isRequired,
  selectionEnabled: _propTypes.default.bool,
  delineateRelease: _propTypes.default.bool,
  availabilityStatusType: _propTypes.default.oneOf(['available', 'tombstoned'])
};
LegendDialog.defaultProps = {
  selectionEnabled: false,
  delineateRelease: false,
  availabilityStatusType: 'available'
};
var BasicAvailabilityKey = function BasicAvailabilityKey(props) {
  var classes = useStyles(_Theme.default);
  var selectionEnabled = props.selectionEnabled,
    delineateRelease = props.delineateRelease,
    availabilityStatusType = props.availabilityStatusType,
    dialogOnly = props.dialogOnly;
  var appliedAvaStatusType = !(0, _typeUtil.exists)(availabilityStatusType) ? 'available' : availabilityStatusType;
  var containerRef = (0, _react.useRef)();
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    dialogOpen = _useState2[0],
    setDialogOpen = _useState2[1];
  var _useState3 = (0, _react.useState)(0),
    _useState4 = _slicedToArray(_useState3, 2),
    componentWidth = _useState4[0],
    setComponentWidth = _useState4[1];
  var atContainerWidthXsFlexCol = false;
  var atContainerWidthXs = false;
  var atContainerWidthSelectionXs = false;
  var atContainerWidthSelectionSm = false;
  if (componentWidth > 0) {
    atContainerWidthXsFlexCol = componentWidth <= CONTAINER_WIDTH_BREAKPOINT_XS_FLEX_COL;
    atContainerWidthXs = componentWidth <= CONTAINER_WIDTH_BREAKPOINT_XS;
    atContainerWidthSelectionXs = componentWidth <= CONTAINER_WIDTH_BREAKPOINT_XS_SELECTION;
    atContainerWidthSelectionSm = componentWidth <= CONTAINER_WIDTH_BREAKPOINT_SM_SELECTION;
  }
  var containerStyleProps = atContainerWidthXsFlexCol ? {
    flexDirection: 'column'
  } : {};
  var handleResizeCb = (0, _react.useCallback)(function () {
    var container = containerRef.current;
    if (!container) {
      return;
    }
    if (container.clientWidth === componentWidth) {
      return;
    }
    setComponentWidth(container.clientWidth);
  }, [containerRef, componentWidth, setComponentWidth]);
  (0, _react.useLayoutEffect)(function () {
    var element = containerRef.current;
    if (!element) {
      return function () {};
    }
    handleResizeCb();
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', handleResizeCb);
      return function () {
        window.removeEventListener('resize', handleResizeCb);
      };
    }
    var resizeObserver = new ResizeObserver(handleResizeCb);
    resizeObserver.observe(element);
    return function () {
      if (!resizeObserver) {
        return;
      }
      resizeObserver.disconnect();
      resizeObserver = null;
    };
  }, [containerRef, handleResizeCb]);
  var renderLegendItems = function renderLegendItems() {
    if (dialogOnly) return null;
    if (selectionEnabled) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(StatusLegendElement, {
        status: appliedAvaStatusType,
        dialog: false
      }), !delineateRelease ? null : /*#__PURE__*/_react.default.createElement(StatusLegendElement, {
        status: "available-provisional",
        dialog: false
      }), /*#__PURE__*/_react.default.createElement(StatusLegendElement, {
        status: "not available",
        dialog: false
      }), !delineateRelease ? null : /*#__PURE__*/_react.default.createElement(StatusLegendElement, {
        status: "mixed-available-provisional",
        dialog: false
      })), !selectionEnabled ? null : /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(SelectionLegendElement, {
        variant: "all",
        dialog: false
      }), /*#__PURE__*/_react.default.createElement(SelectionLegendElement, {
        variant: "some",
        dialog: false
      })));
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(StatusLegendElement, {
      status: appliedAvaStatusType,
      dialog: false
    }), !delineateRelease ? null : /*#__PURE__*/_react.default.createElement(StatusLegendElement, {
      status: "available-provisional",
      dialog: false
    })), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(StatusLegendElement, {
      status: "not available",
      dialog: false
    }), !delineateRelease ? null : /*#__PURE__*/_react.default.createElement(StatusLegendElement, {
      status: "mixed-available-provisional",
      dialog: false
    })));
  };
  var renderLegendItemsContainer = function renderLegendItemsContainer() {
    if (dialogOnly || atContainerWidthSelectionXs) return null;
    if (selectionEnabled) {
      if (atContainerWidthSelectionSm) {
        // If at sm selection container width, wrap in containing div
        // to display all statuses vertically in single row
        return /*#__PURE__*/_react.default.createElement("div", null, renderLegendItems());
      }
      return renderLegendItems();
    }
    // If at xs container width, wrap in containing div
    // to display all statuses vertically in single row
    if (atContainerWidthXs) {
      return /*#__PURE__*/_react.default.createElement("div", null, renderLegendItems());
    }
    return renderLegendItems();
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    ref: containerRef,
    className: classes.legendContainer,
    style: containerStyleProps
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.legendTitleContainer
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    className: classes.legendTitle
  }, "Key:"), /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    size: "small",
    color: "primary",
    title: "Help - Data Availability Chart Key",
    "aria-label": "Help - Data Availability Chart Key",
    onClick: function onClick() {
      return setDialogOpen(true);
    },
    className: classes.legendTitleIcon
  }, /*#__PURE__*/_react.default.createElement(_HelpOutline.default, {
    fontSize: "small"
  }))), renderLegendItemsContainer()), /*#__PURE__*/_react.default.createElement(LegendDialog, {
    dialogOpen: dialogOpen,
    setDialogOpen: setDialogOpen,
    selectionEnabled: selectionEnabled,
    delineateRelease: delineateRelease,
    availabilityStatusType: appliedAvaStatusType
  }));
};
BasicAvailabilityKey.propTypes = {
  selectionEnabled: _propTypes.default.bool,
  delineateRelease: _propTypes.default.bool,
  availabilityStatusType: _propTypes.default.oneOf(['available', 'tombstoned']),
  dialogOnly: _propTypes.default.bool
};
BasicAvailabilityKey.defaultProps = {
  selectionEnabled: false,
  delineateRelease: false,
  availabilityStatusType: 'available',
  dialogOnly: false
};
var _default = BasicAvailabilityKey;
exports.default = _default;