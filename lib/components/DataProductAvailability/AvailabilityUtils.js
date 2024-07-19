"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcRollupStatus = exports.calcBasicRollupStatus = exports.VALID_ENHANCED_STATUSES = exports.TIME = exports.SVG_STYLES = exports.SVG = exports.AvailabilityPropTypes = void 0;
var _propTypes = _interopRequireDefault(require("prop-types"));
var _moment = _interopRequireDefault(require("moment"));
var _d3Transition = require("d3-transition");
var _Theme = _interopRequireWildcard(require("../Theme/Theme"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
  All possible valid statuses (enhanced availability only)
*/
const VALID_ENHANCED_STATUSES = exports.VALID_ENHANCED_STATUSES = {
  expected: {
    title: 'Expected',
    description: 'Data collection is scheduled to happen'
  },
  'being processed': {
    title: 'Being Processed',
    description: 'Data have been collected and will be published after processing has completed'
  },
  available: {
    title: 'Release Available',
    description: 'Data have been published and released. Data are available for download'
  },
  'available-provisional': {
    title: 'Provisional',
    description: 'Provisional data have been published and are available for download'
  },
  'mixed-available-provisional': {
    title: 'Mixed',
    description: 'Data have been published and are available for download. Some data are released and some data are provisional.'
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
  tombstoned: {
    title: 'No Longer Available',
    description: 'Data is no longer available for download'
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
const calcBasicRollupStatus = statuses => {
  if (!statuses) {
    return null;
  }
  if (Array.from(statuses).some(s => !Object.keys(VALID_ENHANCED_STATUSES).includes(s))) {
    return null;
  }
  if (statuses.size === 0) {
    return null;
  }
  if (statuses.size === 1) {
    return Array.from(statuses)[0];
  }
  const hasTomb = statuses.has('tombstoned');
  if (hasTomb) {
    return 'tombstoned';
  }
  return statuses.has('available-provisional') ? 'mixed-available-provisional' : 'available';
};
exports.calcBasicRollupStatus = calcBasicRollupStatus;
const calcRollupStatus = function () {
  let statuses = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  if (!Array.isArray(statuses)) {
    return Object.keys(VALID_ENHANCED_STATUSES).includes(statuses) ? statuses : null;
  }
  if (statuses.some(status => !Object.keys(VALID_ENHANCED_STATUSES).includes(status))) {
    return null;
  }
  const set = new Set(statuses);
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
const AvailabilityPropTypes = exports.AvailabilityPropTypes = {
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
const SVG = exports.SVG = {
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
SVG.MIN_WIDTH = (SVG.CELL_WIDTH + SVG.CELL_PADDING) * SVG.MIN_CELLS + Math.floor(SVG.MIN_CELLS / 12) * SVG.YEAR_PADDING;
SVG.MIN_HEIGHT = (SVG.CELL_HEIGHT + SVG.CELL_PADDING) * (SVG.MIN_ROWS + 1);
SVG.YEAR_MONTH_WIDTH = SVG.CELL_WIDTH + SVG.CELL_PADDING;
SVG.YEAR_WIDTH = SVG.YEAR_MONTH_WIDTH * 12 - SVG.CELL_PADDING;

/**
   Stuff to work with time in blocks as months or years
   Includes all possible year-months ("YYYY-MM" strings) from a fixed start year to a fixed margin
   into the future from right now to serve as an x-axis data set
*/
const TIME = exports.TIME = {
  getYearMonthMoment: yearMonth => (0, _moment.default)("".concat(yearMonth, "-01")),
  getNextMonth: month => _moment.default.utc("".concat(month, "-15T00:00:00Z")).add(1, 'month').format('YYYY-MM'),
  getPreviousMonth: month => _moment.default.utc("".concat(month, "-15T00:00:00Z")).subtract(1, 'month').format('YYYY-MM'),
  CURRENT_MONTH: (0, _moment.default)().format('YYYY-MM'),
  START_YEAR: 2010,
  END_YEAR: new Date().getFullYear() + 1
};
TIME.MIN_YEAR_MONTH = "".concat(TIME.START_YEAR, "-01");
TIME.MAX_YEAR_MONTH = "".concat(TIME.END_YEAR, "-12");
TIME.YEARS = Array(TIME.END_YEAR - TIME.START_YEAR + 1).fill(0).map((val, idx) => TIME.START_YEAR + idx);
TIME.MONTHS = Array(12).fill(0).map((val, idx) => (idx + 1).toString().padStart(2, '0'));
TIME.YEAR_MONTHS = TIME.YEARS.flatMap(year => TIME.MONTHS.map(month => "".concat(year, "-").concat(month)));

// Derive an SVG constant from TIME
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
const SVG_STYLES = exports.SVG_STYLES = {
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
SVG_STYLES.apply = (node, styleName) => {
  if (!SVG_STYLES.styles[styleName]) {
    return;
  }
  Object.keys(SVG_STYLES.styles[styleName]).forEach(key => {
    const style = key.replace(/([A-Z]){1}/g, v => "-".concat(v.toLowerCase()));
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
  let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
  selection.style('fill', 'rgba(199, 110, 0, 0.75)').transition((0, _d3Transition.transition)().duration(duration)).style('fill', 'rgba(199, 110, 0, 0.25)');
};