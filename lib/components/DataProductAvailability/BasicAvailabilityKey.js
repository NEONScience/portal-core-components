"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _Dialog = _interopRequireDefault(require("@mui/material/Dialog"));
var _DialogTitle = _interopRequireDefault(require("@mui/material/DialogTitle"));
var _DialogContent = _interopRequireDefault(require("@mui/material/DialogContent"));
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Close = _interopRequireDefault(require("@mui/icons-material/Close"));
var _HelpOutline = _interopRequireDefault(require("@mui/icons-material/HelpOutline"));
var _AvailabilityUtils = require("./AvailabilityUtils");
var _AvailabilitySvgComponents = require("./AvailabilitySvgComponents");
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
var _defaultProps = require("../../util/defaultProps");
var _typeUtil = require("../../util/typeUtil");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const useStyles = (0, _styles.makeStyles)(theme => ({
  legendContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
    width: '100%'
  },
  legendTitle: {
    fontSize: '0.95rem',
    display: 'inline-flex'
  },
  legendTitleIcon: {
    marginTop: theme.spacing(-0.25)
  },
  legendTitleContainer: {
    margin: theme.spacing(-1, 1, 0.5, 0)
  },
  legendElement: {
    margin: theme.spacing(0, 0, 0, 0)
  },
  legendElementText: {
    textAnchor: 'start',
    whiteSpace: 'pre',
    fontFamily: '"Cutive Mono","Lucida Console",Monaco,monospace',
    fontWeight: 400,
    fontSize: `${_AvailabilityUtils.SVG.LABEL_FONT_SIZE}px`,
    fill: _Theme.default.palette.grey[700]
  }
}));
const CONTAINER_WIDTH_BREAKPOINT_XS_FLEX_COL = 250;
const CONTAINER_WIDTH_BREAKPOINT_XS = 360;
const CONTAINER_WIDTH_BREAKPOINT_XS_SELECTION = 200;
const CONTAINER_WIDTH_BREAKPOINT_SM_SELECTION = 425;
const ALL_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then all sites rolled into a given row are selected';
const SOME_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then one or more but not all of the sites rolled into a given row are selected';
const statusLegendElementDefaultProps = {
  status: null,
  dialog: false
};
const StatusLegendElement = inProps => {
  const props = (0, _defaultProps.resolveProps)(statusLegendElementDefaultProps, inProps);
  const classes = useStyles(_Theme.default);
  const {
    status,
    dialog
  } = props;
  if (!(0, _typeUtil.exists)(status) || !_AvailabilityUtils.VALID_ENHANCED_STATUSES[status]) {
    return null;
  }
  const statusSvgHeight = _AvailabilityUtils.SVG.CELL_HEIGHT + 2;
  const labelLetterWidth = 8;
  const labelY = _AvailabilityUtils.SVG.LABEL_FONT_SIZE - _AvailabilityUtils.SVG.CELL_PADDING + 2;
  const statusLabelX = _AvailabilityUtils.SVG.CELL_WIDTH + 2 * _AvailabilityUtils.SVG.CELL_PADDING;
  const {
    title,
    description
  } = _AvailabilityUtils.VALID_ENHANCED_STATUSES[status];
  const statusSvgWidth = title.length * labelLetterWidth + statusLabelX;
  return dialog ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
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
  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: classes.legendElement,
    title: description,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("svg", {
      width: statusSvgWidth,
      height: statusSvgHeight,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_AvailabilitySvgComponents.JsxCell, {
        status: status
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("text", {
        className: classes.legendElementText,
        x: statusLabelX,
        y: labelY,
        children: title
      })]
    })
  });
};
StatusLegendElement.propTypes = {
  status: _propTypes.default.oneOf(Object.keys(_AvailabilityUtils.VALID_ENHANCED_STATUSES)),
  dialog: _propTypes.default.bool
};
const selectionLegendElementDefaultProps = {
  dialog: false
};
const SelectionLegendElement = inProps => {
  const props = (0, _defaultProps.resolveProps)(selectionLegendElementDefaultProps, inProps);
  const classes = useStyles(_Theme.default);
  const {
    variant,
    dialog
  } = props;
  if (!['all', 'some'].includes(variant)) {
    return null;
  }
  const statusSvgHeight = _AvailabilityUtils.SVG.CELL_HEIGHT + 2;
  const labelLetterWidth = 8;
  const labelY = _AvailabilityUtils.SVG.LABEL_FONT_SIZE - _AvailabilityUtils.SVG.CELL_PADDING + 2;
  const selectionSvgHeight = _AvailabilityUtils.SVG.CELL_HEIGHT + 2;
  const label = variant === 'all' ? 'All sites selected' : 'Some sites selected';
  const fill = variant === 'all' ? _Theme.default.palette.primary.main : _Theme.COLORS.LIGHT_BLUE[200];
  const description = variant === 'all' ? ALL_SELECTED_TITLE : SOME_SELECTED_TITLE;
  const selectionWidth = 30;
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
  return dialog ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
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
    className: classes.legendElement,
    title: description,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("svg", {
      width: selectionSvgWidth,
      height: statusSvgHeight,
      children: [graphic, /*#__PURE__*/(0, _jsxRuntime.jsx)("text", {
        className: classes.legendElementText,
        x: selectionLabelX,
        y: labelY,
        children: label
      })]
    })
  });
};
SelectionLegendElement.propTypes = {
  variant: _propTypes.default.oneOf(['all', 'some']).isRequired,
  dialog: _propTypes.default.bool
};
const legendDialogDefaultProps = {
  selectionEnabled: false,
  delineateRelease: false,
  availabilityStatusType: 'available'
};
const LegendDialog = inProps => {
  const props = (0, _defaultProps.resolveProps)(legendDialogDefaultProps, inProps);
  const {
    dialogOpen,
    setDialogOpen,
    selectionEnabled,
    delineateRelease,
    availabilityStatusType
  } = props;
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
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_DialogContent.default, {
      dividers: true,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        container: true,
        spacing: 2,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 12,
          sm: 6,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(StatusLegendElement, {
            status: availabilityStatusType,
            dialog: true
          })
        }), !delineateRelease ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 12,
          sm: 6,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(StatusLegendElement, {
            status: "available-provisional",
            dialog: true
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 12,
          sm: 6,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(StatusLegendElement, {
            status: "not available",
            dialog: true
          })
        }), !delineateRelease ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 12,
          sm: 6,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(StatusLegendElement, {
            status: "mixed-available-provisional",
            dialog: true
          })
        }), !selectionEnabled ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
            item: true,
            xs: 12,
            sm: 6,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(SelectionLegendElement, {
              variant: "all",
              dialog: true
            })
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
            item: true,
            xs: 12,
            sm: 6,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(SelectionLegendElement, {
              variant: "some",
              dialog: true
            })
          })]
        })]
      })
    })]
  });
};
LegendDialog.propTypes = {
  dialogOpen: _propTypes.default.bool.isRequired,
  setDialogOpen: _propTypes.default.func.isRequired,
  selectionEnabled: _propTypes.default.bool,
  delineateRelease: _propTypes.default.bool,
  availabilityStatusType: _propTypes.default.oneOf(['available', 'tombstoned'])
};
const basicAvailabilityKeyDefaultProps = {
  selectionEnabled: false,
  delineateRelease: false,
  availabilityStatusType: 'available',
  dialogOnly: false
};
const BasicAvailabilityKey = inProps => {
  const props = (0, _defaultProps.resolveProps)(basicAvailabilityKeyDefaultProps, inProps);
  const classes = useStyles(_Theme.default);
  const {
    selectionEnabled,
    delineateRelease,
    availabilityStatusType,
    dialogOnly
  } = props;
  const appliedAvaStatusType = !(0, _typeUtil.exists)(availabilityStatusType) ? 'available' : availabilityStatusType;
  const containerRef = (0, _react.useRef)();
  const [dialogOpen, setDialogOpen] = (0, _react.useState)(false);
  const [componentWidth, setComponentWidth] = (0, _react.useState)(0);
  let atContainerWidthXsFlexCol = false;
  let atContainerWidthXs = false;
  let atContainerWidthSelectionXs = false;
  let atContainerWidthSelectionSm = false;
  if (componentWidth > 0) {
    atContainerWidthXsFlexCol = componentWidth <= CONTAINER_WIDTH_BREAKPOINT_XS_FLEX_COL;
    atContainerWidthXs = componentWidth <= CONTAINER_WIDTH_BREAKPOINT_XS;
    atContainerWidthSelectionXs = componentWidth <= CONTAINER_WIDTH_BREAKPOINT_XS_SELECTION;
    atContainerWidthSelectionSm = componentWidth <= CONTAINER_WIDTH_BREAKPOINT_SM_SELECTION;
  }
  const containerStyleProps = atContainerWidthXsFlexCol ? {
    flexDirection: 'column'
  } : {};
  const handleResizeCb = (0, _react.useCallback)(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    if (container.clientWidth === componentWidth) {
      return;
    }
    setComponentWidth(container.clientWidth);
  }, [containerRef, componentWidth, setComponentWidth]);
  (0, _react.useLayoutEffect)(() => {
    const element = containerRef.current;
    if (!element) {
      return () => {};
    }
    handleResizeCb();
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', handleResizeCb);
      return () => {
        window.removeEventListener('resize', handleResizeCb);
      };
    }
    let resizeObserver = new ResizeObserver(handleResizeCb);
    resizeObserver.observe(element);
    return () => {
      if (!resizeObserver) {
        return;
      }
      resizeObserver.disconnect();
      resizeObserver = null;
    };
  }, [containerRef, handleResizeCb]);
  const renderLegendItems = () => {
    if (dialogOnly) return null;
    if (selectionEnabled) {
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(StatusLegendElement, {
            status: appliedAvaStatusType,
            dialog: false
          }), !delineateRelease ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(StatusLegendElement, {
            status: "available-provisional",
            dialog: false
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(StatusLegendElement, {
            status: "not available",
            dialog: false
          }), !delineateRelease ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(StatusLegendElement, {
            status: "mixed-available-provisional",
            dialog: false
          })]
        }), !selectionEnabled ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(SelectionLegendElement, {
            variant: "all",
            dialog: false
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(SelectionLegendElement, {
            variant: "some",
            dialog: false
          })]
        })]
      });
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(StatusLegendElement, {
          status: appliedAvaStatusType,
          dialog: false
        }), !delineateRelease ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(StatusLegendElement, {
          status: "available-provisional",
          dialog: false
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(StatusLegendElement, {
          status: "not available",
          dialog: false
        }), !delineateRelease ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(StatusLegendElement, {
          status: "mixed-available-provisional",
          dialog: false
        })]
      })]
    });
  };
  const renderLegendItemsContainer = () => {
    if (dialogOnly || atContainerWidthSelectionXs) return null;
    if (selectionEnabled) {
      if (atContainerWidthSelectionSm) {
        // If at sm selection container width, wrap in containing div
        // to display all statuses vertically in single row
        return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          children: renderLegendItems()
        });
      }
      return renderLegendItems();
    }
    // If at xs container width, wrap in containing div
    // to display all statuses vertically in single row
    if (atContainerWidthXs) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        children: renderLegendItems()
      });
    }
    return renderLegendItems();
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      ref: containerRef,
      className: classes.legendContainer,
      style: containerStyleProps,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.legendTitleContainer,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "h6",
          className: classes.legendTitle,
          children: "Key:"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
          size: "small",
          color: "primary",
          title: "Help - Data Availability Chart Key",
          "aria-label": "Help - Data Availability Chart Key",
          onClick: () => setDialogOpen(true),
          className: classes.legendTitleIcon,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_HelpOutline.default, {
            fontSize: "small"
          })
        })]
      }), renderLegendItemsContainer()]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(LegendDialog, {
      dialogOpen: dialogOpen,
      setDialogOpen: setDialogOpen,
      selectionEnabled: selectionEnabled,
      delineateRelease: delineateRelease,
      availabilityStatusType: appliedAvaStatusType
    })]
  });
};
BasicAvailabilityKey.propTypes = {
  selectionEnabled: _propTypes.default.bool,
  delineateRelease: _propTypes.default.bool,
  availabilityStatusType: _propTypes.default.oneOf(['available', 'tombstoned']),
  dialogOnly: _propTypes.default.bool
};
var _default = exports.default = BasicAvailabilityKey;