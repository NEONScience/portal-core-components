"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewerSites;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactSelect = _interopRequireDefault(require("react-select"));

var _reactCopyToClipboard = require("react-copy-to-clipboard");

var _styles = require("@material-ui/core/styles");

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Card = _interopRequireDefault(require("@material-ui/core/Card"));

var _Checkbox = _interopRequireDefault(require("@material-ui/core/Checkbox"));

var _Dialog = _interopRequireDefault(require("@material-ui/core/Dialog"));

var _DialogActions = _interopRequireDefault(require("@material-ui/core/DialogActions"));

var _DialogContent = _interopRequireDefault(require("@material-ui/core/DialogContent"));

var _DialogContentText = _interopRequireDefault(require("@material-ui/core/DialogContentText"));

var _DialogTitle = _interopRequireDefault(require("@material-ui/core/DialogTitle"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _InputAdornment = _interopRequireDefault(require("@material-ui/core/InputAdornment"));

var _List = _interopRequireDefault(require("@material-ui/core/List"));

var _ListItem = _interopRequireDefault(require("@material-ui/core/ListItem"));

var _ListItemIcon = _interopRequireDefault(require("@material-ui/core/ListItemIcon"));

var _ListItemText = _interopRequireDefault(require("@material-ui/core/ListItemText"));

var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));

var _NoSsr = _interopRequireDefault(require("@material-ui/core/NoSsr"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _Table = _interopRequireDefault(require("@material-ui/core/Table"));

var _TableBody = _interopRequireDefault(require("@material-ui/core/TableBody"));

var _TableCell = _interopRequireDefault(require("@material-ui/core/TableCell"));

var _TableContainer = _interopRequireDefault(require("@material-ui/core/TableContainer"));

var _TableHead = _interopRequireDefault(require("@material-ui/core/TableHead"));

var _TableRow = _interopRequireDefault(require("@material-ui/core/TableRow"));

var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));

var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));

var _Clear = _interopRequireDefault(require("@material-ui/icons/Clear"));

var _Terrain = _interopRequireDefault(require("@material-ui/icons/Terrain"));

var _History = _interopRequireDefault(require("@material-ui/icons/History"));

var _InfoOutlined = _interopRequireDefault(require("@material-ui/icons/InfoOutlined"));

var _MyLocation = _interopRequireDefault(require("@material-ui/icons/MyLocation"));

var _NotInterested = _interopRequireDefault(require("@material-ui/icons/NotInterested"));

var _Search = _interopRequireDefault(require("@material-ui/icons/Search"));

var _TouchApp = _interopRequireDefault(require("@material-ui/icons/TouchApp"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

var _iconSiteCoreTerrestrial = _interopRequireDefault(require("../SiteMap/svg/icon-site-core-terrestrial.svg"));

var _iconSiteCoreAquatic = _interopRequireDefault(require("../SiteMap/svg/icon-site-core-aquatic.svg"));

var _iconSiteRelocatableTerrestrial = _interopRequireDefault(require("../SiteMap/svg/icon-site-relocatable-terrestrial.svg"));

var _iconSiteRelocatableAquatic = _interopRequireDefault(require("../SiteMap/svg/icon-site-relocatable-aquatic.svg"));

var _TimeSeriesViewerContext = _interopRequireWildcard(require("./TimeSeriesViewerContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ucWord = function ucWord(word) {
  return "".concat(word.slice(0, 1)).concat(word.slice(1).toLowerCase());
};

var ICON_SVGS = {
  CORE: {
    AQUATIC: _iconSiteCoreAquatic.default,
    TERRESTRIAL: _iconSiteCoreTerrestrial.default
  },
  RELOCATABLE: {
    AQUATIC: _iconSiteRelocatableAquatic.default,
    TERRESTRIAL: _iconSiteRelocatableTerrestrial.default
  }
};
/**
   Classes and Styles
*/

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    root: {
      flexGrow: 1,
      width: '100%'
    },
    input: {
      display: 'flex',
      padding: '2px',
      height: 'auto'
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden'
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2)
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      bottom: 6,
      fontSize: 16
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0
    },
    divider: {
      height: theme.spacing(2)
    },
    optionSubtitle: {
      fontSize: '0.75rem',
      color: _Theme.default.palette.grey[500]
    },
    sitesContainer: {
      display: 'flex',
      alignContent: 'flex-start',
      flexFlow: 'row wrap'
    },
    siteCard: {
      width: '100%',
      padding: theme.spacing(1.5, 2, 1.5, 2),
      backgroundColor: theme.palette.grey[50],
      marginTop: theme.spacing(3)
    },
    siteTitleContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: _Theme.default.spacing(1.5)
    },
    siteDetailsRow: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'space-between'
    },
    siteDetailsColumn: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      marginBottom: _Theme.default.spacing(0.5)
    },
    siteDetail: {
      marginBottom: _Theme.default.spacing(1),
      marginRight: _Theme.default.spacing(4)
    },
    noneIcon: {
      color: theme.palette.grey[400],
      marginRight: theme.spacing(0.5),
      fontSize: '1rem'
    },
    noneLabel: {
      color: theme.palette.grey[400]
    },
    positionsTitleContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: theme.spacing(2)
    },
    positionsCardContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexWrap: 'wrap'
    },
    positionCard: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: theme.spacing(1, 2, 1, 0.5),
      backgroundColor: theme.palette.grey[100],
      marginTop: theme.spacing(1.5),
      marginRight: theme.spacing(3)
    },
    startFlex: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    }
  };
});
var selectStyles = {
  input: function input(base) {
    return _extends(_extends({}, base), {}, {
      color: _Theme.default.palette.text.primary,
      '& input': {
        font: 'inherit'
      }
    });
  },
  clearIndicator: function clearIndicator(base) {
    return _extends(_extends({}, base), {}, {
      display: 'none'
    });
  },
  indicatorSeparator: function indicatorSeparator(base) {
    return _extends(_extends({}, base), {}, {
      display: 'none'
    });
  },
  dropdownIndicator: function dropdownIndicator(base) {
    return _extends(_extends({}, base), {}, {
      cursor: 'pointer'
    });
  },
  groupHeading: function groupHeading(base) {
    return _extends(_extends({}, base), {}, {
      fontSize: '1rem',
      fontWeight: 600,
      color: _Theme.default.palette.primary.main
    });
  }
};
/**
   Common React-Select Components - used by both site-specific and position-specific react-selects
*/

