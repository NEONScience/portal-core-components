"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _AddBox = _interopRequireDefault(require("@mui/icons-material/AddBox"));
var _ArrowUpward = _interopRequireDefault(require("@mui/icons-material/ArrowUpward"));
var _Check = _interopRequireDefault(require("@mui/icons-material/Check"));
var _ChevronLeft = _interopRequireDefault(require("@mui/icons-material/ChevronLeft"));
var _ChevronRight = _interopRequireDefault(require("@mui/icons-material/ChevronRight"));
var _Clear = _interopRequireDefault(require("@mui/icons-material/Clear"));
var _DeleteOutline = _interopRequireDefault(require("@mui/icons-material/DeleteOutline"));
var _Edit = _interopRequireDefault(require("@mui/icons-material/Edit"));
var _FilterList = _interopRequireDefault(require("@mui/icons-material/FilterList"));
var _FirstPage = _interopRequireDefault(require("@mui/icons-material/FirstPage"));
var _LastPage = _interopRequireDefault(require("@mui/icons-material/LastPage"));
var _Remove = _interopRequireDefault(require("@mui/icons-material/Remove"));
var _SaveAlt = _interopRequireDefault(require("@mui/icons-material/SaveAlt"));
var _Search = _interopRequireDefault(require("@mui/icons-material/Search"));
var _TableChart = _interopRequireDefault(require("@mui/icons-material/TableChart"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } // This exists so that Material Table doesn't have to rely on loading the Material Icon font in
// the HTML <HEAD>. See https://github.com/mbrn/material-table/issues/51#issuecomment-508384214
const MaterialTableIcons = {
  Add: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_AddBox.default, _extends({}, props, {
    ref: ref
  }))),
  Check: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_Check.default, _extends({}, props, {
    ref: ref
  }))),
  Clear: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_Clear.default, _extends({}, props, {
    ref: ref
  }))),
  Delete: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_DeleteOutline.default, _extends({}, props, {
    ref: ref
  }))),
  DetailPanel: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_ChevronRight.default, _extends({}, props, {
    ref: ref
  }))),
  Edit: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_Edit.default, _extends({}, props, {
    ref: ref
  }))),
  Export: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_SaveAlt.default, _extends({}, props, {
    ref: ref
  }))),
  Filter: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_FilterList.default, _extends({}, props, {
    ref: ref
  }))),
  FirstPage: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_FirstPage.default, _extends({}, props, {
    ref: ref
  }))),
  LastPage: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_LastPage.default, _extends({}, props, {
    ref: ref
  }))),
  NextPage: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_ChevronRight.default, _extends({}, props, {
    ref: ref
  }))),
  PreviousPage: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_ChevronLeft.default, _extends({}, props, {
    ref: ref
  }))),
  ResetSearch: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_Clear.default, _extends({}, props, {
    ref: ref
  }))),
  Search: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_Search.default, _extends({}, props, {
    ref: ref
  }))),
  SortArrow: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_ArrowUpward.default, _extends({}, props, {
    ref: ref
  }))),
  ThirdStateCheck: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_Remove.default, _extends({}, props, {
    ref: ref
  }))),
  ViewColumn: /*#__PURE__*/(0, _react.forwardRef)((props, ref) => /*#__PURE__*/_react.default.createElement(_TableChart.default, _extends({}, props, {
    ref: ref
  })))
};
var _default = exports.default = MaterialTableIcons;