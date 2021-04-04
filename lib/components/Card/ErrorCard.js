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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var InfoCard = function InfoCard(props) {
  var classes = useStyles(_Theme.default);
  var title = props.title,
      message = props.message;
  return /*#__PURE__*/_react.default.createElement(_BaseCard.default, {
    type: _BaseCard.CardType.ERROR,
    title: title,
    message: message,
    calloutClasses: {
      callout: classes.callout,
      calloutIcon: classes.calloutIcon
    }
  });
};

var _default = InfoCard;
exports.default = _default;