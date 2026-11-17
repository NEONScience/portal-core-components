import PropTypes from 'prop-types';

import moment from 'moment';

import { transition } from 'd3-transition';

import { COLORS } from '../Theme/Theme';
import { AVAILABILITY_DATA_LEVELS } from './EnhancedAvailabilitySchema';
import { AVAILABILITY_INHERITANCE_MODES } from './EnhancedAvailabilityInheritance';

/**
  All possible valid statuses (enhanced availability only)
*/
/* eslint-disable max-len, @stylistic/max-len */
export const VALID_ENHANCED_STATUSES = {
  expected: {
    title: 'Expected',
    description: 'Data collection is scheduled to happen',
  },
  available: {
    title: 'Release Available',
    description: 'Data have been published and released. Data are available for download',
  },
  'available-provisional': {
    title: 'Provisional',
    description: 'Provisional data have been published and are available for download',
  },
  'mixed-available-provisional': {
    title: 'Mixed',
    description: 'Data have been published and are available for download. Some data are released and some data are provisional.',
  },
  partial: {
    title: 'Partial',
    description: 'Data collection was incomplete.',
  },
  tentative: {
    title: 'Potential',
    description: 'Data collection is desired but not expected until other conditions are met',
  },
  'not expected': {
    title: 'Not Planned',
    description: 'No data collection is planned',
  },
  'not collected': {
    title: 'Not Collected',
    description: 'Data collection was expected but collection could not take place; no data will be published',
  },
  'not available': {
    title: 'Not Available',
    description: 'Data was neither expected nor collected',
  },
  tombstoned: {
    title: 'No Longer Available',
    description: 'Data is no longer available for download',
  },
  'mixed some availability': {
    title: 'Mixed (Some Availability)',
    description: 'More than one status including at least one "Available" across sites / packages / tables in the rollup (e.g. viewing states, all tables, etc.)',
  },
  'mixed no availability': {
    title: 'Mixed (No Availability)',
    description: 'More than one status with none "Available" across sites / packages / tables in the rollup (e.g. viewing states, all tables, etc.)',
  },
};
/* eslint-enable max-len, @stylistic/max-len */

/**
   Enhanced availability API constants
*/
export const PROVISIONAL_RELEASE = 'PROVISIONAL';
export const TABLE_COMPONENT_TYPE = 'tablename';
// Maps statuses reported by the enhanced availability API to enhanced statuses
export const API_STATUS_MAP = {
  Expected: 'expected',
  Potential: 'tentative',
  'Not Planned': 'not expected',
  'Not Collected': 'not collected',
  Partial: 'partial',
};
export const AVAILABLE_STATUSES = [
  'available',
  'available-provisional',
  'mixed-available-provisional',
];
const VALID_ENHANCED_STATUS_SET = new Set(Object.keys(VALID_ENHANCED_STATUSES));
const AVAILABLE_STATUS_SET = new Set(AVAILABLE_STATUSES);

export const calcBasicRollupStatus = (statuses) => {
  if (!statuses || statuses.size === 0) {
    return null;
  }
  let firstStatus = null;
  let hasTomb = false;
  let hasProvisional = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const s of statuses) {
    if (!VALID_ENHANCED_STATUS_SET.has(s)) {
      return null;
    }
    if (firstStatus === null) { firstStatus = s; }
    if (s === 'tombstoned') { hasTomb = true; }
    if (s === 'available-provisional') { hasProvisional = true; }
  }
  if (statuses.size === 1) { return firstStatus; }
  if (hasTomb) { return 'tombstoned'; }
  return hasProvisional ? 'mixed-available-provisional' : 'available';
};

