"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _useMediaQuery = _interopRequireDefault(require("@mui/material/useMediaQuery"));
var _AppBar = _interopRequireDefault(require("@mui/material/AppBar"));
var _Dialog = _interopRequireDefault(require("@mui/material/Dialog"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Paper = _interopRequireDefault(require("@mui/material/Paper"));
var _Slide = _interopRequireDefault(require("@mui/material/Slide"));
var _Toolbar = _interopRequireDefault(require("@mui/material/Toolbar"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Close = _interopRequireDefault(require("@mui/icons-material/Close"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _defaultProps = require("../../util/defaultProps");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const Transition = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_Slide.default, {
  direction: "up",
  ref: ref,
  ...props
}));
const useStyles = belowSm => (0, _styles.makeStyles)(theme => ({
  dialogTitle: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  dialogPaper: {
    backgroundColor: theme.palette.grey[200],
    position: 'relative'
  },
  noPaper: {
    margin: theme.spacing(10, 2, belowSm ? 9 : 2, 2)
  },
  contentPaper: {
    margin: theme.spacing(10, 2, belowSm ? 9 : 2, 2),
    padding: theme.spacing(3)
  }
}));
const defaultProps = {
  open: true,
  toolbarChildren: null,
  closeButtonProps: {},
  customClasses: {},
  nopaper: false,
  style: {}
};
const DialogBase = inProps => {
  const props = (0, _defaultProps.resolveProps)(defaultProps, inProps);
  const belowSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('xs'));
  const classes = useStyles(belowSm)(_Theme.default);
  const {
    open,
    onClose,
    title,
    toolbarChildren,
    children,
    closeButtonProps,
    customClasses,
    nopaper,
    style,
    ...other
  } = props;
  const appliedPaperClass = customClasses && customClasses.contentPaper ? customClasses.contentPaper : classes.contentPaper;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Dialog.default, {
    open: open,
    onClose: onClose,
    TransitionComponent: Transition,
    fullScreen: true,
    PaperProps: {
      className: classes.dialogPaper
    },
    style: {
      ...style,
      zIndex: _Theme.default.zIndex.fullScreenBackdrop
    },
    ...other,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_AppBar.default, {
      color: "secondary",
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Toolbar.default, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
          "data-selenium": "dialog-close-button",
          edge: "start",
          color: "inherit",
          onClick: onClose,
          "aria-label": "cancel",
          ...closeButtonProps,
          size: "large",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Close.default, {})
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "h5",
          className: classes.dialogTitle,
          noWrap: true,
          children: title
        }), toolbarChildren]
      })
    }), nopaper ? /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.noPaper,
      children: children
    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Paper.default, {
      className: appliedPaperClass,
      children: children
    })]
  });
};
DialogBase.propTypes = {
  open: _propTypes.default.bool,
  onClose: _propTypes.default.func.isRequired,
  title: _propTypes.default.string.isRequired,
  toolbarChildren: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]),
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]).isRequired,
  closeButtonProps: _propTypes.default.objectOf(_propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])),
  customClasses: _propTypes.default.objectOf(_propTypes.default.oneOfType([_propTypes.default.string])),
  nopaper: _propTypes.default.bool,
  style: _propTypes.default.object // eslint-disable-line react/forbid-prop-types
};
var _default = exports.default = DialogBase;