function inputComponent(_ref) {
  var inputRef = _ref.inputRef,
      props = _objectWithoutProperties(_ref, ["inputRef"]);

  return /*#__PURE__*/_react.default.createElement("div", _extends({
    ref: inputRef
  }, props));
}

inputComponent.propTypes = {
  inputRef: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.shape({
    current: _propTypes.default.any.isRequired
  })]).isRequired
};

function ValueContainer(props) {
  var selectProps = props.selectProps,
      children = props.children;
  var valueContainer = selectProps.classes.valueContainer;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: valueContainer
  }, children);
}

ValueContainer.propTypes = {
  children: _propTypes.default.node.isRequired,
  selectProps: _propTypes.default.object.isRequired
};

function Menu(props) {
  var selectProps = props.selectProps,
      innerProps = props.innerProps,
      children = props.children;
  var paper = selectProps.classes.paper;
  return /*#__PURE__*/_react.default.createElement(_Paper.default, _extends({
    square: true,
    className: paper
  }, innerProps), children);
}

Menu.propTypes = {
  children: _propTypes.default.element.isRequired,
  innerProps: _propTypes.default.object.isRequired,
  selectProps: _propTypes.default.object.isRequired
};
/**
   Common React-Select PropTypes - used by both site-specific and position-specific components
*/

var ControlPropTypes = {
  children: _propTypes.default.node.isRequired,
  innerProps: _propTypes.default.shape({
    onMouseDown: _propTypes.default.func.isRequired
  }).isRequired,
  innerRef: _propTypes.default.oneOfType([_propTypes.default.oneOf([null]), _propTypes.default.func, _propTypes.default.shape({
    current: _propTypes.default.any.isRequired
  })]).isRequired,
  selectProps: _propTypes.default.object.isRequired
};
var OptionPropTypes = {
  children: _propTypes.default.node,
  innerProps: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    key: _propTypes.default.string,
    onClick: _propTypes.default.func,
    onMouseMove: _propTypes.default.func,
    onMouseOver: _propTypes.default.func,
    tabIndex: _propTypes.default.number.isRequired
  }),
  innerRef: _propTypes.default.oneOfType([_propTypes.default.oneOf([null]), _propTypes.default.func, _propTypes.default.shape({
    current: _propTypes.default.any.isRequired
  })]),
  isFocused: _propTypes.default.bool.isRequired,
  isSelected: _propTypes.default.bool.isRequired,
  isDisabled: _propTypes.default.bool,
  data: _propTypes.default.object.isRequired
};
var OptionDefaultProps = {
  children: null,
  innerProps: null,
  innerRef: null,
  isDisabled: false
};
var positionsDescription = "\n  Positions are distinct physical sensor locations at a given site. The x, y, and z coordinates\n  describe where the sensor is located relative to the ground-level reference point for the site.\n  Positions may change over time.\n";
var positionsSeriesDescription = "\n  Each position selected will become a distinct series in the chart for each variable (example: 2\n  positions \xD7 3 variables = 6 distinct series).\n";
/**
   PositionHistoryButton - button that opens a dialog to show all history for a given position
*/