export const calcRollupStatus = (statuses = []) => {
  if (!Array.isArray(statuses)) {
    return VALID_ENHANCED_STATUS_SET.has(statuses) ? statuses : null;
  }
  const len = statuses.length;
  if (len === 0) { return null; }
  const firstStatus = statuses[0];
  if (!VALID_ENHANCED_STATUS_SET.has(firstStatus)) {
    return null;
  }
  let allSame = true;
  let allAvailable = AVAILABLE_STATUS_SET.has(firstStatus);
  let hasAvailability = allAvailable || (firstStatus === 'mixed some availability');
  for (let i = 1; i < len; i += 1) {
    const status = statuses[i];
    if (!VALID_ENHANCED_STATUS_SET.has(status)) {
      return null;
    }
    if (status !== firstStatus) {
      allSame = false;
    }
    const isAvailable = AVAILABLE_STATUS_SET.has(status);
    if (!isAvailable) {
      allAvailable = false;
    }
    if (isAvailable || (status === 'mixed some availability')) {
      hasAvailability = true;
    }
  }
  if (allSame) { return firstStatus; }
  if (allAvailable) { return 'mixed-available-provisional'; }
  return hasAvailability ? 'mixed some availability' : 'mixed no availability';
};

/**
   Color schemes to draw statuses in, see CELL_ATTRS_BY_COLOR_SCHEME in AvailabilitySvgComponents
   * neonBlue: NEON blue available data, with outlined cells for most statuses without data
   * neonGreen: every status is filled with its own color. Released data are solid, provisional
     data are striped, and mixed statuses use the same patterns as the NEON blue scheme.
   * colorVisionAccessible: NEON blue and gold stepped apart in lightness, so statuses remain
     distinguishable with protanopia, deuteranopia, tritanopia, and achromatopsia. Fill styles
     carry meaning as well as color: solid for final statuses, striped for partial versions of
     them, outlined for future statuses, and split diagonally for mixed statuses.
*/
export const AVAILABILITY_COLOR_SCHEMES = {
  NEON_BLUE: 'neonBlue',
  NEON_GREEN: 'neonGreen',
  COLOR_VISION_ACCESSIBLE: 'colorVisionAccessible',
};
export const AVAILABILITY_COLOR_SCHEME_LABELS = {
  [AVAILABILITY_COLOR_SCHEMES.NEON_BLUE]: 'NEON Blue',
  [AVAILABILITY_COLOR_SCHEMES.NEON_GREEN]: 'NEON Green',
  [AVAILABILITY_COLOR_SCHEMES.COLOR_VISION_ACCESSIBLE]: 'Color Vision Accessible',
};
// Color scheme used wherever one is not specified
export const DEFAULT_AVAILABILITY_COLOR_SCHEME = AVAILABILITY_COLOR_SCHEMES.NEON_BLUE;
const AVAILABILITY_COLOR_SCHEME_SET = new Set(Object.values(AVAILABILITY_COLOR_SCHEMES));
export const resolveColorScheme = (colorScheme) => (
  AVAILABILITY_COLOR_SCHEME_SET.has(colorScheme) ? colorScheme : DEFAULT_AVAILABILITY_COLOR_SCHEME
);

