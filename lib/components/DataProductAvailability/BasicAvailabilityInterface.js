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
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _Card = _interopRequireDefault(require("@material-ui/core/Card"));
var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));
var _FormControl = _interopRequireDefault(require("@material-ui/core/FormControl"));
var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));
var _Hidden = _interopRequireDefault(require("@material-ui/core/Hidden"));
var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));
var _OutlinedInput = _interopRequireDefault(require("@material-ui/core/OutlinedInput"));
var _Select = _interopRequireDefault(require("@material-ui/core/Select"));
var _ToggleButton = _interopRequireDefault(require("@material-ui/lab/ToggleButton"));
var _ToggleButtonGroup = _interopRequireDefault(require("@material-ui/lab/ToggleButtonGroup"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _KeyboardArrowDown = _interopRequireDefault(require("@material-ui/icons/KeyboardArrowDown"));
var _KeyboardArrowUp = _interopRequireDefault(require("@material-ui/icons/KeyboardArrowUp"));
var _TouchApp = _interopRequireDefault(require("@material-ui/icons/TouchApp"));
var _VerticalAlignCenter = _interopRequireDefault(require("@material-ui/icons/VerticalAlignCenter"));
var _PanTool = _interopRequireDefault(require("@material-ui/icons/PanTool"));
var _pickers = require("@material-ui/pickers");
var _moment = _interopRequireDefault(require("@date-io/moment"));
var _FullWidthVisualization = _interopRequireDefault(require("../FullWidthVisualization/FullWidthVisualization"));
var _DownloadDataContext = _interopRequireDefault(require("../DownloadDataContext/DownloadDataContext"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _MapSelectionButton = _interopRequireDefault(require("../MapSelectionButton/MapSelectionButton"));
var _SiteChip = _interopRequireDefault(require("../SiteChip/SiteChip"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _AvailabilityPending = _interopRequireDefault(require("./AvailabilityPending"));
var _BasicAvailabilityGrid = _interopRequireDefault(require("./BasicAvailabilityGrid"));
var _BasicAvailabilityKey = _interopRequireDefault(require("./BasicAvailabilityKey"));
var _AvailabilityUtils = require("./AvailabilityUtils");
var _AvailabilitySvgComponents = require("./AvailabilitySvgComponents");
const _excluded = ["dataProducts"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
/**
   Setup: CSS classes
*/
const useStyles = (0, _styles.makeStyles)(theme => ({
  svg: {
    minWidth: "".concat(_AvailabilityUtils.SVG.MIN_WIDTH, "px"),
    minHeight: "".concat(_AvailabilityUtils.SVG.MIN_HEIGHT, "px")
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

/**
   Main Function
*/
const BasicAvailabilityInterface = props => {
  const classes = useStyles(_Theme.default);
  const atXs = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('xs'));
  const atSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('sm'));
  const siteChipClasses = useSiteChipStyles(_Theme.default);
  const {
      dataProducts
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
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
        text: key => " ".concat(key, " "),
        title: key => allStates[key].name
      }
    },
    domains: {
      view: 'domains',
      name: 'Domain',
      selectable: true,
      rows: {},
      getLabel: {
        text: key => "".concat(key, " "),
        title: key => allDomains[key].name
      }
    },
    ungrouped: {
      view: 'ungrouped',
      name: 'Ungrouped',
      selectable: false,
      getLabel: {
        text: key => "".concat(allSites[key].stateCode, "-").concat(allSites[key].domainCode, "-").concat(key),
        title: key => {
          const siteTitle = allSites[key].description;
          const domainTitle = allDomains[allSites[key].domainCode].name;
          const stateTitle = allStates[allSites[key].stateCode].name;
          return "".concat(stateTitle, " - ").concat(domainTitle, " - ").concat(siteTitle);
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
    justifyContent: "flex-".concat(justify)
  };

  /**
     Render: NeonContext-related Loading and Error States
  */
  if (!neonContextIsFinal || neonContextHasError) {
    const message = currentView === 'products' ? 'Loading Products...' : 'Loading Sites...';
    return /*#__PURE__*/_react.default.createElement(_AvailabilityPending.default, {
      message: message
    });
  }

  /**
     Render: View Options
  */
  const renderViewOptions = () => /*#__PURE__*/_react.default.createElement("div", {
    style: optionDivStyle,
    "data-selenium": "data-product-availability.view-options"
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    className: classes.h6Small,
    style: {
      marginRight: _Theme.default.spacing(1.5),
      whiteSpace: 'nowrap'
    }
  }, "View By:"), /*#__PURE__*/_react.default.createElement(_Hidden.default, {
    smDown: true,
    key: "viewMdUp"
  }, /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
    exclusive: true,
    color: "primary",
    variant: "outlined",
    size: "small",
    value: currentView,
    onChange: handleChangeView
  }, selectableViewKeys.map(key => /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
    key: key,
    value: key,
    size: "small"
  }, views[key].name)))), /*#__PURE__*/_react.default.createElement(_Hidden.default, {
    mdUp: true,
    key: "viewSmDown"
  }, /*#__PURE__*/_react.default.createElement(_FormControl.default, {
    variant: "filled"
  }, /*#__PURE__*/_react.default.createElement(_Select.default, {
    value: currentView,
    onChange: event => handleChangeView(event, event.target.value),
    input: /*#__PURE__*/_react.default.createElement(_OutlinedInput.default, {
      margin: "dense",
      className: selectionEnabled ? null : classes.xsSelect
    }),
    variant: "filled"
  }, selectableViewKeys.map(key => /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    key: key,
    value: key
  }, views[key].name))))));

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
    value: currentSortMethod,
    "aria-label": "Sort Method",
    className: classes.sortSelect,
    onChange: handleChangeSortMethod,
    "data-selenium": "data-product-availability.sort-options.method"
  }, Object.keys(SORT_METHODS).map(method => /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    key: method,
    value: method
  }, SORT_METHODS[method].label)))), /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
    exclusive: true,
    size: "small",
    value: currentSortDirection,
    onChange: handleChangeSortDirection,
    "data-selenium": "data-product-availability.sort-options.direction"
  }, /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
    key: SORT_DIRECTIONS[0],
    value: SORT_DIRECTIONS[0],
    title: "Sort Ascending (A-Z)",
    "aria-label": "Sort Ascending (A-Z)"
  }, /*#__PURE__*/_react.default.createElement(_KeyboardArrowDown.default, {
    fontSize: "small"
  })), /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
    key: SORT_DIRECTIONS[1],
    value: SORT_DIRECTIONS[1],
    title: "Sort Descending (Z-A)",
    "aria-label": "Sort Descending (Z-A)"
  }, /*#__PURE__*/_react.default.createElement(_KeyboardArrowUp.default, {
    fontSize: "small"
  })))));

  /**
     Render: View Controls
  */
  const renderViewControls = () => {
    if (currentView === 'products') {
      return /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12
      });
    }
    return /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12,
      sm: currentView === 'ungrouped' ? 12 : 5,
      md: 6
    }, currentView === 'ungrouped' ? renderSortOptions() : renderViewOptions());
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
    return /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12,
      sm: smWidth,
      md: mdWidth,
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/_react.default.createElement(_BasicAvailabilityKey.default, {
      orientation: currentView === 'products' ? 'horizontal' : '',
      selectionEnabled: selectionEnabled,
      delineateRelease: delineateRelease,
      availabilityStatusType: availabilityStatusType,
      style: {
        flexGrow: 1
      }
    }));
  };

  /**
     Render: Selection
  */
  const renderSelection = () => {
    const sitesPlural = sites.value.length > 1 ? 's' : '';
    const siteChipLabel = "".concat(sites.value.length, " site").concat(sitesPlural);
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
    return /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true,
      spacing: 3
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12,
      sm: 5,
      md: 6
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.topFormHeader
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      className: classes.h6Small
    }, "Sites")), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        marginTop: _Theme.default.spacing(1),
        marginBottom: _Theme.default.spacing(1.5)
      }
    }, /*#__PURE__*/_react.default.createElement(_SiteChip.default, siteChipProps)), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex'
      }
    }, /*#__PURE__*/_react.default.createElement(_Button.default, _extends({}, selectionButtonProps, {
      "data-selenium": "data-product-availability.select-all-sites-button",
      onClick: handleSelectAllSites
    }), "Select All Sites"), /*#__PURE__*/_react.default.createElement(_MapSelectionButton.default, {
      selection: "SITES",
      selectedItems: sites.value,
      validItems: sites.validValues,
      buttonProps: _extends({}, selectionButtonProps, {
        style: {
          marginLeft: _Theme.default.spacing(1)
        }
      }),
      "data-selenium": "data-product-availability.map-button",
      onSave: newSites => {
        setSitesValue(Array.from(newSites));
      }
    }))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12,
      sm: 7,
      md: 6
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6",
      className: classes.h6Small
    }, "Date Range"), /*#__PURE__*/_react.default.createElement(_pickers.MuiPickersUtilsProvider, {
      utils: _moment.default
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'nowrap'
      }
    }, /*#__PURE__*/_react.default.createElement(_pickers.DatePicker, _extends({}, datePickerProps, {
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
    })), /*#__PURE__*/_react.default.createElement(_pickers.DatePicker, _extends({}, datePickerProps, {
      label: "End",
      "data-selenium": "data-product-availability.date-range-end",
      orientation: "portrait",
      value: _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.value[1]),
      onChange: newDate => handleChangeEndDate(newDate),
      minDate: _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.value[0]),
      maxDate: _AvailabilityUtils.TIME.getYearMonthMoment(dateRange.validValues[1])
    })))), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        marginTop: _Theme.default.spacing(1)
      }
    }, /*#__PURE__*/_react.default.createElement(_Button.default, _extends({}, selectionButtonProps, {
      "data-selenium": "data-product-availability.all-years-button",
      onClick: handleSelectAllDateRange
    }), "Select All Years"), /*#__PURE__*/_react.default.createElement(_Button.default, _extends({}, selectionButtonProps, {
      "data-selenium": "data-product-availability.latest-year-button",
      onClick: handleSelectLatestYearDateRange,
      style: {
        marginLeft: _Theme.default.spacing(1)
      }
    }), "Select Latest Year"))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12,
      style: {
        marginBottom: _Theme.default.spacing(1)
      }
    }, /*#__PURE__*/_react.default.createElement(_Card.default, null, /*#__PURE__*/_react.default.createElement(_CardContent.default, {
      className: classes.helpGridContainer
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: classes.helpGrid
    }, /*#__PURE__*/_react.default.createElement(_PanTool.default, {
      className: classes.helpIcon
    }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body1",
      component: "div",
      style: {
        flexGrow: 1
      }
    }, "Drag the grid to pan across time")), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.helpGrid
    }, /*#__PURE__*/_react.default.createElement(_TouchApp.default, {
      className: classes.helpIcon
    }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body1",
      component: "div",
      style: {
        flexGrow: 1
      }
    }, "Click rows to select sites")), /*#__PURE__*/_react.default.createElement("div", {
      className: classes.helpGrid
    }, /*#__PURE__*/_react.default.createElement(_VerticalAlignCenter.default, {
      className: classes.helpIcon,
      style: {
        transform: 'rotate(90deg)'
      }
    }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body1",
      component: "div",
      style: {
        flexGrow: 1
      }
    }, "Drag selection edges to adjust dates"))))));
  };

  /**
     Render: Final Component
  */
  const currentRows = views[currentView].rows;
  const currentRowCount = Object.keys(currentRows).length;
  const svgHeight = _AvailabilityUtils.SVG.CELL_PADDING + (_AvailabilityUtils.SVG.CELL_HEIGHT + _AvailabilityUtils.SVG.CELL_PADDING) * (currentRowCount + 1);
  return /*#__PURE__*/_react.default.createElement(_FullWidthVisualization.default, _extends({
    vizRef: svgRef,
    minWidth: _AvailabilityUtils.SVG.MIN_WIDTH,
    handleRedraw: handleSvgRedraw,
    "data-selenium": "data-product-availability"
  }, other), /*#__PURE__*/_react.default.createElement(_AvailabilitySvgComponents.SvgDefs, null), /*#__PURE__*/_react.default.createElement(_Grid.default, {
    container: true,
    spacing: 2,
    direction: "row-reverse",
    style: {
      marginBottom: _Theme.default.spacing(1)
    }
  }, selectionEnabled ? /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 12,
    sm: 12
  }, renderSelection()) : null, renderViewControls(), renderKey()), /*#__PURE__*/_react.default.createElement("svg", {
    id: (0, _lodash.uniqueId)('dpa-'),
    ref: svgRef,
    height: svgHeight,
    className: classes.svg
  }));
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
BasicAvailabilityInterface.defaultProps = {
  siteCodes: [],
  dataProducts: [],
  view: null,
  sortMethod: null,
  sortDirection: 'ASC',
  disableSelection: false,
  delineateRelease: false,
  availabilityStatusType: null
};
var _default = exports.default = BasicAvailabilityInterface;