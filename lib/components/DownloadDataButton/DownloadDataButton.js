"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _SaveAlt = _interopRequireDefault(require("@mui/icons-material/SaveAlt"));
var _DownloadDataContext = _interopRequireDefault(require("../DownloadDataContext/DownloadDataContext"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _defaultProps = require("../../util/defaultProps");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
const defaultProps = {
  label: 'Download Data'
};
const DownloadDataButton = inProps => {
  const props = (0, _defaultProps.resolveProps)(defaultProps, inProps);
  const {
    label,
    ...other
  } = props;
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
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
      color: "primary",
      variant: "contained"
      // eslint-disable-next-line react/jsx-no-bind
      ,
      onClick: handleOpenDialog,
      "data-selenium": "download-data-button",
      endIcon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_SaveAlt.default, {}),
      ...gtmProps,
      ...other,
      children: label
    }), !dialogOpen ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_react.Suspense, {
      fallback: null,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(DownloadDataDialog, {})
    })]
  });
};
DownloadDataButton.propTypes = {
  label: _propTypes.default.string
};
const WrappedDownloadDataButton = _Theme.default.getWrappedComponent(DownloadDataButton);
var _default = exports.default = WrappedDownloadDataButton;