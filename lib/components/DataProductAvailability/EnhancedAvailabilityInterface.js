"use strict";

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
const _excluded = ["sites"];
/* eslint-disable no-unused-vars */
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
const preStyle = {
  width: '100%',
  height: '50vh',
  overflowY: 'scroll',
  padding: '2px',
  border: '1px dotted black'
};

/**
   Setup: CSS classes
*/
const useStyles = (0, _styles.makeStyles)(theme => ({
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
}));
const EnhancedAvailabilityInterface = props => {
  const other = _objectWithoutPropertiesLoose(props, _excluded);
  const classes = useStyles(_Theme.default);
  const [{
    isFinal: neonContextIsFinal,
    hasError: neonContextHasError
  }] = _NeonContext.default.useNeonContextState();
  const {
    SORT_DIRECTIONS,
    useAvailabilityState
  } = _AvailabilityContext.default;
  const [availabilityState, availabilityDispatch] = useAvailabilityState();
  const {
    rows,
    rowLabels,
    rowTitles,
    tables,
    breakouts,
    validBreakouts,
    sortDirection
  } = availabilityState;

  /**
     Context-Derived Stuff
  */
  const selectionEnabled = false;

  /**
     Redraw setup
  */
  const svgRef = (0, _react.useRef)(null);
  const handleSvgRedraw = (0, _react.useCallback)(() => {
    if (!rowLabels.length) {
      return;
    }
    (0, _EnhancedAvailabilityGrid.default)({
      rows,
      rowLabels,
      rowTitles,
      svgRef,
      selectionEnabled
    });
  }, [svgRef, rows, rowLabels, rowTitles, selectionEnabled]);
  (0, _react.useEffect)(() => {
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
  const optionDivStyle = {
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
  const renderBreakoutOptions = () => {
    const handleChangeBreakouts = (event, newBreakouts) => {
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
    }, validBreakouts.map(key => /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
      key: key,
      value: key,
      size: "small"
    }, key))));
  };

  /**
     Render: Sort Options
  */
  const renderSortOptions = () => /*#__PURE__*/_react.default.createElement("div", {
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
    onChange: event => {
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
  }, "--"), validBreakouts.map(method => /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    key: method,
    value: method
  }, "".concat(method.substr(0, 1).toUpperCase()).concat(method.substr(1)))))), /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
    exclusive: true,
    size: "small",
    value: breakouts.length ? sortDirection : null,
    onChange: (event, newSortDirection) => {
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

  /**
     Main Render
  */
  const svgHeight = _AvailabilityUtils.SVG.CELL_PADDING + (_AvailabilityUtils.SVG.CELL_HEIGHT + _AvailabilityUtils.SVG.CELL_PADDING) * (rowLabels.length + 1);
  const rollUpPresent = !(breakouts.includes('sites') && breakouts.includes('tables'));
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
var _default = exports.default = EnhancedAvailabilityInterface;