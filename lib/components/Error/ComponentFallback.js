"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
var _ErrorCard = _interopRequireDefault(require("../Card/ErrorCard"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const ComponentFallback = props => {
  const {
    error,
    resetErrorBoundary
  } = props;
  // eslint-disable-next-line no-console
  console.error(error);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
    container: true,
    spacing: 2,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 12,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ErrorCard.default, {
        title: "Something broke",
        message: error.message,
        actionLabel: "Reset",
        onActionClick: resetErrorBoundary
      })
    })
  });
};
var _default = exports.default = ComponentFallback;