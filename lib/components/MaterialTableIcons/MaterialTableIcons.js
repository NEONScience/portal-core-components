"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _AddBox = _interopRequireDefault(require("@material-ui/icons/AddBox"));

var _ArrowUpward = _interopRequireDefault(require("@material-ui/icons/ArrowUpward"));

var _Check = _interopRequireDefault(require("@material-ui/icons/Check"));

var _ChevronLeft = _interopRequireDefault(require("@material-ui/icons/ChevronLeft"));

var _ChevronRight = _interopRequireDefault(require("@material-ui/icons/ChevronRight"));

var _Clear = _interopRequireDefault(require("@material-ui/icons/Clear"));

var _DeleteOutline = _interopRequireDefault(require("@material-ui/icons/DeleteOutline"));

var _Edit = _interopRequireDefault(require("@material-ui/icons/Edit"));

var _FilterList = _interopRequireDefault(require("@material-ui/icons/FilterList"));

var _FirstPage = _interopRequireDefault(require("@material-ui/icons/FirstPage"));

var _LastPage = _interopRequireDefault(require("@material-ui/icons/LastPage"));

var _Remove = _interopRequireDefault(require("@material-ui/icons/Remove"));

var _SaveAlt = _interopRequireDefault(require("@material-ui/icons/SaveAlt"));

var _Search = _interopRequireDefault(require("@material-ui/icons/Search"));

var _ViewColumn = _interopRequireDefault(require("@material-ui/icons/ViewColumn"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MaterialTableIcons = {
  Add: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_AddBox.default, _extends({}, props, {
      ref: ref
    }));
  }),
  Check: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_Check.default, _extends({}, props, {
      ref: ref
    }));
  }),
  Clear: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_Clear.default, _extends({}, props, {
      ref: ref
    }));
  }),
  Delete: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_DeleteOutline.default, _extends({}, props, {
      ref: ref
    }));
  }),
  DetailPanel: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_ChevronRight.default, _extends({}, props, {
      ref: ref
    }));
  }),
  Edit: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_Edit.default, _extends({}, props, {
      ref: ref
    }));
  }),
  Export: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_SaveAlt.default, _extends({}, props, {
      ref: ref
    }));
  }),
  Filter: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_FilterList.default, _extends({}, props, {
      ref: ref
    }));
  }),
  FirstPage: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_FirstPage.default, _extends({}, props, {
      ref: ref
    }));
  }),
  LastPage: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_LastPage.default, _extends({}, props, {
      ref: ref
    }));
  }),
  NextPage: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_ChevronRight.default, _extends({}, props, {
      ref: ref
    }));
  }),
  PreviousPage: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_ChevronLeft.default, _extends({}, props, {
      ref: ref
    }));
  }),
  ResetSearch: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_Clear.default, _extends({}, props, {
      ref: ref
    }));
  }),
  Search: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_Search.default, _extends({}, props, {
      ref: ref
    }));
  }),
  SortArrow: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_ArrowUpward.default, _extends({}, props, {
      ref: ref
    }));
  }),
  ThirdStateCheck: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_Remove.default, _extends({}, props, {
      ref: ref
    }));
  }),
  ViewColumn: /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(_ViewColumn.default, _extends({}, props, {
      ref: ref
    }));
  })
};
var _default = MaterialTableIcons;
exports.default = _default;