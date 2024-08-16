"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _ButtonGroup = _interopRequireDefault(require("@mui/material/ButtonGroup"));
var _ClickAwayListener = _interopRequireDefault(require("@mui/material/ClickAwayListener"));
var _Grow = _interopRequireDefault(require("@mui/material/Grow"));
var _Paper = _interopRequireDefault(require("@mui/material/Paper"));
var _Popper = _interopRequireDefault(require("@mui/material/Popper"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _MenuList = _interopRequireDefault(require("@mui/material/MenuList"));
var _ArrowDropDown = _interopRequireDefault(require("@mui/icons-material/ArrowDropDown"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _typeUtil = require("../../util/typeUtil");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
    container: true,
    direction: "column",
    alignItems: "center",
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
      item: true,
      xs: 12,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_ButtonGroup.default, {
        "aria-label": `${name}-split-button`,
        ...appliedButtonGroupProps,
        ref: anchorRef,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
          ...appliedButtonProps,
          onClick: handleClick,
          children: renderSelectedOption()
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
          "aria-controls": open ? `${name}-split-button-menu` : undefined,
          "aria-expanded": open ? 'true' : undefined,
          "aria-label": `${name}-split-button-select`,
          "aria-haspopup": "menu",
          ...appliedButtonMenuProps,
          onClick: handleToggle,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ArrowDropDown.default, {})
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Popper.default, {
        transition: true,
        anchorEl: anchorRef.current,
        open: open,
        role: undefined,
        children: _ref => {
          let {
            TransitionProps,
            placement
          } = _ref;
          return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grow.default, {
            ...TransitionProps,
            style: {
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
            },
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Paper.default, {
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ClickAwayListener.default, {
                onClickAway: handleClose,
                children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuList.default, {
                  id: `${name}-split-button-menu`,
                  children: options.map((option, index) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
                    selected: option === stateSelectedOption,
                    onClick: event => handleMenuItemClick(event, index),
                    children: option
                  }, option))
                })
              })
            })
          });
        }
      })]
    })
  });
};
const WrappedSplitButton = _Theme.default.getWrappedComponent(SplitButton);
var _default = exports.default = WrappedSplitButton;