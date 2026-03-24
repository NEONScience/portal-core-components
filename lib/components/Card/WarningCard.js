"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _styles = require("@mui/styles");
var _BaseCard = _interopRequireWildcard(require("./BaseCard"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* eslint-disable react/require-default-props */

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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_BaseCard.default, {
    ...props,
    type: _BaseCard.CardType.WARN,
    calloutClasses: {
      callout: injectedCallout || classes.callout,
      calloutIcon: injectedCalloutIcon || classes.calloutIcon
    }
  });
};
var _default = exports.default = WarningCard;