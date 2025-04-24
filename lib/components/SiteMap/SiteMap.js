"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));
var _ComponentErrorBoundary = _interopRequireDefault(require("../Error/ComponentErrorBoundary"));
var _CustomComponentFallback = _interopRequireDefault(require("../Error/CustomComponentFallback"));
var _ErrorCard = _interopRequireDefault(require("../Card/ErrorCard"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _SiteMapContext = _interopRequireDefault(require("./SiteMapContext"));
var _SiteMapContainer = _interopRequireDefault(require("./SiteMapContainer"));
var _SiteMapUtils = require("./SiteMapUtils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const SiteMapFallbackComponent = props => {
  const {
    resetErrorBoundary
  } = props;
  return /*#__PURE__*/_react.default.createElement(_CustomComponentFallback.default
  // eslint-disable-next-line react/no-unstable-nested-components
  , {
    FallbackComponent: () => /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true,
      spacing: 2
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12
    }, /*#__PURE__*/_react.default.createElement(_ErrorCard.default, {
      title: "Component Error",
      message: "Site map encountered a problem",
      actionLabel: "Reset",
      onActionClick: resetErrorBoundary
    })))
  });
};
SiteMapFallbackComponent.propTypes = {
  resetErrorBoundary: _propTypes.default.func.isRequired
};
const SiteMap = props => {
  // no need to store this in state, just pass it thru
  const {
    unusableVerticalSpace = 0,
    mapUniqueId = 0
  } = props;
  return /*#__PURE__*/_react.default.createElement(_ComponentErrorBoundary.default, {
    fallbackComponent: SiteMapFallbackComponent,
    onReset: () => {/* noop for boundary reset */}
  }, /*#__PURE__*/_react.default.createElement(_SiteMapContext.default.Provider, props, /*#__PURE__*/_react.default.createElement(_SiteMapContainer.default, {
    unusableVerticalSpace: unusableVerticalSpace,
    mapUniqueId: mapUniqueId
  })));
};
SiteMap.propTypes = _SiteMapUtils.SITE_MAP_PROP_TYPES;
SiteMap.defaultProps = _SiteMapUtils.SITE_MAP_DEFAULT_PROPS;
const WrappedSiteMap = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(SiteMap));
var _default = exports.default = WrappedSiteMap;