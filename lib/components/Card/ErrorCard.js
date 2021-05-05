"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styles = require("@material-ui/core/styles");

var _BaseCard = _interopRequireWildcard(require("./BaseCard"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var useStyles = (0, _styles.makeStyles)(function (muiTheme) {
  return (// eslint-disable-next-line implicit-arrow-linebreak
    (0, _styles.createStyles)({
      callout: {
        margin: muiTheme.spacing(0.5, 0, 3, 0),
        backgroundColor: _Theme.default.colors.RED[50],
        borderColor: _Theme.default.colors.RED[300]
      },
      calloutIcon: {
        color: _Theme.default.colors.RED[300],
        marginRight: muiTheme.spacing(2)
      }
    })
  );
});

var ErrorCard = function ErrorCard(props) {
  var classes = useStyles(_Theme.default);
  var calloutClasses = props.classes;
  var injectedCallout = calloutClasses ? calloutClasses.callout : undefined;
  var injectedCalloutIcon = calloutClasses ? calloutClasses.calloutIcon : undefined;
  return /*#__PURE__*/_react.default.createElement(_BaseCard.default, _extends({}, props, {
    type: _BaseCard.CardType.ERROR,
    calloutClasses: {
      callout: injectedCallout || classes.callout,
      calloutIcon: injectedCalloutIcon || classes.calloutIcon
    }
  }));
};

var _default = ErrorCard;
exports.default = _default;