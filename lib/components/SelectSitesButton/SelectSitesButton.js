"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var _SiteMap = _interopRequireDefault(require("../SiteMap/SiteMap"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    appBar: {
      position: 'relative'
    },
    appBarTitle: {
      marginLeft: theme.spacing(2),
      flex: 1
    },
    buttonIcon: {
      marginLeft: theme.spacing(1)
    }
  };
});

var SelectSitesButton = function SelectSitesButton(props) {
  var label = props.label,
      buttonProps = props.buttonProps,
      tooltipProps = props.tooltipProps,
      siteMapProps = props.siteMapProps,
      selectionLimit = props.selectionLimit;
  var classes = useStyles(_Theme.default);

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      dialogOpen = _useState2[0],
      setDialogOpen = _useState2[1];

  var selectSitesTitle = 'Select sites';

  if (typeof selectionLimit === 'number') {
    selectSitesTitle = "Select ".concat(selectionLimit.toString(), " site").concat(selectionLimit === 1 ? '' : 's');
  }

  if (Array.isArray(selectionLimit)) {
    var min = selectionLimit[0],
        max = selectionLimit[1];
    selectSitesTitle = "Select ".concat(min.toString(), "-").concat(max.toString(), " sites");
  }

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Tooltip.default, _extends({
    title: "".concat(selectSitesTitle, " using the observatory map"),
    "aria-label": "".concat(selectSitesTitle, " using the observatory map")
  }, tooltipProps), /*#__PURE__*/_react.default.createElement(_Button.default, _extends({
    color: "primary",
    variant: "contained",
    onClick: function onClick() {
      return setDialogOpen(true);
    },
    "data-selenium": "select-sites-button"
  }, buttonProps), label, /*#__PURE__*/_react.default.createElement(_Language.default, {
    className: classes.buttonIcon
  }))), /*#__PURE__*/_react.default.createElement(_Dialog.default, {
    fullScreen: true,
    open: dialogOpen,
    onClose: function onClose() {
      return setDialogOpen(false);
    }
  }, /*#__PURE__*/_react.default.createElement(_AppBar.default, {
    color: "secondary",
    className: classes.appBar
  }, /*#__PURE__*/_react.default.createElement(_Toolbar.default, null, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    edge: "start",
    color: "primary",
    variant: "contained",
    "aria-label": "close",
    onClick: function onClick() {
      return setDialogOpen(false);
    }
  }, /*#__PURE__*/_react.default.createElement(_Close.default, null)), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h5",
    className: classes.appBarTitle
  }, selectSitesTitle), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: "Complete selection and return",
    "aria-label": "Complete selection and return"
  }, /*#__PURE__*/_react.default.createElement(_Button.default, {
    color: "primary",
    variant: "contained",
    onClick: function onClick() {}
  }, "Save", /*#__PURE__*/_react.default.createElement(_Done.default, {
    className: classes.buttonIcon
  }))))), /*#__PURE__*/_react.default.createElement(_SiteMap.default, _extends({
    selection: "SITES"
  }, siteMapProps))));
};

var SelectionLimitPropType = function SelectionLimitPropType(props, propName) {
  var prop = props[propName];

  if (typeof prop === 'number' && (!Number.isInteger(prop) || prop < 1)) {
    return new Error("When setting ".concat(propName, " as a number it must be an integer greater than 0"));
  }

  if (Array.isArray(prop) && (prop.length !== 2 || !prop.every(function (x) {
    return Number.isInteger(x) && x > 0;
  }) || prop[0] >= prop[1])) {
    return new Error( // eslint-disable-next-line max-len
    "When setting ".concat(propName, " as an array it must contain exactly two distinct non-zero positive integers in ascending order (e.g. [2, 5])"));
  }

  if (prop !== null) {
    return new Error( // eslint-disable-next-line max-len
    "".concat(propName, " must be null, a positive non-zero integer, or an array of two ascending non-zero positive integers"));
  }

  return null;
};

SelectSitesButton.propTypes = {
  label: _propTypes.default.string,
  buttonProps: _propTypes.default.shape(_Button.default.propTypes),
  tooltipProps: _propTypes.default.shape(_Tooltip.default.propTypes),
  siteMapProps: _propTypes.default.shape(_SiteMap.default.propTypes),
  selectionLimit: SelectionLimitPropType
};
SelectSitesButton.defaultProps = {
  label: 'Map',
  buttonProps: {},
  tooltipProps: {},
  siteMapProps: {},
  selectionLimit: null
};

var WrappedDownloadDataButton = _Theme.default.getWrappedComponent(SelectSitesButton);

var _default = WrappedDownloadDataButton;
exports.default = _default;