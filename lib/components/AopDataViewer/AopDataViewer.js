'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = AopDataViewer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _rxjs = require('rxjs');

var _ajax = require('rxjs/ajax');

var _operators = require('rxjs/operators');

var _dateformat = require('dateformat');

var _dateformat2 = _interopRequireDefault(_dateformat);

var _styles = require('@material-ui/core/styles');

var _useMediaQuery = require('@material-ui/core/useMediaQuery');

var _useMediaQuery2 = _interopRequireDefault(_useMediaQuery);

var _Divider = require('@material-ui/core/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _FormControl = require('@material-ui/core/FormControl');

var _FormControl2 = _interopRequireDefault(_FormControl);

var _Grid = require('@material-ui/core/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _IconButton = require('@material-ui/core/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Link = require('@material-ui/core/Link');

var _Link2 = _interopRequireDefault(_Link);

var _MenuItem = require('@material-ui/core/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _OutlinedInput = require('@material-ui/core/OutlinedInput');

var _OutlinedInput2 = _interopRequireDefault(_OutlinedInput);

var _Select = require('@material-ui/core/Select');

var _Select2 = _interopRequireDefault(_Select);

var _Slider = require('@material-ui/core/Slider');

var _Slider2 = _interopRequireDefault(_Slider);

var _SnackbarContent = require('@material-ui/core/SnackbarContent');

var _SnackbarContent2 = _interopRequireDefault(_SnackbarContent);

var _Tooltip = require('@material-ui/core/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _KeyboardArrowLeft = require('@material-ui/icons/KeyboardArrowLeft');

var _KeyboardArrowLeft2 = _interopRequireDefault(_KeyboardArrowLeft);

var _KeyboardArrowRight = require('@material-ui/icons/KeyboardArrowRight');

var _KeyboardArrowRight2 = _interopRequireDefault(_KeyboardArrowRight);

var _InfoOutlined = require('@material-ui/icons/InfoOutlined');

var _InfoOutlined2 = _interopRequireDefault(_InfoOutlined);

var _Warning = require('@material-ui/icons/Warning');

var _Warning2 = _interopRequireDefault(_Warning);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

var _NeonEnvironment = require('../NeonEnvironment/NeonEnvironment');

var _NeonEnvironment2 = _interopRequireDefault(_NeonEnvironment);

var _FullWidthVisualization = require('../FullWidthVisualization/FullWidthVisualization');

var _FullWidthVisualization2 = _interopRequireDefault(_FullWidthVisualization);

var _sites = require('../../static/sites/sites.json');

var _sites2 = _interopRequireDefault(_sites);

var _states = require('../../static/states/states.json');

var _states2 = _interopRequireDefault(_states);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MIN_IFRAME_WIDTH = 240;

/**
   Setup: CSS classes
*/
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    formControl: {
      width: '100%',
      marginBottom: theme.spacing(2)
    },
    iframe: {
      minWidth: '' + MIN_IFRAME_WIDTH,
      minHeight: '' + MIN_IFRAME_WIDTH,
      border: '1px solid ' + theme.palette.grey[700],
      borderRadius: theme.spacing(0.5)
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
      fontWeight: _Theme2.default.typography.fontWeightMedium
    },
    tooltip: {
      marginLeft: theme.spacing(0.25)
    },
    tooltipIconButton: {
      marginTop: theme.spacing(-0.25)
    },
    tooltipPopper: {
      '& > div': {
        padding: theme.spacing(1, 1.5),
        fontSize: '0.85rem',
        fontWeight: 300,
        backgroundColor: theme.palette.grey[800]
      },
      '& a': {
        color: theme.palette.grey[100]
      }
    }
  };
});

var boxShadow = function boxShadow(alpha) {
  return '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,' + alpha + '),0 0 0 1px rgba(0,0,0,0.02)';
};
var YearSlider = (0, _styles.withStyles)({
  root: {
    marginBottom: _Theme2.default.spacing(0)
  },
  rail: {
    height: 5,
    borderRadius: 2
  },
  track: {
    display: 'none'
  },
  mark: {
    height: 16,
    width: 5,
    borderRadius: 2,
    marginTop: -5,
    marginLeft: -2,
    backgroundColor: _Theme2.default.palette.primary.main
  },
  markLabel: {
    marginTop: _Theme2.default.spacing(1)
  },
  thumb: {
    height: _Theme2.default.spacing(3.5),
    width: _Theme2.default.spacing(1.5),
    backgroundColor: _Theme2.default.palette.grey[50],
    boxShadow: boxShadow(0.13),
    border: '2px solid ' + _Theme2.default.palette.primary.main,
    borderRadius: _Theme2.default.spacing(0.5),
    marginTop: _Theme2.default.spacing(-1.5),
    marginLeft: _Theme2.default.spacing(-0.75),
    '&:focus,&:hover,&active': {
      boxShadow: boxShadow(0.3),
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: boxShadow(0.13)
      }
    }
  },
  valueLabel: {
    left: 'initial',
    fontWeight: 600,
    top: -20,
    whiteSpace: 'nowrap',
    '& span': {
      width: 'auto',
      height: 'auto',
      padding: _Theme2.default.spacing(0.5, 1),
      borderRadius: _Theme2.default.spacing(0.5),
      transform: 'none',
      '& span': {
        transform: 'none',
        padding: 0,
        borderRadius: 0
      }
    }
  }
})(_Slider2.default);

