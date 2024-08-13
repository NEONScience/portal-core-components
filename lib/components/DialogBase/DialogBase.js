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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const Transition = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_Slide.default, _extends({
  direction: "up",
  ref: ref
}, props)));
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
const DialogBase = props => {
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
  return /*#__PURE__*/_react.default.createElement(_Dialog.default, _extends({
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
    }
  }, other), /*#__PURE__*/_react.default.createElement(_AppBar.default, {
    color: "secondary"
  }, /*#__PURE__*/_react.default.createElement(_Toolbar.default, null, /*#__PURE__*/_react.default.createElement(_IconButton.default, _extends({
    "data-selenium": "dialog-close-button",
    edge: "start",
    color: "inherit",
    onClick: onClose,
    "aria-label": "cancel"
  }, closeButtonProps, {
    size: "large"
  }), /*#__PURE__*/_react.default.createElement(_Close.default, null)), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h5",
    className: classes.dialogTitle,
    noWrap: true
  }, title), toolbarChildren)), nopaper ? /*#__PURE__*/_react.default.createElement("div", {
    className: classes.noPaper
  }, children) : /*#__PURE__*/_react.default.createElement(_Paper.default, {
    className: appliedPaperClass
  }, children));
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
DialogBase.defaultProps = {
  open: true,
  toolbarChildren: null,
  closeButtonProps: {},
  customClasses: {},
  nopaper: false,
  style: {}
};
var _default = exports.default = DialogBase;