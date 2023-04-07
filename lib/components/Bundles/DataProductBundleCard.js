"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _styles = require("@material-ui/core/styles");
var _reactFontawesome = require("@fortawesome/react-fontawesome");
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
var _InfoMessageCard = _interopRequireDefault(require("../Card/InfoMessageCard"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    cardIcon: {
      color: 'rgba(0, 0, 0, 0.9)',
      padding: '5px 0px',
      fontSize: '1.5em',
      marginRight: theme.spacing(2)
    },
    cardSecondaryIcon: {
      color: 'rgba(138, 191, 236, 0.9)',
      // theme.colors.LIGHT_BLUE[200] with 'a' value applied
      marginLeft: theme.spacing(2),
      fontSize: '1.5rem'
    },
    cardTitleContentContainer: {
      padding: theme.spacing(2, 2.5, 0.5, 2.5)
    },
    cardMessageContentContainer: {
      padding: theme.spacing(0.25, 2.5, 2, 2.5)
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
    customClasses = props.classes;
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
  return /*#__PURE__*/_react.default.createElement(_InfoMessageCard.default, {
    title: "Data Product Bundle",
    messageContent: renderContent(),
    icon: /*#__PURE__*/_react.default.createElement(_reactFontawesome.FontAwesomeIcon, {
      icon: isSplit ? _freeSolidSvgIcons.faBoxesStacked : _freeSolidSvgIcons.faBox,
      size: "1x",
      className: customIconClass || classes.cardIcon
    }),
    classes: {
      secondaryIcon: classes.cardSecondaryIcon,
      cardTitleContentContainer: classes.cardTitleContentContainer,
      messageContentContainer: classes.cardMessageContentContainer
    }
  });
};
DataProductBundleCard.defaultProps = {
  titleContent: undefined,
  detailContent: undefined,
  subTitleContent: undefined,
  customContent: undefined,
  isSplit: false,
  classes: undefined
};
var _default = DataProductBundleCard;
exports.default = _default;