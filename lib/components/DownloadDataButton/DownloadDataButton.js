"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styles = require("@material-ui/core/styles");

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _CloudDownload = _interopRequireDefault(require("@material-ui/icons/CloudDownload"));

var _DownloadDataDialog = _interopRequireDefault(require("../DownloadDataDialog/DownloadDataDialog"));

var _DownloadDataContext = _interopRequireDefault(require("../DownloadDataContext/DownloadDataContext"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var useStyles = (0, _styles.makeStyles)(function () {
  return {
    gtmCaptureButton: {
      '& span': {
        pointerEvents: 'none'
      }
    }
  };
});

var DownloadDataButton = function DownloadDataButton(props) {
  var label = props.label,
      other = _objectWithoutProperties(props, ["label"]);

  var classes = useStyles();

  var _DownloadDataContext$ = _DownloadDataContext.default.useDownloadDataState(),
      _DownloadDataContext$2 = _slicedToArray(_DownloadDataContext$, 2),
      productData = _DownloadDataContext$2[0].productData,
      dispatch = _DownloadDataContext$2[1];

  function handleOpenDialog() {
    dispatch({
      type: 'setDialogOpen',
      open: true
    });
  }

  var gtmProps = {};

  if (productData.productCode) {
    gtmProps.className = classes.gtmCaptureButton;
    gtmProps['data-gtm-product-code'] = productData.productCode;
  }

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Button.default, _extends({
    color: "primary",
    variant: "contained",
    onClick: handleOpenDialog,
    "data-selenium": "download-data-button"
  }, gtmProps, other), label, /*#__PURE__*/_react.default.createElement(_CloudDownload.default, {
    style: {
      marginLeft: _Theme.default.spacing(1)
    }
  })), /*#__PURE__*/_react.default.createElement(_DownloadDataDialog.default, null));
};

DownloadDataButton.propTypes = {
  label: _propTypes.default.string
};
DownloadDataButton.defaultProps = {
  label: 'Download Data'
};

var WrappedDownloadDataButton = _Theme.default.getWrappedComponent(DownloadDataButton);

var _default = WrappedDownloadDataButton;
exports.default = _default;