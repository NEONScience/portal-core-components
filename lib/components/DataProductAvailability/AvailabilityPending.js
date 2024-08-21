"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AvailabilityPending;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Card = _interopRequireDefault(require("@mui/material/Card"));
var _CardContent = _interopRequireDefault(require("@mui/material/CardContent"));
var _CircularProgress = _interopRequireDefault(require("@mui/material/CircularProgress"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Warning = _interopRequireDefault(require("@mui/icons-material/Warning"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _defaultProps = require("../../util/defaultProps");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const defaultProps = {
  message: 'Loading Sites...'
};
function AvailabilityPending(inProps) {
  const props = (0, _defaultProps.resolveProps)(defaultProps, inProps);
  const [{
    isFinal: neonContextIsFinal,
    hasError: neonContextHasError
  }] = _NeonContext.default.useNeonContextState();
  const {
    message
  } = props;
  if (neonContextIsFinal && !neonContextHasError) {
    return null;
  }
  const status = neonContextIsFinal && neonContextHasError ? 'error' : 'loading';
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Card.default, {
    style: {
      width: '100%'
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_CardContent.default, {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        flexDirection: 'column'
      },
      children: status === 'loading' ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "subtitle2",
          component: "h6",
          gutterBottom: true,
          children: message
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_CircularProgress.default, {})]
      }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Warning.default, {
          fontSize: "large",
          color: "error"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "subtitle2",
          component: "h6",
          style: {
            marginTop: '8px'
          },
          children: "Error - Unable to Load Sites"
        })]
      })
    })
  });
}
AvailabilityPending.propTypes = {
  message: _propTypes.default.string
};