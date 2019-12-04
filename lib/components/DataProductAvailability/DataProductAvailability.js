'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = DataProductAvailability;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _styles = require('@material-ui/core/styles');

var _useMediaQuery = require('@material-ui/core/useMediaQuery');

var _useMediaQuery2 = _interopRequireDefault(_useMediaQuery);

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

var _FormControl = require('@material-ui/core/FormControl');

var _FormControl2 = _interopRequireDefault(_FormControl);

var _Grid = require('@material-ui/core/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _Hidden = require('@material-ui/core/Hidden');

var _Hidden2 = _interopRequireDefault(_Hidden);

var _MenuItem = require('@material-ui/core/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _OutlinedInput = require('@material-ui/core/OutlinedInput');

var _OutlinedInput2 = _interopRequireDefault(_OutlinedInput);

var _Select = require('@material-ui/core/Select');

var _Select2 = _interopRequireDefault(_Select);

var _ToggleButton = require('@material-ui/lab/ToggleButton');

var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

var _ToggleButtonGroup = require('@material-ui/lab/ToggleButtonGroup');

var _ToggleButtonGroup2 = _interopRequireDefault(_ToggleButtonGroup);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _IconButton = require('@material-ui/core/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _ExpandMore = require('@material-ui/icons/ExpandMore');

var _ExpandMore2 = _interopRequireDefault(_ExpandMore);

var _ExpandLess = require('@material-ui/icons/ExpandLess');

var _ExpandLess2 = _interopRequireDefault(_ExpandLess);

var _pickers = require('@material-ui/pickers');

var _moment = require('@date-io/moment');

var _moment2 = _interopRequireDefault(_moment);

var _moment3 = require('moment');

var _moment4 = _interopRequireDefault(_moment3);

var _AvailabilityGrid = require('./AvailabilityGrid');

var _AvailabilityLegend = require('./AvailabilityLegend');

var _AvailabilityLegend2 = _interopRequireDefault(_AvailabilityLegend);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

var _SiteChip = require('../SiteChip/SiteChip');

var _SiteChip2 = _interopRequireDefault(_SiteChip);

var _FullWidthVisualization = require('../FullWidthVisualization/FullWidthVisualization');

var _FullWidthVisualization2 = _interopRequireDefault(_FullWidthVisualization);

var _DownloadDataContext = require('../DownloadDataContext/DownloadDataContext');

var _DownloadDataContext2 = _interopRequireDefault(_DownloadDataContext);

var _sites = require('../../static/sites/sites.json');

var _sites2 = _interopRequireDefault(_sites);

var _states = require('../../static/states/states.json');

var _states2 = _interopRequireDefault(_states);

var _domains = require('../../static/domains/domains.json');

var _domains2 = _interopRequireDefault(_domains);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
   Setup: Chart y-range values
   All possible sites, states, and domains, independent of product
   **
   Currently loaded from static JSON since API response is
   enormous, containing lots of data we don't need.
   TODO: get this lean data from a GraphQL request
*/


var getYearMonthMoment = function getYearMonthMoment(yearMonth) {
  return (0, _moment4.default)(yearMonth + '-01');
};

/**
   Setup: CSS classes
*/
var svgMinWidth = (_AvailabilityGrid.SVG.CELL_WIDTH + _AvailabilityGrid.SVG.CELL_PADDING) * _AvailabilityGrid.SVG.MIN_CELLS + Math.floor(_AvailabilityGrid.SVG.MIN_CELLS / 12) * _AvailabilityGrid.SVG.YEAR_PADDING;
var svgMinHeight = (_AvailabilityGrid.SVG.CELL_HEIGHT + _AvailabilityGrid.SVG.CELL_PADDING) * (_AvailabilityGrid.SVG.MIN_ROWS + 1);
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    viewButtonGroup: {
      height: theme.spacing(4)
    },
    viewButtonGroupXsmall: {
      height: theme.spacing(3)
    },
    viewButton: {
      height: theme.spacing(4),
      fontWeight: 700,
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      padding: theme.spacing(0, 2),
      whiteSpace: 'nowrap'
    },
    viewButtonXsmall: {
      height: theme.spacing(3),
      fontWeight: 600,
      padding: theme.spacing(0, 1.5)
    },
    // Use !important here to override the Mui-selected class with higher priority
    viewButtonSelected: {
      color: '#fff !important',
      backgroundColor: theme.palette.primary.main + ' !important'
    },
    svg: {
      minWidth: svgMinWidth + 'px',
      minHeight: svgMinHeight + 'px'
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
      '& div': {
        padding: _Theme2.default.spacing(1, 3, 1, 1.5)
      }
    }
  };
});

var useSiteChipStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    deleteIcon: {
      marginLeft: theme.spacing(-0.25)
    }
  };
});

/**
   Main Function
*/
function DataProductAvailability(props) {
  var classes = useStyles(_Theme2.default);
  var siteChipClasses = useSiteChipStyles(_Theme2.default);

  var other = _objectWithoutProperties(props, []);

  var belowSm = (0, _useMediaQuery2.default)(_Theme2.default.breakpoints.down('sm'));

  /**
     State: Views
     Contain and sort the availability data.
     Afford different methods for rolling up data along the y-axis (geospatial)
  */
  var views = {
    summary: {
      view: 'summary',
      name: 'Summary',
      rows: {
        summary: {}
      },
      getLabel: {
        text: function text() {
          return 'ALL ';
        },
        title: function title() {
          return 'All Sites';
        }
      }
    },
    sites: {
      view: 'sites',
      name: 'Site',
      rows: {},
      getLabel: {
        text: function text(key) {
          return key;
        },
        title: function title(key) {
          return _sites2.default[key].description;
        }
      }
    },
    states: {
      view: 'states',
      name: 'State',
      rows: {},
      getLabel: {
        text: function text(key) {
          return ' ' + key + ' ';
        },
        title: function title(key) {
          return _states2.default[key].name;
        }
      }
    },
    domains: {
      view: 'domains',
      name: 'Domain',
      rows: {},
      getLabel: {
        text: function text(key) {
          return key + ' ';
        },
        title: function title(key) {
          return _domains2.default[key].name;
        }
      }
    }
  };
  var viewKeys = Object.keys(views);

  /**
     State: Context-Derived Stuff
  */

  var _DownloadDataContext$ = _DownloadDataContext2.default.useDownloadDataState(),
      _DownloadDataContext$2 = _slicedToArray(_DownloadDataContext$, 2),
      _DownloadDataContext$3 = _DownloadDataContext$2[0],
      downloadContextIsActive = _DownloadDataContext$3.downloadContextIsActive,
      requiredSteps = _DownloadDataContext$3.requiredSteps,
      productData = _DownloadDataContext$3.productData,
      sites = _DownloadDataContext$3.sites,
      dateRange = _DownloadDataContext$3.dateRange,
      contextView = _DownloadDataContext$3.availabilityView,
      selectionExpanded = _DownloadDataContext$3.availabilitySelectionExpanded,
      dispatchSelection = _DownloadDataContext$2[1];

  var selectionEnabled = requiredSteps.some(function (step) {
    return step.key === 'sitesAndDateRange';
  });

  /**
     State: Current View
     Track the current view as local state and feed its initial value from the
     initialView prop. This covers the use case when the availability chart does
     NOT appear inside a Download Data Context. When in a context, however, the
     context overrides the current view as it is keeping track of the broader
     download workflow state.
  */
  var propsView = props.view;

  var initialView = downloadContextIsActive ? contextView : propsView;

  var _useState = (0, _react.useState)(initialView),
      _useState2 = _slicedToArray(_useState, 2),
      currentView = _useState2[0],
      setCurrentView = _useState2[1];

  var setSitesValue = (0, _react.useCallback)(function (sitesValue) {
    return dispatchSelection({
      type: 'setValidatableValue',
      key: 'sites',
      value: sitesValue
    });
  }, [dispatchSelection]);
  var setDateRangeValue = (0, _react.useCallback)(function (dateRangeValue) {
    return dispatchSelection({
      type: 'setValidatableValue',
      key: 'dateRange',
      value: dateRangeValue
    });
  }, [dispatchSelection]);
  var handleSelectAllSites = function handleSelectAllSites() {
    setSitesValue(sites.validValues);
  };
  var handleSelectNoneSites = function handleSelectNoneSites() {
    setSitesValue([]);
  };
  var handleSelectAllDateRange = function handleSelectAllDateRange() {
    setDateRangeValue(dateRange.validValues);
  };
  var handleSelectLatestYearDateRange = function handleSelectLatestYearDateRange() {
    var start = getYearMonthMoment(dateRange.validValues[1]).subtract(11, 'months').format('YYYY-MM');
    setDateRangeValue([start < dateRange.validValues[0] ? dateRange.validValues[0] : start, dateRange.validValues[1]]);
  };
  var handleChangeStartDate = function handleChangeStartDate(newStartDate) {
    setDateRangeValue([newStartDate.format('YYYY-MM'), dateRange.value[1]]);
  };
  var handleChangeEndDate = function handleChangeEndDate(newEndDate) {
    setDateRangeValue([dateRange.value[0], newEndDate.format('YYYY-MM')]);
  };
  var handleToggleSelectionExpanded = function handleToggleSelectionExpanded(currentSelectionExpanded) {
    return dispatchSelection({
      type: 'setAvailabilitySelectionExpanded',
      value: !currentSelectionExpanded
    });
  };
  var handleCurrentView = function handleCurrentView(event, newView) {
    if (!viewKeys.includes(newView) || currentView === newView) {
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

  /**
     Product Data: Map to Views
     Statically loaded in via props or pulled from context.
     Should not change in render lifecycle.
     Create mappings of the shape row => year-month => status for
     all aggregation views.
     TODO: Add other statuses. Currently the only status is "available".
  */
  var siteCodes = void 0;
  if (selectionEnabled) {
    siteCodes = productData.siteCodes;
  } else {
    siteCodes = props.siteCodes;
  }
  siteCodes.forEach(function (site) {
    var siteCode = site.siteCode,
        availableMonths = site.availableMonths;
    var _allSites$siteCode = _sites2.default[siteCode],
        stateCode = _allSites$siteCode.stateCode,
        domainCode = _allSites$siteCode.domainCode;

    if (!selectionEnabled) {
      sites.validValues.push(siteCode);
    }
    views.sites.rows[siteCode] = {};
    views.states.rows[stateCode] = views.states.rows[stateCode] || {};
    views.domains.rows[domainCode] = views.domains.rows[domainCode] || {};
    availableMonths.forEach(function (month) {
      views.summary.rows.summary[month] = 'available';
      views.sites.rows[siteCode][month] = 'available';
      views.states.rows[stateCode][month] = 'available';
      views.domains.rows[domainCode][month] = 'available';
    });
  });
  if (!selectionEnabled) {
    var summaryMonths = Object.keys(views.summary.rows.summary).sort();
    dateRange.validValues[0] = summaryMonths[0]; // eslint-disable-line prefer-destructuring
    dateRange.validValues[1] = summaryMonths.pop();
  }

  /**
     Selection Collapse
  */
  var disableSelectionCollapse = props.disableSelectionCollapse;

  var absoluteSelectionExpanded = selectionExpanded || disableSelectionCollapse;

  /**
     Redraw setup
  */
  var svgRef = (0, _react.useRef)(null);

  var handleSvgRedraw = (0, _react.useCallback)(function () {
    (0, _AvailabilityGrid.AvailabilityGrid)({
      data: views[currentView],
      svgRef: svgRef,
      sites: sites,
      setSitesValue: setSitesValue,
      dateRange: dateRange,
      setDateRangeValue: setDateRangeValue,
      selectionEnabled: selectionEnabled
    });
  }, [svgRef, views, currentView, sites, setSitesValue, dateRange, setDateRangeValue, selectionEnabled]);

  (0, _react.useEffect)(function () {
    handleSvgRedraw();
  }, [handleSvgRedraw]);

  /**
     Render: View Input
  */
  var renderViewOptions = function renderViewOptions() {
    var containerStyle = selectionEnabled ? {
      textAlign: !absoluteSelectionExpanded && !belowSm ? 'right' : 'left'
    } : {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end'
    };
    var title = selectionEnabled ? _react2.default.createElement(
      'div',
      { style: { height: '30px' } },
      _react2.default.createElement(
        _Typography2.default,
        { variant: 'h5', className: classes.h5Small },
        'View Availability By'
      )
    ) : _react2.default.createElement(
      _Typography2.default,
      { variant: 'subtitle1', style: { marginRight: _Theme2.default.spacing(1.5) } },
      'View Availability By:'
    );
    var renderToggleButton = function renderToggleButton(key) {
      var className = classes.viewButton;
      if (!selectionEnabled) {
        className = className + ' ' + classes.viewButtonXsmall;
      }
      if (key === currentView) {
        className = className + ' ' + classes.viewButtonSelected;
      }
      return _react2.default.createElement(
        _ToggleButton2.default,
        { key: key, value: key, size: 'small', className: className },
        views[key].name
      );
    };
    return _react2.default.createElement(
      'div',
      {
        style: containerStyle,
        'data-selenium': 'data-product-availability.view-options'
      },
      title,
      _react2.default.createElement(
        _Hidden2.default,
        { xsDown: true, key: 'viewSmUp' },
        _react2.default.createElement(
          _ToggleButtonGroup2.default,
          {
            exclusive: true,
            color: 'primary',
            variant: 'outlined',
            size: 'small',
            className: selectionEnabled ? classes.viewButtonGroup : classes.viewButtonGroupXsmall,
            value: currentView,
            onChange: handleCurrentView
          },
          viewKeys.map(function (key) {
            return renderToggleButton(key);
          })
        )
      ),
      _react2.default.createElement(
        _Hidden2.default,
        { smUp: true, key: 'viewXs' },
        _react2.default.createElement(
          _FormControl2.default,
          { variant: 'filled' },
          _react2.default.createElement(
            _Select2.default,
            {
              value: currentView,
              onChange: function onChange(event) {
                return handleCurrentView(event, event.target.value);
              },
              input: _react2.default.createElement(_OutlinedInput2.default, { margin: 'dense', className: selectionEnabled ? null : classes.xsSelect }),
              variant: 'filled'
            },
            viewKeys.map(function (key) {
              return _react2.default.createElement(
                _MenuItem2.default,
                { key: key, value: key },
                views[key].name
              );
            })
          )
        )
      )
    );
  };

  /**
     Render: Selection
  */
  var renderSelection = function renderSelection() {
    if (!selectionEnabled) {
      return null;
    }

    var selectionButtonLabel = absoluteSelectionExpanded ? 'hide selection details' : 'show seleciton details';

    var sitesPlural = sites.value.length > 1 ? 's' : '';
    var humanDateRange = getYearMonthMoment(dateRange.value[0]).format('MMM YYYY') + ' - ' + getYearMonthMoment(dateRange.value[1]).format('MMM YYYY');
    var siteChipLabel = absoluteSelectionExpanded ? sites.value.length + ' site' + sitesPlural : sites.value.length + ' site' + sitesPlural + ' \u2014 ' + humanDateRange;
    var divCollapsedStyle = {
      marginBottom: _Theme2.default.spacing(1)
    };
    var divExpandedStyle = {
      marginTop: _Theme2.default.spacing(1),
      marginBottom: _Theme2.default.spacing(1.5)
    };
    var clickProps = disableSelectionCollapse ? {} : {
      onClick: function onClick() {
        return handleToggleSelectionExpanded(selectionExpanded);
      }
    };
    var siteChip = _react2.default.createElement(
      'div',
      { style: absoluteSelectionExpanded ? divExpandedStyle : divCollapsedStyle },
      _react2.default.createElement(_SiteChip2.default, _extends({
        size: absoluteSelectionExpanded ? 'large' : 'medium',
        classes: siteChipClasses,
        label: sites.value.length ? siteChipLabel : 'no sites selected',
        variant: sites.value.length ? 'default' : 'outlined',
        onDelete: sites.value.length ? handleSelectNoneSites : null
      }, clickProps))
    );

    return _react2.default.createElement(
      _react2.default.Fragment,
      null,
      _react2.default.createElement(
        'div',
        {
          className: classes.topFormHeader,
          style: { display: absoluteSelectionExpanded ? 'none' : 'flex' },
          'data-selenium': 'data-product-availability.selection-options'
        },
        _react2.default.createElement(
          _Typography2.default,
          { variant: 'h5', className: classes.h5Small },
          'Selection'
        ),
        _react2.default.createElement(
          _IconButton2.default,
          {
            size: 'small',
            style: { marginLeft: _Theme2.default.spacing(1) },
            title: selectionButtonLabel,
            'aria-label': selectionButtonLabel,
            onClick: function onClick() {
              return handleToggleSelectionExpanded(selectionExpanded);
            }
          },
          _react2.default.createElement(_ExpandMore2.default, null)
        )
      ),
      !absoluteSelectionExpanded ? siteChip : _react2.default.createElement(
        _Grid2.default,
        { container: true, spacing: 3 },
        _react2.default.createElement(
          _Grid2.default,
          { item: true, xs: 12, sm: 6, style: { marginBottom: _Theme2.default.spacing(1) } },
          _react2.default.createElement(
            'div',
            { className: classes.topFormHeader },
            _react2.default.createElement(
              _Typography2.default,
              { variant: 'h6', className: classes.h6Small },
              'Sites'
            ),
            disableSelectionCollapse ? null : _react2.default.createElement(
              _IconButton2.default,
              {
                size: 'small',
                style: { marginLeft: _Theme2.default.spacing(1), paddingBottom: 0 },
                title: selectionButtonLabel,
                'aria-label': selectionButtonLabel,
                onClick: function onClick() {
                  return handleToggleSelectionExpanded(selectionExpanded);
                }
              },
              _react2.default.createElement(_ExpandLess2.default, null)
            )
          ),
          siteChip,
          _react2.default.createElement(
            'div',
            { style: { display: 'flex' } },
            _react2.default.createElement(
              _Button2.default,
              {
                'data-selenium': 'data-product-availability.select-all-sites-button',
                size: 'small',
                color: 'primary',
                variant: 'outlined',
                onClick: handleSelectAllSites
              },
              'Select All Sites'
            ),
            _react2.default.createElement(
              _Button2.default,
              {
                'data-selenium': 'data-product-availability.browse-sites-button',
                size: 'small',
                color: 'primary',
                variant: 'outlined',
                style: { marginLeft: _Theme2.default.spacing(1), display: 'none' },
                disabled: true
              },
              'Browse Sites\u2026'
            )
          )
        ),
        _react2.default.createElement(
          _Grid2.default,
          { item: true, xs: 12, sm: 6, style: { marginBottom: _Theme2.default.spacing(1) } },
          _react2.default.createElement(
            _Typography2.default,
            { variant: 'h6', className: classes.h6Small },
            'Date Range'
          ),
          _react2.default.createElement(
            _pickers.MuiPickersUtilsProvider,
            { utils: _moment2.default },
            _react2.default.createElement(
              'div',
              { style: { display: 'flex', flexWrap: 'nowrap' } },
              _react2.default.createElement(_pickers.DatePicker, {
                'data-selenium': 'data-product-availability.date-range-start',
                inputVariant: 'outlined',
                margin: 'dense',
                value: getYearMonthMoment(dateRange.value[0]),
                onChange: function onChange(newDate) {
                  return handleChangeStartDate(newDate);
                },
                views: ['month', 'year'],
                label: 'Start',
                openTo: 'month',
                minDate: getYearMonthMoment(dateRange.validValues[0]),
                maxDate: getYearMonthMoment(dateRange.value[1]),
                style: { marginRight: _Theme2.default.spacing(1.5) }
              }),
              _react2.default.createElement(_pickers.DatePicker, {
                'data-selenium': 'data-product-availability.date-range-end',
                inputVariant: 'outlined',
                margin: 'dense',
                value: getYearMonthMoment(dateRange.value[1]),
                onChange: function onChange(newDate) {
                  return handleChangeEndDate(newDate);
                },
                views: ['month', 'year'],
                label: 'End',
                openTo: 'month',
                minDate: getYearMonthMoment(dateRange.value[0]),
                maxDate: getYearMonthMoment(dateRange.validValues[1])
              })
            )
          ),
          _react2.default.createElement(
            'div',
            { style: { display: 'flex', marginTop: _Theme2.default.spacing(1) } },
            _react2.default.createElement(
              _Button2.default,
              {
                'data-selenium': 'data-product-availability.all-years-button',
                size: 'small',
                color: 'primary',
                variant: 'outlined',
                onClick: handleSelectAllDateRange
              },
              'Select All Years'
            ),
            _react2.default.createElement(
              _Button2.default,
              {
                'data-selenium': 'data-product-availability.latest-year-button',
                size: 'small',
                color: 'primary',
                variant: 'outlined',
                onClick: handleSelectLatestYearDateRange,
                style: { marginLeft: _Theme2.default.spacing(1) }
              },
              'Select Latest Year'
            )
          )
        )
      )
    );
  };

  /**
     Render: Final Component
  */
  var currentRows = views[currentView].rows;
  var currentRowCount = Object.keys(currentRows).length;
  var svgHeight = _AvailabilityGrid.SVG.CELL_PADDING + (_AvailabilityGrid.SVG.CELL_HEIGHT + _AvailabilityGrid.SVG.CELL_PADDING) * (currentRowCount + 1);
  var selectionSm = absoluteSelectionExpanded ? 12 : 6;
  return _react2.default.createElement(
    _FullWidthVisualization2.default,
    _extends({
      vizRef: svgRef,
      minWidth: svgMinWidth,
      handleRedraw: handleSvgRedraw,
      'data-selenium': 'data-product-availability'
    }, other),
    _react2.default.createElement(
      _Grid2.default,
      { container: true, spacing: 2, style: { marginBottom: _Theme2.default.spacing(1) } },
      selectionEnabled ? _react2.default.createElement(
        _Grid2.default,
        { item: true, xs: 12, sm: selectionSm },
        renderSelection()
      ) : null,
      _react2.default.createElement(
        _Grid2.default,
        { item: true, xs: 12, sm: selectionEnabled ? selectionSm : 12 },
        renderViewOptions()
      )
    ),
    _react2.default.createElement('svg', {
      id: (0, _lodash.uniqueId)('dpa-'),
      ref: svgRef,
      height: svgHeight,
      className: classes.svg
    }),
    _react2.default.createElement(_AvailabilityLegend2.default, { selectionEnabled: selectionEnabled })
  );
}

DataProductAvailability.propTypes = {
  siteCodes: _propTypes2.default.arrayOf( // eslint-disable-line react/no-unused-prop-types
  _propTypes2.default.shape({
    siteCode: _propTypes2.default.string.isRequired,
    availableMonths: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired
  })),
  view: _propTypes2.default.oneOf(['summary', 'sites', 'states', 'domains']),
  disableSelectionCollapse: _propTypes2.default.bool
};

DataProductAvailability.defaultProps = {
  siteCodes: [],
  view: 'summary',
  disableSelectionCollapse: false
};