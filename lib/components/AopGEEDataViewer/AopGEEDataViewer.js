"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _styles = require("@material-ui/core/styles");
var _SatelliteOutlined = _interopRequireDefault(require("@material-ui/icons/SatelliteOutlined"));
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _uaParserJs = _interopRequireDefault(require("ua-parser-js"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
   Setup: CSS classes
*/
const useStyles = (0, _styles.makeStyles)(theme => ({
  productPaperButton: {
    width: 'fit-content',
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1.5),
    borderColor: theme.palette.primary.main,
    '& span': {
      pointerEvents: 'none'
    }
  }
}));
const isMobileDevice = () => {
  const uaParser = new _uaParserJs.default();
  const device = uaParser.getDevice();
  let isMobile = false;
  // On my ARM64 Mac device.type is blank
  if (device.type === 'mobile') {
    isMobile = true;
  }
  return isMobile;
};
const getMobileOrDesktopUrl = () => {
  if (isMobileDevice()) {
    return _NeonEnvironment.default.getAopGEEMobileUrl();
  }
  return _NeonEnvironment.default.getAopGEEDesktopUrl();
};

/**
   Main Function
*/
const AopGEEDataViewer = props => {
  const classes = useStyles(_Theme.default);
  const aopButtonName = 'AOP GEE Data Viewer';
  const tooltip = 'Launch the AOP Google Earth Engine data visuialization tool.';
  const url = getMobileOrDesktopUrl();
  return /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    placement: "right",
    title: tooltip
  }, /*#__PURE__*/_react.default.createElement(_Button.default, {
    href: url,
    target: "_blank",
    rel: "noopener noreferrer",
    variant: "outlined",
    "data-gtm": "explore-data-products.aop-gee-data-viewer-button",
    className: classes.productPaperButton,
    color: "primary",
    endIcon: /*#__PURE__*/_react.default.createElement(_SatelliteOutlined.default, null)
  }, aopButtonName));
};
const WrappedAopGEEDataViewer = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(AopGEEDataViewer));
var _default = exports.default = WrappedAopGEEDataViewer;