/**
   PropTypes for different major modes
*/
export const AvailabilityPropTypes = {
  colorScheme: PropTypes.oneOf(Object.values(AVAILABILITY_COLOR_SCHEMES)),
  // Enhanced availability data level, one of AvailabilityDataLevel
  dataLevel: PropTypes.oneOf(AVAILABILITY_DATA_LEVELS),
  // Enhanced availability inheritance mode, one of AvailabilityInheritanceMode
  inheritanceMode: PropTypes.oneOf(AVAILABILITY_INHERITANCE_MODES),
  basicSiteCodes: PropTypes.arrayOf(
    PropTypes.shape({
      siteCode: PropTypes.string.isRequired,
      availableMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
      availableReleases: PropTypes.arrayOf(
        PropTypes.shape({
          release: PropTypes.string.isRequired,
          availableMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
        }),
      ),
    }),
  ),
  // The "data" object of an enhanced availability API response
  enhancedAvailability: PropTypes.shape({
    productCode: PropTypes.string,
    siteCodes: PropTypes.arrayOf(
      PropTypes.shape({
        siteCode: PropTypes.string.isRequired,
        availableReleases: PropTypes.arrayOf(
          PropTypes.shape({
            release: PropTypes.string.isRequired,
            months: PropTypes.arrayOf(
              PropTypes.shape({
                month: PropTypes.string.isRequired,
                available: PropTypes.bool.isRequired,
                status: PropTypes.oneOf(Object.keys(API_STATUS_MAP)),
                packages: PropTypes.arrayOf(
                  PropTypes.shape({
                    packageType: PropTypes.string.isRequired,
                    components: PropTypes.arrayOf(
                      PropTypes.shape({
                        name: PropTypes.string.isRequired,
                        type: PropTypes.string.isRequired,
                        status: PropTypes.oneOf(Object.keys(API_STATUS_MAP)),
                      }),
                    ).isRequired,
                  }),
                ),
              }),
            ).isRequired,
          }),
        ).isRequired,
      }),
    ).isRequired,
  }),
  dataProducts: PropTypes.arrayOf(
    PropTypes.shape({
      dataProductCode: PropTypes.string.isRequired,
      dataProductTitle: PropTypes.string.isRequired,
      availableMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
      availableReleases: PropTypes.arrayOf(
        PropTypes.shape({
          release: PropTypes.string.isRequired,
          availableMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
        }),
      ),
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
  PRODUCT_LABEL_WIDTH: 105,
  DATE_RANGE_HANDLE_WIDTH: 4,
  DATE_RANGE_MASK_WIDTH: 24,
  LABEL_SCROLLBAR_HEIGHT: 4,
  LABEL_SCROLLBAR_MIN_THUMB_WIDTH: 12,
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
  getYearMonthMoment: (yearMonth) => (
    moment(`${yearMonth}-01`)
  ),
  getNextMonth: (month) => (
    moment.utc(`${month}-15T00:00:00Z`).add(1, 'month').format('YYYY-MM')
  ),
  getPreviousMonth: (month) => (
    moment.utc(`${month}-15T00:00:00Z`).subtract(1, 'month').format('YYYY-MM')
  ),
  CURRENT_MONTH: moment().format('YYYY-MM'),
  START_YEAR: 2010,
  END_YEAR: ((new Date().getFullYear()) + 1),
};
TIME.MIN_YEAR_MONTH = `${TIME.START_YEAR}-01`;
TIME.MAX_YEAR_MONTH = `${TIME.END_YEAR}-12`;
TIME.YEARS = Array(TIME.END_YEAR - TIME.START_YEAR + 1)
  .fill(0)
  .map((val, idx) => TIME.START_YEAR + idx);
TIME.MONTHS = Array(12)
  .fill(0)
  .map((val, idx) => (idx + 1).toString().padStart(2, '0'));
TIME.YEAR_MONTHS = TIME.YEARS
  .flatMap((year) => TIME.MONTHS.map((month) => `${year}-${month}`));

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
    rowLabelScrollTrack: {
      fill: COLORS.GREY[100],
    },
    rowLabelScrollThumb: {
      fill: COLORS.GREY[300],
    },
    rowLabelScrollThumbActive: {
      fill: COLORS.GREY[500],
    },
    rowLabelScrollMask: {
      fill: 'transparent',
      cursor: 'grab',
      outline: 'none',
    },
    timeDivider: {
      stroke: COLORS.GREY[400],
      strokeDasharray: 3,
      strokeWidth: '1.2px',
    },
    timeBound: {
      stroke: COLORS.GREY[700],
      strokeWidth: '2px',
    },
    timeLabel: {
      fill: COLORS.GREY[700],
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
    const style = key.replace(/([A-Z]){1}/g, (v) => `-${v.toLowerCase()}`);
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
