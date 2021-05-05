"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ApplicationMenu;

var _react = _interopRequireDefault(require("react"));

var _styles = require("@material-ui/core/styles");

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _ClickAwayListener = _interopRequireDefault(require("@material-ui/core/ClickAwayListener"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _Popper = _interopRequireDefault(require("@material-ui/core/Popper"));

var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));

var _Apps = _interopRequireDefault(require("@material-ui/icons/Apps"));

var _Fade = _interopRequireDefault(require("@material-ui/core/Fade"));

var _Launch = _interopRequireDefault(require("@material-ui/icons/Launch"));

var _Card = _interopRequireDefault(require("@material-ui/core/Card"));

var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// declare styles
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return (0, _styles.createStyles)({
    menuContainer: {
      zIndex: 1000 // be sure to display the menu over other elements

    },
    toolbarContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.45)',
      // match shadow of site header
      position: 'relative'
    },
    toolbarButtons: {
      display: 'flex',
      marginLeft: 'auto',
      // align content right
      marginRight: theme.spacing(2.5),
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5)
    },
    paper: {
      padding: theme.spacing(4),
      maxWidth: '500px',
      // limit width of menu
      marginTop: theme.spacing(1),
      // line top of menu up with divider
      overflowX: 'unset',
      overflowY: 'unset',
      '&::before': {
        // add tooltip like arrow to top of menu
        content: '""',
        position: 'absolute',
        marginRight: theme.spacing(4),
        // center arrow point beneath menu button
        top: 0,
        right: 0,
        width: theme.spacing(2),
        // width of arrow
        height: theme.spacing(2),
        // height of arrow
        backgroundColor: theme.palette.background.paper,
        // match paper background
        boxShadow: theme.shadows[2],
        // add arrow shadow
        transform: 'rotate(315deg)',
        // point arrow up toward menu button
        clipPath: 'polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))'
      }
    },
    card: {
      transition: '0.4s',
      '&:hover': {
        // raised hover effect for Cards
        transform: 'translateY(-2px)',
        // raise Card
        boxShadow: theme.shadows[2] // add shadow

      },
      cursor: 'pointer',
      // visually indicate Cards are links
      width: '100%',
      // ensure Cards are equal width
      border: 0 // remove default Card border

    },
    cardContent: {
      textAlign: 'center'
    },
    gridItem: {
      display: 'flex' // so grid items stretch to equal height

    }
  });
}); // define the menu component

var Menu = function Menu(props) {
  var apps = props.apps;
  var classes = useStyles();

  var _React$useState = _react.default.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      open = _React$useState2[0],
      setOpen = _React$useState2[1];

  var anchorRef = _react.default.useRef(null); // handle menu toggle


  var handleToggle = function handleToggle() {
    setOpen(function (prevOpen) {
      return !prevOpen;
    });
  }; // close the menu


  var handleClose = function handleClose(event) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  }; // open menu by tab key


  function handleMenuKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  } // handle a menu selection


  var handleMenuItemClick = function handleMenuItemClick(event, url) {
    window.location.href = url;
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes.toolbarContainer
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.toolbarButtons
  }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: "Neon Applications",
    "aria-label": "Neon Applications",
    placement: "left",
    TransitionComponent: _Fade.default,
    TransitionProps: {
      timeout: 200
    },
    arrow: true
  }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    ref: anchorRef,
    style: {
      color: 'black'
    },
    "aria-label": "more",
    "aria-controls": open ? 'neon-application-menu' : undefined,
    "aria-haspopup": "true",
    onClick: handleToggle,
    onKeyDown: handleMenuKeyDown
  }, /*#__PURE__*/_react.default.createElement(_Apps.default, null))), /*#__PURE__*/_react.default.createElement(_Popper.default, {
    className: classes.menuContainer,
    open: open,
    anchorEl: anchorRef.current,
    role: "presentation",
    transition: true
  }, function (_ref) {
    var TransitionProps = _ref.TransitionProps,
        placement = _ref.placement;
    return /*#__PURE__*/_react.default.createElement(_Fade.default, _extends({}, TransitionProps, {
      style: {
        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
      },
      timeout: 200
    }), /*#__PURE__*/_react.default.createElement(_Paper.default, {
      elevation: 3,
      className: classes.paper
    }, /*#__PURE__*/_react.default.createElement(_ClickAwayListener.default, {
      onClickAway: handleClose
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true,
      spacing: 4,
      alignItems: "stretch"
    }, apps.map(function (app) {
      return /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: apps.length === 1 ? 12 : 6,
        className: classes.gridItem,
        key: app.name
      }, /*#__PURE__*/_react.default.createElement(_Card.default, {
        onClick: function onClick(event) {
          return handleMenuItemClick(event, app.url);
        },
        key: app.url,
        className: classes.card
      }, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
        className: classes.cardContent
      }, /*#__PURE__*/_react.default.createElement(_Launch.default, {
        fontSize: "large"
      }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle1",
        gutterBottom: true,
        style: {
          lineHeight: 1
        }
      }, app.name), app.description)));
    })))));
  })));
};

function ApplicationMenu() {
  var _authData$userData, _authData$userData$da;

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      authData = _NeonContext$useNeonC2[0].auth;

  var apps = authData === null || authData === void 0 ? void 0 : (_authData$userData = authData.userData) === null || _authData$userData === void 0 ? void 0 : (_authData$userData$da = _authData$userData.data) === null || _authData$userData$da === void 0 ? void 0 : _authData$userData$da.apps;

  if ((apps === null || apps === void 0 ? void 0 : apps.length) > 0) {
    return /*#__PURE__*/_react.default.createElement(Menu, {
      apps: apps
    });
  }

  return null;
}