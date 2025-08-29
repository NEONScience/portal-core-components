"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = EnhancedAvailabilityKey;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _Dialog = _interopRequireDefault(require("@mui/material/Dialog"));
var _DialogTitle = _interopRequireDefault(require("@mui/material/DialogTitle"));
var _DialogContent = _interopRequireDefault(require("@mui/material/DialogContent"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Close = _interopRequireDefault(require("@mui/icons-material/Close"));
var _HelpOutline = _interopRequireDefault(require("@mui/icons-material/HelpOutline"));
var _AvailabilityUtils = require("./AvailabilityUtils");
var _AvailabilitySvgComponents = require("./AvailabilitySvgComponents");
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
var _defaultProps = require("../../util/defaultProps");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/* eslint-disable max-len, no-unused-vars, prefer-destructuring */

/**
   Setup: CSS classes
*/const useStyles = (0, _styles.makeStyles)(theme => ({
  keyContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  keyElement: {
    cursor: 'help',
    margin: theme.spacing(0, 3, 0.25, 0)
  },
  keyElementText: {
    textAnchor: 'start',
    whiteSpace: 'pre',
    fontFamily: '"Cutive Mono","Lucida Console",Monaco,monospace',
    fontWeight: 400,
    fontSize: `${_AvailabilityUtils.SVG.LABEL_FONT_SIZE}px`,
    fill: _Theme.default.palette.grey[700]
  },
  h6Small: {
    fontSize: '0.95rem'
  }
}));
const ALL_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then all sites rolled into a given row are selected';
const SOME_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then one or more but not all of the sites rolled into a given row are selected';
const defaultProps = {
  selectionEnabled: false,
  rollUpPresent: false
};

/**
   Main Function
*/
function EnhancedAvailabilityKey(inProps) {
  const props = (0, _defaultProps.resolveProps)(defaultProps, inProps);
  const classes = useStyles(_Theme.default);
  const [dialogOpen, setDialogOpen] = (0, _react.useState)(false);
  const {
    selectionEnabled,
    rollUpPresent
  } = props;
  const statusSvgHeight = _AvailabilityUtils.SVG.CELL_HEIGHT + 2;
  const labelLetterWidth = 8;
  const labelY = _AvailabilityUtils.SVG.LABEL_FONT_SIZE - _AvailabilityUtils.SVG.CELL_PADDING + 1;
  const statusLabelX = _AvailabilityUtils.SVG.CELL_WIDTH + 2 * _AvailabilityUtils.SVG.CELL_PADDING;

  // Let each element in the key be clickable to open the help dialog.
  // This is in addition to the help button, but we should still provide aria attributes.
  const dialogOpenerProps = {
    role: 'button',
    onClick: () => setDialogOpen(true)
  };
  const statusSvgs = {};
  Object.keys(_AvailabilityUtils.VALID_ENHANCED_STATUSES).forEach(status => {
    const label = _AvailabilityUtils.VALID_ENHANCED_STATUSES[status].title;
    const description = _AvailabilityUtils.VALID_ENHANCED_STATUSES[status].description;
    const statusSvgWidth = label.length * labelLetterWidth + statusLabelX;
    statusSvgs[status] = /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.keyElement,
      title: description,
      ...dialogOpenerProps,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("svg", {
        width: statusSvgWidth,
        height: statusSvgHeight,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_AvailabilitySvgComponents.JsxCell, {
          status: status
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("text", {
          className: classes.keyElementText,
          x: statusLabelX,
          y: labelY,
          children: label
        })]
      })
    });
  });
  const renderSelectionElement = (variant, inDialog = false) => {
    if (!['all', 'some'].includes(variant)) {
      return null;
    }
    const selectionSvgHeight = _AvailabilityUtils.SVG.CELL_HEIGHT + 2;
    const label = variant === 'all' ? 'All sites selected' : 'Some sites selected';
    const fill = variant === 'all' ? _Theme.default.palette.primary.main : 'url(#partialSelectionPattern)';
    const description = variant === 'all' ? ALL_SELECTED_TITLE : SOME_SELECTED_TITLE;
    const selectionWidth = 45;
    const selectionLabelX = selectionWidth + 3 * _AvailabilityUtils.SVG.CELL_PADDING;
    const selectionSvgWidth = label.length * labelLetterWidth + selectionLabelX;
    const handleAttribs = {
      width: _AvailabilityUtils.SVG.DATE_RANGE_HANDLE_WIDTH,
      height: _AvailabilityUtils.SVG.CELL_HEIGHT,
      fill: _Theme.COLORS.LIGHT_BLUE[300],
      stroke: _Theme.default.palette.primary.main,
      strokeWidth: 1.5
    };
    const graphic = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("rect", {
        x: 0.5,
        y: 1.5,
        width: selectionWidth,
        height: _AvailabilityUtils.SVG.CELL_HEIGHT - 2,
        fill: fill
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("rect", {
        x: 0.5,
        y: 0.5,
        ...handleAttribs
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("rect", {
        x: selectionWidth - _AvailabilityUtils.SVG.DATE_RANGE_HANDLE_WIDTH,
        y: 0.5,
        ...handleAttribs
      })]
    });
    return inDialog ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      style: {
        marginBottom: _Theme.default.spacing(2)
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        style: {
          display: 'flex',
          alignItems: 'center'
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
          width: Math.ceil(selectionWidth * 1.25),
          height: Math.ceil(selectionSvgHeight * 1.25),
          viewBox: `0 0 ${selectionWidth} ${selectionSvgHeight}`,
          style: {
            marginRight: _Theme.default.spacing(1)
          },
          children: graphic
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "subtitle2",
          style: {
            fontSize: '1.05rem'
          },
          children: label
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "body2",
        children: description
      })]
    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.keyElement,
      title: description,
      ...dialogOpenerProps,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("svg", {
        width: selectionSvgWidth,
        height: statusSvgHeight,
        children: [graphic, /*#__PURE__*/(0, _jsxRuntime.jsx)("text", {
          className: classes.keyElementText,
          x: selectionLabelX,
          y: labelY,
          children: label
        })]
      })
    });
  };
  const renderDialog = () => {
    const renderStatus = status => {
      const {
        title,
        description
      } = _AvailabilityUtils.VALID_ENHANCED_STATUSES[status];
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        style: {
          marginBottom: _Theme.default.spacing(2.5)
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          style: {
            display: 'flex',
            alignItems: 'center'
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
            width: Math.ceil(_AvailabilityUtils.SVG.CELL_WIDTH * 1.25),
            height: Math.ceil(_AvailabilityUtils.SVG.CELL_HEIGHT * 1.25),
            viewBox: `0 0 ${_AvailabilityUtils.SVG.CELL_WIDTH} ${_AvailabilityUtils.SVG.CELL_HEIGHT}`,
            style: {
              marginRight: _Theme.default.spacing(1)
            },
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_AvailabilitySvgComponents.JsxCell, {
              status: status
            })
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "subtitle2",
            style: {
              fontSize: '0.95rem',
              marginTop: '2px'
            },
            children: title
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "body2",
          children: description
        })]
      });
    };
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Dialog.default, {
      open: dialogOpen,
      maxWidth: "md",
      onClose: () => setDialogOpen(false),
      "aria-labelledby": "availability-key-dialog-title",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_DialogTitle.default, {
          id: "availability-key-dialog-title",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            style: {
              fontSize: '1.4rem',
              fontWeight: '600'
            },
            children: "Data Availability Chart Key"
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
          title: "Close",
          "aria-label": "Close",
          onClick: () => setDialogOpen(false),
          style: {
            marginRight: _Theme.default.spacing(1)
          },
          size: "large",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Close.default, {
            fontSize: "inherit"
          })
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_DialogContent.default, {
        style: {
          marginBottom: _Theme.default.spacing(2)
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          style: {
            display: 'flex',
            alignItems: 'flex-start'
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            style: {
              flex: '50%',
              marginRight: _Theme.default.spacing(2)
            },
            children: [renderStatus('available'), renderStatus('being processed'), renderStatus('expected'), renderStatus('not expected')]
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            style: {
              flex: '50%'
            },
            children: [renderStatus('not available'), renderStatus('not collected'), renderStatus('delayed'), renderStatus('tentative')]
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          style: {
            display: 'flex',
            alignItems: 'flex-start'
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            style: {
              flex: '50%',
              marginRight: _Theme.default.spacing(2)
            },
            children: renderStatus('mixed some availability')
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            style: {
              flex: '50%'
            },
            children: renderStatus('mixed no availability')
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          style: {
            display: 'flex',
            alignItems: 'flex-start'
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            style: {
              flex: '50%',
              marginRight: _Theme.default.spacing(2)
            },
            children: renderSelectionElement('all', true)
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            style: {
              flex: '50%'
            },
            children: renderSelectionElement('some', true)
          })]
        })]
      })]
    });
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.keyContainer,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "h6",
          className: classes.h6Small,
          style: {
            margin: _Theme.default.spacing(-0.75, 3, 0.5, 0)
          },
          children: "Key:"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
          size: "small",
          color: "primary",
          title: "Help - Data Availability Chart Key",
          "aria-label": "Help - Data Availability Chart Key",
          onClick: () => setDialogOpen(true),
          style: {
            marginLeft: '-3px'
          },
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_HelpOutline.default, {
            fontSize: "inherit"
          })
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [statusSvgs.available, statusSvgs['being processed'], statusSvgs.expected, statusSvgs['not expected']]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [statusSvgs['not available'], statusSvgs['not collected'], statusSvgs.delayed, statusSvgs.tentative]
      }), !(selectionEnabled || rollUpPresent) ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [!rollUpPresent ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
          children: [statusSvgs['mixed some availability'], statusSvgs['mixed no availability']]
        }), !selectionEnabled ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
          children: [renderSelectionElement('all'), renderSelectionElement('some')]
        })]
      })]
    }), renderDialog()]
  });
}
EnhancedAvailabilityKey.propTypes = {
  selectionEnabled: _propTypes.default.bool,
  rollUpPresent: _propTypes.default.bool
};