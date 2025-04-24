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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const SiteMap = /*#__PURE__*/_react.default.lazy(() => Promise.resolve().then(() => _interopRequireWildcard(require('../SiteMap/SiteMap'))));
const useStyles = (0, _styles.makeStyles)(theme => ({
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
}));
const MapSelectionButton = props => {
  const {
    label,
    icon,
    dialogTitle: dialogTitleProp,
    buttonProps,
    siteMapProps,
    tooltipProps,
    selection: selectionProp,
    validItems,
    selectedItems,
    selectionLimit,
    onSave
  } = props;
  const classes = useStyles(_Theme.default);
  const [dialogOpen, setDialogOpen] = (0, _react.useState)(false);
  const [dialogEntered, setDialogEntered] = (0, _react.useState)(false);
  const [selection, setSelection] = (0, _react.useState)((0, _SiteMapUtils.getDefaultState)().selection);
  let unit = '';
  let units = '';
  if (selectionProp) {
    unit = _SiteMapUtils.FEATURE_TYPES[selectionProp].unit || '';
    units = _SiteMapUtils.FEATURE_TYPES[selectionProp].units || '';
  }
  let dialogTitle = "Select ".concat(units);
  if (typeof selectionLimit === 'number') {
    dialogTitle = selectionLimit === 1 ? "Select a ".concat(unit) : "Select ".concat(selectionLimit.toString(), " ").concat(units);
  }
  if (Array.isArray(selectionLimit)) {
    const {
      0: min,
      1: max
    } = selectionLimit;
    dialogTitle = min === 1 ? "Select up to ".concat(max.toString(), " ").concat(units) : "Select ".concat(min.toString(), "-").concat(max.toString(), " ").concat(units);
  }
  const saveTooltipProps = selection.valid ? {} : {
    disableFocusListener: true,
    disableHoverListener: true,
    disableTouchListener: true
  };
  const aspectRatio = (window.innerHeight - 64) / window.innerWidth;
  const embedProps = {
    fullscreen: true,
    selection: selectionProp,
    aspectRatio,
    validItems,
    selectedItems,
    selectionLimit,
    onSelectionChange: setSelection
  };
  const finalEmbedProps = siteMapProps ? _extends({}, siteMapProps, embedProps) : embedProps;
  const suspenseFallback = /*#__PURE__*/_react.default.createElement("div", {
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
    onClick: () => setDialogOpen(true)
  }), label)), /*#__PURE__*/_react.default.createElement(_Dialog.default, {
    fullScreen: true,
    open: dialogOpen,
    onClose: () => setDialogOpen(false),
    TransitionProps: {
      onEntered: () => setDialogEntered(true)
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
    onClick: () => setDialogOpen(false)
  }, /*#__PURE__*/_react.default.createElement(_Close.default, null))), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h5",
    className: classes.appBarTitle
  }, dialogTitleProp || dialogTitle), /*#__PURE__*/_react.default.createElement(_Tooltip.default, _extends({
    title: "Complete selection and return",
    "aria-label": "Complete selection and return"
  }, saveTooltipProps), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Button.default, {
    color: "primary",
    variant: "contained",
    onClick: () => {
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
  onSave: () => {}
};
const WrappedMapSelectionButton = _Theme.default.getWrappedComponent(MapSelectionButton);
var _default = exports.default = WrappedMapSelectionButton;