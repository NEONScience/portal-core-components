"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _ErrorCard = _interopRequireDefault(require("../Card/ErrorCard"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ComponentFallback = function ComponentFallback(props) {
  var error = props.error; // eslint-disable-next-line no-console

  console.error(error);
  return /*#__PURE__*/_react.default.createElement(_Grid.default, {
    container: true,
    spacing: 2
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12
  }, /*#__PURE__*/_react.default.createElement(_ErrorCard.default, {
    title: "Something broke",
    message: error.message
  })));
};

var _default = ComponentFallback;
exports.default = _default;