function PositionHistoryButton(props) {
  var classes = useStyles(_Theme.default);
  var siteCode = props.siteCode,
      position = props.position,
      history = props.history;
  var disabled = history.length < 2;

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      historyDialogOpen = _useState2[0],
      setHistoryDialogOpen = _useState2[1];

  if (disabled) {
    return /*#__PURE__*/_react.default.createElement(_Button.default, {
      size: "small",
      variant: "outlined",
      title: "This position has had no changes to physical locations since its creation",
      startIcon: /*#__PURE__*/_react.default.createElement(_History.default, null),
      disabled: true
    }, "No History");
  }

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
    size: "small",
    variant: "outlined",
    onClick: function onClick() {
      setHistoryDialogOpen(true);
    },
    title: "Click to show all changes to physical locations for this position over time",
    startIcon: /*#__PURE__*/_react.default.createElement(_History.default, null)
  }, "History (".concat(history.length, ")")), /*#__PURE__*/_react.default.createElement(_Dialog.default, {
    open: historyDialogOpen,
    onClose: function onClose() {
      setHistoryDialogOpen(false);
    },
    scroll: "paper",
    "aria-labelledby": "position-history-dialog-title",
    "aria-describedby": "position-history-dialog-description"
  }, /*#__PURE__*/_react.default.createElement(_DialogTitle.default, {
    id: "position-history-dialog-title",
    disableTypography: true
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    id: "position-history-dialog-title"
  }, "Position History: ".concat(siteCode, " - ").concat(position))), /*#__PURE__*/_react.default.createElement(_DialogContent.default, {
    dividers: true
  }, /*#__PURE__*/_react.default.createElement(_DialogContentText.default, {
    id: "position-history-dialog-description",
    tabIndex: -1,
    variant: "body2"
  }, "".concat(positionsDescription, " The table below shows changes to the physical location of this position since its creation.")), /*#__PURE__*/_react.default.createElement(_TableContainer.default, null, /*#__PURE__*/_react.default.createElement(_Table.default, {
    className: classes.table,
    "aria-label": "simple table"
  }, /*#__PURE__*/_react.default.createElement(_TableHead.default, null, /*#__PURE__*/_react.default.createElement(_TableRow.default, {
    style: {
      backgroundColor: _Theme.default.palette.grey[50]
    }
  }, /*#__PURE__*/_react.default.createElement(_TableCell.default, null, "Start Date"), /*#__PURE__*/_react.default.createElement(_TableCell.default, null, "End Date"), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    align: "right"
  }, "x"), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    align: "right"
  }, "y"), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    align: "right"
  }, "z"), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    align: "right"
  }, "Elevation"))), /*#__PURE__*/_react.default.createElement(_TableBody.default, null, history.map(function (row, idx) {
    var _row$start = row.start,
        start = _row$start === void 0 ? '' : _row$start,
        _row$end = row.end,
        rawEnd = _row$end === void 0 ? '' : _row$end,
        xOffset = row.xOffset,
        yOffset = row.yOffset,
        zOffset = row.zOffset,
        referenceElevation = row.referenceElevation;
    var elevation = referenceElevation === null || zOffset === null ? 'unknown' : "".concat((parseFloat(referenceElevation, 10) + parseFloat(zOffset, 10)).toFixed(2).toString(), "m"); // eslint-disable-line max-len

    var end = rawEnd === '' ? 'Current' : rawEnd;
    var cellStyle = idx !== history.length - 1 ? {} : {
      fontWeight: '600',
      borderBottom: 'none'
    };
    return /*#__PURE__*/_react.default.createElement(_TableRow.default, {
      key: row.start
    }, /*#__PURE__*/_react.default.createElement(_TableCell.default, {
      component: "th",
      scope: "row",
      style: cellStyle
    }, start), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
      component: "th",
      scope: "row",
      style: cellStyle
    }, end), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
      align: "right",
      style: cellStyle
    }, "".concat(xOffset, "m")), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
      align: "right",
      style: cellStyle
    }, "".concat(yOffset, "m")), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
      align: "right",
      style: cellStyle
    }, "".concat(zOffset, "m")), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
      align: "right",
      style: cellStyle
    }, "".concat(elevation, "m")));
  }))))), /*#__PURE__*/_react.default.createElement(_DialogActions.default, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
    onClick: function onClick() {
      setHistoryDialogOpen(false);
    },
    color: "primary",
    variant: "outlined"
  }, "Return"))));
}

PositionHistoryButton.propTypes = {
  siteCode: _propTypes.default.string.isRequired,
  position: _propTypes.default.string.isRequired,
  history: _propTypes.default.arrayOf(_propTypes.default.shape({
    'HOR.VER': _propTypes.default.string.isRequired,
    azimuth: _propTypes.default.string.isRequired,
    pitch: _propTypes.default.string.isRequired,
    roll: _propTypes.default.string.isRequired,
    start: _propTypes.default.string,
    end: _propTypes.default.string,
    xOffset: _propTypes.default.string.isRequired,
    yOffset: _propTypes.default.string.isRequired,
    zOffset: _propTypes.default.string.isRequired,
    referenceStart: _propTypes.default.string,
    referenceEnd: _propTypes.default.string,
    referenceLatitude: _propTypes.default.string.isRequired,
    referenceLongitude: _propTypes.default.string.isRequired,
    referenceElevation: _propTypes.default.string.isRequired
  })).isRequired
};
/**
   PositionDetail - Component to display neatly-formatted position content
*/

