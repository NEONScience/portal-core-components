"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewerSites;
exports.getTestableItems = void 0;
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
var _MapSelectionButton = _interopRequireDefault(require("../MapSelectionButton/MapSelectionButton"));
var _typeUtil = require("../../util/typeUtil");
var _iconSiteCoreTerrestrial = _interopRequireDefault(require("../SiteMap/svg/icon-site-core-terrestrial.svg"));
var _iconSiteCoreAquatic = _interopRequireDefault(require("../SiteMap/svg/icon-site-core-aquatic.svg"));
var _iconSiteGradientTerrestrial = _interopRequireDefault(require("../SiteMap/svg/icon-site-gradient-terrestrial.svg"));
var _iconSiteGradientAquatic = _interopRequireDefault(require("../SiteMap/svg/icon-site-gradient-aquatic.svg"));
var _TimeSeriesViewerContext = _interopRequireWildcard(require("./TimeSeriesViewerContext"));
const _excluded = ["inputRef"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /* eslint-disable react/forbid-prop-types */
const ucWord = word => "".concat(word.slice(0, 1).toUpperCase()).concat(word.slice(1).toLowerCase());
const ICON_SVGS = {
  CORE: {
    AQUATIC: _iconSiteCoreAquatic.default,
    TERRESTRIAL: _iconSiteCoreTerrestrial.default
  },
  GRADIENT: {
    AQUATIC: _iconSiteGradientAquatic.default,
    TERRESTRIAL: _iconSiteGradientTerrestrial.default
  }
};

/**
   Classes and Styles
*/
const useStyles = (0, _styles.makeStyles)(theme => ({
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
    marginRight: theme.spacing(1.5),
    width: '100%',
    maxWidth: '800px'
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  }
}));
const selectStyles = {
  input: base => _extends({}, base, {
    color: _Theme.default.palette.text.primary,
    '& input': {
      font: 'inherit'
    }
  }),
  clearIndicator: base => _extends({}, base, {
    display: 'none'
  }),
  indicatorSeparator: base => _extends({}, base, {
    display: 'none'
  }),
  dropdownIndicator: base => _extends({}, base, {
    cursor: 'pointer'
  }),
  groupHeading: base => _extends({}, base, {
    fontSize: '1rem',
    fontWeight: 600,
    color: _Theme.default.palette.primary.main
  })
};

