"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@material-ui/core/styles");
var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));
var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _ExpandLess = _interopRequireDefault(require("@material-ui/icons/ExpandLess"));
var _ExpandMore = _interopRequireDefault(require("@material-ui/icons/ExpandMore"));
var _InfoMessageCard = _interopRequireDefault(require("../Card/InfoMessageCard"));
var _ExternalHost = _interopRequireDefault(require("../ExternalHost/ExternalHost"));
var _ExternalHostProductSpecificLinks = _interopRequireDefault(require("../ExternalHostProductSpecificLinks/ExternalHostProductSpecificLinks"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
const _excluded = ["productCode", "expandable", "siteCodes"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
const useStyles = (0, _styles.makeStyles)(theme => ({
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  cardDivider: {
    margin: theme.spacing(0, 0, 2, 0)
  }
}));
const ExternalHostInfo = props => {
  const classes = useStyles(_Theme.default);
  const {
      productCode,
      expandable,
      siteCodes
    } = props,
    otherProps = _objectWithoutPropertiesLoose(props, _excluded);
  const [expanded, setExpanded] = (0, _react.useState)(!expandable);
  const externalHost = _ExternalHost.default.getByProductCode(productCode);
  const externalHostProduct = _ExternalHost.default.getProductSpecificInfo(productCode);
  if (!externalHost) {
    return null;
  }

  // Not only _should_ the info have specific links (links in addition to the top-level
  // one for the host), but _does_ it?
  const hasSpecificLinks = externalHost.linkType === _ExternalHost.default.LINK_TYPES.BY_PRODUCT && externalHost.getProductLinks(productCode).length || externalHost.linkType === _ExternalHost.default.LINK_TYPES.BY_SITE;
  const allowNoLinks = hasSpecificLinks && externalHostProduct.allowNoAvailability === true && !(0, _typeUtil.existsNonEmpty)(siteCodes);

  // Remaining setup
  const externalGeneralLink = externalHost.renderLink(productCode);
  const expandTitle = "".concat(expanded ? 'Hide' : 'Show', " links to externally hosted data");
  const rootProps = {};
  Object.keys(otherProps).filter(key => ['data-selenium', 'style', 'className'].includes(key)).forEach(key => {
    rootProps[key] = otherProps[key];
  });
  let blurb = null;
  let dataVariety = externalHost.hostDataVariety || 'Data';
  if (externalHost.hostType === _ExternalHost.default.HOST_TYPES.REFORMATTED_DATA) {
    blurb = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "".concat(dataVariety, " for this product are available in other formats from"), "\xA0", externalGeneralLink);
  }
  if (externalHost.hostType === _ExternalHost.default.HOST_TYPES.EXCLUSIVE_DATA || allowNoLinks) {
    blurb = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "".concat(dataVariety, " for this product are only available from"), "\xA0", externalGeneralLink);
  }
  // Default: ExternalHost.HOST_TYPES.ADDITIONAL_DATA:
  if (!blurb) {
    dataVariety = externalHost.hostDataVariety || 'Additional data';
    const are = hasSpecificLinks ? 'are' : 'may be';
    blurb = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "".concat(dataVariety, " associated with this product ").concat(are, " available from"), "\xA0", externalGeneralLink);
  }
  return /*#__PURE__*/_react.default.createElement("div", rootProps, /*#__PURE__*/_react.default.createElement(_InfoMessageCard.default, {
    title: "External Host",
    messageContent: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Divider.default, {
      className: classes.cardDivider
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.startFlex
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2",
      style: {
        flexGrow: 1
      }
    }, blurb), hasSpecificLinks && expandable && !allowNoLinks ? /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      title: expandTitle
    }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      "aria-label": expandTitle,
      onClick: () => setExpanded(!expanded),
      style: {
        marginLeft: _Theme.default.spacing(2)
      }
    }, expanded ? /*#__PURE__*/_react.default.createElement(_ExpandLess.default, null) : /*#__PURE__*/_react.default.createElement(_ExpandMore.default, null))) : null), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: hasSpecificLinks && expanded && !allowNoLinks ? 'block' : 'none'
      }
    }, /*#__PURE__*/_react.default.createElement(_ExternalHostProductSpecificLinks.default, {
      productCode: productCode,
      siteCodes: siteCodes
    })))
  }));
};
ExternalHostInfo.propTypes = {
  productCode: _propTypes.default.string.isRequired,
  expandable: _propTypes.default.bool,
  siteCodes: _propTypes.default.arrayOf(_propTypes.default.string)
};
ExternalHostInfo.defaultProps = {
  expandable: false,
  siteCodes: null
};
const WrappedExternalHostInfo = _Theme.default.getWrappedComponent(ExternalHostInfo);
var _default = exports.default = WrappedExternalHostInfo;