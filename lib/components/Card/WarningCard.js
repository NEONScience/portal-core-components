"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _styles = require("@material-ui/core/styles");
var _BaseCard = _interopRequireWildcard(require("./BaseCard"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /* eslint-disable react/require-default-props */
const useStyles = (0, _styles.makeStyles)(muiTheme =>
// eslint-disable-next-line implicit-arrow-linebreak
(0, _styles.createStyles)({
  callout: {
    margin: muiTheme.spacing(0.5, 0, 3, 0),
    backgroundColor: _Theme.default.colors.BROWN[50],
    borderColor: _Theme.default.colors.BROWN[300]
  },
  calloutIcon: {
    color: _Theme.default.colors.BROWN[300],
    marginRight: muiTheme.spacing(2)
  }
}));
const WarningCard = props => {
  const classes = useStyles(_Theme.default);
  const {
    classes: calloutClasses
  } = props;
  const injectedCallout = calloutClasses ? calloutClasses.callout : undefined;
  const injectedCalloutIcon = calloutClasses ? calloutClasses.calloutIcon : undefined;
  return /*#__PURE__*/_react.default.createElement(_BaseCard.default, _extends({}, props, {
    type: _BaseCard.CardType.WARN,
    calloutClasses: {
      callout: injectedCallout || classes.callout,
      calloutIcon: injectedCalloutIcon || classes.calloutIcon
    }
  }));
};
var _default = exports.default = WarningCard;