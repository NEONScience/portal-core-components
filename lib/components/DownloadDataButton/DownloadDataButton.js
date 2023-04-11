"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@material-ui/core/styles");
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _SaveAlt = _interopRequireDefault(require("@material-ui/icons/SaveAlt"));
var _DownloadDataContext = _interopRequireDefault(require("../DownloadDataContext/DownloadDataContext"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _excluded = ["label"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var DownloadDataDialog = /*#__PURE__*/_react.default.lazy(function () {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('../DownloadDataDialog/DownloadDataDialog'));
  });
});
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
    other = _objectWithoutProperties(props, _excluded);
  var classes = useStyles();
  var _DownloadDataContext$ = _DownloadDataContext.default.useDownloadDataState(),
    _DownloadDataContext$2 = _slicedToArray(_DownloadDataContext$, 2),
    _DownloadDataContext$3 = _DownloadDataContext$2[0],
    dialogOpen = _DownloadDataContext$3.dialogOpen,
    productData = _DownloadDataContext$3.productData,
    dispatch = _DownloadDataContext$2[1];
  function handleOpenDialog() {
    dispatch({
      type: 'setDialogOpen',
      open: true
    });
  }
  var gtmProps = {};
  if ((productData || {}).productCode) {
    gtmProps.className = classes.gtmCaptureButton;
    gtmProps['data-gtm-product-code'] = productData.productCode;
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Button.default, _extends({
    color: "primary",
    variant: "contained"
    // eslint-disable-next-line react/jsx-no-bind
    ,
    onClick: handleOpenDialog,
    "data-selenium": "download-data-button",
    endIcon: /*#__PURE__*/_react.default.createElement(_SaveAlt.default, null)
  }, gtmProps, other), label), !dialogOpen ? null : /*#__PURE__*/_react.default.createElement(_react.Suspense, {
    fallback: null
  }, /*#__PURE__*/_react.default.createElement(DownloadDataDialog, null)));
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