/**
   Function: Parse the response from the Visus API from its original shape
   into an object keyed by sites each containing an object keyed by years
   each containing an array of flights. Each flight contains the month and URL.
*/
/* eslint-disable no-param-reassign */
var parseFetchResponse = function parseFetchResponse(response) {
  return response.data.siteCodes.reduce(function (obj, site) {
    obj[site.siteCode] = site.availableMonths.reduce(function (siteObj, yearMonth, idx) {
      var year = parseInt(yearMonth.substr(0, 4), 10);
      var month = yearMonth.substr(5, 2);
      if (!siteObj[year]) {
        siteObj[year] = [];
      }
      siteObj[year].push({
        month: month,
        url: site.availableDataUrls[idx]
      });
      return siteObj;
    }, {});
    return obj;
  }, {});
};
/* eslint-enable no-param-reassign */

/**
   Function: Generate an appropriate height for the iframe given its width.
   Maintain a more square aspect ratio for smaller widths and prefer a 16:9
   ratio for larger widths.
   Known breakpoints for Visus viewer: 675, 900, 1200, 1425
*/
var getIframeHeight = function getIframeHeight(width) {
  var breakpoints = [0, 675, 900, 1200];
  var ratios = ['3:2', '16:9', '2:1', '2.5:1'];
  var breakIdx = breakpoints.reduce(function (acc, breakpoint, idx) {
    return width >= breakpoint ? idx : acc;
  }, 0);
  var ratio = /^([\d.]+):([\d.]+)$/.exec(ratios[breakIdx]);
  var mult = (parseFloat(ratio[2], 10) || 1) / (parseFloat(ratio[1], 10) || 1);
  return Math.floor(width * mult);
};

/**
   Functions to get slider marks and bounds
   Limit slider marks to one per year where the year is the slider value
*/
var getCurrentSliderMarks = function getCurrentSliderMarks(currentYears) {
  return Array.from(new Set(Object.keys(currentYears || {}).sort().map(function (year) {
    return { label: year, value: year };
  })));
};

var getCurrentSliderBounds = function getCurrentSliderBounds(currentYears) {
  var years = Object.keys(currentYears).sort();
  if (years < 2) {
    return null;
  }
  return {
    min: parseInt(years[0], 10) - 1,
    max: parseInt(years[years.length - 1], 10) + 1
  };
};

var getSiteDescription = function getSiteDescription(site) {
  var includeState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (_sites2.default[site]) {
    var state = includeState ? ', ' + _sites2.default[site].stateCode : '';
    return '' + _sites2.default[site].description + state;
  }
  return null;
};

var getDataSetTitle = function getDataSetTitle(selection, data) {
  if (!selection || !data) {
    return '';
  }
  var site = selection.site,
      year = selection.year,
      flight = selection.flight;

  if (!site || !year || !flight) {
    return '';
  }
  var flightIdx = flight - 1;
  if (!data[site] || !data[site][year] || !data[site][year][flightIdx]) {
    return '';
  }
  var parts = {
    site: getSiteDescription(site),
    date: (0, _dateformat2.default)(new Date(year + '-' + data[site][year][flightIdx].month + '-02'), 'mmmm yyyy'),
    flight: 'Flight ' + flight + '/' + data[site][year].length
  };
  return parts.site + ' -- ' + parts.date + ' -- ' + parts.flight;
};