function PositionDetail(props) {
  var siteCode = props.siteCode,
      position = props.position,
      wide = props.wide;
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont2 = _slicedToArray(_TimeSeriesViewerCont, 1),
      state = _TimeSeriesViewerCont2[0];

  if (!state.product.sites[siteCode] || !state.product.sites[siteCode].positions[position]) {
    return /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body1"
    }, position);
  }

  var history = state.product.sites[siteCode].positions[position].history;
  var current = history.length - 1 || 0;

  var _ref2 = history[current] || {},
      _ref2$referenceElevat = _ref2.referenceElevation,
      referenceElevation = _ref2$referenceElevat === void 0 ? '--' : _ref2$referenceElevat,
      _ref2$xOffset = _ref2.xOffset,
      xOffset = _ref2$xOffset === void 0 ? '--' : _ref2$xOffset,
      _ref2$yOffset = _ref2.yOffset,
      yOffset = _ref2$yOffset === void 0 ? '--' : _ref2$yOffset,
      _ref2$zOffset = _ref2.zOffset,
      zOffset = _ref2$zOffset === void 0 ? '--' : _ref2$zOffset;

  var elevation = referenceElevation === '--' ? '--' : (parseFloat(referenceElevation, 10) + parseFloat(zOffset, 10)).toFixed(2).toString();
  var fadeStyle = {
    color: _Theme.default.palette.grey[500]
  };
  var axisStyle = {
    marginRight: _Theme.default.spacing(1),
    fontWeight: 600
  };
  return wide ? /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.startFlex,
    style: {
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body1",
    style: {
      fontWeight: 600,
      marginRight: _Theme.default.spacing(3)
    }
  }, position), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.startFlex,
    style: _extends({
      alignItems: 'center'
    }, fadeStyle)
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2"
  }, "Elevation:"), /*#__PURE__*/_react.default.createElement(_Terrain.default, {
    fontSize: "small",
    style: {
      margin: _Theme.default.spacing(0, 0.5, 0, 1)
    }
  }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2"
  }, "".concat(elevation, "m")))), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.startFlex
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: _extends({}, axisStyle)
  }, "x / y / z:"), "".concat(xOffset, "m / ").concat(yOffset, "m / ").concat(zOffset, "m")))) : /*#__PURE__*/_react.default.createElement("div", {
    className: classes.startFlex,
    style: {
      alignItems: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginRight: _Theme.default.spacing(3)
    }
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body1",
    style: {
      fontWeight: 600
    }
  }, position), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2",
    style: _extends({}, fadeStyle)
  }, "Elevation:"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement(_Terrain.default, {
    fontSize: "small",
    style: _extends({
      marginRight: _Theme.default.spacing(0.5)
    }, fadeStyle)
  }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2",
    style: _extends({}, fadeStyle)
  }, "".concat(elevation, "m")))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginRight: _Theme.default.spacing(3)
    }
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: _extends({}, axisStyle)
  }, "x:"), "".concat(xOffset, "m"), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("span", {
    style: _extends({}, axisStyle)
  }, "y:"), "".concat(yOffset, "m"), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("span", {
    style: _extends({}, axisStyle)
  }, "z:"), "".concat(zOffset, "m"))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/_react.default.createElement(PositionHistoryButton, {
    siteCode: siteCode,
    position: position,
    history: history
  })));
}

PositionDetail.propTypes = {
  siteCode: _propTypes.default.string.isRequired,
  position: _propTypes.default.string.isRequired,
  wide: _propTypes.default.bool
};
PositionDetail.defaultProps = {
  wide: false
};
/**
   Selected Position - Component for a single deletable position paper to show within a SelectedSite
*/

function SelectedPosition(props) {
  var classes = useStyles(_Theme.default);
  var siteCode = props.siteCode,
      position = props.position,
      disabled = props.disabled;

  var _TimeSeriesViewerCont3 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont4 = _slicedToArray(_TimeSeriesViewerCont3, 2),
      state = _TimeSeriesViewerCont4[0],
      dispatch = _TimeSeriesViewerCont4[1];

  return /*#__PURE__*/_react.default.createElement(_Card.default, {
    key: position,
    variant: "outlined",
    className: classes.positionCard
  }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    "aria-label": "remove position ".concat(position, " from ").concat(siteCode),
    disabled: disabled,
    style: {
      marginLeft: _Theme.default.spacing(1),
      marginRight: _Theme.default.spacing(1)
    },
    onClick: function onClick() {
      if (disabled) {
        return;
      }

      var selectedSiteIdx = state.selection.sites.findIndex(function (site) {
        return site.siteCode === siteCode;
      });
      dispatch({
        type: 'selectSitePositions',
        positions: state.selection.sites[selectedSiteIdx].positions.filter(function (p) {
          return p !== position;
        }),
        siteCode: siteCode
      });
    }
  }, /*#__PURE__*/_react.default.createElement(_Clear.default, {
    fontSize: "small"
  })), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      flexGrow: 1
    }
  }, /*#__PURE__*/_react.default.createElement(PositionDetail, {
    siteCode: siteCode,
    position: position
  })));
}

