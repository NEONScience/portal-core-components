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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SiteMap = function SiteMap(props) {
  return /*#__PURE__*/_react.default.createElement(_SiteMapContext.default.Provider, props, /*#__PURE__*/_react.default.createElement(_SiteMapContainer.default, null));
};

SiteMap.propTypes = _SiteMapUtils.SITE_MAP_PROP_TYPES;
SiteMap.defaultProps = _SiteMapUtils.SITE_MAP_DEFAULT_PROPS;

var WrappedSiteMap = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(SiteMap));

var _default = WrappedSiteMap;
exports.default = _default;