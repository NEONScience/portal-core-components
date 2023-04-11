"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _ButtonGroup = _interopRequireDefault(require("@material-ui/core/ButtonGroup"));
var _ClickAwayListener = _interopRequireDefault(require("@material-ui/core/ClickAwayListener"));
var _Grow = _interopRequireDefault(require("@material-ui/core/Grow"));
var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));
var _Popper = _interopRequireDefault(require("@material-ui/core/Popper"));
var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));
var _MenuList = _interopRequireDefault(require("@material-ui/core/MenuList"));
var _ArrowDropDown = _interopRequireDefault(require("@material-ui/icons/ArrowDropDown"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var SplitButton = function SplitButton(props) {
  var name = props.name,
    options = props.options,
    selectedOption = props.selectedOption,
    selectedOptionDisplayCallback = props.selectedOptionDisplayCallback,
    onClick = props.onClick,
    onChange = props.onChange,
    buttonGroupProps = props.buttonGroupProps,
    buttonMenuProps = props.buttonMenuProps,
    buttonProps = props.buttonProps;
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    open = _useState2[0],
    setOpen = _useState2[1];
  var _useState3 = (0, _react.useState)(selectedOption),
    _useState4 = _slicedToArray(_useState3, 2),
    stateSelectedOption = _useState4[0],
    setStateSelectedOption = _useState4[1];
  var anchorRef = (0, _react.useRef)(null);
  var appliedButtonGroupProps = {
    variant: 'outlined',
    color: 'primary'
  };
  if ((0, _typeUtil.exists)(buttonGroupProps)) {
    appliedButtonGroupProps = buttonGroupProps;
  }
  var appliedButtonProps = {
    color: 'primary',
    size: 'small'
  };
  if ((0, _typeUtil.exists)(buttonProps)) {
    appliedButtonProps = buttonProps;
  }
  var appliedButtonMenuProps = {
    color: 'primary',
    size: 'small'
  };
  if ((0, _typeUtil.exists)(buttonMenuProps)) {
    appliedButtonMenuProps = buttonMenuProps;
  }
  (0, _react.useEffect)(function () {
    if (selectedOption === stateSelectedOption) return;
    setStateSelectedOption(selectedOption);
  }, [selectedOption, stateSelectedOption]);
  var handleClick = function handleClick() {
    onClick(stateSelectedOption);
  };
  var handleMenuItemClick = function handleMenuItemClick(event, index) {
    setStateSelectedOption(options[index]);
    onChange(options[index]);
    setOpen(false);
  };
  var handleToggle = function handleToggle() {
    setOpen(function (prevOpen) {
      return !prevOpen;
    });
  };
  var handleClose = function handleClose(event) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  var renderSelectedOption = function renderSelectedOption() {
    if ((0, _typeUtil.exists)(selectedOptionDisplayCallback)) {
      // eslint-disable-next-line max-len
      return selectedOptionDisplayCallback(stateSelectedOption);
    }
    return stateSelectedOption;
  };
  return /*#__PURE__*/_react.default.createElement(_Grid.default, {
    container: true,
    direction: "column",
    alignItems: "center"
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12
  }, /*#__PURE__*/_react.default.createElement(_ButtonGroup.default, _extends({
    "aria-label": "".concat(name, "-split-button")
  }, appliedButtonGroupProps, {
    ref: anchorRef
  }), /*#__PURE__*/_react.default.createElement(_Button.default, _extends({}, appliedButtonProps, {
    onClick: handleClick
  }), renderSelectedOption()), /*#__PURE__*/_react.default.createElement(_Button.default, _extends({
    "aria-controls": open ? "".concat(name, "-split-button-menu") : undefined,
    "aria-expanded": open ? 'true' : undefined,
    "aria-label": "".concat(name, "-split-button-select"),
    "aria-haspopup": "menu"
  }, appliedButtonMenuProps, {
    onClick: handleToggle
  }), /*#__PURE__*/_react.default.createElement(_ArrowDropDown.default, null))), /*#__PURE__*/_react.default.createElement(_Popper.default, {
    transition: true,
    anchorEl: anchorRef.current,
    open: open,
    role: undefined
  }, function (_ref) {
    var TransitionProps = _ref.TransitionProps,
      placement = _ref.placement;
    return /*#__PURE__*/_react.default.createElement(_Grow.default, _extends({}, TransitionProps, {
      style: {
        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
      }
    }), /*#__PURE__*/_react.default.createElement(_Paper.default, null, /*#__PURE__*/_react.default.createElement(_ClickAwayListener.default, {
      onClickAway: handleClose
    }, /*#__PURE__*/_react.default.createElement(_MenuList.default, {
      id: "".concat(name, "-split-button-menu")
    }, options.map(function (option, index) {
      return /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
        key: option,
        selected: option === stateSelectedOption,
        onClick: function onClick(event) {
          return handleMenuItemClick(event, index);
        }
      }, option);
    })))));
  })));
};
var WrappedSplitButton = _Theme.default.getWrappedComponent(SplitButton);
var _default = WrappedSplitButton;
exports.default = _default;