"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AvailabilityPending;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Card = _interopRequireDefault(require("@material-ui/core/Card"));
var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));
var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function AvailabilityPending(props) {
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
  return /*#__PURE__*/_react.default.createElement(_Card.default, {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      flexDirection: 'column'
    }
  }, status === 'loading' ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle2",
    component: "h6",
    gutterBottom: true
  }, message), /*#__PURE__*/_react.default.createElement(_CircularProgress.default, null)) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Warning.default, {
    fontSize: "large",
    color: "error"
  }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle2",
    component: "h6",
    style: {
      marginTop: '8px'
    }
  }, "Error - Unable to Load Sites"))));
}
AvailabilityPending.propTypes = {
  message: _propTypes.default.string
};
AvailabilityPending.defaultProps = {
  message: 'Loading Sites...'
};