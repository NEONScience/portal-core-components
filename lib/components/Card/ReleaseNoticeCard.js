"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _styles = require("@material-ui/core/styles");
var _InfoMessageCard = _interopRequireDefault(require("./InfoMessageCard"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /* eslint-disable react/require-default-props */
const useStyles = (0, _styles.makeStyles)(theme =>
// eslint-disable-next-line implicit-arrow-linebreak
(0, _styles.createStyles)({
  card: {
    margin: theme.spacing(0.5, 0, 3, 0),
    backgroundColor: theme.colors.GOLD[50],
    borderColor: theme.colors.GOLD[300]
  },
  cardSecondaryIcon: {
    color: theme.colors.GOLD[300],
    marginLeft: theme.spacing(2)
  }
}));
const ReleaseNoticeCard = props => {
  const classes = useStyles(_Theme.default);
  return /*#__PURE__*/_react.default.createElement(_InfoMessageCard.default, _extends({}, props, {
    title: "Release Notice",
    classes: {
      card: classes.card,
      secondaryIcon: classes.cardSecondaryIcon
    }
  }));
};
var _default = exports.default = ReleaseNoticeCard;