/**
   Common React-Select Components - used by both site-specific and position-specific react-selects
*/
function inputComponent(_ref) {
  let {
      inputRef
    } = _ref,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
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
  const {
    selectProps,
    children
  } = props;
  const {
    valueContainer
  } = selectProps.classes;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: valueContainer
  }, children);
}
ValueContainer.propTypes = {
  children: _propTypes.default.node.isRequired,
  selectProps: _propTypes.default.object.isRequired
};
function Menu(props) {
  const {
    selectProps,
    innerProps,
    children
  } = props;
  const {
    paper
  } = selectProps.classes;
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
const ControlPropTypes = {
  children: _propTypes.default.node.isRequired,
  innerProps: _propTypes.default.shape({
    onMouseDown: _propTypes.default.func.isRequired
  }).isRequired,
  innerRef: _propTypes.default.oneOfType([_propTypes.default.oneOf([null]), _propTypes.default.func, _propTypes.default.shape({
    current: _propTypes.default.any.isRequired
  })]).isRequired,
  selectProps: _propTypes.default.object.isRequired
};
const OptionPropTypes = {
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
const OptionDefaultProps = {
  children: null,
  innerProps: null,
  innerRef: null,
  isDisabled: false
};
const positionsDescription = "\n  Positions are distinct physical sensor locations at a given site. The x, y, and z coordinates\n  describe where the sensor is located relative to the ground-level reference location.\n  Positions may change over time.\n";
const positionsSeriesDescription = "\n  Each position selected will become a distinct series in the chart for each variable (example: 2\n  positions \xD7 3 variables = 6 distinct series).\n";

/**
   PositionHistoryButton - button that opens a dialog to show all history for a given position
*/
function PositionHistoryButton(props) {
  const classes = useStyles(_Theme.default);
  const {
    siteCode,
    position,
    history,
    fullWidth
  } = props;
  const disabled = history.length < 2;
  const [historyDialogOpen, setHistoryDialogOpen] = (0, _react.useState)(false);
  if (disabled) {
    return /*#__PURE__*/_react.default.createElement(_Button.default, {
      fullWidth: fullWidth,
      size: "small",
      variant: "outlined",
      title: "This position has had no changes to physical locations since its creation",
      startIcon: /*#__PURE__*/_react.default.createElement(_History.default, null),
      disabled: true
    }, "No History");
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
    fullWidth: fullWidth,
    size: "small",
    variant: "outlined",
    onClick: () => {
      setHistoryDialogOpen(true);
    },
    title: "Click to show all changes to physical locations for this position over time",
    startIcon: /*#__PURE__*/_react.default.createElement(_History.default, null)
  }, "History (".concat(history.length, ")")), /*#__PURE__*/_react.default.createElement(_Dialog.default, {
    open: historyDialogOpen,
    onClose: () => {
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
  }, "Elevation"))), /*#__PURE__*/_react.default.createElement(_TableBody.default, null, history.map((row, idx) => {
    const {
      sensorStartDateTime = '',
      sensorEndDateTime: rawEnd = '',
      xOffset,
      yOffset,
      zOffset,
      referenceLocationElevation
    } = row;
    const hasReferenceElevation = (0, _typeUtil.exists)(referenceLocationElevation) && !isNaN(referenceLocationElevation);
    const hasXOffset = (0, _typeUtil.exists)(xOffset) && !isNaN(xOffset);
    const hasYOffset = (0, _typeUtil.exists)(yOffset) && !isNaN(yOffset);
    const hasZOffset = (0, _typeUtil.exists)(zOffset) && !isNaN(zOffset);
    const parsedReferenceElevation = hasReferenceElevation ? referenceLocationElevation : NaN;
    const parsedXOffset = hasXOffset ? xOffset : NaN;
    const parsedYOffset = hasYOffset ? yOffset : NaN;
    const parsedZOffset = hasZOffset ? zOffset : NaN;
    let elevation = 'unknown';
    if (!isNaN(parsedReferenceElevation)) {
      if (!isNaN(parsedZOffset)) {
        elevation = "".concat((parsedReferenceElevation + parsedZOffset).toFixed(2).toString(), "m");
      } else {
        elevation = "".concat(parsedReferenceElevation, "m");
      }
    }
    const displayXOffset = hasXOffset ? "".concat(xOffset, "m") : '--';
    const displayYOffset = hasYOffset ? "".concat(yOffset, "m") : '--';
    const displayZOffset = hasZOffset ? "".concat(zOffset, "m") : '--';
    const end = rawEnd === '' ? 'Current' : rawEnd;
    const cellStyle = idx !== history.length - 1 ? {} : {
      fontWeight: '600',
      borderBottom: 'none'
    };
    const key = "".concat(sensorStartDateTime).concat(end).concat(parsedXOffset).concat(parsedYOffset).concat(parsedZOffset);
    return /*#__PURE__*/_react.default.createElement(_TableRow.default, {
      key: key
    }, /*#__PURE__*/_react.default.createElement(_TableCell.default, {
      component: "th",
      scope: "row",
      style: cellStyle
    }, sensorStartDateTime), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
      component: "th",
      scope: "row",
      style: cellStyle
    }, end), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
      align: "right",
      style: cellStyle
    }, displayXOffset), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
      align: "right",
      style: cellStyle
    }, displayYOffset), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
      align: "right",
      style: cellStyle
    }, displayZOffset), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
      align: "right",
      style: cellStyle
    }, elevation));
  }))))), /*#__PURE__*/_react.default.createElement(_DialogActions.default, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
    onClick: () => {
      setHistoryDialogOpen(false);
    },
    color: "primary",
    variant: "outlined"
  }, "Return"))));
}
PositionHistoryButton.propTypes = {
  siteCode: _propTypes.default.string.isRequired,
  position: _propTypes.default.string.isRequired,
  fullWidth: _propTypes.default.bool,
  history: _propTypes.default.arrayOf(_propTypes.default.shape({
    horVer: _propTypes.default.string.isRequired,
    azimuth: _propTypes.default.number,
    pitch: _propTypes.default.number,
    roll: _propTypes.default.number,
    sensorStartDateTime: _propTypes.default.string,
    sensorEndDateTime: _propTypes.default.string,
    xOffset: _propTypes.default.number,
    yOffset: _propTypes.default.number,
    zOffset: _propTypes.default.number,
    referenceLocationStartDateTime: _propTypes.default.string,
    referenceLocationEndDateTime: _propTypes.default.string,
    referenceLocationLatitude: _propTypes.default.number,
    referenceLocationLongitude: _propTypes.default.number,
    referenceLocationElevation: _propTypes.default.number
  })).isRequired
};
PositionHistoryButton.defaultProps = {
  fullWidth: false
};
const POSITION_DETAIL_COMPONENT_XS_UPPER = 300;
const POSITION_DETAIL_COMPONENT_MD_LOWER = 600;

