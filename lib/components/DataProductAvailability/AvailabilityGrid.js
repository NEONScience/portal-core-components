"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AvailabilityGrid = AvailabilityGrid;
exports.yearMonths = exports.SVG = void 0;

var _lodash = require("lodash");

var _d3Selection = require("d3-selection");

var _d3Transition = require("d3-transition");

var _d3Drag = require("d3-drag");

var _Theme = _interopRequireWildcard(require("../Theme/Theme"));

var _sites = _interopRequireDefault(require("../../static/sites/sites.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
   Setup: Static site/domain/state data
   Create mappings of all sites for given state or domain
   to aid in showing partial vs. full selections
*/
var siteViewMaps = {
  domains: {},
  states: {}
};
Object.keys(_sites.default).forEach(function (site) {
  var domain = _sites.default[site].domainCode;

  if (!siteViewMaps.domains[domain]) {
    siteViewMaps.domains[domain] = [];
  }

  siteViewMaps.domains[domain].push(site);
  var state = _sites.default[site].stateCode;

  if (!siteViewMaps.states[state]) {
    siteViewMaps.states[state] = [];
  }

  siteViewMaps.states[state].push(site);
});
/**
   Setup: SVG display constants
*/

var SVG = {
  MIN_ROWS: 1,
  MIN_CELLS: 12,
  CELL_WIDTH: 7,
  CELL_HEIGHT: 12,
  CELL_PADDING: 4,
  YEAR_PADDING: 21,
  END_PADDING: 10,
  CELL_RX: 1,
  LABEL_FONT_SIZE: 13,
  GROUPED_LABEL_WIDTH: 37,
  UNGROUPED_LABEL_WIDTH: 93,
  DATE_RANGE_HANDLE_WIDTH: 4,
  DATE_RANGE_MASK_WIDTH: 24
}; // This gets used a lot!

exports.SVG = SVG;
var halfCellPad = SVG.CELL_PADDING / 2;
/**
   Setup: Chart x-range values
   All possible year-months ("YYYY-MM" strings) from a fixed start
   year to a fixed margin into the future from right now
*/

var startYear = 2010;
var endYear = new Date().getFullYear() + 1;
var minYearMonth = "".concat(startYear, "-01");
var maxYearMonth = "".concat(endYear, "-12");
var years = Array(endYear - startYear + 1).fill(0).map(function (val, idx) {
  return startYear + idx;
});
var months = Array(12).fill(0).map(function (val, idx) {
  return (idx + 1).toString().padStart(2, '0');
});
var yearMonths = years.flatMap(function (year) {
  return months.map(function (month) {
    return "".concat(year, "-").concat(month);
  });
});
exports.yearMonths = yearMonths;
var yearMonthWidth = SVG.CELL_WIDTH + SVG.CELL_PADDING;
var yearWidth = yearMonthWidth * 12 - SVG.CELL_PADDING;
var absMaxDataWidth = 2 * SVG.END_PADDING + years.length * yearWidth + (years.length - 1) * SVG.YEAR_PADDING;
/**
   Setup: Style object literals
   We can't use makeStyles to make classes for these on the fly as only
   react components can do that. Most of these styles also make use of
   variables to be built dynamically (Theme and SVG). Our stop-gap is
   to define them as if we're generating dynamic CSS classes using
   makeStyles but instead apply them using a custom function to add
   them in-line to the style attribute for a given DOM element.
*/

var styles = {
  rowLabel: {
    textAnchor: 'end',
    whiteSpace: 'pre',
    fontFamily: '"Cutive Mono","Lucida Console",Monaco,monospace',
    fontWeight: 400,
    fontSize: "".concat(SVG.LABEL_FONT_SIZE, "px")
  },
  rowLabelMask: {
    fill: 'transparent',
    cursor: 'pointer',
    outline: 'none'
  },
  timeDivider: {
    stroke: _Theme.default.palette.grey[400],
    strokeDasharray: 3,
    strokeWidth: '1.2px'
  },
  timeBound: {
    stroke: _Theme.default.palette.grey[700],
    strokeWidth: '2px'
  },
  timeLabel: {
    fill: _Theme.default.palette.grey[700],
    textAnchor: 'middle',
    fontFamily: '"Cutive Mono","Lucida Console",Monaco,monospace',
    fontWeight: 400,
    fontSize: "".concat(SVG.LABEL_FONT_SIZE, "px")
  },
  timeHighlight: {
    fill: _Theme.COLORS.ORANGE[400],
    stroke: _Theme.COLORS.ORANGE[700],
    strokeWidth: '1px',
    opacity: 0
  },
  timeHighlightHover: {
    opacity: 0.3
  },
  timeHighlightDrag: {
    opacity: 0.5
  },
  timeHighlightMask: {
    fill: 'transparent',
    cursor: 'grab',
    outline: 'none'
  }
};
/**
   Function: applyStyles
   Parse an object literal style definition into d3 selection.style()
   calls to apply styles defined in the styles object literal to a node
*/

var applyStyles = function applyStyles(node, styleName) {
  if (!styles[styleName]) {
    return;
  }

  Object.keys(styles[styleName]).forEach(function (key) {
    var style = key.replace(/([A-Z]){1}/g, function (v) {
      return "-".concat(v.toLowerCase());
    });
    node.style(style, styles[styleName][key]);
  });
};
/**
   Function: touchRipple
   For click interactions pass a d3 selection in and the fill will transition
   from an "active" semi-transparent orange color to near-transparent. We don't go
   full transparent as the ripple is typically followed by a delayed state update
   that will trigger a rerender and thus a full style reset.
*/


var touchRipple = function touchRipple(selection) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
  selection.style('fill', 'rgba(199, 110, 0, 0.75)').transition((0, _d3Transition.transition)().duration(duration)).style('fill', 'rgba(199, 110, 0, 0.25)');
};
/**
 * AvailabilityGrid generator function
 * @param {object} config - all arguments, see below:
 * * @param {object} svgRef Pointer to an <svg> element generated by useRef()
 * * @param {object} data View object containing name, rows, and getLabel functions
 * * @param {object} sites
 * * * @param {array} value Array of site code strings to show as selected
 * * * @param {array} validValues Array of site code strings known to have some data
 *         in the data set. This is only superfluous when the view is "site". Otherwise,
 *         for example, clicking the summary view row has no way of knowing the specific
 *         sites that actually apply when "selecting all" for this particular product
 * * @param {function} setSitesValue Setter from useState hook defined in
 *       parent to set state for sites
 * * @param {object} dateRange
 * * * @param {array} value Array of exactly two "YYYY-MM" strings
 * * * @param {array} validValues Array of exactly two "YYYY-MM" strings
 *       representing the limits of available / selectable data for the product
 * * @param {function} setDateRangeValue Setter from useState hook defined in
 *       parent to set state for dateRange
 * * @param {boolean} selectionEnabled Whether to hook up interactions to allow
 *       user selection of sites
 */


function AvailabilityGrid(config) {
  /**
     Extract Config
  */
  var svgRef = config.svgRef,
      data = config.data,
      _config$sites = config.sites,
      sites = _config$sites === void 0 ? {
    value: [],
    validValues: []
  } : _config$sites,
      _config$sortedSites = config.sortedSites,
      sortedSites = _config$sortedSites === void 0 ? [] : _config$sortedSites,
      _config$setSitesValue = config.setSitesValue,
      setSitesValue = _config$setSitesValue === void 0 ? function () {} : _config$setSitesValue,
      _config$dateRange = config.dateRange,
      dateRange = _config$dateRange === void 0 ? {
    value: [],
    validValues: [minYearMonth, maxYearMonth]
  } : _config$dateRange,
      _config$setDateRangeV = config.setDateRangeValue,
      setDateRangeValue = _config$setDateRangeV === void 0 ? function () {} : _config$setDateRangeV,
      _config$selectionEnab = config.selectionEnabled,
      selectionEnabled = _config$selectionEnab === void 0 ? true : _config$selectionEnab;
  /**
     Sanity Check: svgRef must be a valid ref
  */

  if (!svgRef || !svgRef.current) {
    return null;
  }
  /**
     Sanity Check: data must exist and have rows
  */


  if (!data || !data.rows) {
    return null;
  }
  /**
     Setup: Inputs and Base Values
  */


  var svg = (0, _d3Selection.select)(svgRef.current);
  var svgId = svg.attr('id');
  var svgWidth = parseFloat(svg.attr('width'));
  var svgHeight = parseFloat(svg.attr('height'));
  var rowKeys = sortedSites.length ? sortedSites : Object.keys(data.rows).sort().reverse();
  var rowCount = rowKeys.length;
  /**
     Setup: Interaction state vars (local vars is all we need here)
  */

  var rowHoverKey = null;
  var draggingCells = false;
  /* eslint-disable no-unused-vars */

  var dateRangeHoverKey = null;
  var draggingDateRange = [{
    dragging: false,
    centerDragX: 0
  }, {
    dragging: false,
    centerDragX: 0
  }];
  /* eslint-enable no-unused-vars */

  /**
     Functions to filter yearMonths and years to only what's in view
     given the current dragOffset and the clip width. We use this to
     feed data to d3 selections in order to only draw what will actually
     be visible.
  */

  var getLabelWidth = function getLabelWidth() {
    return data.view === 'ungrouped' ? SVG.UNGROUPED_LABEL_WIDTH : SVG.GROUPED_LABEL_WIDTH;
  };

  var getMinTimeOffset = function getMinTimeOffset() {
    return 0 - (absMaxDataWidth - (svgWidth - getLabelWidth()));
  };

  var getYearStartX = function getYearStartX(year) {
    var intYear = parseInt(year, 10);
    return getLabelWidth() + SVG.END_PADDING + years.indexOf(intYear) * yearWidth + years.indexOf(intYear) * SVG.YEAR_PADDING;
  };

  var getYearCenterX = function getYearCenterX(year) {
    return getYearStartX(year) + yearWidth / 2;
  };

  var getYearMonthStartX = function getYearMonthStartX(yearMonth) {
    var year = parseInt(yearMonth.substr(0, 4), 10);
    var month = parseInt(yearMonth.substr(5, 2), 10);
    var yearIdx = years.indexOf(year);

    if (yearIdx === -1 || month < 1 || month > 12) {
      return 0;
    }

    return getYearStartX(year) + (month - 1) * yearMonthWidth;
  };

  var getYearMonthsInView = function getYearMonthsInView(totalSvgWidth, dragOffset) {
    return yearMonths.filter(function (yearMonth) {
      var tX = getYearMonthStartX(yearMonth) + dragOffset;
      var margin = yearMonthWidth * 4;
      var lower = Math.max(0, getLabelWidth() - margin);
      var upper = totalSvgWidth + margin;
      return tX > lower && tX + yearMonthWidth < upper;
    });
  };

  var getYearsInView = function getYearsInView(totalSvgWidth, dragOffset) {
    return years.filter(function (year) {
      var tX = getYearStartX(year) + dragOffset;
      var lower = -2 * yearWidth;
      var upper = totalSvgWidth - getLabelWidth() + 2 * yearWidth;
      return tX > lower && tX + yearWidth < upper;
    });
  };
  /**
     Function to generate the "initial" time offset for first load. By default we may extend the
     viewable time range well beyond available data (e.g. if there is no data this year the chart
     should still show dates for this year so it's not ambiguous). This function aims to generate
     an ideal time offset that will put the latest month with availability in view and close to the
     right edge, but also keeping full year labels in view (why we target 8 months of the latest
     year... the right number of months so the year label is not cut off even if the year is empty)
  */


  var getInitialTimeOffset = function getInitialTimeOffset() {
    var minTimeOffset = getMinTimeOffset();

    if (!data || !data.rows) {
      return minTimeOffset;
    }

    var availableMonths = [];

    if (data.rows.summary) {
      availableMonths = Object.keys(data.rows.summary);
    } else {
      var availableMonthsSet = new Set();
      Object.keys(data.rows).forEach(function (rowKey) {
        Object.keys(data.rows[rowKey]).forEach(availableMonthsSet.add, availableMonthsSet);
      });
      availableMonths = Array.from(availableMonthsSet.values());
    }

    if (!availableMonths.length) {
      return minTimeOffset;
    }

    availableMonths.sort();
    var latestAvailableYearMonth = availableMonths[availableMonths.length - 1];
    var latestAvailableYearInt = parseInt(latestAvailableYearMonth.substr(0, 4), 10);
    var latestAvailableMonthInt = parseInt(latestAvailableYearMonth.substr(5, 2), 10);
    var finalMonth = latestAvailableMonthInt <= 6 ? "".concat(latestAvailableYearInt, "-08") : "".concat(latestAvailableYearInt + 1, "-08");
    return Math.max(0 - getYearMonthStartX(finalMonth) - yearMonthWidth + svgWidth, minTimeOffset);
  };
  /**
     Functions to get a translate() string for a data row by index
     in the sorted rowKeys array
  */


  var getRowY = function getRowY(idx) {
    return SVG.CELL_PADDING + (rowCount - idx) * (SVG.CELL_HEIGHT + SVG.CELL_PADDING);
  };

  var getRowTranslation = function getRowTranslation(d, idx) {
    return "translate(0,".concat(getRowY(idx), ")");
  };
  /**
     Main SVG Structure
     (Layered groups, clip definition, etc.)
  */


  svg.selectAll('*').remove();
  var clipWidth = svgWidth - getLabelWidth();
  var defs = svg.append('defs');
  var labelSelectionsG = svg.append('g').attr('class', 'labelSelectionsG');
  var clipPath = defs.append('clipPath').attr('id', "".concat(svgId, "-clip"));
  clipPath.append('rect').attr('x', getLabelWidth()).attr('y', 0).attr('width', clipWidth).attr('height', svgHeight);
  var clipG = svg.append('g').attr('class', 'clipG').attr('clip-path', "url(#".concat(svgId, "-clip)"));
  var dragG = clipG.append('g').attr('class', 'dragG');
  var rowSelectionsG = dragG.append('g').attr('class', 'rowSelectionsG');
  var dragContentG = dragG.append('g').attr('class', 'dragContentG');
  /**
     Time offset values and functions
     Setting the time offset (by interacting with the drag group) must
     be sensitive to the previous time offset in the event of a resize
     (e.g. if the time offset is already at the minimum but the minimum
     has changed, prefer it stays at the minimum). Also keep the offset
     bounded within where there's actually data to show.
  */

  var prevMinTimeOffset = getMinTimeOffset();

  if (svg.attr('data-prevMinTimeOffset') === null) {
    svg.attr('data-prevMinTimeOffset', getMinTimeOffset());
  } else {
    prevMinTimeOffset = parseFloat(svg.attr('data-prevMinTimeOffset'));
  }

  var getTimeOffset = function getTimeOffset() {
    var minTimeOffset = getMinTimeOffset();
    var currentTimeOffset = parseFloat(svg.attr('data-timeOffset')) || 0;

    if (currentTimeOffset === prevMinTimeOffset && prevMinTimeOffset !== minTimeOffset) {
      currentTimeOffset = minTimeOffset;
      prevMinTimeOffset = minTimeOffset;
      svg.attr('data-prevMinTimeOffset', minTimeOffset);
    }

    return currentTimeOffset;
  };

  var setTimeOffset = function setTimeOffset(timeOffset) {
    var boundedTimeOffset = Math.min(Math.max(getMinTimeOffset(), timeOffset), 0);
    dragG.attr('transform', "translate(".concat(boundedTimeOffset, ",0)"));
    svg.attr('data-timeOffset', boundedTimeOffset);
  }; // Set timeOffset the first time. It's preserved through state updates
  // but we still send its value through the setter to stay within bounds.


  if (svg.attr('data-timeOffset') === null) {
    setTimeOffset(getInitialTimeOffset());
  } else {
    setTimeOffset(svg.attr('data-timeOffset'));
  }
  /**
     Setup: Functions to translate yearMonth gutter centers to pixel offsets and back,
     and other helpers for giving the date range drag handles a snappy feel
  */
  // Get the center of the gutter on either side of a given yearMonth INSIDE the clip.
  // To translate the value to pixels OUTSIDE the clip add the time offset, e.g.:
  //   getYearMonthGutterX('YYYY-MM') + getTimeOffset();


  var getYearMonthGutterX = function getYearMonthGutterX(yearMonth) {
    var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'left';

    switch (side) {
      case 'left':
        if (yearMonth === minYearMonth) {
          return getLabelWidth();
        }

        if (yearMonth.substr(5, 2) === '01') {
          return getYearStartX(yearMonth.substr(0, 4)) - SVG.YEAR_PADDING / 2;
        }

        return getYearMonthStartX(yearMonth) - halfCellPad;

      case 'right':
        if (yearMonth === maxYearMonth) {
          return svgWidth - getTimeOffset();
        }

        if (yearMonth.substr(5, 2) === '12') {
          return getYearStartX(yearMonth.substr(0, 4)) + yearWidth + SVG.YEAR_PADDING / 2;
        }

        return getYearMonthStartX(yearMonth) + SVG.CELL_WIDTH + halfCellPad;

      default:
        return getYearMonthStartX(yearMonth) - halfCellPad;
    }
  }; // Get the yearMonth string that's next to a given yearMonth on either side.
  // Stays within the selectable range unless selectable is false, in which case
  // is stays within the chart's global min and max.


  var getAdjacentYearMonth = function getAdjacentYearMonth(yearMonth) {
    var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'left';
    var selectable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var year = parseInt(yearMonth.substr(0, 4), 10);
    var month = parseInt(yearMonth.substr(5, 2), 10);
    var bounds = selectable ? dateRange.validValues : [minYearMonth, maxYearMonth];
    var adjacent = yearMonth;

    switch (side) {
      case 'left':
        if (month === 1) {
          adjacent = "".concat(year - 1, "-12");
        } else {
          adjacent = "".concat(year, "-").concat((month - 1).toString().padStart(2, '0'));
        }

        return adjacent < bounds[0] ? bounds[0] : adjacent;

      case 'right':
        if (month === 12) {
          adjacent = "".concat(year + 1, "-01");
        } else {
          adjacent = "".concat(year, "-").concat((month + 1).toString().padStart(2, '0'));
        }

        return adjacent > bounds[1] ? bounds[1] : adjacent;

      default:
        return adjacent;
    }
  };
  /**
     SVG: Row Hover
   */


  var rowHover = svg.append('rect').attr('class', 'rowHover');
  rowHover.attr('x', 1).attr('y', -2 * SVG.CELL_HEIGHT).attr('width', svgWidth - 1).attr('height', SVG.CELL_HEIGHT + SVG.CELL_PADDING).attr('fill', 'none').attr('stroke', _Theme.COLORS.SECONDARY_BLUE[700]).attr('stroke-width', '1.5px').style('opacity', 0);
  /**
     SVG: Left and Right bounds
  */

  var lboundOffset = getLabelWidth() + halfCellPad - 1;
  var lbound = svg.append('line');
  lbound.attr('x1', lboundOffset).attr('y1', 0).attr('x2', lboundOffset).attr('y2', svgHeight);
  applyStyles(lbound, 'timeBound');
  var rboundOffset = svgWidth - 1;
  var rbound = svg.append('line');
  rbound.attr('x1', rboundOffset).attr('y1', 0).attr('x2', rboundOffset).attr('y2', svgHeight);
  applyStyles(rbound, 'timeBound');
  /**
     SVG: Selections
     Create a mapping of current view keys (sites, domains, states, etc.)
     to selected status (i.e. 'full' or 'partial')
  */

  var viewSelections = {};
  var sitesSet = new Set(sites.value);
  var validSitesSet = new Set(sites.validValues);

  if (sites.value.length) {
    switch (data.view) {
      case 'summary':
        viewSelections.summary = sites.value.length === sites.validValues.length ? 'full' : 'partial';
        break;

      case 'sites':
        sites.value.forEach(function (site) {
          viewSelections[site] = 'full';
        });
        break;

      default:
        // domains, states
        Object.keys(siteViewMaps[data.view]).forEach(function (entry) {
          var viewSites = new Set(siteViewMaps[data.view][entry].filter(function (s) {
            return validSitesSet.has(s);
          }));
          var intersection = new Set(_toConsumableArray(viewSites).filter(function (s) {
            return sitesSet.has(s);
          }));

          if (!intersection.size) {
            return;
          }

          viewSelections[entry] = intersection.size === viewSites.size ? 'full' : 'partial';
        });
        break;
    }
  }

  var toggleSelection = function toggleSelection(key) {
    var allSitesForKey = new Set();

    switch (data.view) {
      case 'summary':
        allSitesForKey = new Set(sites.validValues);
        break;

      case 'sites':
        allSitesForKey = new Set([key]);
        break;

      default:
        // domains, states
        allSitesForKey = new Set(siteViewMaps[data.view][key].filter(function (s) {
          return validSitesSet.has(s);
        }));
        break;
    }

    var newSelectedSitesSet;

    if (!viewSelections[key] || viewSelections[key] === 'partial') {
      // select all sites for this key
      newSelectedSitesSet = new Set([].concat(_toConsumableArray(sitesSet), _toConsumableArray(allSitesForKey)));
    } else {
      // deselect all sites for this key
      newSelectedSitesSet = new Set(_toConsumableArray(sitesSet).filter(function (s) {
        return !allSitesForKey.has(s);
      }));
    }

    setSitesValue(_toConsumableArray(newSelectedSitesSet));
  };

  var rowHighlightReset = (0, _lodash.debounce)(function () {
    var clearRowHoverKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (clearRowHoverKey) {
      rowHoverKey = null;
    }

    rowHover.style('opacity', 0);
    rowHover.attr('y', -2 * SVG.CELL_HEIGHT);
  }, 100);

  var rowHighlightHover = function rowHighlightHover(key) {
    rowHoverKey = key;
    var offset = rowKeys.indexOf(key);

    if (offset !== -1 && !draggingCells) {
      rowHighlightReset.cancel();
      var y = halfCellPad + (rowCount - offset) * (SVG.CELL_HEIGHT + SVG.CELL_PADDING);
      rowHover.style('opacity', 1);
      rowHover.attr('y', y);
    }
  };
  /**
     SVG: Row Labels
  */


  var rowLabelsG = svg.append('g').attr('class', 'rowLabelsG');
  rowKeys.forEach(function (rowKey, rowIdx) {
    var transform = getRowTranslation(rowKey, rowIdx);
    var labelX = getLabelWidth() - SVG.CELL_PADDING;
    var rowLabelG = rowLabelsG.append('g').attr('transform', transform);
    var fill = viewSelections[rowKey] ? _Theme.default.palette.secondary.contrastText : _Theme.default.palette.grey[700];
    var text = rowLabelG.append('text').attr('x', labelX).attr('y', SVG.LABEL_FONT_SIZE - SVG.CELL_PADDING).attr('fill', fill).text(data.getLabel.text(rowKey));
    applyStyles(text, 'rowLabel');
    var mask = rowLabelG.append('rect').attr('x', 0).attr('y', -1 * halfCellPad).attr('width', getLabelWidth()).attr('height', SVG.CELL_HEIGHT + SVG.CELL_PADDING).on('mouseover', function () {
      return rowHighlightHover(rowKey);
    }).on('focus', function () {
      return rowHighlightHover(rowKey);
    }).on('mouseout', rowHighlightReset).on('blur', rowHighlightReset);
    applyStyles(mask, 'rowLabelMask'); // Fill the mask and delay the selection to emulate a touch ripple.
    // Re-render to show the selection will reset the style.

    var maskClick = selectionEnabled ? function () {
      touchRipple(mask, 15);
      setTimeout(function () {
        return toggleSelection(rowKey);
      }, 15);
    } : function () {};
    mask.on('click', maskClick);
    mask.append('svg:title').text(data.getLabel.title(rowKey));
  });
  /**
     SVG: Time Axis
  */

  var timeAxis = {};
  timeAxis.g = dragContentG.append('g').attr('class', 'timeAxisG');
  timeAxis.highlight = timeAxis.g.append('rect').attr('class', 'timeAxisHighlight');
  timeAxis.innerG = timeAxis.g.append('g').attr('class', 'timeAxisInnerG');
  timeAxis.mask = clipG.append('rect').attr('class', 'timeAxisMask');

  var redrawTimeAxis = function redrawTimeAxis() {
    if (timeAxis.innerG.selectAll('*').empty()) {
      timeAxis.highlight.attr('x', getLabelWidth()).attr('y', 0).attr('width', absMaxDataWidth).attr('height', SVG.CELL_HEIGHT + 1.5 * SVG.CELL_PADDING);
      applyStyles(timeAxis.highlight, 'timeHighlight');
      timeAxis.mask.attr('x', getLabelWidth()).attr('y', 0).attr('width', absMaxDataWidth).attr('height', SVG.CELL_HEIGHT + SVG.CELL_PADDING);
      applyStyles(timeAxis.mask, 'timeHighlightMask');
    }

    timeAxis.innerG.selectAll('text').data(function () {
      return getYearsInView(svgWidth, getTimeOffset());
    }).join('text').attr('x', function (year) {
      return getYearCenterX(year);
    }).attr('y', SVG.LABEL_FONT_SIZE - halfCellPad).text(function (year) {
      return year;
    }).each(function (year, idx, labelNodes) {
      applyStyles((0, _d3Selection.select)(labelNodes[idx]), 'timeLabel');
    });
    timeAxis.innerG.selectAll('line').data(function () {
      var lineYears = getYearsInView(svgWidth, getTimeOffset());
      return lineYears[0] === startYear ? lineYears.slice(1) : lineYears;
    }).join('line').attr('x1', function (year) {
      return getYearStartX(year) - SVG.YEAR_PADDING / 2;
    }).attr('y1', 0).attr('x2', function (year) {
      return getYearStartX(year) - SVG.YEAR_PADDING / 2;
    }).attr('y2', svgHeight).each(function (year, idx, lineNodes) {
      applyStyles((0, _d3Selection.select)(lineNodes[idx]), 'timeDivider');
    });
  };
  /**
     SVG: Row Data
  */


  var dataG = dragContentG.append('g').attr('class', 'dataG');
  var dataMasksG = svg.append('g').attr('class', 'dataMasksG');

  var redrawData = function redrawData() {
    // Click/drag masks
    dataMasksG.selectAll('rect').data(rowKeys).join('rect').attr('x', getLabelWidth()).attr('y', function (d, idx) {
      return halfCellPad + (rowCount - idx) * (SVG.CELL_HEIGHT + SVG.CELL_PADDING);
    }).attr('width', svgWidth - getLabelWidth()).attr('height', SVG.CELL_HEIGHT + SVG.CELL_PADDING).attr('fill', 'transparent').style('cursor', selectionEnabled ? 'pointer' : 'grab').style('outline', 'none').on('mouseover', rowHighlightHover).on('focus', rowHighlightHover).on('mouseout', rowHighlightReset).on('blur', rowHighlightReset).on('click', selectionEnabled ? function (rowKey, idx, nodes) {
      touchRipple((0, _d3Selection.select)(nodes[idx]), 15);
      setTimeout(function () {
        return toggleSelection(rowKey);
      }, 15);
    } : function () {}); // Cells

    dataG.selectAll('g').data(rowKeys).join('g').attr('transform', getRowTranslation).each(function (rowKey, rowIdx, gNodes) {
      var rowData = data.rows[rowKey];
      (0, _d3Selection.select)(gNodes[rowIdx]).selectAll('rect').data(function () {
        return getYearMonthsInView(svgWidth, getTimeOffset());
      }).join('rect').attr('x', function (yearMonth) {
        return getYearMonthStartX(yearMonth);
      }).attr('y', 0).attr('width', "".concat(SVG.CELL_WIDTH, "px")).attr('height', "".concat(SVG.CELL_HEIGHT, "px")).attr('rx', "".concat(SVG.CELL_RX, "px")).attr('cursor', 'pointer').attr('fill', function (d) {
        switch (rowData[d]) {
          case 'available':
            return _Theme.default.palette.primary.main;

          default:
            return _Theme.default.palette.grey[100];
        }
      });
    });
  };
  /**
     SVG: Date Range Handles
  */


  var dateRangeHandlesG = selectionEnabled ? dragG.append('g').attr('class', 'dateRangeHandlesG') : null;

  var redrawDateRangeHandles = function redrawDateRangeHandles() {
    if (!selectionEnabled) {
      return;
    }

    var isHighlighted = function isHighlighted(d) {
      return dateRangeHoverKey === d || draggingDateRange[d].dragging;
    };

    var yBounds = Object.keys(viewSelections).reduce(function (acc, key) {
      var y = getRowY(rowKeys.indexOf(key));
      var low = y - halfCellPad;
      var high = y + SVG.CELL_HEIGHT + halfCellPad;
      return [acc[0] === null || acc[0] > low ? low : acc[0], acc[1] === null || acc[1] < high ? high : acc[1]];
    }, [null, null]);
    dateRangeHandlesG.selectAll('rect').data([0, 1]).join('rect').attr('class', function (d) {
      return "dateRange".concat(d === 0 ? 'Start' : 'End', "HandleRect");
    }).attr('x', function (d) {
      var useWidth = isHighlighted(d) ? SVG.DATE_RANGE_HANDLE_WIDTH + 2 : SVG.DATE_RANGE_HANDLE_WIDTH;
      var gutterX = getYearMonthGutterX(dateRange.value[d], d === 0 ? 'left' : 'right');

      if (d === 0 && dateRange.value[d] === minYearMonth) {
        return gutterX;
      }

      if (d === 1 && dateRange.value[d] === maxYearMonth) {
        return gutterX - useWidth;
      }

      return gutterX - useWidth / 2;
    }).attr('width', function (d) {
      return isHighlighted(d) ? SVG.DATE_RANGE_HANDLE_WIDTH + 2 : SVG.DATE_RANGE_HANDLE_WIDTH;
    }).attr('y', function (d) {
      if (isHighlighted(d)) {
        return getRowY(rowKeys.length - 1) - halfCellPad;
      }

      return yBounds[0];
    }).attr('height', function (d) {
      if (isHighlighted(d)) {
        return svgHeight - getRowY(rowKeys.length - 1) + halfCellPad - 0.5;
      }

      return yBounds[1] - yBounds[0];
    }).attr('fill', function (d) {
      return isHighlighted(d) ? _Theme.COLORS.SECONDARY_BLUE[100] : _Theme.COLORS.SECONDARY_BLUE[300];
    }).attr('stroke', _Theme.default.palette.secondary.main).style('stroke-width', '1.5px').style('display', sites.value.length ? null : 'none');
  };
  /**
     SVG: Date Range Masks
  */


  var dateRangeMasksG = selectionEnabled ? svg.append('g').attr('class', 'dateRangeMasksG') : null;

  var redrawDateRangeHandleMasks = function redrawDateRangeHandleMasks() {
    if (!selectionEnabled) {
      return;
    }

    dateRangeMasksG.selectAll('rect').data([0, 1]).join('rect').attr('class', function (d) {
      return "dateRange".concat(d === 0 ? 'Start' : 'End', "MaskRect");
    }).attr('x', function (d) {
      return getYearMonthGutterX(dateRange.value[d] || minYearMonth, d === 0 ? 'left' : 'right') - SVG.DATE_RANGE_MASK_WIDTH / 2 + getTimeOffset();
    }).attr('y', 0).attr('width', SVG.DATE_RANGE_MASK_WIDTH).attr('height', svgHeight).style('cursor', 'ew-resize').style('outline', 'none').attr('fill', 'red').style('opacity', 0).style('display', sites.value.length ? null : 'none');
  };
  /**
     SVG: Selections
  */


  var redrawSelections = function redrawSelections() {
    if (!selectionEnabled) {
      return;
    } // Row and label backgrounds


    var yOffset = halfCellPad;
    var yMultiplier = SVG.CELL_HEIGHT + SVG.CELL_PADDING;

    var y = function y(d) {
      return yOffset + (rowCount - rowKeys.indexOf(d)) * yMultiplier;
    };

    var fill = function fill(d) {
      return viewSelections[d] === 'full' ? _Theme.default.palette.secondary.main : _Theme.COLORS.SECONDARY_BLUE[200];
    };

    var startX = getYearMonthGutterX(dateRange.value[0], 'left');
    var endX = getYearMonthGutterX(dateRange.value[1], 'right');
    rowSelectionsG.selectAll('rect').data(Object.keys(viewSelections)).join('rect').attr('x', startX).attr('y', y).attr('width', endX - startX).attr('height', SVG.CELL_HEIGHT + SVG.CELL_PADDING).attr('fill', fill);
    labelSelectionsG.selectAll('rect').data(Object.keys(viewSelections)).join('rect').attr('x', 0).attr('y', y).attr('width', getLabelWidth()).attr('height', SVG.CELL_HEIGHT + SVG.CELL_PADDING).attr('fill', fill); // Date range handles

    redrawDateRangeHandles();
  };
  /**
     Redraw functions
  */


  var redraw = function redraw() {
    redrawTimeAxis();
    redrawData();

    if (selectionEnabled) {
      redrawSelections();
    }
  }; // const debouncedRedraw = debounce(redraw, 150);

  /**
     Invoke initial redraws
  */


  redraw();
  redrawDateRangeHandleMasks();
  /**
     Setup Interactions
  */

  var timeHighlightReset = (0, _lodash.debounce)(function () {
    if (draggingCells) {
      return;
    }

    dataMasksG.selectAll('rect').style('cursor', selectionEnabled ? 'pointer' : 'grab');
    timeAxis.mask.style('cursor', 'grab');
    applyStyles(timeAxis.highlight, 'timeHighlight');
  }, 100);

  var timeHighlightHover = function timeHighlightHover() {
    if (draggingCells) {
      return;
    }

    timeHighlightReset.cancel();
    applyStyles(timeAxis.highlight, 'timeHighlightHover');
  };

  var cellDragTime = null;
  var dragCells = (0, _d3Drag.drag)().on('start', function () {
    draggingCells = true;
    rowHighlightReset(false);
    dataMasksG.selectAll('rect').style('cursor', 'grabbing');
    timeAxis.mask.style('cursor', 'grabbing');
    applyStyles(timeAxis.highlight, 'timeHighlightDrag');
    cellDragTime = new Date().getTime();
  }).on('drag', function () {
    setTimeOffset(getTimeOffset() + _d3Selection.event.dx);
    redrawData();
    redrawDateRangeHandleMasks();
  }).on('end', function () {
    draggingCells = false;
    rowHighlightHover(rowHoverKey);
    timeHighlightReset();
    redraw();
    redrawDateRangeHandleMasks(); // If the drag was less than 1/10 of a second long assume it's a sloppy click.
    // Perform a select action if selection is enabled to keep the end user happy. =)

    cellDragTime = new Date().getTime() - cellDragTime;

    if (selectionEnabled && cellDragTime < 100) {
      touchRipple(dataMasksG.selectAll('rect').filter(function (d) {
        return d === rowHoverKey;
      }), 15);
      setTimeout(function () {
        return toggleSelection(rowHoverKey);
      }, 15);
    }
  });
  dragCells(timeAxis.mask);
  dragCells(dataMasksG.selectAll('rect'));
  timeAxis.mask
  /*
  .on('wheel', () => {
    event.preventDefault();
    const step = (SVG.CELL_WIDTH + SVG.CELL_PADDING) * 3;
    const delta = (event.wheelDelta > 0 ? -1 : 1) * step;
    setTimeOffset(getTimeOffset() + delta);
    debouncedRedraw();
  })
  */
  .on('mouseover', timeHighlightHover).on('focus', timeHighlightHover).on('mouseout', timeHighlightReset).on('blur', timeHighlightReset);

  if (selectionEnabled) {
    var dateRangeHandleReset = (0, _lodash.debounce)(function () {
      dateRangeHoverKey = null;
      redrawDateRangeHandles();
    }, 100);

    var dateRangeHandleHover = function dateRangeHandleHover(key) {
      dateRangeHoverKey = key;
      redrawDateRangeHandles();
    }; // Interactions for Date Range START Handle


    var dragDateRangeStartMask = dateRangeMasksG.select('.dateRangeStartMaskRect');
    dragDateRangeStartMask.on('mouseover', function () {
      return dateRangeHandleHover(0);
    }).on('focus', function () {
      return dateRangeHandleHover(0);
    }).on('mouseout', dateRangeHandleReset).on('blur', dateRangeHandleReset);
    var dragDateRangeStart = (0, _d3Drag.drag)().on('start', function () {
      draggingDateRange[0].dragging = true;
      draggingDateRange[0].centerDragX = parseFloat(dragDateRangeStartMask.attr('x'), 10) + SVG.DATE_RANGE_MASK_WIDTH / 2;
    }).on('drag', function () {
      draggingDateRange[0].centerDragX += _d3Selection.event.dx;
      dragDateRangeStartMask.attr('x', draggingDateRange[0].centerDragX - SVG.DATE_RANGE_MASK_WIDTH / 2);
      var adjacentYearMonth = getAdjacentYearMonth(dateRange.value[0], _d3Selection.event.dx > 0 ? 'right' : 'left');
      var adjacentYearMonthStartX = getYearMonthGutterX(adjacentYearMonth, 'left');
      var currentYearMonthStartX = getYearMonthGutterX(dateRange.value[0], 'left');
      var insideClipCenterDragX = draggingDateRange[0].centerDragX - getTimeOffset();
      var distanceToAdjacent = Math.abs(insideClipCenterDragX - adjacentYearMonthStartX);
      var distanceToCurrent = Math.abs(insideClipCenterDragX - currentYearMonthStartX);

      if (adjacentYearMonth !== dateRange.value[0] && distanceToAdjacent < distanceToCurrent) {
        dateRange.value[0] = adjacentYearMonth;
        redrawSelections();
      }
    }).on('end', function () {
      draggingDateRange[0].dragging = false;
      draggingDateRange[0].centerDragX = 0; // Recenter mask as it is likely off a few pixels due to snap-to-gutter behavior

      var maskX = getYearMonthGutterX(dateRange.value[0], 'left') + SVG.DATE_RANGE_MASK_WIDTH / 2 + getTimeOffset();
      dateRangeMasksG.select('.dateRangeStartMaskRect').attr('x', maskX);
      setDateRangeValue(_toConsumableArray(dateRange.value));
      redrawSelections();
    });
    dragDateRangeStart(dateRangeMasksG.select('.dateRangeStartMaskRect')); // Interactions for Date Range END Handle

    var dragDateRangeEndMask = dateRangeMasksG.select('.dateRangeEndMaskRect');
    dragDateRangeEndMask.on('mouseover', function () {
      return dateRangeHandleHover(1);
    }).on('focus', function () {
      return dateRangeHandleHover(1);
    }).on('mouseout', dateRangeHandleReset).on('blur', dateRangeHandleReset);
    var dragDateRangeEnd = (0, _d3Drag.drag)().on('start', function () {
      draggingDateRange[1].dragging = true;
      draggingDateRange[1].centerDragX = parseFloat(dragDateRangeEndMask.attr('x'), 10) + SVG.DATE_RANGE_MASK_WIDTH / 2;
    }).on('drag', function () {
      draggingDateRange[1].centerDragX += _d3Selection.event.dx;
      dragDateRangeEndMask.attr('x', draggingDateRange[1].centerDragX - SVG.DATE_RANGE_MASK_WIDTH / 2);
      var adjacentYearMonth = getAdjacentYearMonth(dateRange.value[1], _d3Selection.event.dx > 0 ? 'right' : 'left');
      var adjacentYearMonthEndX = getYearMonthGutterX(adjacentYearMonth, 'right');
      var currentYearMonthEndX = getYearMonthGutterX(dateRange.value[1], 'right');
      var insideClipCenterDragX = draggingDateRange[1].centerDragX - getTimeOffset();
      var distanceToAdjacent = Math.abs(insideClipCenterDragX - adjacentYearMonthEndX);
      var distanceToCurrent = Math.abs(insideClipCenterDragX - currentYearMonthEndX);

      if (adjacentYearMonth !== dateRange.value[1] && distanceToAdjacent < distanceToCurrent) {
        dateRange.value[1] = adjacentYearMonth;
        redrawSelections();
      }
    }).on('end', function () {
      draggingDateRange[1].dragging = false;
      draggingDateRange[1].centerDragX = 0; // Recenter mask as it is likely off a few pixels due to snap-to-gutter behavior

      var maskX = getYearMonthGutterX(dateRange.value[1], 'right') - SVG.DATE_RANGE_MASK_WIDTH / 2 + getTimeOffset();
      dateRangeMasksG.select('.dateRangeEndMaskRect').attr('x', maskX);
      setDateRangeValue(_toConsumableArray(dateRange.value));
      redrawSelections();
    });
    dragDateRangeEnd(dateRangeMasksG.select('.dateRangeEndMaskRect'));
  }
}