SelectedPosition.propTypes = {
  siteCode: _propTypes.default.string.isRequired,
  position: _propTypes.default.string.isRequired,
  disabled: _propTypes.default.bool
};
SelectedPosition.defaultProps = {
  disabled: false
};
/**
   SelectPositionsButton - button that opens a dialog for position selection
*/

function SelectPositionsButton(props) {
  var selectedSite = props.selectedSite;
  var siteCode = selectedSite.siteCode,
      selectedPositions = selectedSite.positions;

  var _TimeSeriesViewerCont5 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont6 = _slicedToArray(_TimeSeriesViewerCont5, 2),
      state = _TimeSeriesViewerCont6[0],
      dispatch = _TimeSeriesViewerCont6[1];

  var availablePositions = state.product.sites[siteCode] ? Object.keys(state.product.sites[siteCode].positions) : [];
  availablePositions.sort();

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      selectDialogOpen = _useState4[0],
      setSelectDialogOpen = _useState4[1]; // Local state for position selections so that no fetches are fired until the dialog is submitted


  var _useState5 = (0, _react.useState)(selectedPositions),
      _useState6 = _slicedToArray(_useState5, 2),
      localSelectedPositions = _useState6[0],
      setLocalSelectedPositions = _useState6[1];

  var togglePosition = function togglePosition(position) {
    if (localSelectedPositions.includes(position)) {
      setLocalSelectedPositions(localSelectedPositions.filter(function (p) {
        return p !== position;
      }));
    } else {
      setLocalSelectedPositions([].concat(_toConsumableArray(localSelectedPositions), [position]));
    }
  };

  var handleApply = function handleApply() {
    if (!localSelectedPositions.length) {
      return;
    }

    setSelectDialogOpen(false);
    dispatch({
      type: 'selectSitePositions',
      siteCode: siteCode,
      positions: localSelectedPositions
    });
  };

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
    size: "small",
    variant: "outlined",
    startIcon: /*#__PURE__*/_react.default.createElement(_TouchApp.default, null),
    style: {
      marginLeft: _Theme.default.spacing(4)
    },
    onClick: function onClick() {
      setLocalSelectedPositions(selectedPositions);
      setSelectDialogOpen(true);
    }
  }, "Select Positions\u2026"), /*#__PURE__*/_react.default.createElement(_Dialog.default, {
    open: selectDialogOpen,
    onClose: function onClose() {
      setSelectDialogOpen(false);
    },
    scroll: "paper",
    "aria-labelledby": "add-positions-dialog-title",
    "aria-describedby": "add-positions-dialog-description"
  }, /*#__PURE__*/_react.default.createElement(_DialogTitle.default, {
    id: "add-positions-dialog-title",
    disableTypography: true
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    id: "add-positions-dialog-title"
  }, "Select Positions"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle2",
    color: !localSelectedPositions.length ? 'error' : 'textPrimary',
    style: {
      textAlign: 'right'
    }
  }, "".concat(localSelectedPositions.length, " of ").concat(availablePositions.length, " selected"), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("span", {
    style: {
      fontWeight: 300,
      color: _Theme.default.palette.grey[500],
      fontStyle: 'italic'
    }
  }, "at least one is required")))), /*#__PURE__*/_react.default.createElement(_DialogContent.default, {
    dividers: true
  }, /*#__PURE__*/_react.default.createElement(_DialogContentText.default, {
    id: "add-positions-dialog-description",
    tabIndex: -1,
    variant: "body2"
  }, positionsDescription, /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), positionsSeriesDescription), /*#__PURE__*/_react.default.createElement(_List.default, null, availablePositions.map(function (position) {
    var labelId = "position-list-label-".concat(position);
    return /*#__PURE__*/_react.default.createElement(_ListItem.default, {
      key: position,
      role: undefined,
      dense: true,
      button: true,
      onClick: function onClick() {
        togglePosition(position);
      }
    }, /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, null, /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
      edge: "start",
      checked: localSelectedPositions.includes(position),
      tabIndex: -1,
      disableRipple: true,
      inputProps: {
        'aria-labelledby': labelId
      }
    })), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
      id: labelId,
      primary: /*#__PURE__*/_react.default.createElement(PositionDetail, {
        siteCode: siteCode,
        position: position,
        wide: true
      })
    }));
  }))), /*#__PURE__*/_react.default.createElement(_DialogActions.default, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
    onClick: function onClick() {
      setSelectDialogOpen(false);
    },
    variant: "outlined"
  }, "Cancel"), /*#__PURE__*/_react.default.createElement(_Button.default, {
    onClick: handleApply,
    variant: "contained",
    disabled: !localSelectedPositions.length
  }, "Apply"))));
}

