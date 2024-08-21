"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _lodash = require("lodash");
var _styles = require("@mui/styles");
var _FormControl = _interopRequireDefault(require("@mui/material/FormControl"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _Select = _interopRequireDefault(require("@mui/material/Select"));
var _ToggleButton = _interopRequireDefault(require("@mui/material/ToggleButton"));
var _ToggleButtonGroup = _interopRequireDefault(require("@mui/material/ToggleButtonGroup"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _KeyboardArrowDown = _interopRequireDefault(require("@mui/icons-material/KeyboardArrowDown"));
var _KeyboardArrowUp = _interopRequireDefault(require("@mui/icons-material/KeyboardArrowUp"));
var _AvailabilityContext = _interopRequireDefault(require("./AvailabilityContext"));
var _AvailabilityPending = _interopRequireDefault(require("./AvailabilityPending"));
var _FullWidthVisualization = _interopRequireDefault(require("../FullWidthVisualization/FullWidthVisualization"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _defaultProps = require("../../util/defaultProps");
var _EnhancedAvailabilityKey = _interopRequireDefault(require("./EnhancedAvailabilityKey"));
var _EnhancedAvailabilityGrid = _interopRequireDefault(require("./EnhancedAvailabilityGrid"));
var _AvailabilityUtils = require("./AvailabilityUtils");
var _AvailabilitySvgComponents = require("./AvailabilitySvgComponents");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/* eslint-disable no-unused-vars */

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
    minWidth: `${_AvailabilityUtils.SVG.MIN_WIDTH}px`,
    minHeight: `${_AvailabilityUtils.SVG.MIN_HEIGHT}px`
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
const defaultProps = {
  sites: [],
  view: null,
  table: 'ALL',
  sortMethod: null,
  sortDirection: 'ASC',
  disableSelection: false
};
const EnhancedAvailabilityInterface = inProps => {
  const props = (0, _defaultProps.resolveProps)(defaultProps, inProps);
  const {
    sites: availabilitySites,
    ...other
  } = props;
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
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_AvailabilityPending.default, {});
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
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      style: {
        ...optionDivStyle,
        marginRight: _Theme.default.spacing(3)
      },
      "data-selenium": "data-product-availability.breakout-options",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "h6",
        className: classes.h6Small,
        style: {
          marginRight: _Theme.default.spacing(1.5),
          whiteSpace: 'nowrap'
        },
        children: "View By:"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ToggleButtonGroup.default, {
        color: "primary",
        variant: "outlined",
        size: "small",
        value: breakouts,
        onChange: handleChangeBreakouts,
        children: validBreakouts.map(key => /*#__PURE__*/(0, _jsxRuntime.jsx)(_ToggleButton.default, {
          value: key,
          size: "small",
          children: key
        }, key))
      })]
    });
  };

  /**
     Render: Sort Options
  */
  const renderSortOptions = () => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    style: optionDivStyle,
    "data-selenium": "data-product-availability.sort-options",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "h6",
      className: classes.h6Small,
      style: {
        marginRight: _Theme.default.spacing(1.5),
        whiteSpace: 'nowrap'
      },
      children: "Sort By:"
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end'
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControl.default, {
        variant: "outlined",
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Select.default, {
          value: breakouts.length ? breakouts[0] : 'n/a',
          "aria-label": "Sort By",
          className: classes.sortSelect,
          onChange: event => {
            availabilityDispatch({
              type: 'setSortMethod',
              method: event.target.value
            });
          },
          "data-selenium": "data-product-availability.sort-options.method",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
            value: "n/a",
            disabled: true,
            children: "--"
          }, "--"), validBreakouts.map(method => /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
            value: method,
            children: `${method.substr(0, 1).toUpperCase()}${method.substr(1)}`
          }, method))]
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ToggleButtonGroup.default, {
        exclusive: true,
        size: "small",
        value: breakouts.length ? sortDirection : null,
        onChange: (event, newSortDirection) => {
          availabilityDispatch({
            type: 'setSortDirection',
            direction: newSortDirection
          });
        },
        "data-selenium": "data-product-availability.sort-options.direction",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ToggleButton.default, {
          value: SORT_DIRECTIONS.ASC,
          style: breakouts.length ? null : {
            borderColor: 'unset'
          },
          disabled: !breakouts.length,
          title: "Sort Ascending (A-Z)",
          "aria-label": "Sort Ascending (A-Z)",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_KeyboardArrowDown.default, {
            fontSize: "small"
          })
        }, SORT_DIRECTIONS.ASC), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ToggleButton.default, {
          value: SORT_DIRECTIONS.DESC,
          style: breakouts.length ? null : {
            borderColor: 'unset'
          },
          disabled: !breakouts.length,
          title: "Sort Descending (Z-A)",
          "aria-label": "Sort Descending (Z-A)",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_KeyboardArrowUp.default, {
            fontSize: "small"
          })
        }, SORT_DIRECTIONS.DESC)]
      })]
    })]
  });

  /**
     Main Render
  */
  const svgHeight = _AvailabilityUtils.SVG.CELL_PADDING + (_AvailabilityUtils.SVG.CELL_HEIGHT + _AvailabilityUtils.SVG.CELL_PADDING) * (rowLabels.length + 1);
  const rollUpPresent = !(breakouts.includes('sites') && breakouts.includes('tables'));
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_FullWidthVisualization.default, {
    vizRef: svgRef,
    minWidth: _AvailabilityUtils.SVG.MIN_WIDTH,
    handleRedraw: handleSvgRedraw,
    "data-selenium": "data-product-availability",
    ...other,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_AvailabilitySvgComponents.SvgDefs, {}), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.viewAndSortOptionsContainer,
      children: [renderBreakoutOptions(), renderSortOptions()]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_EnhancedAvailabilityKey.default, {
      selectionEnabled: true,
      rollUpPresent: rollUpPresent
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
      id: (0, _lodash.uniqueId)('dpa-'),
      ref: svgRef,
      height: svgHeight,
      className: classes.svg
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("pre", {
      style: preStyle,
      children: JSON.stringify(tables, null, 2)
    })]
  });
};
EnhancedAvailabilityInterface.propTypes = {
  sites: _AvailabilityUtils.AvailabilityPropTypes.enhancedSites,
  view: _propTypes.default.oneOf(['summary', 'sites', 'states', 'domains', 'ungrouped']),
  table: _propTypes.default.string,
  sortMethod: _propTypes.default.oneOf(['sites', 'states', 'domains']),
  sortDirection: _propTypes.default.oneOf(['ASC', 'DESC']),
  disableSelection: _propTypes.default.bool
};
var _default = exports.default = EnhancedAvailabilityInterface;