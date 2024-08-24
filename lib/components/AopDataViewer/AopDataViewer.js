"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _rxjs = require("rxjs");
var _ajax = require("rxjs/ajax");
var _moment = _interopRequireDefault(require("moment"));
var _styles = require("@mui/styles");
var _useMediaQuery = _interopRequireDefault(require("@mui/material/useMediaQuery"));
var _Divider = _interopRequireDefault(require("@mui/material/Divider"));
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Link = _interopRequireDefault(require("@mui/material/Link"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _OutlinedInput = _interopRequireDefault(require("@mui/material/OutlinedInput"));
var _Select = _interopRequireDefault(require("@mui/material/Select"));
var _Slider = _interopRequireDefault(require("@mui/material/Slider"));
var _SnackbarContent = _interopRequireDefault(require("@mui/material/SnackbarContent"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _KeyboardArrowLeft = _interopRequireDefault(require("@mui/icons-material/KeyboardArrowLeft"));
var _KeyboardArrowRight = _interopRequireDefault(require("@mui/icons-material/KeyboardArrowRight"));
var _InfoOutlined = _interopRequireDefault(require("@mui/icons-material/InfoOutlined"));
var _OpenInNew = _interopRequireDefault(require("@mui/icons-material/OpenInNew"));
var _Warning = _interopRequireDefault(require("@mui/icons-material/Warning"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));
var _NeonEnvironment = _interopRequireDefault(require("../NeonEnvironment/NeonEnvironment"));
var _FullWidthVisualization = _interopRequireDefault(require("../FullWidthVisualization/FullWidthVisualization"));
var _MapSelectionButton = _interopRequireDefault(require("../MapSelectionButton/MapSelectionButton"));
var _defaultProps = require("../../util/defaultProps");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const MIN_IFRAME_WIDTH = 240;

/**
   Setup: CSS classes
*/
const useStyles = (0, _styles.makeStyles)(theme => ({
  selectionForm: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  iframe: {
    minWidth: `${MIN_IFRAME_WIDTH}px`,
    minHeight: `${MIN_IFRAME_WIDTH}px`,
    border: `1px solid ${theme.palette.grey[700]}`
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  label: {
    color: theme.palette.grey[500],
    fontSize: '0.9rem',
    marginBottom: theme.spacing(0.5)
  },
  optgroup: {
    fontWeight: _Theme.default.typography.fontWeightMedium
  },
  tooltipIconButton: {
    marginTop: theme.spacing(-0.5),
    marginLeft: theme.spacing(0.5)
  },
  openInNewLink: {
    display: 'block',
    width: '100%',
    textAlign: 'right',
    marginTop: theme.spacing(0.5),
    fontSize: '0.8rem'
  },
  openInNewIcon: {
    fontSize: '0.95rem',
    margin: theme.spacing(0, 0.5, -0.25, 0)
  }
}));

/**
   Function: Parse the response from the Visus API from its original shape
   into an object keyed by sites each containing an object keyed by years
   each containing an array of flights. Each flight contains the month and URL.
*/
/* eslint-disable no-param-reassign, function-paren-newline */
const parseFetchResponse = response => response.data.siteCodes.reduce((obj, site) => {
  obj[site.siteCode] = site.availableMonths.reduce((siteObj, yearMonth, idx) => {
    const year = parseInt(yearMonth.substr(0, 4), 10);
    const month = yearMonth.substr(5, 2);
    if (!siteObj[year]) {
      siteObj[year] = [];
    }
    siteObj[year].push({
      month,
      url: site.availableDataUrls[idx]
    });
    return siteObj;
  }, {});
  return obj;
}, {});
/* eslint-enable no-param-reassign, function-paren-newline */

/**
   Functions to get slider marks and bounds
   Limit slider marks to one per year where the year is the slider value
*/
const getCurrentSliderMarks = currentYears => Array.from(new Set(Object.keys(currentYears || {}).sort().map(year => ({
  label: year,
  value: year
}))));
const getCurrentSliderBounds = currentYears => {
  const years = Object.keys(currentYears).sort();
  if (years < 2) {
    return null;
  }
  return {
    min: parseInt(years[0], 10) - 1,
    max: parseInt(years[years.length - 1], 10) + 1
  };
};
const defaultProps = {
  showTitle: true,
  initialSite: null,
  initialYear: null,
  initialFlight: null,
  fillContainer: false,
  showOpenInNewWindow: false
};

/**
   Main Function
*/
const AopDataViewer = inProps => {
  const props = (0, _defaultProps.resolveProps)(defaultProps, inProps);
  const classes = useStyles(_Theme.default);
  const {
    productCode,
    showTitle,
    fillContainer,
    showOpenInNewWindow
  } = props;
  const [{
    data: neonContextData
  }] = _NeonContext.default.useNeonContextState();
  const {
    sites,
    states
  } = neonContextData;
  const belowSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('xs'));
  const atSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('sm'));

  /**
     Getters for site description and data set title
  */
  const getSiteDescription = function (site) {
    let includeState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    if (sites[site]) {
      const state = includeState ? `, ${sites[site].stateCode}` : '';
      return `${sites[site].description}${state}`;
    }
    return null;
  };
  const getDataSetTitle = (selection, data) => {
    if (!selection || !data) {
      return '';
    }
    const {
      site,
      year,
      flight
    } = selection;
    if (!site || !year || !flight) {
      return '';
    }
    const flightIdx = flight - 1;
    if (!data[site] || !data[site][year] || !data[site][year][flightIdx]) {
      return '';
    }
    const parts = {
      site: getSiteDescription(site),
      date: (0, _moment.default)(new Date(`${year}-${data[site][year][flightIdx].month}-02`)).format('MMMM YYYY'),
      flight: `Flight ${flight}/${data[site][year].length}`
    };
    return `${parts.site} -- ${parts.date} -- ${parts.flight}`;
  };

  /**
     State: data
     Object, keyed by site code and then year, with each year containing an array of flight objects.
  */
  const [data, setData] = (0, _react.useState)({});

  /**
     State: iFrame Width
     Keep iFrame width in state to trigger re-renders as necessary on resize, including
     keeping the component at its maximum width at all times and with an appropriate
     aspect ratio given the width.
  */
  const iframeRef = (0, _react.useRef)(null);

  /**
     State: currentSelection
     Object containing current site, year, and flight to show in the iframe
  */
  const {
    initialSite,
    initialYear,
    initialFlight
  } = props;
  const initialCurrentSelection = {
    site: initialSite || null,
    year: initialYear || null,
    flight: initialFlight || null,
    sliderMarks: [],
    sliderBounds: {
      min: 2010,
      max: 2050
    }
  };
  const [currentSelection, setCurrentSelection] = (0, _react.useState)(initialCurrentSelection);
  const handleSiteChange = (0, _react.useCallback)(function () {
    let site = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!data || !Object.keys(data).length) {
      return;
    }
    let newSite = site;
    if (site === null) {
      newSite = initialSite || Object.keys(data)[0];
    }
    if (!data[newSite] || !Object.keys(data[newSite]).length) {
      return;
    }
    let newYear = parseInt(Object.keys(data[newSite]).sort().reverse()[0], 10);
    if (site === null && initialYear && data[newSite][initialYear]) {
      newYear = initialYear;
    }
    if (!data[newSite][newYear].length) {
      return;
    }
    let newFlight = data[newSite][newYear].length;
    if (site === null && initialFlight && data[newSite][newYear][initialFlight - 1]) {
      newFlight = initialFlight;
    }
    setCurrentSelection({
      site: newSite,
      year: newYear,
      flight: newFlight,
      sliderMarks: getCurrentSliderMarks(data[newSite]),
      sliderBounds: getCurrentSliderBounds(data[newSite])
    });
  }, [initialSite, initialYear, initialFlight, data]);
  const handleSliderChange = year => {
    const validYears = Object.keys(data[currentSelection.site]).map(y => parseInt(y, 10));
    if (!year || !validYears.includes(year) || year === currentSelection.year) {
      return;
    }
    const flight = data[currentSelection.site][year].length;
    setCurrentSelection(previousCurrentSelection => ({
      ...previousCurrentSelection,
      year,
      flight
    }));
  };
  const handleSliderButtonClick = direction => {
    if (!['next', 'previous'].includes(direction)) {
      return;
    }
    const validYears = Object.keys(data[currentSelection.site]).map(y => parseInt(y, 10));
    const currentYearIdx = validYears.indexOf(currentSelection.year);
    const nudge = direction === 'next' ? 1 : -1;
    const newYear = validYears[currentYearIdx + nudge];
    if (!newYear) {
      return;
    }
    handleSliderChange(newYear);
  };
  const handleFlightChange = flight => {
    if (Number.isNaN(flight) || !data[currentSelection.site][currentSelection.year][flight - 1]) {
      return;
    }
    setCurrentSelection(previousCurrentSelection => ({
      ...previousCurrentSelection,
      flight
    }));
  };
  const getCurrentIframeSrc = () => {
    const {
      site,
      year,
      flight
    } = currentSelection;
    if (!site || !year || !flight) {
      return '';
    }
    const flightIdx = flight - 1;
    if (!data[site] || !data[site][year] || !data[site][year][flightIdx]) {
      return '';
    }
    const yearData = data[site][year];
    if (!yearData[flightIdx].month) {
      return '';
    }
    const yearFlightMonth = yearData[flightIdx].month;
    const currentDataUrl = data[site][year][flightIdx].url;
    const queryParams = `&dataproduct=${productCode}&site=${site}&month=${year}-${yearFlightMonth}`;
    const appliedDataUrl = `${currentDataUrl}${queryParams}`;
    const title = encodeURIComponent(getDataSetTitle(currentSelection, data));
    return `${_NeonEnvironment.default.getVisusIframeBaseUrl()}?${appliedDataUrl}&title=${title}`;
  };

  /**
     State: fetchCalled, fetchSucceeded, and fetchFailed
     Booleans for whether the initial data availability fetch has been called,
     whether it has completed (resolved OK or with an error), and whether it failed.
  */
  const [fetchCalled, setFetchCalled] = (0, _react.useState)(false);
  const [fetchSucceeded, setFetchSucceeded] = (0, _react.useState)(false);
  const [fetchFailed, setFetchFailed] = (0, _react.useState)(false);

  /**
     Effect: fetch and parse available data
  */
  const handleFetchProductByCode = (0, _react.useCallback)(() => (0, _ajax.ajax)({
    method: 'GET',
    url: `${_NeonEnvironment.default.getVisusProductsBaseUrl()}/${productCode}`,
    crossDomain: true
  }).pipe((0, _rxjs.map)(response => {
    if (!response || !response.response || !response.response.data || !response.response.data.siteCodes || response.response.data.siteCodes.length <= 0) {
      throw Error('Product response contained no data');
    }
    setData(parseFetchResponse(response.response));
    setFetchSucceeded(true);
  }), (0, _rxjs.catchError)(() => {
    setFetchFailed(true);
    return (0, _rxjs.of)('Product not found');
  })).subscribe(), [productCode]);
  (0, _react.useEffect)(() => {
    if (!fetchCalled) {
      handleFetchProductByCode();
      setFetchCalled(true);
    }
    if (fetchSucceeded && (!currentSelection.site || !currentSelection.sliderMarks.length)) {
      handleSiteChange();
    }
  }, [fetchCalled, fetchSucceeded, currentSelection, handleFetchProductByCode, handleSiteChange]);
  const renderSiteSelect = () => {
    const sitesByStateName = {};
    Object.keys(data).forEach(site => {
      if (!sites[site]) {
        return;
      }
      const stateName = states[sites[site].stateCode].name;
      if (!sitesByStateName[stateName]) {
        sitesByStateName[stateName] = [];
      }
      sitesByStateName[stateName].push(site);
    });
    const menuItems = Object.keys(sitesByStateName).sort().flatMap(stateName => [/*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
      value: stateName,
      className: classes.optgroup,
      style: {
        opacity: 1
      },
      disabled: true,
      children: stateName
    }, stateName)].concat(sitesByStateName[stateName].map(site => /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
      value: site,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          display: "block",
          children: site
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          display: "block",
          variant: "caption",
          children: getSiteDescription(site, false)
        })]
      })
    }, site))));
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      style: {
        display: 'flex',
        flexWrap: 'nowrap'
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_MapSelectionButton.default, {
        selection: "SITES",
        selectionLimit: 1,
        selectedItems: currentSelection.site ? [currentSelection.site] : [],
        validItems: Object.keys(data),
        buttonProps: {
          style: {
            marginRight: _Theme.default.spacing(1)
          }
        },
        onSave: newSites => {
          handleSiteChange([...newSites][0]);
        },
        icon: !atSm
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Select.default, {
        "data-selenium": "aop-data-viewer.site-select",
        value: currentSelection.site || '',
        onChange: event => handleSiteChange(event.target.value),
        input: /*#__PURE__*/(0, _jsxRuntime.jsx)(_OutlinedInput.default, {
          name: "site",
          id: "site",
          size: "small"
        }),
        "aria-labelledby": "site-label",
        renderValue: value => value,
        children: menuItems
      })]
    });
  };
  const renderYearSlider = () => {
    if (!currentSelection.year) {
      return null;
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      style: {
        width: '100%',
        display: 'flex'
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        style: {
          flexGrow: 0
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
          "data-selenium": "aop-data-viewer.previous-year-button",
          size: "small",
          color: "primary",
          "aria-label": "previous year",
          style: {
            marginRight: _Theme.default.spacing(0.5)
          },
          onClick: () => handleSliderButtonClick('previous'),
          disabled: currentSelection.year === currentSelection.sliderBounds.min + 1,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_KeyboardArrowLeft.default, {})
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        style: {
          flexGrow: 1
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Slider.default, {
          "data-selenium": "aop-data-viewer.year-slider",
          value: currentSelection.year,
          step: null,
          marks: currentSelection.sliderMarks,
          min: currentSelection.sliderBounds.min,
          max: currentSelection.sliderBounds.max,
          "aria-labelledby": "year-label",
          valueLabelDisplay: "auto",
          valueLabelFormat: value => value,
          onChange: (event, newYear) => handleSliderChange(parseInt(newYear, 10))
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        style: {
          flexGrow: 0
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
          "data-selenium": "aop-data-viewer.next-year-button",
          size: "small",
          color: "primary",
          "aria-label": "next year",
          style: {
            marginLeft: _Theme.default.spacing(0.5)
          },
          onClick: () => handleSliderButtonClick('next'),
          disabled: currentSelection.year === currentSelection.sliderBounds.max - 1,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_KeyboardArrowRight.default, {})
        })
      })]
    });
  };
  const renderFlightSelect = () => {
    const {
      site,
      year,
      flight
    } = currentSelection;
    if (!flight || !data[site] || !data[site][year] || !data[site][year].length) {
      return null;
    }
    const total = data[site][year].length;
    const getFlightLabel = (flightNumber, month) => `${flightNumber}/${total} (${(0, _moment.default)(new Date(`2000-${month}-02`)).format('MMMM')})`;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Select.default, {
      "data-selenium": "aop-data-viewer.flight-select",
      value: flight,
      onChange: event => handleFlightChange(parseInt(event.target.value, 10)),
      input: /*#__PURE__*/(0, _jsxRuntime.jsx)(_OutlinedInput.default, {
        name: "flight",
        id: "flight",
        size: "small"
      }),
      "aria-labelledby": "flight-label",
      renderValue: value => getFlightLabel(value, data[site][year][value - 1].month),
      disabled: total === 1,
      children: data[site][year].map((f, idx) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_MenuItem.default, {
        value: idx + 1,
        children: getFlightLabel(idx + 1, f.month)
      }, `${f.url}`))
    });
  };
  const renderInputLabel = function (input) {
    let tooltip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
      className: classes.label,
      id: `${input}-label`,
      children: [`${input.substr(0, 1).toUpperCase()}${input.substr(1)}`, tooltip ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
        placement: "right",
        title: tooltip,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
          size: "small",
          className: classes.tooltipIconButton,
          "aria-label": tooltip,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_InfoOutlined.default, {
            fontSize: "inherit"
          })
        })
      }) : null]
    });
  };
  const tooltips = {
    site: 'Use the map or the menu below to select a site to display. Only one site can be viewed at a time.',
    year: 'This slider can be used to move back and forth through time for a given site.',
    flight: 'Most sites are visited once per year, but sometimes subsequent flights are necessary to get complete data for that year. If more than one flight is available for a given site/year then this field can be used to select particular flights of interest.'
  };
  const visusLink = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.default, {
    href: "https://visus.org/",
    target: "_blank",
    "data-external": "VISUS",
    rel: "noopener noreferrer",
    children: "Visus Project at the Univeristy of Utah"
  });
  const renderSelectionForm = () => /*#__PURE__*/(0, _jsxRuntime.jsxs)("form", {
    className: classes.selectionForm,
    autoComplete: "off",
    children: [showTitle ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "h5",
      gutterBottom: true,
      children: "AOP Data Viewer"
    }) : null, /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
      variant: "caption",
      gutterBottom: true,
      children: ["This viewer allows for interactive exploration of remotely sensed data from the Airborne Observation Platform (AOP). Change the field site and flight for this data product using the tools below to stream different data into view. Pan and zoom in the view to stream higher resolution imagery. This pilot data viewer is provided through a collaboration with the ", visusLink, " and more updates are planned for the future."]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Divider.default, {
      className: classes.divider
    }), belowSm ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        container: true,
        spacing: 2,
        justifyContent: "center",
        style: {
          marginBottom: _Theme.default.spacing(1)
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 2,
          children: renderInputLabel('site', tooltips.site)
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 10,
          children: renderSiteSelect()
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        container: true,
        spacing: 2,
        justifyContent: "center",
        style: {
          marginBottom: _Theme.default.spacing(1)
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 2,
          children: renderInputLabel('year', tooltips.year)
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 10,
          children: renderYearSlider()
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        container: true,
        spacing: 2,
        justifyContent: "center",
        style: {
          marginBottom: _Theme.default.spacing(1)
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 2,
          children: renderInputLabel('flight', tooltips.flight)
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 10,
          children: renderFlightSelect()
        })]
      })]
    }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      style: {
        width: '100%',
        display: 'flex'
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        style: {
          flexGrow: 0
        },
        children: [renderInputLabel('site', tooltips.site), renderSiteSelect()]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        style: {
          flexGrow: 1,
          margin: _Theme.default.spacing(0, 2)
        },
        children: [renderInputLabel('year', tooltips.year), renderYearSlider()]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        style: {
          flexGrow: 0
        },
        children: [renderInputLabel('flight', tooltips.flight), renderFlightSelect()]
      })]
    })]
  });
  if (fetchFailed) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.iframeContainer,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_SnackbarContent.default, {
        style: {
          backgroundColor: _Theme.default.palette.error.main
        },
        message: /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
          style: {
            display: 'flex',
            alignItems: 'center'
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Warning.default, {
            style: {
              marginRight: _Theme.default.spacing(1)
            }
          }), "AOP Data Viewer is not available for this data product."]
        })
      })
    });
  }
  const srcUrl = getCurrentIframeSrc();
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_FullWidthVisualization.default, {
    vizRef: iframeRef,
    minWidth: MIN_IFRAME_WIDTH,
    allowHeightResize: fillContainer,
    deriveHeightFromWidth: !fillContainer ? 'auto' : (width, container, viz) => container.clientHeight - viz.offsetTop - 10,
    containerStyle: !fillContainer ? null : {
      minWidth: `${MIN_IFRAME_WIDTH}px`,
      position: 'absolute',
      top: _Theme.default.spacing(3),
      left: _Theme.default.spacing(3),
      right: _Theme.default.spacing(3),
      bottom: _Theme.default.spacing(3),
      overflowX: 'hidden',
      overflowY: 'auto'
    },
    "data-selenium": "aop-data-viewer",
    children: [renderSelectionForm(), /*#__PURE__*/(0, _jsxRuntime.jsx)("iframe", {
      src: srcUrl,
      title: getDataSetTitle(currentSelection),
      ref: iframeRef,
      scrolling: "no",
      className: classes.iframe
    }), !showOpenInNewWindow ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Link.default, {
      href: srcUrl,
      target: "_blank",
      rel: "noopener noreferrer",
      className: classes.openInNewLink,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_OpenInNew.default, {
        className: classes.openInNewIcon
      }), "Open in New Window"]
    })]
  });
};
AopDataViewer.propTypes = {
  productCode: _propTypes.default.string.isRequired,
  showTitle: _propTypes.default.bool,
  initialSite: _propTypes.default.string,
  initialYear: _propTypes.default.number,
  initialFlight: _propTypes.default.number,
  fillContainer: _propTypes.default.bool,
  showOpenInNewWindow: _propTypes.default.bool
};
const WrappedAopDataViewer = _Theme.default.getWrappedComponent(_NeonContext.default.getWrappedComponent(AopDataViewer));
var _default = exports.default = WrappedAopDataViewer;