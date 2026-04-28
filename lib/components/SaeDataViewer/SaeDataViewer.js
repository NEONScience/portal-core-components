"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _styles = require("@material-ui/core/styles");
var _TimelineOutlined = _interopRequireDefault(require("@material-ui/icons/TimelineOutlined"));
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _RouteService = _interopRequireDefault(require("../../service/RouteService"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
   Setup: CSS classes
*/
const useStyles = (0, _styles.makeStyles)(theme => ({
  productPaperButton: {
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1.5),
    borderColor: theme.palette.primary.main,
    '& span': {
      pointerEvents: 'none'
    }
  }
}));

/**
   Main Function
*/
const SaeDataViewer = props => {
  const {
    isFullWidth,
    site,
    product,
    startDate,
    endDate
  } = props;
  const classes = useStyles(_Theme.default);
  const saeButtonName = 'SAE Data Viewer';
  const tooltip = 'Launch the SAE data visuialization tool.';
  const url = _RouteService.default.getSaeViewerUrlPath(product, site, startDate, endDate);
  return /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    placement: "right",
    title: tooltip
  }, /*#__PURE__*/_react.default.createElement(_Button.default, {
    href: url.toString(),
    target: "_blank",
    rel: "noopener noreferrer",
    variant: "outlined",
    "data-gtm": "sae-data-viewer-button",
    className: classes.productPaperButton,
    fullWidth: isFullWidth,
    color: "primary",
    endIcon: /*#__PURE__*/_react.default.createElement(_TimelineOutlined.default, null)
  }, saeButtonName));
};
SaeDataViewer.propTypes = {
  isFullWidth: _propTypes.default.bool,
  site: _propTypes.default.string,
  product: _propTypes.default.string,
  startDate: _propTypes.default.string,
  endDate: _propTypes.default.string
};
SaeDataViewer.defaultProps = {
  isFullWidth: true,
  site: '',
  product: '',
  startDate: '',
  endDate: ''
};
const WrappedSaeDataViewer = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(SaeDataViewer));
var _default = exports.default = WrappedSaeDataViewer;