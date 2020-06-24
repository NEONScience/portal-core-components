"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _AppBar = _interopRequireDefault(require("@material-ui/core/AppBar"));

var _Dialog = _interopRequireDefault(require("@material-ui/core/Dialog"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _Slide = _interopRequireDefault(require("@material-ui/core/Slide"));

var _Toolbar = _interopRequireDefault(require("@material-ui/core/Toolbar"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Close = _interopRequireDefault(require("@material-ui/icons/Close"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Transition = (0, _react.forwardRef)(function (props, ref) {
  return /*#__PURE__*/_react.default.createElement(_Slide.default, _extends({
    direction: "up",
    ref: ref
  }, props));
});
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    dialogTitle: {
      marginLeft: theme.spacing(2),
      flex: 1
    },
    dialogPaper: {
      backgroundColor: theme.palette.grey[200],
      position: 'relative'
    },
    noPaper: {
      margin: theme.spacing(2)
    },
    contentPaper: {
      margin: theme.spacing(2),
      padding: theme.spacing(3)
    }
  };
});

var DialogBase = function DialogBase(props) {
  var classes = useStyles(_Theme.default);
  var belowSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('xs'));

  var open = props.open,
      onClose = props.onClose,
      title = props.title,
      toolbarChildren = props.toolbarChildren,
      children = props.children,
      closeButtonProps = props.closeButtonProps,
      nopaper = props.nopaper,
      other = _objectWithoutProperties(props, ["open", "onClose", "title", "toolbarChildren", "children", "closeButtonProps", "nopaper"]);

  return /*#__PURE__*/_react.default.createElement(_Dialog.default, _extends({
    open: open,
    onClose: onClose,
    TransitionComponent: Transition,
    fullScreen: true,
    PaperProps: {
      className: classes.dialogPaper,
      style: {
        top: _Theme.default.spacing(belowSm ? 0.5 : 4),
        height: "calc(100% - ".concat(_Theme.default.spacing(belowSm ? 13 : 8), "px)")
      }
    }
  }, other), /*#__PURE__*/_react.default.createElement(_AppBar.default, {
    color: "secondary"
  }, /*#__PURE__*/_react.default.createElement(_Toolbar.default, null, /*#__PURE__*/_react.default.createElement(_IconButton.default, _extends({
    "data-selenium": "dialog-close-button",
    edge: "start",
    color: "inherit",
    onClick: onClose,
    "aria-label": "cancel"
  }, closeButtonProps), /*#__PURE__*/_react.default.createElement(_Close.default, null)), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h5",
    className: classes.dialogTitle,
    noWrap: true
  }, title), toolbarChildren)), nopaper ? /*#__PURE__*/_react.default.createElement("div", {
    className: classes.noPaper
  }, children) : /*#__PURE__*/_react.default.createElement(_Paper.default, {
    className: classes.contentPaper
  }, children));
};

DialogBase.propTypes = {
  open: _propTypes.default.bool,
  onClose: _propTypes.default.func.isRequired,
  title: _propTypes.default.string.isRequired,
  toolbarChildren: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]),
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]).isRequired,
  closeButtonProps: _propTypes.default.objectOf(_propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])),
  nopaper: _propTypes.default.bool
};
DialogBase.defaultProps = {
  open: true,
  toolbarChildren: null,
  closeButtonProps: {},
  nopaper: false
};
var _default = DialogBase;
exports.default = _default;