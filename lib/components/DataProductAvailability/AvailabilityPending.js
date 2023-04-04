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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function AvailabilityPending(props) {
  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
    _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
    _NeonContext$useNeonC3 = _NeonContext$useNeonC2[0],
    neonContextIsFinal = _NeonContext$useNeonC3.isFinal,
    neonContextHasError = _NeonContext$useNeonC3.hasError;
  var message = props.message;
  if (neonContextIsFinal && !neonContextHasError) {
    return null;
  }
  var status = neonContextIsFinal && neonContextHasError ? 'error' : 'loading';
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