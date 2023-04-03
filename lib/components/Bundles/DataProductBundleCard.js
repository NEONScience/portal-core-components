"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Card = _interopRequireDefault(require("@material-ui/core/Card"));
var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _styles = require("@material-ui/core/styles");
var _reactFontawesome = require("@fortawesome/react-fontawesome");
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
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
var DataProductBundleCard = function DataProductBundleCard(props) {
  var classes = useStyles(_Theme.default);
  var titleContent = props.titleContent,
    subTitleContent = props.subTitleContent,
    detailContent = props.detailContent,
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
    }, titleContent), !(0, _typeUtil.exists)(detailContent) ? null :
    /*#__PURE__*/
    // eslint-disable-next-line react/jsx-no-useless-fragment
    _react.default.createElement(_react.default.Fragment, null, detailContent), !(0, _typeUtil.exists)(subTitleContent) ? null : /*#__PURE__*/_react.default.createElement(_Typography.default, {
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
  detailContent: undefined,
  subTitleContent: undefined,
  customContent: undefined,
  isSplit: false,
  showIcon: true,
  classes: undefined
};
var _default = DataProductBundleCard;
exports.default = _default;