"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _SiteMapContext = _interopRequireDefault(require("./SiteMapContext"));
var _SiteMapContainer = _interopRequireDefault(require("./SiteMapContainer"));
var _SiteMapUtils = require("./SiteMapUtils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const SiteMap = props => {
  // no need to store this in state, just pass it thru
  const {
    unusableVerticalSpace = 0,
    mapUniqueId = 0
  } = props;
  return /*#__PURE__*/_react.default.createElement(_SiteMapContext.default.Provider, props, /*#__PURE__*/_react.default.createElement(_SiteMapContainer.default, {
    unusableVerticalSpace: unusableVerticalSpace,
    mapUniqueId: mapUniqueId
  }));
};
SiteMap.propTypes = _SiteMapUtils.SITE_MAP_PROP_TYPES;
SiteMap.defaultProps = _SiteMapUtils.SITE_MAP_DEFAULT_PROPS;
const WrappedSiteMap = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(SiteMap));
var _default = exports.default = WrappedSiteMap;