SelectPositionsButton.propTypes = {
  selectedSite: _propTypes.default.shape({
    siteCode: _propTypes.default.string.isRequired,
    positions: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
  }).isRequired
};
/**
   SitesControl - Component for the top-level Sites search field
*/

function SitesControl(props) {
  var children = props.children,
      innerProps = props.innerProps,
      innerRef = props.innerRef,
      TextFieldProps = props.selectProps.TextFieldProps;
  return /*#__PURE__*/_react.default.createElement(_TextField.default, _extends({
    fullWidth: true,
    label: "Add Sites",
    variant: "outlined",
    InputProps: {
      inputComponent: inputComponent,
      inputProps: _extends({
        ref: innerRef,
        children: children
      }, innerProps),
      endAdornment: /*#__PURE__*/_react.default.createElement(_InputAdornment.default, {
        position: "end"
      }, /*#__PURE__*/_react.default.createElement(_Search.default, {
        color: "disabled"
      }))
    }
  }, TextFieldProps));
}

SitesControl.propTypes = ControlPropTypes;
/**
   SiteOption - Component for a single site as it appears in the drop-down menu
*/

function SiteOption(props) {
  var classes = useStyles(_Theme.default);
  var innerRef = props.innerRef,
      isFocused = props.isFocused,
      isDisabled = props.isDisabled,
      innerProps = props.innerProps,
      data = props.data;
  var siteCode = data.siteCode,
      description = data.description,
      type = data.type,
      terrain = data.terrain,
      domainCode = data.domainCode,
      domainName = data.domainName,
      stateCode = data.stateCode,
      latitude = data.latitude,
      longitude = data.longitude;
  var terrainTypeTitle = "".concat(ucWord(terrain), " ").concat(ucWord(type));

  var optionContent = /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body1",
    gutterBottom: true
  }, siteCode);

  if (stateCode) {
    var iconSvg = ICON_SVGS[type] && ICON_SVGS[type][terrain] ? ICON_SVGS[type][terrain] : null;
    optionContent = /*#__PURE__*/_react.default.createElement("div", {
      className: classes.startFlex
    }, iconSvg ? /*#__PURE__*/_react.default.createElement("img", {
      src: iconSvg,
      alt: terrainTypeTitle,
      title: terrainTypeTitle,
      width: _Theme.default.spacing(3),
      height: _Theme.default.spacing(3),
      style: {
        marginRight: _Theme.default.spacing(1.5),
        marginTop: _Theme.default.spacing(0.5),
        flexGrow: 0
      }
    }) : null, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flexGrow: 1
      }
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body1"
    }, "".concat(siteCode, " - ").concat(description, ", ").concat(stateCode)), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      className: classes.optionSubtitle,
      gutterBottom: true
    }, "".concat(terrainTypeTitle, " - Domain ").concat(domainCode, " (").concat(domainName, ") - Lat/Lon: ").concat(latitude.toFixed(6), ", ").concat(longitude.toFixed(6)))));
  }

  return /*#__PURE__*/_react.default.createElement(_MenuItem.default, _extends({
    key: siteCode,
    ref: innerRef,
    selected: isFocused && !isDisabled,
    component: "div",
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      cursor: isDisabled ? 'not-allowed' : 'pointer'
    }
  }, innerProps), optionContent);
}

SiteOption.propTypes = OptionPropTypes;
SiteOption.defaultProps = OptionDefaultProps;
/**
   Selected Site - Component for a single deletable site paper to show below the search box
*/

