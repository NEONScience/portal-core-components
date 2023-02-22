"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParentProductLink = exports.default = exports.buildManyParentsAdditionalContent = exports.buildDefaultTitleContent = exports.buildDefaultSubTitleContent = exports.buildDefaultSplitTitleContent = void 0;
var _react = _interopRequireDefault(require("react"));
var _Card = _interopRequireDefault(require("@material-ui/core/Card"));
var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));
var _Link = _interopRequireDefault(require("@material-ui/core/Link"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _styles = require("@material-ui/core/styles");
var _reactFontawesome = require("@fortawesome/react-fontawesome");
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
var _RouteService = _interopRequireDefault(require("../../service/RouteService"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    card: {
      backgroundColor: _Theme.default.colors.GOLD[50],
      borderColor: _Theme.default.colors.GOLD[200],
      marginTop: theme.spacing(1)
    },
    cardContent: {
      padding: theme.spacing(2),
      paddingBottom: "".concat(theme.spacing(2), "px !important")
    },
    cardContentFlexContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(2),
      paddingBottom: "".concat(theme.spacing(2), "px !important")
    },
    cardContentContainer: {
      flexGrow: 1
    },
    cardIcon: {
      color: theme.colors.GOLD[700],
      padding: '5px',
      fontSize: '2.3875em',
      marginRight: theme.spacing(2)
    },
    cardIconBoxesStacked: {
      color: theme.colors.GOLD[700],
      fontSize: '2.3875em',
      marginRight: theme.spacing(2)
    }
  };
});
var getParentProductLink = function getParentProductLink(dataProduct, release) {
  return /*#__PURE__*/_react.default.createElement(_Link.default, {
    href: _RouteService.default.getProductDetailPath(dataProduct.productCode, release),
    target: "_blank"
  }, "".concat(dataProduct.productName, " (").concat(dataProduct.productCode, ")"));
};
exports.getParentProductLink = getParentProductLink;
var buildManyParentsAdditionalContent = function buildManyParentsAdditionalContent(dataProducts) {
  return /*#__PURE__*/_react.default.createElement("ul", {
    style: {
      margin: _Theme.default.spacing(1, 0)
    }
  }, dataProducts.map(function (dataProduct) {
    return /*#__PURE__*/_react.default.createElement("li", {
      key: dataProduct.productCode
    }, getParentProductLink(dataProduct));
  }));
};
exports.buildManyParentsAdditionalContent = buildManyParentsAdditionalContent;
var buildDefaultTitleContent = function buildDefaultTitleContent(dataProduct, release) {
  var bundleParentLink = getParentProductLink(dataProduct, release);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "This data product is bundled into ", bundleParentLink);
};
exports.buildDefaultTitleContent = buildDefaultTitleContent;
var buildDefaultSplitTitleContent = function buildDefaultSplitTitleContent(terminalChar) {
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "This data product has been split and bundled into more than one parent data product", "".concat(terminalChar));
};
exports.buildDefaultSplitTitleContent = buildDefaultSplitTitleContent;
var buildDefaultSubTitleContent = function buildDefaultSubTitleContent(forwardAvailability, hasManyParents) {
  return (
    /*#__PURE__*/
    // eslint-disable-next-line react/jsx-no-useless-fragment
    _react.default.createElement(_react.default.Fragment, null, forwardAvailability ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "It is not available as a standalone download. Data availability shown below reflects availability of the entire bundle.") : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "It is not available as a standalone download. Data availability information and data product download is only available through the parent ", hasManyParents ? 'products' : 'product', "."))
  );
};
exports.buildDefaultSubTitleContent = buildDefaultSubTitleContent;
var DataProductBundleCard = function DataProductBundleCard(props) {
  var classes = useStyles(_Theme.default);
  var titleContent = props.titleContent,
    subTitleContent = props.subTitleContent,
    additionalTitleContent = props.additionalTitleContent,
    customContent = props.customContent,
    isSplit = props.isSplit,
    showIcon = props.showIcon,
    customClasses = props.classes;
  var customCardClass = customClasses ? customClasses.card : undefined;
  var customCardContentClass = customClasses ? customClasses.cardContent : undefined;
  var customCardContentFlexContainerClass = customClasses ? customClasses.cardContentFlexContainer : undefined;
  var customCardContentContainerClass = customClasses ? customClasses.cardContentContainer : undefined;
  var customIconClass = customClasses ? customClasses.cardIcon : undefined;
  var renderContent = function renderContent() {
    if ((0, _typeUtil.exists)(customContent)) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, customContent);
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !(0, _typeUtil.exists)(titleContent) ? null : /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, titleContent), !(0, _typeUtil.exists)(additionalTitleContent) ? null :
    /*#__PURE__*/
    // eslint-disable-next-line react/jsx-no-useless-fragment
    _react.default.createElement(_react.default.Fragment, null, additionalTitleContent), !(0, _typeUtil.exists)(subTitleContent) ? null : /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2"
    }, subTitleContent));
  };
  var renderCardContent = function renderCardContent() {
    if (!showIcon) {
      return renderContent();
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactFontawesome.FontAwesomeIcon, {
      icon: isSplit ? _freeSolidSvgIcons.faBoxesStacked : _freeSolidSvgIcons.faBox,
      size: "2x",
      className: customIconClass || isSplit ? classes.cardIconBoxesStacked : classes.cardIcon
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: customCardContentContainerClass || classes.cardContentContainer
    }, renderContent()));
  };
  return /*#__PURE__*/_react.default.createElement(_Card.default, {
    className: customCardClass || classes.card
  }, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
    className: showIcon ? customCardContentFlexContainerClass || classes.cardContentFlexContainer : customCardContentClass || classes.cardContent
  }, renderCardContent()));
};
DataProductBundleCard.defaultProps = {
  titleContent: undefined,
  additionalTitleContent: undefined,
  subTitleContent: undefined,
  customContent: undefined,
  isSplit: false,
  showIcon: true,
  classes: undefined
};
var _default = DataProductBundleCard;
exports.default = _default;