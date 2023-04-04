"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@material-ui/core/styles");
var _AppBar = _interopRequireDefault(require("@material-ui/core/AppBar"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _Dialog = _interopRequireDefault(require("@material-ui/core/Dialog"));
var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));
var _Toolbar = _interopRequireDefault(require("@material-ui/core/Toolbar"));
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Close = _interopRequireDefault(require("@material-ui/icons/Close"));
var _Done = _interopRequireDefault(require("@material-ui/icons/Done"));
var _Language = _interopRequireDefault(require("@material-ui/icons/Language"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _SiteMapUtils = require("../SiteMap/SiteMapUtils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var SiteMap = /*#__PURE__*/_react.default.lazy(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('../SiteMap/SiteMap'));
  });
});
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    appBar: {
      position: 'relative',
      paddingRight: '0px !important'
    },
    appBarTitle: {
      marginLeft: theme.spacing(2),
      flex: 1
    },
    toolbar: {
      padding: '0px 10px 0px 14px'
    },
    toolbarClose: {
      '&:hover': {
        backgroundColor: '#ffffff33'
      },
      '&:not(:hover):not(:focus)': {
        backgroundColor: '#ffffff11',
        border: "1px solid ".concat(theme.palette.primary.main, "11")
      }
    },
    buttonIcon: {
      marginLeft: theme.spacing(1)
    },
    suspenseFallback: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.palette.grey[200],
      fontSize: '1.5em'
    }
  };
});
var MapSelectionButton = function MapSelectionButton(props) {
  var label = props.label,
    icon = props.icon,
    dialogTitleProp = props.dialogTitle,
    buttonProps = props.buttonProps,
    siteMapProps = props.siteMapProps,
    tooltipProps = props.tooltipProps,
    selectionProp = props.selection,
    validItems = props.validItems,
    selectedItems = props.selectedItems,
    selectionLimit = props.selectionLimit,
    onSave = props.onSave;
  var classes = useStyles(_Theme.default);
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    dialogOpen = _useState2[0],
    setDialogOpen = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    dialogEntered = _useState4[0],
    setDialogEntered = _useState4[1];
  var _useState5 = (0, _react.useState)(_SiteMapUtils.DEFAULT_STATE.selection),
    _useState6 = _slicedToArray(_useState5, 2),
    selection = _useState6[0],
    setSelection = _useState6[1];
  var unit = '';
  var units = '';
  if (selectionProp) {
    unit = _SiteMapUtils.FEATURE_TYPES[selectionProp].unit || '';
    units = _SiteMapUtils.FEATURE_TYPES[selectionProp].units || '';
  }
  var dialogTitle = "Select ".concat(units);
  if (typeof selectionLimit === 'number') {
    dialogTitle = selectionLimit === 1 ? "Select a ".concat(unit) : "Select ".concat(selectionLimit.toString(), " ").concat(units);
  }
  if (Array.isArray(selectionLimit)) {
    var min = selectionLimit[0],
      max = selectionLimit[1];
    dialogTitle = min === 1 ? "Select up to ".concat(max.toString(), " ").concat(units) : "Select ".concat(min.toString(), "-").concat(max.toString(), " ").concat(units);
  }
  var saveTooltipProps = selection.valid ? {} : {
    disableFocusListener: true,
    disableHoverListener: true,
    disableTouchListener: true
  };
  var aspectRatio = (window.innerHeight - 64) / window.innerWidth;
  var embedProps = {
    fullscreen: true,
    selection: selectionProp,
    aspectRatio: aspectRatio,
    validItems: validItems,
    selectedItems: selectedItems,
    selectionLimit: selectionLimit,
    onSelectionChange: setSelection
  };
  var finalEmbedProps = siteMapProps ? _extends({}, siteMapProps, embedProps) : embedProps;
  var suspenseFallback = /*#__PURE__*/_react.default.createElement("div", {
    className: classes.suspenseFallback
  }, "Loading Map...");
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Tooltip.default, _extends({
    title: "".concat(dialogTitle, " using the observatory map"),
    "aria-label": "".concat(dialogTitle, " using the observatory map")
  }, tooltipProps), /*#__PURE__*/_react.default.createElement(_Button.default, _extends({
    color: "primary",
    variant: "contained",
    "data-selenium": "map-selection-button",
    startIcon: icon ? /*#__PURE__*/_react.default.createElement(_Language.default, null) : null
  }, buttonProps, {
    onClick: function onClick() {
      return setDialogOpen(true);
    }
  }), label)), /*#__PURE__*/_react.default.createElement(_Dialog.default, {
    fullScreen: true,
    open: dialogOpen,
    onClose: function onClose() {
      return setDialogOpen(false);
    },
    TransitionProps: {
      onEntered: function onEntered() {
        return setDialogEntered(true);
      }
    }
  }, /*#__PURE__*/_react.default.createElement(_AppBar.default, {
    color: "secondary",
    className: classes.appBar
  }, /*#__PURE__*/_react.default.createElement(_Toolbar.default, {
    className: classes.toolbar
  }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: "Exit selection without saving",
    "aria-label": "Exit selection without saving"
  }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    edge: "start",
    color: "primary",
    variant: "contained",
    "aria-label": "close",
    size: "small",
    className: classes.toolbarClose,
    onClick: function onClick() {
      return setDialogOpen(false);
    }
  }, /*#__PURE__*/_react.default.createElement(_Close.default, null))), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h5",
    className: classes.appBarTitle
  }, dialogTitleProp || dialogTitle), /*#__PURE__*/_react.default.createElement(_Tooltip.default, _extends({
    title: "Complete selection and return",
    "aria-label": "Complete selection and return"
  }, saveTooltipProps), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Button.default, {
    color: "primary",
    variant: "contained",
    onClick: function onClick() {
      onSave(selection.set);
      setDialogOpen(false);
    },
    disabled: !selection.valid
  }, "Save", /*#__PURE__*/_react.default.createElement(_Done.default, {
    className: classes.buttonIcon
  })))))), !dialogEntered ? null : /*#__PURE__*/_react.default.createElement(_react.Suspense, {
    fallback: suspenseFallback
  }, /*#__PURE__*/_react.default.createElement(SiteMap, finalEmbedProps))));
};
MapSelectionButton.propTypes = {
  label: _propTypes.default.string,
  icon: _propTypes.default.bool,
  dialogTitle: _propTypes.default.string,
  buttonProps: _propTypes.default.shape(_Button.default.propTypes),
  siteMapProps: _propTypes.default.shape(_SiteMapUtils.SITE_MAP_PROP_TYPES),
  tooltipProps: _propTypes.default.shape(_Tooltip.default.propTypes),
  selection: _SiteMapUtils.SITE_MAP_PROP_TYPES.selection.isRequired,
  validItems: _SiteMapUtils.SITE_MAP_PROP_TYPES.validItems,
  selectedItems: _SiteMapUtils.SITE_MAP_PROP_TYPES.selectedItems,
  selectionLimit: _SiteMapUtils.SITE_MAP_PROP_TYPES.selectionLimit,
  onSave: _propTypes.default.func
};
MapSelectionButton.defaultProps = {
  label: 'Map',
  icon: true,
  dialogTitle: null,
  buttonProps: {},
  siteMapProps: null,
  tooltipProps: {},
  validItems: null,
  selectedItems: [],
  selectionLimit: null,
  onSave: function onSave() {}
};
var WrappedMapSelectionButton = _Theme.default.getWrappedComponent(MapSelectionButton);
var _default = WrappedMapSelectionButton;
exports.default = _default;