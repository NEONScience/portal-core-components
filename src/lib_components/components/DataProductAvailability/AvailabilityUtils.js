import PropTypes from 'prop-types';

import moment from 'moment';

import { transition } from 'd3-transition';

import Theme, { COLORS } from '../Theme/Theme';

/**
  All possible valid statuses (enhanced availability only)
*/
export const VALID_ENHANCED_STATUSES = {
  expected: {
    title: 'Expected',
    description: 'Data collection is scheduled to happen',
  },
  'being processed': {
    title: 'Being Processed',
    description: 'Data have been collected and will be published after processing has completed',
  },
  available: {
    title: 'Available',
    description: 'Data have been published and are available for download',
  },
  delayed: {
    title: 'Delayed',
    description: 'Data should be available for download but something has prevented publication',
  },
  tentative: {
    title: 'Potential',
    description: 'Data collection is desired but not expected until other conditions are met',
  },
  'not expected': {
    title: 'Not Expected',
    description: 'No data collection is scheduled',
  },
  'not collected': {
    title: 'Not Collected',
    description: 'Data collection was expected but collection could not take place; no data will be published',
  },
  'not available': {
    title: 'Not Available',
    description: 'Data was neither expected nor collected',
  },
  'mixed some availability': {
    title: 'Mixed (Some Availability)',
    description: 'More than one status including at least one "Available" across sites / tables in the rollup (e.g. viewing states, all tables, etc.)',
  },
  'mixed no availability': {
    title: 'Mixed (No Availability)',
    description: 'More than one status with none "Available" across sites / tables in the rollup (e.g. viewing states, all tables, etc.)',
  },
};

export const calcRollupStatus = (statuses = []) => {
  if (!Array.isArray(statuses)) { return statuses || null; }
  const set = new Set(statuses);
  if (set.size === 0) { return null; }
  if (set.size === 1) { return Array.from(set)[0]; }
  return set.has('available') ? 'mixed some availability' : 'mixed no availability';
};

/**
   PropTypes for different major modes
*/
export const AvailabilityPropTypes = {
  basicSiteCodes: PropTypes.arrayOf(
    PropTypes.shape({
      siteCode: PropTypes.string.isRequired,
      availableMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ),
  enhancedSites: PropTypes.arrayOf(
    PropTypes.shape({
      siteCode: PropTypes.string.isRequired,
      tables: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          waitInterval: PropTypes.string.isRequired,
          months: PropTypes.objectOf(
            PropTypes.oneOf(Object.keys(VALID_ENHANCED_STATUSES)),
          ).isRequired,
        }),
      ).isRequired,
    }),
  ),
};

/**
   SVG display constants
*/
export const SVG = {
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
  DATE_RANGE_HANDLE_WIDTH: 4,
  DATE_RANGE_MASK_WIDTH: 24,
};
SVG.MIN_WIDTH = (SVG.CELL_WIDTH + SVG.CELL_PADDING) * SVG.MIN_CELLS
  + Math.floor(SVG.MIN_CELLS / 12) * SVG.YEAR_PADDING;
SVG.MIN_HEIGHT = (SVG.CELL_HEIGHT + SVG.CELL_PADDING) * (SVG.MIN_ROWS + 1);
SVG.YEAR_MONTH_WIDTH = SVG.CELL_WIDTH + SVG.CELL_PADDING;
SVG.YEAR_WIDTH = (SVG.YEAR_MONTH_WIDTH * 12) - SVG.CELL_PADDING;

/**
   Stuff to work with time in blocks as months or years
   Includes all possible year-months ("YYYY-MM" strings) from a fixed start year to a fixed margin
   into the future from right now to serve as an x-axis data set
*/
export const TIME = {
  getYearMonthMoment: yearMonth => (
    moment(`${yearMonth}-01`)
  ),
  getNextMonth: month => (
    moment.utc(`${month}-15T00:00:00Z`).add(1, 'month').format('YYYY-MM')
  ),
  getPreviousMonth: month => (
    moment.utc(`${month}-15T00:00:00Z`).subtract(1, 'month').format('YYYY-MM')
  ),
  CURRENT_MONTH: moment().format('YYYY-MM'),
  START_YEAR: 2010,
  END_YEAR: ((new Date().getFullYear()) + 1),
};
TIME.MIN_YEAR_MONTH = `${TIME.START_YEAR}-01`;
TIME.MAX_YEAR_MONTH = `${TIME.endYear}-12`;
TIME.YEARS = Array(TIME.END_YEAR - TIME.START_YEAR + 1)
  .fill(0)
  .map((val, idx) => TIME.START_YEAR + idx);
TIME.MONTHS = Array(12)
  .fill(0)
  .map((val, idx) => (idx + 1).toString().padStart(2, '0'));
TIME.YEAR_MONTHS = TIME.YEARS
  .flatMap(year => TIME.MONTHS.map(month => `${year}-${month}`));

// Derive an SVG constant from TIME
SVG.ABS_MAX_DATA_WIDTH = (2 * SVG.END_PADDING)
  + (TIME.YEARS.length * SVG.YEAR_WIDTH)
  + ((TIME.YEARS.length - 1) * SVG.YEAR_PADDING);

/**
   SVG Styles and Style Functions
   We can't use makeStyles to make classes for these on the fly as only
   react components can do that. Most of these styles also make use of
   variables to be built dynamically (Theme and SVG). Our stop-gap is
   to define them as if we're generating dynamic CSS classes using
   makeStyles but instead apply them using a custom function to add
   them in-line to the style attribute for a given DOM element.
*/
export const SVG_STYLES = {
  styles: {
    rowLabel: {
      textAnchor: 'end',
      whiteSpace: 'pre',
      fontFamily: '"Cutive Mono","Lucida Console",Monaco,monospace',
      fontWeight: 400,
      fontSize: `${SVG.LABEL_FONT_SIZE}px`,
    },
    rowLabelMask: {
      fill: 'transparent',
      cursor: 'pointer',
      outline: 'none',
    },
    timeDivider: {
      stroke: Theme.palette.grey[400],
      strokeDasharray: 3,
      strokeWidth: '1.2px',
    },
    timeBound: {
      stroke: Theme.palette.grey[700],
      strokeWidth: '2px',
    },
    timeLabel: {
      fill: Theme.palette.grey[700],
      textAnchor: 'middle',
      fontFamily: '"Cutive Mono","Lucida Console",Monaco,monospace',
      fontWeight: 400,
      fontSize: `${SVG.LABEL_FONT_SIZE}px`,
    },
    timeHighlight: {
      fill: COLORS.GREEN[400],
      stroke: COLORS.GREEN[700],
      strokeWidth: '1px',
      opacity: 0,
    },
    timeHighlightHover: {
      opacity: 0.3,
    },
    timeHighlightDrag: {
      opacity: 0.5,
    },
    timeHighlightMask: {
      fill: 'transparent',
      cursor: 'grab',
      outline: 'none',
    },
  },
};

/**
   Function: apply
   Parse an object literal style definition into d3 selection.style()
   calls to apply styles defined in the styles object literal to a node
*/
SVG_STYLES.apply = (node, styleName) => {
  if (!SVG_STYLES.styles[styleName]) { return; }
  Object.keys(SVG_STYLES.styles[styleName]).forEach((key) => {
    const style = key.replace(/([A-Z]){1}/g, v => `-${v.toLowerCase()}`);
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
SVG_STYLES.touchRipple = (selection, duration = 15) => {
  selection
    .style('fill', 'rgba(199, 110, 0, 0.75)')
    .transition(transition().duration(duration))
    .style('fill', 'rgba(199, 110, 0, 0.25)');
};