function SelectedSite(props) {
  var classes = useStyles(_Theme.default);
  var site = props.site,
      disabled = props.disabled,
      setSelectedTab = props.setSelectedTab,
      TAB_IDS = props.TAB_IDS;
  var siteCode = site.siteCode,
      positions = site.positions;

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      neonContextData = _NeonContext$useNeonC2[0].data;

  var allSites = neonContextData.sites,
      allStates = neonContextData.states,
      allDomains = neonContextData.domains;

  var _TimeSeriesViewerCont7 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont8 = _slicedToArray(_TimeSeriesViewerCont7, 2),
      dispatch = _TimeSeriesViewerCont8[1]; // style={{ fontSize: '0.8rem', fontWeight: 600 }}


  var dateRangeTabButton = /*#__PURE__*/_react.default.createElement(_Button.default, {
    size: "small",
    color: "secondary",
    onClick: function onClick() {
      setSelectedTab(TAB_IDS.DATE_RANGE);
    },
    style: {
      padding: '0px 2px',
      marginTop: '-4px',
      fontStyle: 'italic'
    }
  }, "Date Range");

  var removeSiteButton = /*#__PURE__*/_react.default.createElement(_Button.default, {
    size: "small",
    variant: "outlined",
    onClick: function onClick() {
      if (disabled) {
        return;
      }

      dispatch({
        type: 'selectRemoveSite',
        siteCode: siteCode
      });
    },
    style: {
      minWidth: _Theme.default.spacing(13),
      whiteSpace: 'nowrap'
    },
    disabled: disabled,
    startIcon: /*#__PURE__*/_react.default.createElement(_Clear.default, null)
  }, "Remove Site");

  var selectedSiteContent = /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body1",
    gutterBottom: true
  }, "".concat(siteCode, " (loading site details\u2026)")), removeSiteButton);

  if (allSites[siteCode]) {
    var _allSites$siteCode = allSites[siteCode],
        description = _allSites$siteCode.description,
        type = _allSites$siteCode.type,
        terrain = _allSites$siteCode.terrain,
        domainCode = _allSites$siteCode.domainCode,
        stateCode = _allSites$siteCode.stateCode,
        latitude = _allSites$siteCode.latitude,
        longitude = _allSites$siteCode.longitude;
    var typeTitle = 'Core';
    var typeSubtitle = 'fixed location';

    if (type === 'RELOCATABLE') {
      typeTitle = 'Relocatable';
      typeSubtitle = 'location may change';
    }

    var terrainTitle = 'Terrestrial';
    var terrainSubtitle = 'land-based';

    if (terrain === 'AQUATIC') {
      terrainTitle = 'Aquatic';
      terrainSubtitle = 'water-based';
    }

    var terrainTypeTitle = "".concat(terrainTitle, " ").concat(typeTitle);
    var terrainTypeSubtitle = "".concat(terrainSubtitle, "; ").concat(typeSubtitle);
    var domainName = allDomains[domainCode] ? allDomains[domainCode].name : null;
    var stateName = allStates[stateCode] ? allStates[stateCode].name : null;
    var stateFieldTitle = stateCode === 'PR' ? 'Territory' : 'State';
    var iconSvg = ICON_SVGS[type] && ICON_SVGS[type][terrain] ? ICON_SVGS[type][terrain] : null;
    var terrainIcon = iconSvg ? /*#__PURE__*/_react.default.createElement("img", {
      src: iconSvg,
      alt: terrainTypeTitle,
      title: terrainTypeTitle,
      width: _Theme.default.spacing(4),
      height: _Theme.default.spacing(4),
      style: {
        marginRight: _Theme.default.spacing(1),
        flexGrow: 0
      }
    }) : null;
    selectedSiteContent = /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.siteTitleContainer
    }, terrainIcon, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      style: {
        lineHeight: '1.4rem',
        flexGrow: 1
      }
    }, "".concat(description, " (").concat(siteCode, ")")), removeSiteButton), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.siteDetailsRow
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.siteDetailsColumn
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.siteDetail
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, terrainTypeTitle), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      style: {
        fontSize: '0.8rem'
      }
    }, /*#__PURE__*/_react.default.createElement("i", null, terrainTypeSubtitle))), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.siteDetail
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.startFlex,
      style: {
        alignItems: 'center'
      }
    }, /*#__PURE__*/_react.default.createElement(_reactCopyToClipboard.CopyToClipboard, {
      text: "".concat(latitude, " ").concat(longitude)
    }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      title: "Latitude / Longitude (click to copy)"
    }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      size: "small",
      style: {
        marginRight: _Theme.default.spacing(0.5)
      },
      "aria-label": "Latitude / Longitude (click to copy)"
    }, /*#__PURE__*/_react.default.createElement(_MyLocation.default, null)))), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption",
      "aria-label": "Latitude / Longitude",
      style: {
        fontFamily: 'monospace',
        textAlign: 'right',
        fontSize: '0.85rem'
      }
    }, latitude, /*#__PURE__*/_react.default.createElement("br", null), longitude)))), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.siteDetailsColumn
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.siteDetail
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, stateFieldTitle), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2"
    }, stateName)), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.siteDetail
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "Domain"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2"
    }, "".concat(domainCode, " - ").concat(domainName))))));
  }

  return /*#__PURE__*/_react.default.createElement(_Card.default, {
    key: siteCode,
    variant: "outlined",
    className: classes.siteCard
  }, selectedSiteContent, positions.length ? /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.positionsTitleContainer
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle2"
  }, "Position(s)"), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, positionsDescription, /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), positionsSeriesDescription)
  }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    size: "small",
    style: {
      marginLeft: _Theme.default.spacing(1)
    }
  }, /*#__PURE__*/_react.default.createElement(_InfoOutlined.default, {
    fontSize: "small"
  }))), /*#__PURE__*/_react.default.createElement(SelectPositionsButton, {
    selectedSite: site
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.positionsCardContainer
  }, positions.map(function (position) {
    return /*#__PURE__*/_react.default.createElement(SelectedPosition, {
      key: position,
      siteCode: siteCode,
      position: position,
      disabled: positions.length < 2
    });
  }))) : /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.startFlex,
    style: {
      alignItems: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement(_NotInterested.default, {
    className: classes.noneIcon
  }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body1",
    className: classes.noneLabel,
    style: {
      fontWeight: 600
    }
  }, "No Positions Available.")), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2",
    className: classes.noneLabel,
    style: {
      fontSize: '0.8rem'
    }
  }, /*#__PURE__*/_react.default.createElement("i", null, "This site has no available data for the current selected date range, and thus no positions. See ", dateRangeTabButton, " to compare selection with availability."))));
}

