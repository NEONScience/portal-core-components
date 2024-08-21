"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _defaultProps = require("../../util/defaultProps");
var _AvailabilityContext = _interopRequireDefault(require("./AvailabilityContext"));
var _BasicAvailabilityInterface = _interopRequireDefault(require("./BasicAvailabilityInterface"));
var _EnhancedAvailabilityInterface = _interopRequireDefault(require("./EnhancedAvailabilityInterface"));
var _AvailabilityUtils = require("./AvailabilityUtils");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const defaultProps = {
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
const DataProductAvailability = inProps => {
  const props = (0, _defaultProps.resolveProps)(defaultProps, inProps);
  const {
    sites: enhancedSites,
    siteCodes: basicSiteCodes,
    ...other
  } = props;

  // Favor enhanced view if we have the enhanced prop
  return enhancedSites.length ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_AvailabilityContext.default.Provider, {
    ...props,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_EnhancedAvailabilityInterface.default, {
      sites: enhancedSites,
      ...other
    })
  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_BasicAvailabilityInterface.default, {
    siteCodes: basicSiteCodes,
    ...other
  });
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
const WrappedDataProductAvailability = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(DataProductAvailability));
var _default = exports.default = WrappedDataProductAvailability;