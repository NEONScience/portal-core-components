"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _styles = require("@material-ui/core/styles");
var _SatelliteOutlined = _interopRequireDefault(require("@material-ui/icons/SatelliteOutlined"));
var _uaParserJs = _interopRequireDefault(require("ua-parser-js"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const MIN_IFRAME_WIDTH = 240;

/**
   Setup: CSS classes
*/
const useStyles = (0, _styles.makeStyles)(theme => ({
  selectionForm: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  iframe: {
    minWidth: "".concat(MIN_IFRAME_WIDTH, "px"),
    minHeight: "".concat(MIN_IFRAME_WIDTH, "px"),
    border: "1px solid ".concat(theme.palette.grey[700])
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  label: {
    color: theme.palette.grey[500],
    fontSize: '0.9rem',
    marginBottom: theme.spacing(0.5)
  },
  optgroup: {
    fontWeight: _Theme.default.typography.fontWeightMedium
  },
  tooltipIconButton: {
    marginTop: theme.spacing(-0.5),
    marginLeft: theme.spacing(0.5)
  },
  openInNewLink: {
    display: 'block',
    width: '100%',
    textAlign: 'right',
    marginTop: theme.spacing(0.5),
    fontSize: '0.8rem'
  },
  openInNewIcon: {
    fontSize: '0.95rem',
    margin: theme.spacing(0, 0.5, -0.25, 0)
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
const handleLaunchMobileOrDesktopWindow = () => {
  // const GEE_DESKTOP_VIEWER_URL = 'https://neon-prod-earthengine.projects.earthengine.app/'
  //   + 'view/neon-aop-gee-data-viewer---desktop';
  // const GEE_MOBILE_VIEWER_URL = 'https://neon-prod-earthengine.projects.earthengine.app/'
  //   + 'view/aop-gee-data-viewer---mobile';
  if (isMobileDevice()) {
    window.open(_NeonEnvironment.default.getAopGEEMobileUrl(), '_blank', 'noopener,noreferrer');
  } else {
    window.open(_NeonEnvironment.default.getAopGEEDesktopUrl(), '_blank', 'noopener,noreferrer');
  }
};

/**
   Main Function
*/
const AopGEEDataViewer = props => {
  const classes = useStyles(_Theme.default);
  const AOP_BUTTON_NAME = 'AOP GEE Data Viewer';
  return /*#__PURE__*/_react.default.createElement(_Button.default, {
    "data-gtm": "explore-data-products.aop-data-viewer-button"
    // data-gtm-product-code={productCode}
    // data-selenium={`browse-data-products-page.products.${productCode}.aop-data-viewer-button`}
    ,
    className: classes.productPaperButton,
    variant: "outlined",
    color: "primary",
    endIcon: /*#__PURE__*/_react.default.createElement(_SatelliteOutlined.default, null),
    onClick: () => handleLaunchMobileOrDesktopWindow()
  }, AOP_BUTTON_NAME);
};
const WrappedAopGEEDataViewer = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(AopGEEDataViewer));
var _default = exports.default = WrappedAopGEEDataViewer;