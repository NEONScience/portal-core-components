"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = EnhancedAvailabilityKey;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@material-ui/core/styles");
var _Dialog = _interopRequireDefault(require("@material-ui/core/Dialog"));
var _DialogTitle = _interopRequireDefault(require("@material-ui/core/DialogTitle"));
var _DialogContent = _interopRequireDefault(require("@material-ui/core/DialogContent"));
var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Close = _interopRequireDefault(require("@material-ui/icons/Close"));
var _HelpOutline = _interopRequireDefault(require("@material-ui/icons/HelpOutline"));
var _AvailabilityUtils = require("./AvailabilityUtils");
var _AvailabilitySvgComponents = require("./AvailabilitySvgComponents");
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /* eslint-disable max-len, no-unused-vars, prefer-destructuring */
/**
   Setup: CSS classes
*/
const useStyles = (0, _styles.makeStyles)(theme => ({
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
    fontSize: "".concat(_AvailabilityUtils.SVG.LABEL_FONT_SIZE, "px"),
    fill: _Theme.default.palette.grey[700]
  },
  h6Small: {
    fontSize: '0.95rem'
  }
}));
const ALL_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then all sites rolled into a given row are selected';
const SOME_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then one or more but not all of the sites rolled into a given row are selected';

/**
   Main Function
*/
function EnhancedAvailabilityKey(props) {
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
    statusSvgs[status] = /*#__PURE__*/_react.default.createElement("div", _extends({
      className: classes.keyElement,
      title: description
    }, dialogOpenerProps), /*#__PURE__*/_react.default.createElement("svg", {
      width: statusSvgWidth,
      height: statusSvgHeight
    }, /*#__PURE__*/_react.default.createElement(_AvailabilitySvgComponents.JsxCell, {
      status: status
    }), /*#__PURE__*/_react.default.createElement("text", {
      className: classes.keyElementText,
      x: statusLabelX,
      y: labelY
    }, label)));
  });
  const renderSelectionElement = function (variant) {
    let inDialog = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
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
    const graphic = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("rect", {
      x: 0.5,
      y: 1.5,
      width: selectionWidth,
      height: _AvailabilityUtils.SVG.CELL_HEIGHT - 2,
      fill: fill
    }), /*#__PURE__*/_react.default.createElement("rect", _extends({
      x: 0.5,
      y: 0.5
    }, handleAttribs)), /*#__PURE__*/_react.default.createElement("rect", _extends({
      x: selectionWidth - _AvailabilityUtils.SVG.DATE_RANGE_HANDLE_WIDTH,
      y: 0.5
    }, handleAttribs)));
    return inDialog ? /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginBottom: _Theme.default.spacing(2)
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/_react.default.createElement("svg", {
      width: Math.ceil(selectionWidth * 1.25),
      height: Math.ceil(selectionSvgHeight * 1.25),
      viewBox: "0 0 ".concat(selectionWidth, " ").concat(selectionSvgHeight),
      style: {
        marginRight: _Theme.default.spacing(1)
      }
    }, graphic), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2",
      style: {
        fontSize: '1.05rem'
      }
    }, label)), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2"
    }, description)) : /*#__PURE__*/_react.default.createElement("div", _extends({
      className: classes.keyElement,
      title: description
    }, dialogOpenerProps), /*#__PURE__*/_react.default.createElement("svg", {
      width: selectionSvgWidth,
      height: statusSvgHeight
    }, graphic, /*#__PURE__*/_react.default.createElement("text", {
      className: classes.keyElementText,
      x: selectionLabelX,
      y: labelY
    }, label)));
  };
  const renderDialog = () => {
    const renderStatus = status => {
      const {
        title,
        description
      } = _AvailabilityUtils.VALID_ENHANCED_STATUSES[status];
      return /*#__PURE__*/_react.default.createElement("div", {
        style: {
          marginBottom: _Theme.default.spacing(2.5)
        }
      }, /*#__PURE__*/_react.default.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      }, /*#__PURE__*/_react.default.createElement("svg", {
        width: Math.ceil(_AvailabilityUtils.SVG.CELL_WIDTH * 1.25),
        height: Math.ceil(_AvailabilityUtils.SVG.CELL_HEIGHT * 1.25),
        viewBox: "0 0 ".concat(_AvailabilityUtils.SVG.CELL_WIDTH, " ").concat(_AvailabilityUtils.SVG.CELL_HEIGHT),
        style: {
          marginRight: _Theme.default.spacing(1)
        }
      }, /*#__PURE__*/_react.default.createElement(_AvailabilitySvgComponents.JsxCell, {
        status: status
      })), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle2",
        style: {
          fontSize: '0.95rem',
          marginTop: '2px'
        }
      }, title)), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2"
      }, description));
    };
    return /*#__PURE__*/_react.default.createElement(_Dialog.default, {
      open: dialogOpen,
      maxWidth: "md",
      onClose: () => setDialogOpen(false),
      "aria-labelledby": "availability-key-dialog-title"
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/_react.default.createElement(_DialogTitle.default, {
      id: "availability-key-dialog-title"
    }, /*#__PURE__*/_react.default.createElement("span", {
      style: {
        fontSize: '1.4rem',
        fontWeight: '600'
      }
    }, "Data Availability Chart Key")), /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      title: "Close",
      "aria-label": "Close",
      onClick: () => setDialogOpen(false),
      style: {
        marginRight: _Theme.default.spacing(1)
      }
    }, /*#__PURE__*/_react.default.createElement(_Close.default, {
      fontSize: "inherit"
    }))), /*#__PURE__*/_react.default.createElement(_DialogContent.default, {
      style: {
        marginBottom: _Theme.default.spacing(2)
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flex: '50%',
        marginRight: _Theme.default.spacing(2)
      }
    }, renderStatus('available'), renderStatus('being processed'), renderStatus('expected'), renderStatus('not expected')), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flex: '50%'
      }
    }, renderStatus('not available'), renderStatus('not collected'), renderStatus('delayed'), renderStatus('tentative'))), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flex: '50%',
        marginRight: _Theme.default.spacing(2)
      }
    }, renderStatus('mixed some availability')), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flex: '50%'
      }
    }, renderStatus('mixed no availability'))), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flex: '50%',
        marginRight: _Theme.default.spacing(2)
      }
    }, renderSelectionElement('all', true)), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flex: '50%'
      }
    }, renderSelectionElement('some', true)))));
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.keyContainer
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    className: classes.h6Small,
    style: {
      margin: _Theme.default.spacing(-0.75, 3, 0.5, 0)
    }
  }, "Key:"), /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    size: "small",
    color: "primary",
    title: "Help - Data Availability Chart Key",
    "aria-label": "Help - Data Availability Chart Key",
    onClick: () => setDialogOpen(true),
    style: {
      marginLeft: '-3px'
    }
  }, /*#__PURE__*/_react.default.createElement(_HelpOutline.default, {
    fontSize: "inherit"
  }))), /*#__PURE__*/_react.default.createElement("div", null, statusSvgs.available, statusSvgs['being processed'], statusSvgs.expected, statusSvgs['not expected']), /*#__PURE__*/_react.default.createElement("div", null, statusSvgs['not available'], statusSvgs['not collected'], statusSvgs.delayed, statusSvgs.tentative), !(selectionEnabled || rollUpPresent) ? null : /*#__PURE__*/_react.default.createElement("div", null, !rollUpPresent ? null : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, statusSvgs['mixed some availability'], statusSvgs['mixed no availability']), !selectionEnabled ? null : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderSelectionElement('all'), renderSelectionElement('some')))), renderDialog());
}
EnhancedAvailabilityKey.propTypes = {
  selectionEnabled: _propTypes.default.bool,
  rollUpPresent: _propTypes.default.bool
};
EnhancedAvailabilityKey.defaultProps = {
  selectionEnabled: false,
  rollUpPresent: false
};