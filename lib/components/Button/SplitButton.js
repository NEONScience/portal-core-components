"use strict";

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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SplitButton = props => {
  const {
    name,
    options,
    selectedOption,
    selectedOptionDisplayCallback,
    onClick,
    onChange,
    buttonGroupProps,
    buttonMenuProps,
    buttonProps
  } = props;
  const [open, setOpen] = (0, _react.useState)(false);
  const [stateSelectedOption, setStateSelectedOption] = (0, _react.useState)(selectedOption);
  const anchorRef = (0, _react.useRef)(null);
  let appliedButtonGroupProps = {
    variant: 'outlined',
    color: 'primary'
  };
  if ((0, _typeUtil.exists)(buttonGroupProps)) {
    appliedButtonGroupProps = buttonGroupProps;
  }
  let appliedButtonProps = {
    color: 'primary',
    size: 'small'
  };
  if ((0, _typeUtil.exists)(buttonProps)) {
    appliedButtonProps = buttonProps;
  }
  let appliedButtonMenuProps = {
    color: 'primary',
    size: 'small'
  };
  if ((0, _typeUtil.exists)(buttonMenuProps)) {
    appliedButtonMenuProps = buttonMenuProps;
  }
  (0, _react.useEffect)(() => {
    if (selectedOption === stateSelectedOption) return;
    setStateSelectedOption(selectedOption);
  }, [selectedOption, stateSelectedOption]);
  const handleClick = () => {
    onClick(stateSelectedOption);
  };
  const handleMenuItemClick = (event, index) => {
    setStateSelectedOption(options[index]);
    onChange(options[index]);
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };
  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  const renderSelectedOption = () => {
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
  }, _ref => {
    let {
      TransitionProps,
      placement
    } = _ref;
    return /*#__PURE__*/_react.default.createElement(_Grow.default, _extends({}, TransitionProps, {
      style: {
        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
      }
    }), /*#__PURE__*/_react.default.createElement(_Paper.default, null, /*#__PURE__*/_react.default.createElement(_ClickAwayListener.default, {
      onClickAway: handleClose
    }, /*#__PURE__*/_react.default.createElement(_MenuList.default, {
      id: "".concat(name, "-split-button-menu")
    }, options.map((option, index) => /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
      key: option,
      selected: option === stateSelectedOption,
      onClick: event => handleMenuItemClick(event, index)
    }, option))))));
  })));
};
const WrappedSplitButton = _Theme.default.getWrappedComponent(SplitButton);
var _default = exports.default = WrappedSplitButton;