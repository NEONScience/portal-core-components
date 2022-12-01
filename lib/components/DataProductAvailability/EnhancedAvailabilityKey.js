"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/**
   Setup: CSS classes
*/
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
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
  };
});
var ALL_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then all sites rolled into a given row are selected';
var SOME_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then one or more but not all of the sites rolled into a given row are selected';

/**
   Main Function
*/
function EnhancedAvailabilityKey(props) {
  var classes = useStyles(_Theme.default);
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    dialogOpen = _useState2[0],
    setDialogOpen = _useState2[1];
  var selectionEnabled = props.selectionEnabled,
    rollUpPresent = props.rollUpPresent;
  var statusSvgHeight = _AvailabilityUtils.SVG.CELL_HEIGHT + 2;
  var labelLetterWidth = 8;
  var labelY = _AvailabilityUtils.SVG.LABEL_FONT_SIZE - _AvailabilityUtils.SVG.CELL_PADDING + 1;
  var statusLabelX = _AvailabilityUtils.SVG.CELL_WIDTH + 2 * _AvailabilityUtils.SVG.CELL_PADDING;

  // Let each element in the key be clickable to open the help dialog.
  // This is in addition to the help button, but we should still provide aria attributes.
  var dialogOpenerProps = {
    role: 'button',
    onClick: function onClick() {
      return setDialogOpen(true);
    }
  };
  var statusSvgs = {};
  Object.keys(_AvailabilityUtils.VALID_ENHANCED_STATUSES).forEach(function (status) {
    var label = _AvailabilityUtils.VALID_ENHANCED_STATUSES[status].title;
    var description = _AvailabilityUtils.VALID_ENHANCED_STATUSES[status].description;
    var statusSvgWidth = label.length * labelLetterWidth + statusLabelX;
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
  var renderSelectionElement = function renderSelectionElement(variant) {
    var inDialog = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!['all', 'some'].includes(variant)) {
      return null;
    }
    var selectionSvgHeight = _AvailabilityUtils.SVG.CELL_HEIGHT + 2;
    var label = variant === 'all' ? 'All sites selected' : 'Some sites selected';
    var fill = variant === 'all' ? _Theme.default.palette.primary.main : 'url(#partialSelectionPattern)';
    var description = variant === 'all' ? ALL_SELECTED_TITLE : SOME_SELECTED_TITLE;
    var selectionWidth = 45;
    var selectionLabelX = selectionWidth + 3 * _AvailabilityUtils.SVG.CELL_PADDING;
    var selectionSvgWidth = label.length * labelLetterWidth + selectionLabelX;
    var handleAttribs = {
      width: _AvailabilityUtils.SVG.DATE_RANGE_HANDLE_WIDTH,
      height: _AvailabilityUtils.SVG.CELL_HEIGHT,
      fill: _Theme.COLORS.LIGHT_BLUE[300],
      stroke: _Theme.default.palette.primary.main,
      strokeWidth: 1.5
    };
    var graphic = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("rect", {
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
  var renderDialog = function renderDialog() {
    var renderStatus = function renderStatus(status) {
      var _VALID_ENHANCED_STATU = _AvailabilityUtils.VALID_ENHANCED_STATUSES[status],
        title = _VALID_ENHANCED_STATU.title,
        description = _VALID_ENHANCED_STATU.description;
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
      onClose: function onClose() {
        return setDialogOpen(false);
      },
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
      onClick: function onClick() {
        return setDialogOpen(false);
      },
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
    onClick: function onClick() {
      return setDialogOpen(true);
    },
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