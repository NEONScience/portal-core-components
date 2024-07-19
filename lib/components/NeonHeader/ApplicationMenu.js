"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// interface for user application data

// interface for the menu component props

// declare styles
const useStyles = (0, _styles.makeStyles)(theme => (0, _styles.createStyles)({
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
}));

// define the menu component
const Menu = props => {
  const {
    apps
  } = props;
  const classes = useStyles();
  const [open, setOpen] = _react.default.useState(false);
  const anchorRef = _react.default.useRef(null);

  // handle menu toggle
  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  // close the menu
  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  // open menu by tab key
  const handleMenuKeyDown = event => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  };

  // handle a menu selection
  const handleMenuItemClick = (event, url) => {
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
  }, _ref => {
    let {
      TransitionProps,
      placement
    } = _ref;
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
    }, apps.map(app => /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: apps.length === 1 ? 12 : 6,
      className: classes.gridItem,
      key: app.name
    }, /*#__PURE__*/_react.default.createElement(_Card.default, {
      onClick: event => handleMenuItemClick(event, app.url),
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
    }, app.name), app.description))))))));
  })));
};

/**
 * Return the application menu
 * @returns The menu or null if the user has no applications to display.
 */
const ApplicationMenu = () => {
  var _authData$userData;
  const [{
    auth: authData
  }] = _NeonContext.default.useNeonContextState();
  const apps = authData === null || authData === void 0 || (_authData$userData = authData.userData) === null || _authData$userData === void 0 || (_authData$userData = _authData$userData.data) === null || _authData$userData === void 0 ? void 0 : _authData$userData.apps;
  if ((apps === null || apps === void 0 ? void 0 : apps.length) > 0) {
    return /*#__PURE__*/_react.default.createElement(Menu, {
      apps: apps
    });
  }
  return null;
};
var _default = exports.default = ApplicationMenu;