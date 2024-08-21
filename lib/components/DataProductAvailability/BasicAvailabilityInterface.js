"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _lodash = require("lodash");
var _styles = require("@mui/styles");
var _useMediaQuery = _interopRequireDefault(require("@mui/material/useMediaQuery"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _Card = _interopRequireDefault(require("@mui/material/Card"));
var _CardContent = _interopRequireDefault(require("@mui/material/CardContent"));
var _FormControl = _interopRequireDefault(require("@mui/material/FormControl"));
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
var _Hidden = _interopRequireDefault(require("@mui/material/Hidden"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _OutlinedInput = _interopRequireDefault(require("@mui/material/OutlinedInput"));
var _Select = _interopRequireDefault(require("@mui/material/Select"));
var _ToggleButton = _interopRequireDefault(require("@mui/material/ToggleButton"));
var _ToggleButtonGroup = _interopRequireDefault(require("@mui/material/ToggleButtonGroup"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _KeyboardArrowDown = _interopRequireDefault(require("@mui/icons-material/KeyboardArrowDown"));
var _KeyboardArrowUp = _interopRequireDefault(require("@mui/icons-material/KeyboardArrowUp"));
var _TouchApp = _interopRequireDefault(require("@mui/icons-material/TouchApp"));
var _VerticalAlignCenter = _interopRequireDefault(require("@mui/icons-material/VerticalAlignCenter"));
var _PanTool = _interopRequireDefault(require("@mui/icons-material/PanTool"));
var _xDatePickers = require("@mui/x-date-pickers");
var _AdapterMoment = require("@mui/x-date-pickers/AdapterMoment");
var _DatePicker = require("@mui/x-date-pickers/DatePicker");
var _FullWidthVisualization = _interopRequireDefault(require("../FullWidthVisualization/FullWidthVisualization"));
var _DownloadDataContext = _interopRequireDefault(require("../DownloadDataContext/DownloadDataContext"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _MapSelectionButton = _interopRequireDefault(require("../MapSelectionButton/MapSelectionButton"));
var _SiteChip = _interopRequireDefault(require("../SiteChip/SiteChip"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _defaultProps = require("../../util/defaultProps");
var _AvailabilityPending = _interopRequireDefault(require("./AvailabilityPending"));
var _BasicAvailabilityGrid = _interopRequireDefault(require("./BasicAvailabilityGrid"));
var _BasicAvailabilityKey = _interopRequireDefault(require("./BasicAvailabilityKey"));
var _AvailabilityUtils = require("./AvailabilityUtils");
var _AvailabilitySvgComponents = require("./AvailabilitySvgComponents");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
   Setup: CSS classes
*/const useStyles = (0, _styles.makeStyles)(theme => ({
  svg: {
    minWidth: `${_AvailabilityUtils.SVG.MIN_WIDTH}px`,
    minHeight: `${_AvailabilityUtils.SVG.MIN_HEIGHT}px`
  },
  topFormHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  h5Small: {
    fontSize: '1.075rem'
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
  helpIcon: {
    color: theme.palette.grey[300],
    marginRight: theme.spacing(1)
  },
  helpGridContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    padding: '16px 16px 8px 16px !important'
  },
  helpGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));
const useSiteChipStyles = (0, _styles.makeStyles)(theme => ({
  deleteIcon: {
    marginLeft: theme.spacing(-0.25)
  }
}));
const defaultProps = {
  siteCodes: [],
  dataProducts: [],
  view: null,
  sortMethod: null,
  sortDirection: 'ASC',
  disableSelection: false,
  delineateRelease: false,
  availabilityStatusType: null
};

/**
   Main Function
*/
const BasicAvailabilityInterface = inProps => {
  const props = (0, _defaultProps.resolveProps)(defaultProps, inProps);
  const classes = useStyles(_Theme.default);
  const atXs = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('xs'));
  const atSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('sm'));
  const siteChipClasses = useSiteChipStyles(_Theme.default);
  const {
    dataProducts,
    ...other
  } = props;
  const [{
    data: neonContextData,
    isFinal: neonContextIsFinal,
    hasError: neonContextHasError
  }] = _NeonContext.default.useNeonContextState();
  const {
    sites: allSites,
    states: allStates,
    domains: allDomains
  } = neonContextData;

  /**
     Sort methods and directions
  */
  const SORT_METHODS = {
    states: {
      label: 'by State',
      getSortFunction: ret => (a, b) => {
        const aState = allStates[allSites[a].stateCode].name;
        const bState = allStates[allSites[b].stateCode].name;
        if (aState === bState) {
          return a < b ? ret[0] : ret[1];
        }
        return aState < bState ? ret[0] : ret[1];
      }
    },
    domains: {
      label: 'by Domain',
      getSortFunction: ret => (a, b) => {
        const aDomain = allSites[a].domainCode;
        const bDomain = allSites[b].domainCode;
        if (aDomain === bDomain) {
          return a < b ? ret[0] : ret[1];
        }
        return aDomain < bDomain ? ret[0] : ret[1];
      }
    },
    sites: {
      label: 'by Site',
      getSortFunction: ret => (a, b) => a < b ? ret[0] : ret[1]
    }
  };
  const SORT_DIRECTIONS = ['ASC', 'DESC'];
  const PRODUCT_LOOKUP = {};
  dataProducts.forEach(product => {
    PRODUCT_LOOKUP[product.dataProductCode] = product.dataProductTitle;
  });

  /**
     State: Views
     Contain and sort the availability data.
     Afford different methods for presenting/grouping data along the y-axis (geospatial)
  */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const views = {
    summary: {
      view: 'summary',
      name: 'Summary',
      selectable: true,
      rows: {
        summary: {}
      },
      getLabel: {
        text: () => 'ALL ',
        title: () => 'All Sites'
      }
    },
    sites: {
      view: 'sites',
      name: 'Site',
      selectable: true,
      rows: {},
      getLabel: {
        text: key => key,
        title: key => allSites[key].description
      }
    },
    states: {
      view: 'states',
      name: 'State',
      selectable: true,
      rows: {},
      getLabel: {
        text: key => ` ${key} `,
        title: key => allStates[key].name
      }
    },
    domains: {
      view: 'domains',
      name: 'Domain',
      selectable: true,
      rows: {},
      getLabel: {
        text: key => `${key} `,
        title: key => allDomains[key].name
      }
    },
    ungrouped: {
      view: 'ungrouped',
      name: 'Ungrouped',
      selectable: false,
      getLabel: {
        text: key => `${allSites[key].stateCode}-${allSites[key].domainCode}-${key}`,
        title: key => {
          const siteTitle = allSites[key].description;
          const domainTitle = allDomains[allSites[key].domainCode].name;
          const stateTitle = allStates[allSites[key].stateCode].name;
          return `${stateTitle} - ${domainTitle} - ${siteTitle}`;
        }
      }
    },
    products: {
      view: 'products',
      name: 'Product',
      selectable: false,
      rows: {},
      getLabel: {
        text: key => key,
        title: key => PRODUCT_LOOKUP[key]
      }
    }
  };
  views.ungrouped.rows = views.sites.rows;
  const selectableViewKeys = Object.keys(views).filter(key => views[key].selectable);

  /**
     State: Context-Derived Stuff
  */
  const [{
    downloadContextIsActive,
    requiredSteps,
    productData,
    sites,
    dateRange,
    availabilityView: contextView,
    availabilitySortMethod: contextSortMethod,
    availabilitySortDirection: contextSortDirection
  }, dispatchSelection] = _DownloadDataContext.default.useDownloadDataState();
  const {
    disableSelection,
    delineateRelease,
    availabilityStatusType
  } = props;
  const selectionEnabled = !disableSelection && requiredSteps.some(step => step.key === 'sitesAndDateRange');

  /**
     State: Current View
     View mode can be set from the view prop or pulled from a download context.
     Prop overrides context. If neither are set then default to 'sites' if selection
     is currently enabled and 'summary' if not.
  */
  const {
    view: propsView
  } = props;
  let initialView = propsView;
  if (!initialView) {
    initialView = contextView;
  }
  if (!initialView) {
    initialView = selectionEnabled ? 'sites' : 'summary';
  }
  const [currentView, setCurrentView] = (0, _react.useState)(initialView);

  /**
     State: Current Sort Method and Sort Direction
     Only applies for "ungrouped" view mode.
  */
  const {
    sortMethod: propsSortMethod,
    sortDirection: propsSortDirection
  } = props;
  let initialSortMethod = propsSortMethod;
  if (!initialSortMethod) {
    initialSortMethod = contextSortMethod;
  }
  if (!initialSortMethod) {
    initialSortMethod = 'states';
  }
  let initialSortDirection = propsSortDirection;
  if (!initialSortDirection) {
    initialSortDirection = contextSortDirection;
  }
  if (!initialSortDirection) {
    initialSortDirection = 'ASC';
  }
  const [currentSortMethod, setCurrentSortMethod] = (0, _react.useState)(initialSortMethod);
  const [currentSortDirection, setCurrentSortDirection] = (0, _react.useState)(initialSortDirection);
  const setSitesValue = (0, _react.useCallback)(sitesValue => dispatchSelection({
    type: 'setValidatableValue',
    key: 'sites',
    value: sitesValue
  }), [dispatchSelection]);
  const setDateRangeValue = (0, _react.useCallback)(dateRangeValue => dispatchSelection({
    type: 'setValidatableValue',
    key: 'dateRange',
    value: dateRangeValue
  }), [dispatchSelection]);

  /**
     Handlers
  */
  const handleSelectAllSites = () => {
    setSitesValue(sites.validValues);
  };
  const handleSelectNoneSites = () => {
    setSitesValue([]);
  };
  const handleSelectAllDateRange = () => {
    setDateRangeValue(dateRange.validValues);
  };
  const handleSelectLatestYearDateRange = () => {
    const start = _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.validValues[1]).subtract(11, 'months').format('YYYY-MM');
    setDateRangeValue([start < dateRange.validValues[0] ? dateRange.validValues[0] : start, dateRange.validValues[1]]);
  };
  const handleChangeStartDate = newStartDate => {
    setDateRangeValue([newStartDate.format('YYYY-MM'), dateRange.value[1]]);
  };
  const handleChangeEndDate = newEndDate => {
    setDateRangeValue([dateRange.value[0], newEndDate.format('YYYY-MM')]);
  };
  const handleChangeView = (event, newView) => {
    if (!selectableViewKeys.includes(newView) || currentView === newView) {
      return;
    }
    if (downloadContextIsActive) {
      dispatchSelection({
        type: 'setAvailabilityView',
        value: newView
      });
    }
    setCurrentView(newView);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  let sortedSites = [];
  const applySort = () => {
    if (currentView !== 'ungrouped') {
      return;
    }
    // NOTE - these returns are backwards because the rendering in the chart is bottom-up
    // (though of course a user will read it top-down).
    const sortReturns = [currentSortDirection === 'ASC' ? 1 : -1, currentSortDirection === 'ASC' ? -1 : 1];
    sortedSites = Object.keys(views.ungrouped.rows);
    sortedSites.sort(SORT_METHODS[currentSortMethod].getSortFunction(sortReturns));
  };
  const handleChangeSortMethod = event => {
    const newSortMethod = event.target.value;
    if (!Object.keys(SORT_METHODS).includes(newSortMethod) || currentSortMethod === newSortMethod) {
      return;
    }
    if (downloadContextIsActive) {
      dispatchSelection({
        type: 'setAvailabilitySortMethod',
        value: newSortMethod
      });
    }
    setCurrentSortMethod(newSortMethod);
    applySort();
  };
  const handleChangeSortDirection = (event, newSortDirection) => {
    if (!SORT_DIRECTIONS.includes(newSortDirection) || currentSortDirection === newSortDirection) {
      return;
    }
    if (downloadContextIsActive) {
      dispatchSelection({
        type: 'setAvailabilitySortDirection',
        value: newSortDirection
      });
    }
    setCurrentSortDirection(newSortDirection);
    applySort();
  };

  /**
     Product Data: Map to Views
     Statically loaded in via props or pulled from context. If both, props wins.
     Should not change in render lifecycle.
     Create mappings of the shape row => year-month => status for
     all aggregation views.
     TODO: Add other statuses. Currently the only status is "available".
  */
  let siteCodes = [];
  const {
    siteCodes: propsSiteCodes
  } = props;
  const {
    siteCodes: contextSiteCodes
  } = productData;
  if (propsSiteCodes && propsSiteCodes.length) {
    siteCodes = propsSiteCodes;
  } else if (contextSiteCodes && contextSiteCodes.length) {
    siteCodes = contextSiteCodes;
  }
  siteCodes.forEach(site => {
    const {
      siteCode,
      availableMonths,
      availableReleases
    } = site;
    if (!allSites[siteCode]) {
      return;
    }
    const {
      stateCode,
      domainCode
    } = allSites[siteCode];
    if (!downloadContextIsActive) {
      sites.validValues.push(siteCode);
    }
    let provAvailableMonths = [];
    if (delineateRelease && Array.isArray(availableReleases)) {
      const provRelease = availableReleases.find(value => value.release === 'PROVISIONAL');
      if (provRelease) {
        provAvailableMonths = provRelease.availableMonths;
      }
    }
    views.sites.rows[siteCode] = {};
    views.states.rows[stateCode] = views.states.rows[stateCode] || {};
    views.domains.rows[domainCode] = views.domains.rows[domainCode] || {};
    availableMonths.forEach(month => {
      let status = availabilityStatusType || 'available';
      if (delineateRelease && provAvailableMonths && provAvailableMonths.length > 0) {
        if (provAvailableMonths.includes(month)) {
          status = 'available-provisional';
        }
      }
      if (!views.summary.rows.summary[month]) {
        views.summary.rows.summary[month] = new Set();
      }
      if (!views.sites.rows[siteCode][month]) {
        views.sites.rows[siteCode][month] = new Set();
      }
      if (!views.states.rows[stateCode][month]) {
        views.states.rows[stateCode][month] = new Set();
      }
      if (!views.domains.rows[domainCode][month]) {
        views.domains.rows[domainCode][month] = new Set();
      }
      views.summary.rows.summary[month].add(status);
      views.sites.rows[siteCode][month].add(status);
      views.states.rows[stateCode][month].add(status);
      views.domains.rows[domainCode][month].add(status);
    });
  });
  dataProducts.forEach(product => {
    const {
      dataProductCode,
      availableMonths,
      availableReleases
    } = product;
    let provAvailableMonths = [];
    if (delineateRelease && Array.isArray(availableReleases)) {
      const provRelease = availableReleases.find(value => value.release === 'PROVISIONAL');
      if (provRelease) {
        provAvailableMonths = provRelease.availableMonths;
      }
    }
    views.products.rows[dataProductCode] = {};
    availableMonths.forEach(month => {
      let status = availabilityStatusType || 'available';
      if (delineateRelease && provAvailableMonths && provAvailableMonths.length > 0) {
        if (provAvailableMonths.includes(month)) {
          status = 'available-provisional';
        }
      }
      if (!views.products.rows[dataProductCode][month]) {
        views.products.rows[dataProductCode][month] = new Set();
      }
      views.products.rows[dataProductCode][month].add(status);
    });
  });
  if (!downloadContextIsActive) {
    const summaryMonths = Object.keys(views.summary.rows.summary).sort();
    dateRange.validValues[0] = summaryMonths[0]; // eslint-disable-line prefer-destructuring
    dateRange.validValues[1] = summaryMonths.pop();
  }

  /**
     Redraw setup
  */
  const svgRef = (0, _react.useRef)(null);
  const handleSvgRedraw = (0, _react.useCallback)(() => {
    (0, _BasicAvailabilityGrid.default)({
      data: views[currentView],
      svgRef,
      allSites,
      sites,
      sortedSites,
      setSitesValue,
      dateRange,
      setDateRangeValue,
      selectionEnabled
    });
  }, [svgRef, views, currentView, allSites, sites, sortedSites, setSitesValue, dateRange, setDateRangeValue, selectionEnabled]);
  (0, _react.useEffect)(() => {
    applySort();
    handleSvgRedraw();
  });
  let justify = 'end';
  if (currentView === 'ungrouped') {
    justify = atXs || atSm ? 'start' : 'end';
  } else {
    justify = atXs ? 'start' : 'end';
  }
  const optionDivStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: `flex-${justify}`
  };

  /**
     Render: NeonContext-related Loading and Error States
  */
  if (!neonContextIsFinal || neonContextHasError) {
    const message = currentView === 'products' ? 'Loading Products...' : 'Loading Sites...';
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_AvailabilityPending.default, {
      message: message
    });
  }

  /**
     Render: View Options
  */
  const renderViewOptions = () => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    style: optionDivStyle,
    "data-selenium": "data-product-availability.view-options",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "h6",
      className: classes.h6Small,
      style: {
        marginRight: _Theme.default.spacing(1.5),
        whiteSpace: 'nowrap'
      },
      children: "View By:"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Hidden.default, {
      mdDown: true,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ToggleButtonGroup.default, {
        exclusive: true,
        color: "primary",
        variant: "outlined",
        size: "small",
        value: currentView,
        onChange: handleChangeView,
        children: selectableViewKeys.map(key => /*#__PURE__*/(0, _jsxRuntime.jsx)(_ToggleButton.default, {
          value: key,
          size: "small",
          children: views[key].name
        }, key))
      })
    }, "viewMdUp"), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Hidden.default, {
      mdUp: true,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControl.default, {
        variant: "filled",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Select.default, {
          value: currentView,
          onChange: event => handleChangeView(event, event.target.value),
          input: /*#__PURE__*/(0, _jsxRuntime.jsx)(_OutlinedInput.default, {
            margin: "dense",
            className: selectionEnabled ? null : classes.xsSelect
          }),
          variant: "filled",
          children: selectableViewKeys.map(key => /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
            value: key,
            children: views[key].name
          }, key))
        })
      })
    }, "viewSmDown")]
  });

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
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Select.default, {
          value: currentSortMethod,
          "aria-label": "Sort Method",
          className: classes.sortSelect,
          onChange: handleChangeSortMethod,
          "data-selenium": "data-product-availability.sort-options.method",
          children: Object.keys(SORT_METHODS).map(method => /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
            value: method,
            children: SORT_METHODS[method].label
          }, method))
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ToggleButtonGroup.default, {
        exclusive: true,
        size: "small",
        value: currentSortDirection,
        onChange: handleChangeSortDirection,
        "data-selenium": "data-product-availability.sort-options.direction",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ToggleButton.default, {
          value: SORT_DIRECTIONS[0],
          title: "Sort Ascending (A-Z)",
          "aria-label": "Sort Ascending (A-Z)",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_KeyboardArrowDown.default, {
            fontSize: "small"
          })
        }, SORT_DIRECTIONS[0]), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ToggleButton.default, {
          value: SORT_DIRECTIONS[1],
          title: "Sort Descending (Z-A)",
          "aria-label": "Sort Descending (Z-A)",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_KeyboardArrowUp.default, {
            fontSize: "small"
          })
        }, SORT_DIRECTIONS[1])]
      })]
    })]
  });

  /**
     Render: View Controls
  */
  const renderViewControls = () => {
    if (currentView === 'products') {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 12
      });
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 12,
      sm: currentView === 'ungrouped' ? 12 : 5,
      md: 6,
      children: currentView === 'ungrouped' ? renderSortOptions() : renderViewOptions()
    });
  };

  /**
     Render: Key
  */
  const renderKey = () => {
    let smWidth = currentView === 'ungrouped' ? 12 : 7;
    let mdWidth = 6;
    if (currentView === 'products') {
      smWidth = 12;
      mdWidth = 12;
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 12,
      sm: smWidth,
      md: mdWidth,
      style: {
        display: 'flex',
        alignItems: 'center'
      },
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_BasicAvailabilityKey.default, {
        orientation: currentView === 'products' ? 'horizontal' : '',
        selectionEnabled: selectionEnabled,
        delineateRelease: delineateRelease,
        availabilityStatusType: availabilityStatusType,
        style: {
          flexGrow: 1
        }
      })
    });
  };

  /**
     Render: Selection
  */
  const renderSelection = () => {
    const sitesPlural = sites.value.length > 1 ? 's' : '';
    const siteChipLabel = `${sites.value.length} site${sitesPlural}`;
    const siteChipProps = {
      size: 'large',
      color: 'primary',
      classes: siteChipClasses,
      label: sites.value.length ? siteChipLabel : 'no sites selected',
      variant: sites.value.length ? 'default' : 'outlined',
      onDelete: sites.value.length ? handleSelectNoneSites : null
    };
    const selectionButtonProps = {
      size: 'small',
      color: 'primary',
      variant: 'outlined'
    };
    const datePickerProps = {
      inputVariant: 'outlined',
      margin: 'dense',
      views: ['month', 'year'],
      openTo: 'month'
    };
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
      container: true,
      spacing: 3,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        item: true,
        xs: 12,
        sm: 5,
        md: 6,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: classes.topFormHeader,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "h6",
            className: classes.h6Small,
            children: "Sites"
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          style: {
            marginTop: _Theme.default.spacing(1),
            marginBottom: _Theme.default.spacing(1.5)
          },
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_SiteChip.default, {
            ...siteChipProps
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          style: {
            display: 'flex'
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
            ...selectionButtonProps,
            "data-selenium": "data-product-availability.select-all-sites-button",
            onClick: handleSelectAllSites,
            children: "Select All Sites"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_MapSelectionButton.default, {
            selection: "SITES",
            selectedItems: sites.value,
            validItems: sites.validValues,
            buttonProps: {
              ...selectionButtonProps,
              style: {
                marginLeft: _Theme.default.spacing(1)
              }
            },
            "data-selenium": "data-product-availability.map-button",
            onSave: newSites => {
              setSitesValue(Array.from(newSites));
            }
          })]
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        item: true,
        xs: 12,
        sm: 7,
        md: 6,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "h6",
          className: classes.h6Small,
          children: "Date Range"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_xDatePickers.LocalizationProvider, {
          dateAdapter: _AdapterMoment.AdapterMoment,
          children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            style: {
              display: 'flex',
              flexWrap: 'nowrap'
            },
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_DatePicker.DatePicker, {
              ...datePickerProps,
              label: "Start",
              "data-selenium": "data-product-availability.date-range-start",
              orientation: "portrait",
              value: _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.value[0]),
              onChange: newDate => handleChangeStartDate(newDate),
              minDate: _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.validValues[0]),
              maxDate: _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.value[1]),
              style: {
                marginRight: _Theme.default.spacing(1.5)
              }
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_DatePicker.DatePicker, {
              ...datePickerProps,
              label: "End",
              "data-selenium": "data-product-availability.date-range-end",
              orientation: "portrait",
              value: _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.value[1]),
              onChange: newDate => handleChangeEndDate(newDate),
              minDate: _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.value[0]),
              maxDate: _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.validValues[1])
            })]
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          style: {
            display: 'flex',
            marginTop: _Theme.default.spacing(1)
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
            ...selectionButtonProps,
            "data-selenium": "data-product-availability.all-years-button",
            onClick: handleSelectAllDateRange,
            children: "Select All Years"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
            ...selectionButtonProps,
            "data-selenium": "data-product-availability.latest-year-button",
            onClick: handleSelectLatestYearDateRange,
            style: {
              marginLeft: _Theme.default.spacing(1)
            },
            children: "Select Latest Year"
          })]
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 12,
        style: {
          marginBottom: _Theme.default.spacing(1)
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Card.default, {
          children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_CardContent.default, {
            className: classes.helpGridContainer,
            children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: classes.helpGrid,
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_PanTool.default, {
                className: classes.helpIcon
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                variant: "body1",
                component: "div",
                style: {
                  flexGrow: 1
                },
                children: "Drag the grid to pan across time"
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: classes.helpGrid,
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_TouchApp.default, {
                className: classes.helpIcon
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                variant: "body1",
                component: "div",
                style: {
                  flexGrow: 1
                },
                children: "Click rows to select sites"
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: classes.helpGrid,
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_VerticalAlignCenter.default, {
                className: classes.helpIcon,
                style: {
                  transform: 'rotate(90deg)'
                }
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                variant: "body1",
                component: "div",
                style: {
                  flexGrow: 1
                },
                children: "Drag selection edges to adjust dates"
              })]
            })]
          })
        })
      })]
    });
  };

  /**
     Render: Final Component
  */
  const currentRows = views[currentView].rows;
  const currentRowCount = Object.keys(currentRows).length;
  const svgHeight = _AvailabilityUtils.SVG.CELL_PADDING + (_AvailabilityUtils.SVG.CELL_HEIGHT + _AvailabilityUtils.SVG.CELL_PADDING) * (currentRowCount + 1);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_FullWidthVisualization.default, {
    vizRef: svgRef,
    minWidth: _AvailabilityUtils.SVG.MIN_WIDTH,
    handleRedraw: handleSvgRedraw,
    "data-selenium": "data-product-availability",
    ...other,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_AvailabilitySvgComponents.SvgDefs, {}), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
      container: true,
      spacing: 2,
      direction: "row-reverse",
      style: {
        marginBottom: _Theme.default.spacing(1)
      },
      children: [selectionEnabled ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        item: true,
        xs: 12,
        sm: 12,
        children: renderSelection()
      }) : null, renderViewControls(), renderKey()]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
      id: (0, _lodash.uniqueId)('dpa-'),
      ref: svgRef,
      height: svgHeight,
      className: classes.svg
    })]
  });
};
BasicAvailabilityInterface.propTypes = {
  // eslint-disable-line react/no-unused-prop-types
  siteCodes: _AvailabilityUtils.AvailabilityPropTypes.basicSiteCodes,
  dataProducts: _AvailabilityUtils.AvailabilityPropTypes.dataProducts,
  view: _propTypes.default.oneOf(['summary', 'sites', 'states', 'domains', 'ungrouped', 'products']),
  sortMethod: _propTypes.default.oneOf(['sites', 'states', 'domains']),
  sortDirection: _propTypes.default.oneOf(['ASC', 'DESC']),
  disableSelection: _propTypes.default.bool,
  delineateRelease: _propTypes.default.bool,
  availabilityStatusType: _propTypes.default.oneOf(['available', 'tombstoned'])
};
var _default = exports.default = BasicAvailabilityInterface;