/**
   Main Function
*/
function AopDataViewer(props) {
  var classes = useStyles(_Theme2.default);
  var productCode = props.productCode,
      showTitle = props.showTitle;


  var belowSm = (0, _useMediaQuery2.default)(_Theme2.default.breakpoints.only('xs'));

  /**
     State: data
     Object, keyed by site code and then year, with each year containing an array of flight objects.
  */

  var _useState = (0, _react.useState)({}),
      _useState2 = _slicedToArray(_useState, 2),
      data = _useState2[0],
      setData = _useState2[1];

  /**
     State: iFrame Width
     Keep iFrame width in state to trigger re-renders as necessary on resize, including
     keeping the component at its maximum width at all times and with an appropriate
     aspect ratio given the width.
  */


  var iframeRef = (0, _react.useRef)(null);

  /**
     State: currentSelection
     Object containing current site, year, and flight to show in the iframe
  */
  var initialSite = props.initialSite,
      initialYear = props.initialYear,
      initialFlight = props.initialFlight;

  var initialCurrentSelection = {
    site: initialSite || null,
    year: initialYear || null,
    flight: initialFlight || null,
    sliderMarks: [],
    sliderBounds: { min: 2010, max: 2050 }
  };

  var _useState3 = (0, _react.useState)(initialCurrentSelection),
      _useState4 = _slicedToArray(_useState3, 2),
      currentSelection = _useState4[0],
      setCurrentSelection = _useState4[1];

  var handleSiteChange = (0, _react.useCallback)(function () {
    var site = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (!data || !Object.keys(data).length) {
      return;
    }
    var newSite = site;
    if (site === null) {
      newSite = initialSite || Object.keys(data)[0];
    }
    if (!Object.keys(data[newSite]).length) {
      return;
    }
    var newYear = parseInt(Object.keys(data[newSite]).sort().reverse()[0], 10);
    if (site === null && initialYear && data[newSite][initialYear]) {
      newYear = initialYear;
    }
    if (!data[newSite][newYear].length) {
      return;
    }
    var newFlight = data[newSite][newYear].length;
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
  var handleSliderChange = function handleSliderChange(year) {
    var validYears = Object.keys(data[currentSelection.site]).map(function (y) {
      return parseInt(y, 10);
    });
    if (!year || !validYears.includes(year) || year === currentSelection.year) {
      return;
    }
    var flight = data[currentSelection.site][year].length;
    setCurrentSelection(function (previousCurrentSelection) {
      return _extends({}, previousCurrentSelection, {
        year: year,
        flight: flight
      });
    });
  };
  var handleSliderButtonClick = function handleSliderButtonClick(direction) {
    if (!['next', 'previous'].includes(direction)) {
      return;
    }
    var validYears = Object.keys(data[currentSelection.site]).map(function (y) {
      return parseInt(y, 10);
    });
    var currentYearIdx = validYears.indexOf(currentSelection.year);
    var nudge = direction === 'next' ? 1 : -1;
    var newYear = validYears[currentYearIdx + nudge];
    if (!newYear) {
      return;
    }
    handleSliderChange(newYear);
  };
  var handleFlightChange = function handleFlightChange(flight) {
    if (Number.isNaN(flight) || !data[currentSelection.site][currentSelection.year][flight - 1]) {
      return;
    }
    setCurrentSelection(function (previousCurrentSelection) {
      return _extends({}, previousCurrentSelection, {
        flight: flight
      });
    });
  };
  var getCurrentIframeSrc = function getCurrentIframeSrc() {
    var site = currentSelection.site,
        year = currentSelection.year,
        flight = currentSelection.flight;

    if (!site || !year || !flight) {
      return '';
    }
    var flightIdx = flight - 1;
    if (!data[site] || !data[site][year] || !data[site][year][flightIdx]) {
      return '';
    }
    var currentDataUrl = data[site][year][flightIdx].url;
    var title = encodeURIComponent(getDataSetTitle(currentSelection, data));
    return _NeonEnvironment2.default.getVisusIframeBaseUrl() + '?' + currentDataUrl + '&title=' + title;
  };

  /**
     State: fetchCalled, fetchSucceeded, and fetchFailed
     Booleans for whether the initial data availability fetch has been called,
     whether it has completed (resolved OK or with an error), and whether it failed.
  */

  var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      fetchCalled = _useState6[0],
      setFetchCalled = _useState6[1];

  var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      fetchSucceeded = _useState8[0],
      setFetchSucceeded = _useState8[1];

  var _useState9 = (0, _react.useState)(false),
      _useState10 = _slicedToArray(_useState9, 2),
      fetchFailed = _useState10[0],
      setFetchFailed = _useState10[1];

  /**
     Effect: fetch and parse available data
  */


  var handleFetchProductByCode = (0, _react.useCallback)(function () {
    return _ajax.ajax.getJSON('' + _NeonEnvironment2.default.getVisusProductsBaseUrl() + productCode).pipe((0, _operators.map)(function (response) {
      setData(parseFetchResponse(response));
      setFetchSucceeded(true);
    }), (0, _operators.catchError)(function () {
      setFetchFailed(true);
      return (0, _rxjs.of)('Product not found');
    })).subscribe();
  }, [productCode]);

  (0, _react.useEffect)(function () {
    if (!fetchCalled) {
      handleFetchProductByCode();
      setFetchCalled(true);
    }
    if (fetchSucceeded && (!currentSelection.site || !currentSelection.sliderMarks.length)) {
      handleSiteChange();
    }
  }, [fetchCalled, fetchSucceeded, currentSelection, handleFetchProductByCode, handleSiteChange]);

  var renderSiteSelect = function renderSiteSelect() {
    var sitesByStateName = {};
    Object.keys(data).forEach(function (site) {
      var stateName = _states2.default[_sites2.default[site].stateCode].name;
      if (!sitesByStateName[stateName]) {
        sitesByStateName[stateName] = [];
      }
      sitesByStateName[stateName].push(site);
    });
    var menuItems = Object.keys(sitesByStateName).sort().flatMap(function (stateName) {
      return [_react2.default.createElement(
        _MenuItem2.default,
        {
          key: stateName,
          value: stateName,
          className: classes.optgroup,
          style: { opacity: 1 },
          disabled: true
        },
        stateName
      )].concat(sitesByStateName[stateName].map(function (site) {
        return _react2.default.createElement(
          _MenuItem2.default,
          { key: site, value: site },
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              _Typography2.default,
              { display: 'block' },
              site
            ),
            _react2.default.createElement(
              _Typography2.default,
              { display: 'block', variant: 'caption' },
              getSiteDescription(site, false)
            )
          )
        );
      }));
    });
    return _react2.default.createElement(
      _Select2.default,
      {
        'data-selenium': 'aop-data-viewer.site-select',
        value: currentSelection.site || '',
        onChange: function onChange(event) {
          return handleSiteChange(event.target.value);
        },
        input: _react2.default.createElement(_OutlinedInput2.default, { name: 'site', id: 'site', margin: 'dense' }),
        'aria-labelledby': 'site-label',
        renderValue: function renderValue(value) {
          return value;
        }
      },
      menuItems
    );
  };

  var renderYearSlider = function renderYearSlider() {
    if (!currentSelection.year) {
      return null;
    }
    return _react2.default.createElement(
      'div',
      { style: { width: '100%', display: 'flex', padding: _Theme2.default.spacing(0.25, 0, 2.25, 0) } },
      _react2.default.createElement(
        'div',
        { style: { flexGrow: 0 } },
        _react2.default.createElement(
          _IconButton2.default,
          {
            'data-selenium': 'aop-data-viewer.previous-year-button',
            size: 'small',
            color: 'primary',
            'aria-label': 'previous year',
            style: { marginRight: _Theme2.default.spacing(0.5) },
            onClick: function onClick() {
              return handleSliderButtonClick('previous');
            },
            disabled: currentSelection.year === currentSelection.sliderBounds.min + 1
          },
          _react2.default.createElement(_KeyboardArrowLeft2.default, null)
        )
      ),
      _react2.default.createElement(
        'div',
        { style: { flexGrow: 1 } },
        _react2.default.createElement(YearSlider, {
          'data-selenium': 'aop-data-viewer.year-slider',
          value: currentSelection.year,
          step: null,
          marks: currentSelection.sliderMarks,
          min: currentSelection.sliderBounds.min,
          max: currentSelection.sliderBounds.max,
          'aria-labelledby': 'year-label',
          valueLabelDisplay: 'auto',
          valueLabelFormat: function valueLabelFormat(value) {
            return value;
          },
          onChange: function onChange(event, newYear) {
            return handleSliderChange(parseInt(newYear, 10));
          }
        })
      ),
      _react2.default.createElement(
        'div',
        { style: { flexGrow: 0 } },
        _react2.default.createElement(
          _IconButton2.default,
          {
            'data-selenium': 'aop-data-viewer.next-year-button',
            size: 'small',
            color: 'primary',
            'aria-label': 'next year',
            style: { marginLeft: _Theme2.default.spacing(0.5) },
            onClick: function onClick() {
              return handleSliderButtonClick('next');
            },
            disabled: currentSelection.year === currentSelection.sliderBounds.max - 1
          },
          _react2.default.createElement(_KeyboardArrowRight2.default, null)
        )
      )
    );
  };

  var renderFlightSelect = function renderFlightSelect() {
    var site = currentSelection.site,
        year = currentSelection.year,
        flight = currentSelection.flight;

    if (!flight || !data[site] || !data[site][year] || !data[site][year].length) {
      return null;
    }
    var total = data[site][year].length;
    var getFlightLabel = function getFlightLabel(flightNumber, month) {
      return flightNumber + '/' + total + ' (' + (0, _dateformat2.default)(new Date('2000-' + month + '-02'), 'mmmm') + ')';
    };
    return _react2.default.createElement(
      _Select2.default,
      {
        'data-selenium': 'aop-data-viewer.flight-select',
        value: flight,
        onChange: function onChange(event) {
          return handleFlightChange(parseInt(event.target.value, 10));
        },
        input: _react2.default.createElement(_OutlinedInput2.default, { name: 'flight', id: 'flight', margin: 'dense' }),
        'aria-labelledby': 'flight-label',
        renderValue: function renderValue(value) {
          return getFlightLabel(value, data[site][year][value - 1].month);
        },
        disabled: total === 1
      },
      data[site][year].map(function (f, idx) {
        return _react2.default.createElement(
          _MenuItem2.default,
          { key: '' + f.url, value: idx + 1 },
          getFlightLabel(idx + 1, f.month)
        );
      })
    );
  };

  var renderInputLabel = function renderInputLabel(input) {
    var tooltip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return _react2.default.createElement(
      _Typography2.default,
      { className: classes.label, id: input + '-label' },
      '' + input.substr(0, 1).toUpperCase() + input.substr(1),
      tooltip ? _react2.default.createElement(
        _Tooltip2.default,
        {
          placement: 'right',
          title: tooltip,
          className: classes.tooltip,
          PopperProps: { className: classes.tooltipPopper },
          interactive: true
        },
        _react2.default.createElement(
          _IconButton2.default,
          { size: 'small', className: classes.tooltipIconButton, 'aria-label': tooltip },
          _react2.default.createElement(_InfoOutlined2.default, { fontSize: 'inherit' })
        )
      ) : null
    );
  };

  var tooltips = {
    site: 'All sites available for this product are shown here. Only one site can be viewed at a time.',
    year: 'This slider can be used to move back and forth through time for a given site.',
    flight: 'Most sites are visited once per year, but sometimes subsequent flights are necessary to get complete data for that year. If more than one flight is available for a given site/year then this field can be used to select particular flights of interest.'
  };
  var visusLink = _react2.default.createElement(
    _Link2.default,
    {
      href: 'https://visus.org/',
      target: '_blank',
      'data-external': 'VISUS',
      rel: 'noopener noreferrer'
    },
    'Visus Project at the Univeristy of Utah'
  );
  var renderTopForm = function renderTopForm() {
    return _react2.default.createElement(
      'form',
      { className: classes.root, autoComplete: 'off' },
      _react2.default.createElement(
        _FormControl2.default,
        { className: classes.formControl },
        showTitle ? _react2.default.createElement(
          _Typography2.default,
          { variant: 'h5', gutterBottom: true },
          'AOP Data Viewer'
        ) : null,
        _react2.default.createElement(
          _Typography2.default,
          { variant: 'caption', gutterBottom: true },
          'This viewer allows for interactive exploration of remotely sensed data from the Airborne Observation Platform (AOP). Change the field site and flight for this data product using the tools below to stream different data into view. Pan and zoom in the view to stream higher resolution imagery. This pilot data viewer is provided through a collaboration with the ',
          visusLink,
          ' and more updates are planned for the future.'
        ),
        _react2.default.createElement(_Divider2.default, { className: classes.divider }),
        belowSm ? _react2.default.createElement(
          _react2.default.Fragment,
          null,
          _react2.default.createElement(
            _Grid2.default,
            { container: true, spacing: 2, justify: 'center', style: { marginBottom: _Theme2.default.spacing(1) } },
            _react2.default.createElement(
              _Grid2.default,
              { item: true, xs: 2 },
              renderInputLabel('site', tooltips.site)
            ),
            _react2.default.createElement(
              _Grid2.default,
              { item: true, xs: 10 },
              renderSiteSelect()
            )
          ),
          _react2.default.createElement(
            _Grid2.default,
            { container: true, spacing: 2, justify: 'center', style: { marginBottom: _Theme2.default.spacing(1) } },
            _react2.default.createElement(
              _Grid2.default,
              { item: true, xs: 2 },
              renderInputLabel('year', tooltips.year)
            ),
            _react2.default.createElement(
              _Grid2.default,
              { item: true, xs: 10 },
              renderYearSlider()
            )
          ),
          _react2.default.createElement(
            _Grid2.default,
            { container: true, spacing: 2, justify: 'center', style: { marginBottom: _Theme2.default.spacing(1) } },
            _react2.default.createElement(
              _Grid2.default,
              { item: true, xs: 2 },
              renderInputLabel('flight', tooltips.flight)
            ),
            _react2.default.createElement(
              _Grid2.default,
              { item: true, xs: 10 },
              renderFlightSelect()
            )
          )
        ) : _react2.default.createElement(
          'div',
          { style: { width: '100%', display: 'flex' } },
          _react2.default.createElement(
            'div',
            { style: { flexGrow: 0 } },
            renderInputLabel('site', tooltips.site),
            renderSiteSelect()
          ),
          _react2.default.createElement(
            'div',
            { style: { flexGrow: 1, margin: _Theme2.default.spacing(0, 2) } },
            renderInputLabel('year', tooltips.year),
            renderYearSlider()
          ),
          _react2.default.createElement(
            'div',
            { style: { flexGrow: 0 } },
            renderInputLabel('flight', tooltips.flight),
            renderFlightSelect()
          )
        )
      )
    );
  };

  if (fetchFailed) {
    return _react2.default.createElement(
      'div',
      { className: classes.iframeContainer },
      _react2.default.createElement(_SnackbarContent2.default, {
        style: { backgroundColor: _Theme2.default.palette.error.main },
        message: _react2.default.createElement(
          'span',
          { style: { display: 'flex', alignItems: 'center' } },
          _react2.default.createElement(_Warning2.default, { style: { marginRight: _Theme2.default.spacing(1) } }),
          'AOP Data Viewer is not available for this data product.'
        )
      })
    );
  }

  return _react2.default.createElement(
    _FullWidthVisualization2.default,
    {
      vizRef: iframeRef,
      minWidth: MIN_IFRAME_WIDTH,
      deriveHeightFromWidth: getIframeHeight,
      'data-selenium': 'aop-data-viewer'
    },
    renderTopForm(),
    _react2.default.createElement('iframe', {
      src: getCurrentIframeSrc(),
      title: getDataSetTitle(currentSelection),
      ref: iframeRef,
      scrolling: 'no',
      className: classes.iframe
    })
  );
}

AopDataViewer.propTypes = {
  productCode: _propTypes2.default.string.isRequired,
  showTitle: _propTypes2.default.bool,
  initialSite: _propTypes2.default.string,
  initialYear: _propTypes2.default.number,
  initialFlight: _propTypes2.default.number
};

AopDataViewer.defaultProps = {
  showTitle: true,
  initialSite: null,
  initialYear: null,
  initialFlight: null
};