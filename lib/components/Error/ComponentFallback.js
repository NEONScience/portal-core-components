"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));
var _ErrorCard = _interopRequireDefault(require("../Card/ErrorCard"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const ComponentFallback = props => {
  const {
    error,
    resetErrorBoundary
  } = props;
  // eslint-disable-next-line no-console
  console.error(error);
  return /*#__PURE__*/_react.default.createElement(_Grid.default, {
    container: true,
    spacing: 2
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12
  }, /*#__PURE__*/_react.default.createElement(_ErrorCard.default, {
    title: "Something broke",
    message: error.message,
    actionLabel: "Reset",
    onActionClick: resetErrorBoundary
  })));
};
var _default = exports.default = ComponentFallback;