/**
   PositionDetail - Component to display neatly-formatted position content
*/
function PositionDetail(props) {
  const {
    siteCode,
    position,
    wide
  } = props;
  const classes = useStyles(_Theme.default);
  const [state] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const containerRef = (0, _react.useRef)();
  const [componentWidth, setComponentWidth] = (0, _react.useState)(0);
  let atComponentXs = false;
  let atComponentMd = false;
  if (componentWidth > 0) {
    atComponentXs = componentWidth <= POSITION_DETAIL_COMPONENT_XS_UPPER;
    atComponentMd = componentWidth > POSITION_DETAIL_COMPONENT_MD_LOWER;
  }
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
  if (!state.product.sites[siteCode] || !state.product.sites[siteCode].positions[position]) {
    return /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body1"
    }, position);
  }
  const {
    history
  } = state.product.sites[siteCode].positions[position];
  const current = history.length - 1 || 0;
  const {
    sensorName,
    sensorDescription,
    referenceLocationName,
    referenceLocationDescription,
    referenceLocationElevation,
    xOffset,
    yOffset,
    zOffset
  } = history[current] || {};
  const hasReferenceElevation = (0, _typeUtil.exists)(referenceLocationElevation) && !isNaN(referenceLocationElevation);
  const hasXOffset = (0, _typeUtil.exists)(xOffset) && !isNaN(xOffset);
  const hasYOffset = (0, _typeUtil.exists)(yOffset) && !isNaN(yOffset);
  const hasZOffset = (0, _typeUtil.exists)(zOffset) && !isNaN(zOffset);
  const parsedReferenceElevation = hasReferenceElevation ? referenceLocationElevation : NaN;
  const parsedZOffset = hasZOffset ? zOffset : NaN;
  const displayXOffset = hasXOffset ? "".concat(xOffset, "m") : '--';
  const displayYOffset = hasYOffset ? "".concat(yOffset, "m") : '--';
  const displayZOffset = hasZOffset ? "".concat(zOffset, "m") : '--';
  let elevation = '--';
  if (!isNaN(parsedReferenceElevation)) {
    if (!isNaN(parsedZOffset)) {
      elevation = "".concat((parsedReferenceElevation + parsedZOffset).toFixed(2).toString(), "m");
    } else {
      elevation = "".concat(parsedReferenceElevation, "m");
    }
  }
  const fadeStyle = {
    color: _Theme.default.palette.grey[500]
  };
  const axisStyle = {
    marginRight: _Theme.default.spacing(1),
    fontWeight: 600
  };
  const renderDescription = () => {
    const hasName = (0, _typeUtil.isStringNonEmpty)(sensorName);
    const hasDescription = (0, _typeUtil.isStringNonEmpty)(sensorDescription);
    const hasReferenceName = (0, _typeUtil.isStringNonEmpty)(referenceLocationName);
    const hasReferenceDescription = (0, _typeUtil.isStringNonEmpty)(referenceLocationDescription);
    const appliedName = hasName ? sensorName : 'N/A';
    const appliedDescription = hasDescription ? sensorDescription : 'N/A';
    const includeReference = hasReferenceName || hasReferenceDescription;
    const appliedReferenceName = hasReferenceName ? referenceLocationName : 'N/A';
    const appliedReferenceDescription = hasReferenceDescription ? referenceLocationDescription : 'N/A';
    return wide ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.startFlex,
      style: _extends({}, fadeStyle, {
        marginRight: _Theme.default.spacing(3),
        marginTop: _Theme.default.spacing(0.5)
      })
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, /*#__PURE__*/_react.default.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, "Location: "), "".concat(appliedDescription, " (").concat(appliedName, ")"))), !includeReference ? null : /*#__PURE__*/_react.default.createElement("div", {
      className: classes.startFlex,
      style: _extends({}, fadeStyle, {
        marginRight: _Theme.default.spacing(3)
      })
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, /*#__PURE__*/_react.default.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, "Reference Location: "), "".concat(appliedReferenceDescription, " (").concat(appliedReferenceName, ")")))) : /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginRight: _Theme.default.spacing(3),
        marginTop: _Theme.default.spacing(0.5)
      }
    }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      style: {
        fontWeight: 600
      }
    }, "Location:")), /*#__PURE__*/_react.default.createElement("div", {
      style: _extends({}, fadeStyle)
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2"
    }, "".concat(appliedDescription, " (").concat(appliedName, ")"))), !includeReference ? null : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      style: {
        fontWeight: 600
      }
    }, "Reference Location:")), /*#__PURE__*/_react.default.createElement("div", {
      style: _extends({}, fadeStyle)
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2"
    }, "".concat(appliedReferenceDescription, " (").concat(appliedReferenceName, ")")))));
  };
  let positionContainerStyle = {
    alignItems: 'center',
    justifyContent: 'space-between'
  };
  let positionSectionsContainerStyle = {
    display: 'flex',
    flexDirection: 'column'
  };
  let historyButtonContainerStyle = {
    textAlign: 'right'
  };
  if (atComponentXs) {
    positionContainerStyle = _extends({}, positionContainerStyle, {
      alignItems: 'flex-start',
      flexDirection: 'column'
    });
    historyButtonContainerStyle = _extends({}, historyButtonContainerStyle, {
      textAlign: 'unset',
      marginTop: _Theme.default.spacing(1),
      width: '100%'
    });
  }
  if (atComponentMd) {
    positionSectionsContainerStyle = _extends({}, positionSectionsContainerStyle, {
      flexDirection: 'row'
    });
  }
  return wide ? /*#__PURE__*/_react.default.createElement("div", {
    ref: containerRef
  }, /*#__PURE__*/_react.default.createElement("div", {
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
  }, elevation))), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.startFlex
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: _extends({}, axisStyle)
  }, "x / y / z:"), "".concat(displayXOffset, " / ").concat(displayYOffset, " / ").concat(displayZOffset))), renderDescription()) : /*#__PURE__*/_react.default.createElement("div", {
    ref: containerRef,
    className: classes.startFlex,
    style: positionContainerStyle
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: positionSectionsContainerStyle
  }, /*#__PURE__*/_react.default.createElement("div", {
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
  }, elevation))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginRight: _Theme.default.spacing(3)
    }
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: _extends({}, axisStyle)
  }, "x:"), "".concat(displayXOffset), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("span", {
    style: _extends({}, axisStyle)
  }, "y:"), "".concat(displayYOffset), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("span", {
    style: _extends({}, axisStyle)
  }, "z:"), "".concat(displayZOffset)))), renderDescription()), /*#__PURE__*/_react.default.createElement("div", {
    style: historyButtonContainerStyle
  }, /*#__PURE__*/_react.default.createElement(PositionHistoryButton, {
    siteCode: siteCode,
    position: position,
    history: history,
    fullWidth: atComponentXs
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
  const classes = useStyles(_Theme.default);
  const {
    siteCode,
    position,
    disabled
  } = props;
  const [state, dispatch] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
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
    onClick: () => {
      if (disabled) {
        return;
      }
      const selectedSiteIdx = state.selection.sites.findIndex(site => site.siteCode === siteCode);
      const positions = state.selection.sites[selectedSiteIdx].positions.filter(p => p !== position);
      dispatch({
        type: 'selectSitePositions',
        positions,
        siteCode
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
  const {
    selectedSite
  } = props;
  const {
    siteCode,
    positions: selectedPositions
  } = selectedSite;
  const [state, dispatch] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const availablePositions = state.product.sites[siteCode] ? Object.keys(state.product.sites[siteCode].positions) : [];
  availablePositions.sort();
  const [selectDialogOpen, setSelectDialogOpen] = (0, _react.useState)(false);
  // Local state for position selections so that no fetches are fired until the dialog is submitted
  const [localSelectedPositions, setLocalSelectedPositions] = (0, _react.useState)(selectedPositions);
  const togglePosition = position => {
    if (localSelectedPositions.includes(position)) {
      setLocalSelectedPositions(localSelectedPositions.filter(p => p !== position));
    } else {
      setLocalSelectedPositions([...localSelectedPositions, position]);
    }
  };
  const handleApply = () => {
    if (!localSelectedPositions.length) {
      return;
    }
    setSelectDialogOpen(false);
    dispatch({
      type: 'selectSitePositions',
      siteCode,
      positions: localSelectedPositions
    });
  };
  const isApplyButtonDisabled = selectedPositions2 => {
    // state.selection does not include what was added by users dialog selections so exclude
    // current site from getPositionCount and use sites from localSelectedPositions
    const allCurrentPositions = selectedPositions2.length + _TimeSeriesViewerContext.default.getPositionCount(state.selection.sites, siteCode);
    let isDisabled = false;
    if (!selectedPositions2.length) {
      isDisabled = true;
    } else if (_TimeSeriesViewerContext.default.calcPredictedPointsForNewPosition(state, allCurrentPositions) > _TimeSeriesViewerContext.POINTS_PERFORMANCE_LIMIT) {
      isDisabled = true;
    }
    return isDisabled;
  };
  const isDisabled = _TimeSeriesViewerContext.default.calcPredictedPointsForNewPosition(state) > _TimeSeriesViewerContext.POINTS_PERFORMANCE_LIMIT;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
    size: "small",
    variant: "outlined",
    startIcon: /*#__PURE__*/_react.default.createElement(_TouchApp.default, null),
    style: {
      marginLeft: _Theme.default.spacing(4)
    },
    disabled: isDisabled,
    onClick: () => {
      setLocalSelectedPositions(selectedPositions);
      setSelectDialogOpen(true);
    }
  }, "Select Positions\u2026"), /*#__PURE__*/_react.default.createElement(_Dialog.default, {
    open: selectDialogOpen,
    onClose: () => {
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
  }, "at least one is required"), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("span", {
    style: {
      fontWeight: 300,
      fontStyle: 'italic',
      // eslint-disable-next-line max-len
      visibility: isApplyButtonDisabled(localSelectedPositions) && localSelectedPositions.length > 0 ? 'visible' : 'hidden'
    },
    className: "MuiTypography-colorError"
  }, "Number of positions selected may cause performance issues")))), /*#__PURE__*/_react.default.createElement(_DialogContent.default, {
    dividers: true
  }, /*#__PURE__*/_react.default.createElement(_DialogContentText.default, {
    id: "add-positions-dialog-description",
    tabIndex: -1,
    variant: "body2"
  }, positionsDescription, /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), positionsSeriesDescription), /*#__PURE__*/_react.default.createElement(_List.default, null, availablePositions.map(position => {
    const labelId = "position-list-label-".concat(position);
    return /*#__PURE__*/_react.default.createElement(_ListItem.default, {
      key: position,
      role: undefined,
      dense: true,
      button: true,
      onClick: () => {
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
    onClick: () => {
      setSelectDialogOpen(false);
    },
    variant: "outlined"
  }, "Cancel"), /*#__PURE__*/_react.default.createElement(_Button.default, {
    onClick: handleApply,
    variant: "contained",
    disabled: isApplyButtonDisabled(localSelectedPositions)
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
  const {
    children,
    innerProps,
    innerRef,
    selectProps: {
      TextFieldProps
    }
  } = props;
  const [state] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const labelText = _TimeSeriesViewerContext.default.calcPredictedPointsForNewPosition(state) > _TimeSeriesViewerContext.POINTS_PERFORMANCE_LIMIT ? 'Add Sites (disabled)' : 'Add Sites';
  return /*#__PURE__*/_react.default.createElement(_TextField.default, _extends({
    fullWidth: true,
    label: labelText,
    variant: "outlined",
    InputProps: {
      inputComponent,
      inputProps: _extends({
        ref: innerRef,
        children
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
  const classes = useStyles(_Theme.default);
  const {
    innerRef,
    isFocused,
    isDisabled,
    innerProps,
    data
  } = props;
  const {
    siteCode,
    description,
    type,
    terrain,
    domainCode,
    domainName,
    stateCode,
    latitude,
    longitude
  } = data;
  const terrainTypeTitle = "".concat(ucWord(terrain), " ").concat(ucWord(type));
  let optionContent = /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body1",
    gutterBottom: true
  }, siteCode);
  if (stateCode) {
    const iconSvg = ICON_SVGS[type] && ICON_SVGS[type][terrain] ? ICON_SVGS[type][terrain] : null;
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
  const classes = useStyles(_Theme.default);
  const {
    site,
    disabled,
    setSelectedTab,
    TAB_IDS
  } = props;
  const {
    siteCode,
    positions
  } = site;
  const [{
    data: neonContextData
  }] = _NeonContext.default.useNeonContextState();
  const {
    sites: allSites,
    states: allStates,
    domains: allDomains
  } = neonContextData;
  const [, dispatch] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  // style={{ fontSize: '0.8rem', fontWeight: 600 }}
  const dateRangeTabButton = /*#__PURE__*/_react.default.createElement(_Button.default, {
    size: "small",
    color: "secondary",
    onClick: () => {
      setSelectedTab(TAB_IDS.DATE_RANGE);
    },
    style: {
      padding: '0px 2px',
      marginTop: '-4px',
      fontStyle: 'italic'
    }
  }, "Date Range");
  const removeSiteButton = /*#__PURE__*/_react.default.createElement(_Button.default, {
    size: "small",
    variant: "outlined",
    onClick: () => {
      if (disabled) {
        return;
      }
      dispatch({
        type: 'selectRemoveSite',
        siteCode
      });
    },
    style: {
      minWidth: _Theme.default.spacing(13),
      whiteSpace: 'nowrap'
    },
    disabled: disabled,
    startIcon: /*#__PURE__*/_react.default.createElement(_Clear.default, null)
  }, "Remove Site");
  let selectedSiteContent = /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body1",
    gutterBottom: true
  }, "".concat(siteCode, " (loading site details\u2026)")), removeSiteButton);
  if (allSites[siteCode]) {
    const {
      description,
      type,
      terrain,
      domainCode,
      stateCode,
      latitude,
      longitude
    } = allSites[siteCode];
    let typeTitle = 'Core';
    let typeSubtitle = 'fixed location';
    if (type === 'GRADIENT') {
      typeTitle = 'Gradient';
      typeSubtitle = 'gradient location';
    }
    let terrainTitle = 'Terrestrial';
    let terrainSubtitle = 'land-based';
    if (terrain === 'AQUATIC') {
      terrainTitle = 'Aquatic';
      terrainSubtitle = 'water-based';
    }
    const terrainTypeTitle = "".concat(terrainTitle, " ").concat(typeTitle);
    const terrainTypeSubtitle = "".concat(terrainSubtitle, "; ").concat(typeSubtitle);
    const domainName = allDomains[domainCode] ? allDomains[domainCode].name : null;
    const stateName = allStates[stateCode] ? allStates[stateCode].name : null;
    const stateFieldTitle = stateCode === 'PR' ? 'Territory' : 'State';
    const iconSvg = ICON_SVGS[type] && ICON_SVGS[type][terrain] ? ICON_SVGS[type][terrain] : null;
    const terrainIcon = iconSvg ? /*#__PURE__*/_react.default.createElement("img", {
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
  }, positions.map(position => /*#__PURE__*/_react.default.createElement(SelectedPosition, {
    key: position,
    siteCode: siteCode,
    position: position,
    disabled: positions.length < 2
  })))) : /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
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
const SitesSelectComponents = {
  Control: SitesControl,
  Option: SiteOption,
  Menu,
  ValueContainer,
  Placeholder: () => null,
  MultiValue: () => null,
  IndicatorsContainer: () => null
};
const SitesSelect = () => {
  const classes = useStyles(_Theme.default);
  const [state, dispatch] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const [{
    data: neonContextData
  }] = _NeonContext.default.useNeonContextState();
  const {
    states: allStates,
    sites: allSites,
    domains: allDomains
  } = neonContextData;
  let isDisabled = false;

  // Build list of selectable sites grouped by US state
  const selectableSiteCodes = Object.keys(state.product.sites);
  let selectableSitesCount = 0;
  const selectableSites = Object.keys(allStates).map(stateCode => ({
    label: allStates[stateCode].name,
    stateCode,
    options: []
  }));
  Object.keys(state.product.sites).filter(siteCode => selectableSiteCodes.includes(siteCode)).forEach(siteCode => {
    const groupIdx = selectableSites.findIndex(group => allSites[siteCode] && group.stateCode === allSites[siteCode].stateCode);
    if (groupIdx === -1) {
      return;
    }
    const domain = allDomains[allSites[siteCode].domainCode] || {};
    const usState = allStates[allSites[siteCode].stateCode] || {};
    const search = [siteCode, allSites[siteCode].description, allSites[siteCode].domainCode, allSites[siteCode].stateCode, allSites[siteCode].type, allSites[siteCode].terrain, domain.name || '', usState.name || ''].join(' ').toLowerCase();
    selectableSites[groupIdx].options.push(_extends({
      value: siteCode,
      domainName: domain.name || null
    }, allSites[siteCode], {
      search
    }));
    selectableSitesCount += 1;
  });
  const selectedSites = state.selection.sites.map(site => site.siteCode).filter(siteCode => selectableSiteCodes.includes(siteCode));
  if (!selectableSitesCount) {
    return null;
  }
  isDisabled = _TimeSeriesViewerContext.default.calcPredictedPointsForNewPosition(state) > _TimeSeriesViewerContext.POINTS_PERFORMANCE_LIMIT;
  return /*#__PURE__*/_react.default.createElement(_NoSsr.default, null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/_react.default.createElement(_reactSelect.default, {
    isMulti: true,
    isSearchable: true,
    isDisabled: isDisabled,
    clearable: false,
    classes: classes,
    styles: selectStyles,
    "aria-label": "Add Sites",
    "data-gtm": "time-series-viewer.add-sites",
    options: selectableSites,
    components: SitesSelectComponents,
    value: selectedSites,
    controlShouldRenderValue: false,
    filterOption: (option, searchText) => option.data.search.includes(searchText.toLowerCase()),
    onChange: (value, change) => {
      if (change.action !== 'select-option') {
        return;
      }
      dispatch({
        type: 'selectAddSite',
        siteCode: change.option.siteCode
      });
    }
  })));
};

/**
   Primary Component
*/
function TimeSeriesViewerSites(props) {
  const classes = useStyles(_Theme.default);
  const [state, dispatch] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const [{
    data: neonContextData
  }] = _NeonContext.default.useNeonContextState();
  const {
    sites: allSites
  } = neonContextData;
  if (!state.selection.sites.length || !Object.keys(allSites).length) {
    return /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      variant: "rect",
      width: "100%",
      height: 56
    });
  }
  const calcUpperSelectionLimit = () => {
    let upperLimit = 0;
    const currentPositionCount = _TimeSeriesViewerContext.default.getPositionCount(state.selection.sites);
    for (let upperLimitCandidate = 1; upperLimitCandidate <= 5; upperLimitCandidate += 1) {
      const numNewPositions = currentPositionCount + upperLimitCandidate;
      if (_TimeSeriesViewerContext.default.calcPredictedPointsForNewPosition(state, numNewPositions) < _TimeSeriesViewerContext.POINTS_PERFORMANCE_LIMIT) {
        upperLimit = upperLimitCandidate;
      }
    }
    return upperLimit;
  };
  const selectedItems = state.selection.sites.map(site => site.siteCode);
  const isDisabled = _TimeSeriesViewerContext.default.calcPredictedPointsForNewPosition(state) > _TimeSeriesViewerContext.POINTS_PERFORMANCE_LIMIT;
  const upperLimit = Math.min(calcUpperSelectionLimit() + selectedItems.length, 5);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes.root
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement(SitesSelect, null), /*#__PURE__*/_react.default.createElement(_MapSelectionButton.default, {
    selection: "SITES",
    selectionLimit: [1, upperLimit],
    selectedItems: selectedItems,
    validItems: Object.keys(state.product.sites),
    buttonProps: {
      style: {
        size: 'large',
        marginLeft: _Theme.default.spacing(1.5)
      },
      disabled: isDisabled
    },
    onSave: newSites => {
      dispatch({
        type: 'updateSelectedSites',
        siteCodes: newSites
      });
    }
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.sitesContainer
  }, state.selection.sites.map(site => /*#__PURE__*/_react.default.createElement(SelectedSite, _extends({
    key: site.siteCode,
    site: site,
    disabled: state.selection.sites.length < 2
  }, props)))));
}
TimeSeriesViewerSites.propTypes = _TimeSeriesViewerContext.TabComponentPropTypes;

// Additional items exported for unit testing
const getTestableItems = () => process.env.NODE_ENV !== 'test' ? {} : {
  ucWord,
  PositionHistoryButton,
  PositionDetail,
  SelectedPosition,
  SelectPositionsButton,
  SitesControl,
  SiteOption,
  SelectedSite
};
exports.getTestableItems = getTestableItems;