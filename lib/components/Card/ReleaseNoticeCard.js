"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _styles = require("@mui/styles");
var _InfoMessageCard = _interopRequireDefault(require("./InfoMessageCard"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* eslint-disable react/require-default-props */

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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_InfoMessageCard.default, {
    ...props,
    title: "Release Notice",
    classes: {
      card: classes.card,
      secondaryIcon: classes.cardSecondaryIcon
    }
  });
};
var _default = exports.default = ReleaseNoticeCard;