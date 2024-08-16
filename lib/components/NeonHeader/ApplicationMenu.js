"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _styles = require("@mui/styles");
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _ClickAwayListener = _interopRequireDefault(require("@mui/material/ClickAwayListener"));
var _Paper = _interopRequireDefault(require("@mui/material/Paper"));
var _Popper = _interopRequireDefault(require("@mui/material/Popper"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _Apps = _interopRequireDefault(require("@mui/icons-material/Apps"));
var _Fade = _interopRequireDefault(require("@mui/material/Fade"));
var _Launch = _interopRequireDefault(require("@mui/icons-material/Launch"));
var _Card = _interopRequireDefault(require("@mui/material/Card"));
var _CardContent = _interopRequireDefault(require("@mui/material/CardContent"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: classes.toolbarContainer,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.toolbarButtons,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
        title: "Neon Applications",
        "aria-label": "Neon Applications",
        placement: "left",
        TransitionComponent: _Fade.default,
        TransitionProps: {
          timeout: 200
        },
        arrow: true,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
          ref: anchorRef,
          style: {
            color: 'black'
          },
          "aria-label": "more",
          "aria-controls": open ? 'neon-application-menu' : undefined,
          "aria-haspopup": "true",
          onClick: handleToggle,
          onKeyDown: handleMenuKeyDown,
          size: "large",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Apps.default, {})
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Popper.default, {
        className: classes.menuContainer,
        open: open,
        anchorEl: anchorRef.current,
        role: "presentation",
        transition: true,
        children: _ref => {
          let {
            TransitionProps,
            placement
          } = _ref;
          return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Fade.default, {
            ...TransitionProps,
            style: {
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
            },
            timeout: 200,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Paper.default, {
              elevation: 3,
              className: classes.paper,
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ClickAwayListener.default, {
                onClickAway: handleClose,
                children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
                  container: true,
                  spacing: 4,
                  alignItems: "stretch",
                  children: apps.map(app => /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
                    item: true,
                    xs: apps.length === 1 ? 12 : 6,
                    className: classes.gridItem,
                    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Card.default, {
                      onClick: event => handleMenuItemClick(event, app.url),
                      className: classes.card,
                      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_CardContent.default, {
                        className: classes.cardContent,
                        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Launch.default, {
                          fontSize: "large"
                        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                          variant: "subtitle1",
                          gutterBottom: true,
                          style: {
                            lineHeight: 1
                          },
                          children: app.name
                        }), app.description]
                      })
                    }, app.url)
                  }, app.name))
                })
              })
            })
          });
        }
      })]
    })
  });
};

/**
 * Return the application menu
 * @returns The menu or null if the user has no applications to display.
 */
const ApplicationMenu = () => {
  const [{
    auth: authData
  }] = _NeonContext.default.useNeonContextState();
  const apps = authData?.userData?.data?.apps;
  if (apps?.length > 0) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(Menu, {
      apps: apps
    });
  }
  return null;
};
var _default = exports.default = ApplicationMenu;