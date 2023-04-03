"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _lodash = require("lodash");
var _styles = require("@material-ui/core/styles");
var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));
var _FormControl = _interopRequireDefault(require("@material-ui/core/FormControl"));
var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));
var _Select = _interopRequireDefault(require("@material-ui/core/Select"));
var _ToggleButton = _interopRequireDefault(require("@material-ui/lab/ToggleButton"));
var _ToggleButtonGroup = _interopRequireDefault(require("@material-ui/lab/ToggleButtonGroup"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _KeyboardArrowDown = _interopRequireDefault(require("@material-ui/icons/KeyboardArrowDown"));
var _KeyboardArrowUp = _interopRequireDefault(require("@material-ui/icons/KeyboardArrowUp"));
var _AvailabilityContext = _interopRequireDefault(require("./AvailabilityContext"));
var _AvailabilityPending = _interopRequireDefault(require("./AvailabilityPending"));
var _FullWidthVisualization = _interopRequireDefault(require("../FullWidthVisualization/FullWidthVisualization"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _EnhancedAvailabilityKey = _interopRequireDefault(require("./EnhancedAvailabilityKey"));
var _EnhancedAvailabilityGrid = _interopRequireDefault(require("./EnhancedAvailabilityGrid"));
var _AvailabilityUtils = require("./AvailabilityUtils");
var _AvailabilitySvgComponents = require("./AvailabilitySvgComponents");
var _excluded = ["sites"];
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
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
var preStyle = {
  width: '100%',
  height: '50vh',
  overflowY: 'scroll',
  padding: '2px',
  border: '1px dotted black'
};

/**
   Setup: CSS classes
*/
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    svg: {
      minWidth: "".concat(_AvailabilityUtils.SVG.MIN_WIDTH, "px"),
      minHeight: "".concat(_AvailabilityUtils.SVG.MIN_HEIGHT, "px")
    },
    h6Small: {
      fontSize: '0.95rem'
    },
    xsSelect: {
      height: theme.spacing(4),
      '& div': {
        padding: _Theme.default.spacing(1, 3, 1, 1.5)
      }
    },
    sortSelect: {
      height: theme.spacing(4),
      '& div': {
        paddingRight: _Theme.default.spacing(4.5)
      },
      marginRight: theme.spacing(2)
    },
    viewAndSortOptionsContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      marginBottom: theme.spacing(3)
    }
  };
});
var EnhancedAvailabilityInterface = function EnhancedAvailabilityInterface(props) {
  var availabilitySites = props.sites,
    other = _objectWithoutProperties(props, _excluded);
  var classes = useStyles(_Theme.default);
  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
    _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
    _NeonContext$useNeonC3 = _NeonContext$useNeonC2[0],
    neonContextIsFinal = _NeonContext$useNeonC3.isFinal,
    neonContextHasError = _NeonContext$useNeonC3.hasError;
  var SORT_DIRECTIONS = _AvailabilityContext.default.SORT_DIRECTIONS,
    useAvailabilityState = _AvailabilityContext.default.useAvailabilityState;
  var _useAvailabilityState = useAvailabilityState(),
    _useAvailabilityState2 = _slicedToArray(_useAvailabilityState, 2),
    availabilityState = _useAvailabilityState2[0],
    availabilityDispatch = _useAvailabilityState2[1];
  var rows = availabilityState.rows,
    rowLabels = availabilityState.rowLabels,
    rowTitles = availabilityState.rowTitles,
    tables = availabilityState.tables,
    breakouts = availabilityState.breakouts,
    validBreakouts = availabilityState.validBreakouts,
    sortDirection = availabilityState.sortDirection;

  /**
     Context-Derived Stuff
  */
  var selectionEnabled = false;

  /**
     Redraw setup
  */
  var svgRef = (0, _react.useRef)(null);
  var handleSvgRedraw = (0, _react.useCallback)(function () {
    if (!rowLabels.length) {
      return;
    }
    (0, _EnhancedAvailabilityGrid.default)({
      rows: rows,
      rowLabels: rowLabels,
      rowTitles: rowTitles,
      svgRef: svgRef,
      selectionEnabled: selectionEnabled
    });
  }, [svgRef, rows, rowLabels, rowTitles, selectionEnabled]);
  (0, _react.useEffect)(function () {
    handleSvgRedraw();
  });

  /*
  let justify = 'end';
  if (currentView === 'ungrouped') {
    justify = atXs || atSm ? 'start' : 'end';
  } else {
    justify = atXs ? 'start' : 'end';
  }
  */
  var optionDivStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  };

  /**
     Render: NeonContext-related Loading and Error States
  */
  if (!neonContextIsFinal || neonContextHasError) {
    return /*#__PURE__*/_react.default.createElement(_AvailabilityPending.default, null);
  }

  /**
     Render: Breakout Options
  */
  var renderBreakoutOptions = function renderBreakoutOptions() {
    var handleChangeBreakouts = function handleChangeBreakouts(event, newBreakouts) {
      availabilityDispatch({
        type: 'setBreakouts',
        breakouts: newBreakouts
      });
    };
    return /*#__PURE__*/_react.default.createElement("div", {
      style: _extends({}, optionDivStyle, {
        marginRight: _Theme.default.spacing(3)
      }),
      "data-selenium": "data-product-availability.breakout-options"
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      className: classes.h6Small,
      style: {
        marginRight: _Theme.default.spacing(1.5),
        whiteSpace: 'nowrap'
      }
    }, "View By:"), /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
      color: "primary",
      variant: "outlined",
      size: "small",
      value: breakouts,
      onChange: handleChangeBreakouts
    }, validBreakouts.map(function (key) {
      return /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
        key: key,
        value: key,
        size: "small"
      }, key);
    })));
  };

  /**
     Render: Sort Options
  */
  var renderSortOptions = function renderSortOptions() {
    return /*#__PURE__*/_react.default.createElement("div", {
      style: optionDivStyle,
      "data-selenium": "data-product-availability.sort-options"
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      className: classes.h6Small,
      style: {
        marginRight: _Theme.default.spacing(1.5),
        whiteSpace: 'nowrap'
      }
    }, "Sort By:"), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/_react.default.createElement(_FormControl.default, {
      variant: "outlined"
    }, /*#__PURE__*/_react.default.createElement(_Select.default, {
      value: breakouts.length ? breakouts[0] : 'n/a',
      "aria-label": "Sort By",
      className: classes.sortSelect,
      onChange: function onChange(event) {
        availabilityDispatch({
          type: 'setSortMethod',
          method: event.target.value
        });
      },
      "data-selenium": "data-product-availability.sort-options.method"
    }, /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
      key: "--",
      value: "n/a",
      disabled: true
    }, "--"), validBreakouts.map(function (method) {
      return /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
        key: method,
        value: method
      }, "".concat(method.substr(0, 1).toUpperCase()).concat(method.substr(1)));
    }))), /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
      exclusive: true,
      size: "small",
      value: breakouts.length ? sortDirection : null,
      onChange: function onChange(event, newSortDirection) {
        availabilityDispatch({
          type: 'setSortDirection',
          direction: newSortDirection
        });
      },
      "data-selenium": "data-product-availability.sort-options.direction"
    }, /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
      key: SORT_DIRECTIONS.ASC,
      value: SORT_DIRECTIONS.ASC,
      style: breakouts.length ? null : {
        borderColor: 'unset'
      },
      disabled: !breakouts.length,
      title: "Sort Ascending (A-Z)",
      "aria-label": "Sort Ascending (A-Z)"
    }, /*#__PURE__*/_react.default.createElement(_KeyboardArrowDown.default, {
      fontSize: "small"
    })), /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
      key: SORT_DIRECTIONS.DESC,
      value: SORT_DIRECTIONS.DESC,
      style: breakouts.length ? null : {
        borderColor: 'unset'
      },
      disabled: !breakouts.length,
      title: "Sort Descending (Z-A)",
      "aria-label": "Sort Descending (Z-A)"
    }, /*#__PURE__*/_react.default.createElement(_KeyboardArrowUp.default, {
      fontSize: "small"
    })))));
  };

  /**
     Main Render
  */
  var svgHeight = _AvailabilityUtils.SVG.CELL_PADDING + (_AvailabilityUtils.SVG.CELL_HEIGHT + _AvailabilityUtils.SVG.CELL_PADDING) * (rowLabels.length + 1);
  var rollUpPresent = !(breakouts.includes('sites') && breakouts.includes('tables'));
  return /*#__PURE__*/_react.default.createElement(_FullWidthVisualization.default, _extends({
    vizRef: svgRef,
    minWidth: _AvailabilityUtils.SVG.MIN_WIDTH,
    handleRedraw: handleSvgRedraw,
    "data-selenium": "data-product-availability"
  }, other), /*#__PURE__*/_react.default.createElement(_AvailabilitySvgComponents.SvgDefs, null), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.viewAndSortOptionsContainer
  }, renderBreakoutOptions(), renderSortOptions()), /*#__PURE__*/_react.default.createElement(_EnhancedAvailabilityKey.default, {
    selectionEnabled: true,
    rollUpPresent: rollUpPresent
  }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("svg", {
    id: (0, _lodash.uniqueId)('dpa-'),
    ref: svgRef,
    height: svgHeight,
    className: classes.svg
  }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("pre", {
    style: preStyle
  }, JSON.stringify(tables, null, 2)));
};
EnhancedAvailabilityInterface.propTypes = {
  sites: _AvailabilityUtils.AvailabilityPropTypes.enhancedSites,
  view: _propTypes.default.oneOf(['summary', 'sites', 'states', 'domains', 'ungrouped']),
  table: _propTypes.default.string,
  sortMethod: _propTypes.default.oneOf(['sites', 'states', 'domains']),
  sortDirection: _propTypes.default.oneOf(['ASC', 'DESC']),
  disableSelection: _propTypes.default.bool
};
EnhancedAvailabilityInterface.defaultProps = {
  sites: [],
  view: null,
  table: 'ALL',
  sortMethod: null,
  sortDirection: 'ASC',
  disableSelection: false
};
var _default = EnhancedAvailabilityInterface;
exports.default = _default;