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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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