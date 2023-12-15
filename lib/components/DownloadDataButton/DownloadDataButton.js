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
const _excluded = ["label"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const DownloadDataDialog = /*#__PURE__*/_react.default.lazy(() => Promise.resolve().then(() => _interopRequireWildcard(require('../DownloadDataDialog/DownloadDataDialog'))));
const useStyles = (0, _styles.makeStyles)(() => ({
  gtmCaptureButton: {
    '& span': {
      pointerEvents: 'none'
    }
  }
}));
const DownloadDataButton = props => {
  const {
      label
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const classes = useStyles();
  const [{
    dialogOpen,
    productData
  }, dispatch] = _DownloadDataContext.default.useDownloadDataState();
  function handleOpenDialog() {
    dispatch({
      type: 'setDialogOpen',
      open: true
    });
  }
  const gtmProps = {};
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
const WrappedDownloadDataButton = _Theme.default.getWrappedComponent(DownloadDataButton);
var _default = exports.default = WrappedDownloadDataButton;