"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _AppBar = _interopRequireDefault(require("@mui/material/AppBar"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _Dialog = _interopRequireDefault(require("@mui/material/Dialog"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Toolbar = _interopRequireDefault(require("@mui/material/Toolbar"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Close = _interopRequireDefault(require("@mui/icons-material/Close"));
var _Done = _interopRequireDefault(require("@mui/icons-material/Done"));
var _Language = _interopRequireDefault(require("@mui/icons-material/Language"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _SiteMapUtils = require("../SiteMap/SiteMapUtils");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
      border: `1px solid ${theme.palette.primary.main}11`
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
  let dialogTitle = `Select ${units}`;
  if (typeof selectionLimit === 'number') {
    dialogTitle = selectionLimit === 1 ? `Select a ${unit}` : `Select ${selectionLimit.toString()} ${units}`;
  }
  if (Array.isArray(selectionLimit)) {
    const {
      0: min,
      1: max
    } = selectionLimit;
    dialogTitle = min === 1 ? `Select up to ${max.toString()} ${units}` : `Select ${min.toString()}-${max.toString()} ${units}`;
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
  const finalEmbedProps = siteMapProps ? {
    ...siteMapProps,
    ...embedProps
  } : embedProps;
  const suspenseFallback = /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: classes.suspenseFallback,
    children: "Loading Map..."
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: `${dialogTitle} using the observatory map`,
      "aria-label": `${dialogTitle} using the observatory map`,
      ...tooltipProps,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
        color: "primary",
        variant: "contained",
        "data-selenium": "map-selection-button",
        startIcon: icon ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Language.default, {}) : null,
        ...buttonProps,
        onClick: () => setDialogOpen(true),
        children: label
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Dialog.default, {
      fullScreen: true,
      open: dialogOpen,
      onClose: () => setDialogOpen(false),
      TransitionProps: {
        onEntered: () => setDialogEntered(true)
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_AppBar.default, {
        color: "secondary",
        className: classes.appBar,
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Toolbar.default, {
          className: classes.toolbar,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
            title: "Exit selection without saving",
            "aria-label": "Exit selection without saving",
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
              edge: "start",
              color: "primary",
              variant: "contained",
              "aria-label": "close",
              size: "small",
              className: classes.toolbarClose,
              onClick: () => setDialogOpen(false),
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Close.default, {})
            })
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "h5",
            className: classes.appBarTitle,
            children: dialogTitleProp || dialogTitle
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
            title: "Complete selection and return",
            "aria-label": "Complete selection and return",
            ...saveTooltipProps,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
              children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Button.default, {
                color: "primary",
                variant: "contained",
                onClick: () => {
                  onSave(selection.set);
                  setDialogOpen(false);
                },
                disabled: !selection.valid,
                children: ["Save", /*#__PURE__*/(0, _jsxRuntime.jsx)(_Done.default, {
                  className: classes.buttonIcon
                })]
              })
            })
          })]
        })
      }), !dialogEntered ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_react.Suspense, {
        fallback: suspenseFallback,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(SiteMap, {
          ...finalEmbedProps
        })
      })]
    })]
  });
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
  tooltipProps: {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {})
  },
  validItems: null,
  selectedItems: [],
  selectionLimit: null,
  onSave: () => {}
};
const WrappedMapSelectionButton = _Theme.default.getWrappedComponent(MapSelectionButton);
var _default = exports.default = WrappedMapSelectionButton;