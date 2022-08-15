"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcRollupStatus = exports.VALID_ENHANCED_STATUSES = exports.TIME = exports.SVG_STYLES = exports.SVG = exports.AvailabilityPropTypes = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _moment = _interopRequireDefault(require("moment"));

var _d3Transition = require("d3-transition");

var _Theme = _interopRequireWildcard(require("../Theme/Theme"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  All possible valid statuses (enhanced availability only)
*/
var VALID_ENHANCED_STATUSES = {
  expected: {
    title: 'Expected',
    description: 'Data collection is scheduled to happen'
  },
  'being processed': {
    title: 'Being Processed',
    description: 'Data have been collected and will be published after processing has completed'
  },
  available: {
    title: 'Available',
    description: 'Data have been published and are available for download'
  },
  'available-provisional': {
    title: 'Provisional Available',
    description: 'Provisional data have been published and are available for download'
  },
  delayed: {
    title: 'Delayed',
    description: 'Data should be available for download but something has prevented publication'
  },
  tentative: {
    title: 'Potential',
    description: 'Data collection is desired but not expected until other conditions are met'
  },
  'not expected': {
    title: 'Not Expected',
    description: 'No data collection is scheduled'
  },
  'not collected': {
    title: 'Not Collected',
    description: 'Data collection was expected but collection could not take place; no data will be published'
  },
  'not available': {
    title: 'Not Available',
    description: 'Data was neither expected nor collected'
  },
  'mixed some availability': {
    title: 'Mixed (Some Availability)',
    description: 'More than one status including at least one "Available" across sites / tables in the rollup (e.g. viewing states, all tables, etc.)'
  },
  'mixed no availability': {
    title: 'Mixed (No Availability)',
    description: 'More than one status with none "Available" across sites / tables in the rollup (e.g. viewing states, all tables, etc.)'
  }
};
exports.VALID_ENHANCED_STATUSES = VALID_ENHANCED_STATUSES;

var calcRollupStatus = function calcRollupStatus() {
  var statuses = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (!Array.isArray(statuses)) {
    return Object.keys(VALID_ENHANCED_STATUSES).includes(statuses) ? statuses : null;
  }

  if (statuses.some(function (status) {
    return !Object.keys(VALID_ENHANCED_STATUSES).includes(status);
  })) {
    return null;
  }

  var set = new Set(statuses);

  if (set.size === 0) {
    return null;
  }

  if (set.size === 1) {
    return Array.from(set)[0];
  }

  return set.has('available') ? 'mixed some availability' : 'mixed no availability';
};
/**
   PropTypes for different major modes
*/


exports.calcRollupStatus = calcRollupStatus;
var AvailabilityPropTypes = {
  basicSiteCodes: _propTypes.default.arrayOf(_propTypes.default.shape({
    siteCode: _propTypes.default.string.isRequired,
    availableMonths: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
    availableReleases: _propTypes.default.arrayOf(_propTypes.default.shape({
      release: _propTypes.default.string.isRequired,
      availableMonths: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
    }))
  })),
  enhancedSites: _propTypes.default.arrayOf(_propTypes.default.shape({
    siteCode: _propTypes.default.string.isRequired,
    tables: _propTypes.default.arrayOf(_propTypes.default.shape({
      name: _propTypes.default.string.isRequired,
      description: _propTypes.default.string.isRequired,
      waitInterval: _propTypes.default.string.isRequired,
      months: _propTypes.default.objectOf(_propTypes.default.oneOf(Object.keys(VALID_ENHANCED_STATUSES))).isRequired
    })).isRequired
  })),
  dataProducts: _propTypes.default.arrayOf(_propTypes.default.shape({
    dataProductCode: _propTypes.default.string.isRequired,
    dataProductTitle: _propTypes.default.string.isRequired,
    availableMonths: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
    availableReleases: _propTypes.default.arrayOf(_propTypes.default.shape({
      release: _propTypes.default.string.isRequired,
      availableMonths: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
    }))
  }))
};
/**
   SVG display constants
*/

exports.AvailabilityPropTypes = AvailabilityPropTypes;
var SVG = {
  MIN_ROWS: 1,
  MIN_CELLS: 12,
  CELL_WIDTH: 7,
  CELL_HEIGHT: 12,
  CELL_PADDING: 4,
  YEAR_PADDING: 21,
  END_PADDING: 10,
  CELL_RX: 1,
  LABEL_FONT_SIZE: 12,
  LABEL_WIDTH_MULTIPLIER: 9,
  LABEL_WIDTH_RIGHT_BUFFER: 4,
  GROUPED_LABEL_WIDTH: 37,
  UNGROUPED_LABEL_WIDTH: 93,
  PRODUCT_LABEL_WIDTH: 105,
  DATE_RANGE_HANDLE_WIDTH: 4,
  DATE_RANGE_MASK_WIDTH: 24
};
exports.SVG = SVG;
SVG.MIN_WIDTH = (SVG.CELL_WIDTH + SVG.CELL_PADDING) * SVG.MIN_CELLS + Math.floor(SVG.MIN_CELLS / 12) * SVG.YEAR_PADDING;
SVG.MIN_HEIGHT = (SVG.CELL_HEIGHT + SVG.CELL_PADDING) * (SVG.MIN_ROWS + 1);
SVG.YEAR_MONTH_WIDTH = SVG.CELL_WIDTH + SVG.CELL_PADDING;
SVG.YEAR_WIDTH = SVG.YEAR_MONTH_WIDTH * 12 - SVG.CELL_PADDING;
/**
   Stuff to work with time in blocks as months or years
   Includes all possible year-months ("YYYY-MM" strings) from a fixed start year to a fixed margin
   into the future from right now to serve as an x-axis data set
*/

var TIME = {
  getYearMonthMoment: function getYearMonthMoment(yearMonth) {
    return (0, _moment.default)("".concat(yearMonth, "-01"));
  },
  getNextMonth: function getNextMonth(month) {
    return _moment.default.utc("".concat(month, "-15T00:00:00Z")).add(1, 'month').format('YYYY-MM');
  },
  getPreviousMonth: function getPreviousMonth(month) {
    return _moment.default.utc("".concat(month, "-15T00:00:00Z")).subtract(1, 'month').format('YYYY-MM');
  },
  CURRENT_MONTH: (0, _moment.default)().format('YYYY-MM'),
  START_YEAR: 2010,
  END_YEAR: new Date().getFullYear() + 1
};
exports.TIME = TIME;
TIME.MIN_YEAR_MONTH = "".concat(TIME.START_YEAR, "-01");
TIME.MAX_YEAR_MONTH = "".concat(TIME.END_YEAR, "-12");
TIME.YEARS = Array(TIME.END_YEAR - TIME.START_YEAR + 1).fill(0).map(function (val, idx) {
  return TIME.START_YEAR + idx;
});
TIME.MONTHS = Array(12).fill(0).map(function (val, idx) {
  return (idx + 1).toString().padStart(2, '0');
});
TIME.YEAR_MONTHS = TIME.YEARS.flatMap(function (year) {
  return TIME.MONTHS.map(function (month) {
    return "".concat(year, "-").concat(month);
  });
}); // Derive an SVG constant from TIME

SVG.ABS_MAX_DATA_WIDTH = 2 * SVG.END_PADDING + TIME.YEARS.length * SVG.YEAR_WIDTH + (TIME.YEARS.length - 1) * SVG.YEAR_PADDING;
/**
   SVG Styles and Style Functions
   We can't use makeStyles to make classes for these on the fly as only
   react components can do that. Most of these styles also make use of
   variables to be built dynamically (Theme and SVG). Our stop-gap is
   to define them as if we're generating dynamic CSS classes using
   makeStyles but instead apply them using a custom function to add
   them in-line to the style attribute for a given DOM element.
*/

var SVG_STYLES = {
  styles: {
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
      fill: _Theme.COLORS.GREEN[400],
      stroke: _Theme.COLORS.GREEN[700],
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
  }
};
/**
   Function: apply
   Parse an object literal style definition into d3 selection.style()
   calls to apply styles defined in the styles object literal to a node
*/

exports.SVG_STYLES = SVG_STYLES;

SVG_STYLES.apply = function (node, styleName) {
  if (!SVG_STYLES.styles[styleName]) {
    return;
  }

  Object.keys(SVG_STYLES.styles[styleName]).forEach(function (key) {
    var style = key.replace(/([A-Z]){1}/g, function (v) {
      return "-".concat(v.toLowerCase());
    });
    node.style(style, SVG_STYLES.styles[styleName][key]);
  });
};
/**
   Function: touchRipple
   For click interactions pass a d3 selection in and the fill will transition
   from an "active" semi-transparent orange color to near-transparent. We don't go
   full transparent as the ripple is typically followed by a delayed state update
   that will trigger a rerender and thus a full style reset.
*/


SVG_STYLES.touchRipple = function (selection) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
  selection.style('fill', 'rgba(199, 110, 0, 0.75)').transition((0, _d3Transition.transition)().duration(duration)).style('fill', 'rgba(199, 110, 0, 0.25)');
};