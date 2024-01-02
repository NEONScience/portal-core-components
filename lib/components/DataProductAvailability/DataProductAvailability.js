"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _AvailabilityContext = _interopRequireDefault(require("./AvailabilityContext"));
var _BasicAvailabilityInterface = _interopRequireDefault(require("./BasicAvailabilityInterface"));
var _EnhancedAvailabilityInterface = _interopRequireDefault(require("./EnhancedAvailabilityInterface"));
var _AvailabilityUtils = require("./AvailabilityUtils");
const _excluded = ["sites", "siteCodes"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const DataProductAvailability = props => {
  const {
      sites: enhancedSites,
      siteCodes: basicSiteCodes
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);

  // Favor enhanced view if we have the enhanced prop
  return enhancedSites.length ? /*#__PURE__*/_react.default.createElement(_AvailabilityContext.default.Provider, props, /*#__PURE__*/_react.default.createElement(_EnhancedAvailabilityInterface.default, _extends({
    sites: enhancedSites
  }, other))) : /*#__PURE__*/_react.default.createElement(_BasicAvailabilityInterface.default, _extends({
    siteCodes: basicSiteCodes
  }, other));
};
DataProductAvailability.propTypes = {
  sites: _AvailabilityUtils.AvailabilityPropTypes.enhancedSites,
  // Enhanced availability data
  siteCodes: _AvailabilityUtils.AvailabilityPropTypes.basicSiteCodes,
  // Basic availability data
  dataProducts: _AvailabilityUtils.AvailabilityPropTypes.dataProducts,
  view: _propTypes.default.oneOf(['summary', 'sites', 'states', 'domains', 'ungrouped', 'products']),
  sortMethod: _propTypes.default.oneOf(['sites', 'states', 'domains']),
  sortDirection: _propTypes.default.oneOf(['ASC', 'DESC']),
  disableSelection: _propTypes.default.bool,
  delineateRelease: _propTypes.default.bool,
  availabilityStatusType: _propTypes.default.oneOf(['available', 'tombstoned'])
};
DataProductAvailability.defaultProps = {
  sites: [],
  siteCodes: [],
  dataProducts: [],
  view: null,
  sortMethod: null,
  sortDirection: 'ASC',
  disableSelection: false,
  delineateRelease: false,
  availabilityStatusType: null
};
const WrappedDataProductAvailability = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(DataProductAvailability));
var _default = exports.default = WrappedDataProductAvailability;