SelectedSite.propTypes = _extends({
  site: _propTypes.default.shape({
    siteCode: _propTypes.default.string.isRequired,
    positions: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
  }).isRequired,
  disabled: _propTypes.default.bool
}, _TimeSeriesViewerContext.TabComponentPropTypes);
SelectedSite.defaultProps = {
  disabled: false
};
/**
   Complete Select for Sites
*/

var SitesSelectComponents = {
  Control: SitesControl,
  Option: SiteOption,
  Menu: Menu,
  ValueContainer: ValueContainer,
  Placeholder: function Placeholder() {
    return null;
  },
  MultiValue: function MultiValue() {
    return null;
  },
  IndicatorsContainer: function IndicatorsContainer() {
    return null;
  }
};

var SitesSelect = function SitesSelect() {
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont9 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont10 = _slicedToArray(_TimeSeriesViewerCont9, 2),
      state = _TimeSeriesViewerCont10[0],
      dispatch = _TimeSeriesViewerCont10[1];

  var _NeonContext$useNeonC3 = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC4 = _slicedToArray(_NeonContext$useNeonC3, 1),
      neonContextData = _NeonContext$useNeonC4[0].data;

  var allStates = neonContextData.states,
      allSites = neonContextData.sites,
      allDomains = neonContextData.domains; // Build list of selectable sites grouped by US state

  var selectableSiteCodes = Object.keys(state.product.sites);
  var selectableSitesCount = 0;
  var selectableSites = Object.keys(allStates).map(function (stateCode) {
    return {
      label: allStates[stateCode].name,
      stateCode: stateCode,
      options: []
    };
  });
  Object.keys(state.product.sites).filter(function (siteCode) {
    return selectableSiteCodes.includes(siteCode);
  }).forEach(function (siteCode) {
    var groupIdx = selectableSites.findIndex(function (group) {
      return allSites[siteCode] && group.stateCode === allSites[siteCode].stateCode;
    });

    if (groupIdx === -1) {
      return;
    }

    var domain = allDomains[allSites[siteCode].domainCode] || {};
    var usState = allStates[allSites[siteCode].stateCode] || {};
    var search = [siteCode, allSites[siteCode].description, allSites[siteCode].domainCode, allSites[siteCode].stateCode, allSites[siteCode].type, allSites[siteCode].terrain, domain.name || '', usState.name || ''].join(' ').toLowerCase();
    selectableSites[groupIdx].options.push(_extends(_extends({
      value: siteCode,
      domainName: domain.name || null
    }, allSites[siteCode]), {}, {
      search: search
    }));
    selectableSitesCount += 1;
  });
  var selectedSites = state.selection.sites.map(function (site) {
    return site.siteCode;
  }).filter(function (siteCode) {
    return selectableSiteCodes.includes(siteCode);
  });

  if (!selectableSitesCount) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_NoSsr.default, null, /*#__PURE__*/_react.default.createElement(_reactSelect.default, {
    isMulti: true,
    isSearchable: true,
    clearable: false,
    classes: classes,
    styles: selectStyles,
    "aria-label": "Add Sites",
    "data-gtm": "time-series-viewer.add-sites",
    options: selectableSites,
    components: SitesSelectComponents,
    value: selectedSites,
    controlShouldRenderValue: false,
    filterOption: function filterOption(option, searchText) {
      return option.data.search.includes(searchText.toLowerCase());
    },
    onChange: function onChange(value, change) {
      if (change.action !== 'select-option') {
        return;
      }

      dispatch({
        type: 'selectAddSite',
        siteCode: change.option.siteCode
      });
    }
  }));
};
/**
   Primary Component
*/


function TimeSeriesViewerSites(props) {
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont11 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont12 = _slicedToArray(_TimeSeriesViewerCont11, 1),
      state = _TimeSeriesViewerCont12[0];

  var _NeonContext$useNeonC5 = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC6 = _slicedToArray(_NeonContext$useNeonC5, 1),
      neonContextData = _NeonContext$useNeonC6[0].data;

  var allSites = neonContextData.sites;

  if (!state.selection.sites.length || !Object.keys(allSites).length) {
    return /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      variant: "rect",
      width: "100%",
      height: 56
    });
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes.root
  }, /*#__PURE__*/_react.default.createElement(SitesSelect, null), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.sitesContainer
  }, state.selection.sites.map(function (site) {
    return /*#__PURE__*/_react.default.createElement(SelectedSite, _extends({
      key: site.siteCode,
      site: site,
      disabled: state.selection.sites.length < 2
    }, props));
  })));
}

TimeSeriesViewerSites.propTypes = _TimeSeriesViewerContext.TabComponentPropTypes;