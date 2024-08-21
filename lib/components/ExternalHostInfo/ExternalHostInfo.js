"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _Divider = _interopRequireDefault(require("@mui/material/Divider"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _ExpandLess = _interopRequireDefault(require("@mui/icons-material/ExpandLess"));
var _ExpandMore = _interopRequireDefault(require("@mui/icons-material/ExpandMore"));
var _InfoMessageCard = _interopRequireDefault(require("../Card/InfoMessageCard"));
var _ExternalHost = _interopRequireDefault(require("../ExternalHost/ExternalHost"));
var _ExternalHostProductSpecificLinks = _interopRequireDefault(require("../ExternalHostProductSpecificLinks/ExternalHostProductSpecificLinks"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
var _defaultProps = require("../../util/defaultProps");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
const defaultProps = {
  expandable: false,
  siteCodes: null
};
const ExternalHostInfo = inProps => {
  const props = (0, _defaultProps.resolveProps)(defaultProps, inProps);
  const classes = useStyles(_Theme.default);
  const {
    productCode,
    expandable,
    siteCodes,
    ...otherProps
  } = props;
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
  const expandTitle = `${expanded ? 'Hide' : 'Show'} links to externally hosted data`;
  const rootProps = {};
  Object.keys(otherProps).filter(key => ['data-selenium', 'style', 'className'].includes(key)).forEach(key => {
    rootProps[key] = otherProps[key];
  });
  let blurb = null;
  let dataVariety = externalHost.hostDataVariety || 'Data';
  if (externalHost.hostType === _ExternalHost.default.HOST_TYPES.REFORMATTED_DATA) {
    blurb = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [`${dataVariety} for this product are available in other formats from`, "\xA0", externalGeneralLink]
    });
  }
  if (externalHost.hostType === _ExternalHost.default.HOST_TYPES.EXCLUSIVE_DATA || allowNoLinks) {
    blurb = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [`${dataVariety} for this product are only available from`, "\xA0", externalGeneralLink]
    });
  }
  // Default: ExternalHost.HOST_TYPES.ADDITIONAL_DATA:
  if (!blurb) {
    dataVariety = externalHost.hostDataVariety || 'Additional data';
    const are = hasSpecificLinks ? 'are' : 'may be';
    blurb = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [`${dataVariety} associated with this product ${are} available from`, "\xA0", externalGeneralLink]
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    ...rootProps,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_InfoMessageCard.default, {
      title: "External Host",
      messageContent: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Divider.default, {
          className: classes.cardDivider
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: classes.startFlex,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "subtitle2",
            style: {
              flexGrow: 1
            },
            children: blurb
          }), hasSpecificLinks && expandable && !allowNoLinks ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
            title: expandTitle,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
              "aria-label": expandTitle,
              onClick: () => setExpanded(!expanded),
              style: {
                marginLeft: _Theme.default.spacing(2)
              },
              size: "large",
              children: expanded ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_ExpandLess.default, {}) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_ExpandMore.default, {})
            })
          }) : null]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          style: {
            display: hasSpecificLinks && expanded && !allowNoLinks ? 'block' : 'none'
          },
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ExternalHostProductSpecificLinks.default, {
            productCode: productCode,
            siteCodes: siteCodes
          })
        })]
      })
    })
  });
};
ExternalHostInfo.propTypes = {
  productCode: _propTypes.default.string.isRequired,
  expandable: _propTypes.default.bool,
  siteCodes: _propTypes.default.arrayOf(_propTypes.default.string)
};
const WrappedExternalHostInfo = _Theme.default.getWrappedComponent(ExternalHostInfo);
var _default = exports.default = WrappedExternalHostInfo;