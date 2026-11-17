import React from 'react';
import PropTypes from 'prop-types';

import {
  SVG,
  VALID_ENHANCED_STATUSES,
  AVAILABILITY_COLOR_SCHEMES,
  DEFAULT_AVAILABILITY_COLOR_SCHEME,
  AvailabilityPropTypes,
  resolveColorScheme,
} from './AvailabilityUtils';

import { COLORS } from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';

/**
   DIAGONAL STRIPES
   45 degree stripes from top left to bottom right, STRIPE_SPACING apart and STRIPE_THICKNESS
   thick (measured perpendicular to the stripes). Measured along the x or y axis they repeat every
   STRIPE_PERIOD and are STRIPE_WIDTH wide, so a point is on a stripe where
   (y - x) mod STRIPE_PERIOD < STRIPE_WIDTH.
*/
const STRIPE_SPACING = SVG.CELL_HEIGHT / 4;
const STRIPE_THICKNESS = (STRIPE_SPACING / 2) - 0.25;
const STRIPE_PERIOD = STRIPE_SPACING * Math.SQRT2;
const STRIPE_WIDTH = STRIPE_THICKNESS * Math.SQRT2;

// Stripe path data is rounded to hundredths of a pixel
const toHundredths = (value) => Math.round(value * 100);
const formatHundredths = (hundredths) => `${hundredths / 100}`;

const diagLinesPatternDefaultProps = {
  secondaryColor: '#ffffff',
};

/**
   SVG_DEFS
*/
// One stripe period in an axis-aligned square tile, so the pattern needs no patternTransform
const DIAG_LINES_TILE = (() => {
  const size = toHundredths(STRIPE_PERIOD);
  const width = toHundredths(STRIPE_WIDTH);
  const [s, w, gap] = [size, width, size - width].map(formatHundredths);
  return { size: s, d: `M0,0L${s},${s}H${gap}L0,${w}ZM${gap},0H${s}V${w}Z` };
})();

const DiagLinesPattern = (inProps) => {
  const props = resolveProps(diagLinesPatternDefaultProps, inProps);
  const { id, color, secondaryColor } = props;
  const { size, d } = DIAG_LINES_TILE;
  return (
    <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
      <rect x={0} y={0} width={size} height={size} fill={secondaryColor} />
      <path d={d} fill={color} />
    </pattern>
  );
};
DiagLinesPattern.propTypes = {
  id: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  secondaryColor: PropTypes.string,
};

const halfAndHalfPatternDefaultProps = {
  secondaryColor: '#ffffff',
};
const HalfAndHalfPattern = (inProps) => {
  const props = resolveProps(halfAndHalfPatternDefaultProps, inProps);
  const { id, color, secondaryColor } = props;
  return (
    <pattern
      id={id}
      width={1}
      height={1}
      patternContentUnits="objectBoundingBox"
    >
      <path d="M 0 0 V 1 L 1 0 Z" fill={color} />
      <path d="M 1 1 V 0 L 0 1 Z" fill={secondaryColor} />
    </pattern>
  );
};
HalfAndHalfPattern.propTypes = {
  id: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  secondaryColor: PropTypes.string,
};

const diagHalfAndHalfPatternDefaultProps = {
  secondaryDiagColor: '#ffffff',
};

// Precompute static diagonal half-and-half pattern geometry once at module load
// since cell dimensions and line parameters are constant.
const DIAG_HALF_AND_HALF_GEOMETRY = (() => {
  const cellW = SVG.CELL_WIDTH;
  const cellH = SVG.CELL_HEIGHT;
  // Extends the bounds of the applied rectangle dimensions
  // when computing coordinates. This will overlay the
  // computed coordinate such that they extend beyond the actual bounds
  // of the rectangle, to account for squared stroke end of line points
  // so that there's no gaps with a sufficiently heavy stroke width.
  // Setting this to 0 will disable to the extension and map directly
  // onto the bounding box of the rectangle.
  // When divided by 2, should result in a rational number.
  const extendBoundsPadding = 0;
  const w = cellW + extendBoundsPadding;
  const h = cellH + extendBoundsPadding;
  // Nudge the half fill color to prevent background from initial
  // line from top right corner consuming the color at normal
  // viewing levels. Ensures it looks visually appropriate for half color
  // fill and half diag line pattern.
  // Will be based on initDist
  const nudgeDiagFill = 1;
  const numLines = 4;
  // Distance of the diagonal of the rectangle
  const diagLengthRaw = Math.sqrt((cellW ** 2) + (cellH ** 2));
  // Distance of initial line to top right corner, as opposed to starting
  // at point (0, w)
  const initDist = (diagLengthRaw * 0.18);
  // Distance of furthest potential end line to bottom left corner
  const trailingDist = (diagLengthRaw * 0.1);
  // Distance of the diagonal of the rectangle
  const diagLength = diagLengthRaw - (initDist + trailingDist);
  // Distance between parallel lines
  const diagLineGap = (diagLength / numLines);
  const diagLineStrokeWidth = (diagLength * 0.1).toFixed(2);
  // Compute the initial x coordinate of the first line based on specified
  // initial distance from top right corner
  // 45 degree lines means perpendicular line to top right corner
  // c^2 = a^2 + b^2 where a == b
  // Find the initial x coordinate (y == 0) to derive linear function from
  const initXCoordDist = (w - Math.sqrt(2 * (initDist ** 2)));
  const pathSegments = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < numLines; i++) {
    // Vertical transformation of linear function scalar value
    // As m == 1, use distance between parallel lines to compute hypotenuse
    // of equilateral triangle which will be the vertical transformation scalar
    // to apply to the linear function
    // Then scale by line index for each line
    const v = Math.sqrt(2 * (diagLineGap ** 2)) * i;
    // Linear functions derived from initial X coordinate, known slope
    const findY = (x) => ((x - initXCoordDist) + v);
    const findX = (y) => ((y + initXCoordDist) - v);
    let x1 = 0;
    let y1 = findY(x1);
    let x2 = w;
    let y2 = findY(x2);
    // Snap coordinates to bounding box
    if (y1 < 0) {
      x1 = findX(0);
      y1 = 0;
    }
    if (y2 > h) {
      x2 = findX(h);
      y2 = h;
    }
    const x1Str = (x1 - (extendBoundsPadding / 2)).toFixed(2);
    const y1Str = (y1 - (extendBoundsPadding / 2)).toFixed(2);
    const x2Str = (x2 - (extendBoundsPadding / 2)).toFixed(2);
    const y2Str = (y2 - (extendBoundsPadding / 2)).toFixed(2);
    pathSegments.push(`M${x1Str},${y1Str}L${x2Str},${y2Str}`);
  }
  return {
    cellW,
    cellH,
    diagLineStrokeWidth,
    diagLinesPathD: pathSegments.join(' '),
    foregroundPoints: `0,0 ${cellW - nudgeDiagFill},0 0,${cellH}`,
  };
})();

const DiagHalfAndHalfPattern = (inProps) => {
  const props = resolveProps(diagHalfAndHalfPatternDefaultProps, inProps);
  const {
    id,
    color,
    diagColor,
    diagColorFillOpacity,
    secondaryDiagColor,
  } = props;
  const {
    cellW,
    cellH,
    diagLineStrokeWidth,
    diagLinesPathD,
    foregroundPoints,
  } = DIAG_HALF_AND_HALF_GEOMETRY;
  return (
    <pattern
      id={id}
      x={0}
      y={0}
      width={1}
      height={1}
      patternUnits="objectBoundingBox"
      patternContentUnits="userSpaceOnUse"
    >
      {/* Diagonal lines background */}
      <rect
        x={0}
        y={0}
        width={cellW}
        height={cellH}
        fill={secondaryDiagColor}
        fillOpacity={diagColorFillOpacity}
      />
      {/* Diagonal lines, top right to bottom left, 45 degree angle (slope = 1) */}
      <path
        d={diagLinesPathD}
        stroke={diagColor}
        strokeWidth={diagLineStrokeWidth}
        strokeLinecap="square"
      />
      {/* Half solid fill foreground */}
      <polygon points={foregroundPoints} fill={color} />
    </pattern>
  );
};
DiagHalfAndHalfPattern.propTypes = {
  id: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  diagColor: PropTypes.string.isRequired,
  diagColorFillOpacity: PropTypes.number.isRequired,
  secondaryDiagColor: PropTypes.string,
};

/**
   COLOR SCHEMES
   Statuses are drawn in one of the AVAILABILITY_COLOR_SCHEMES, see CELL_ATTRS_BY_COLOR_SCHEME
*/
const { NEON_BLUE, NEON_GREEN, COLOR_VISION_ACCESSIBLE } = AVAILABILITY_COLOR_SCHEMES;

// Colors of the NEON green color scheme
export const NEON_GREEN_PALETTE = {
  AVAILABLE: '#2E7D32', // Dark green: data published and ready
  EXPECTED: '#66BB6A', // Light green: data anticipated soon
  PARTIAL: '#FDD835', // Yellow: incomplete data available
  POTENTIAL: '#1976D2', // Blue: data might be available
  NOT_COLLECTED: '#616161', // Dark gray: data was not collected
  NOT_PLANNED: '#9E9E9E', // Light gray: data never planned
  PROVISIONAL_BACKGROUND: '#E8F5E9', // Very light green: behind provisional data stripes
};

// Colors of the color vision accessible color scheme, from the NEON blue, gold, and grey ramps.
// Statuses drawn in the same fill style differ in lightness as well as hue, as differences in
// lightness remain with every type of color vision deficiency.
export const COLOR_VISION_ACCESSIBLE_PALETTE = {
  AVAILABLE: COLORS.NEON_BLUE[700],
  PROVISIONAL_BACKGROUND: '#ffffff',
  EXPECTED: COLORS.NEON_BLUE[800],
  POTENTIAL: COLORS.GOLD[900],
  NOT_PLANNED: COLORS.GREY[300],
  NOT_COLLECTED: COLORS.GOLD[700],
  NOT_AVAILABLE: COLORS.GREY[200],
};

// Mixed statuses are filled with patterns of the same shapes in every color scheme, only in
// different colors, unless a color scheme sets:
// * stripedProvisionalHalf: mixed available and provisional cells are split like the other mixed
//   statuses, with the provisional half striped the same as provisional cells (see CELL_STRIPES)
// * borderlessSplits: the other mixed statuses are drawn without a border
// Pattern ids are unique to each color scheme as charts in different schemes may share a page.
const MIXED_PATTERNS = {
  [NEON_BLUE]: {
    ids: {
      mixedAvailableProvisional: 'mixedAvailableProvisionalPattern',
      mixedSomeAvailability: 'mixedSomeAvailabilityPattern',
      mixedNoAvailability: 'mixedNoAvailabilityPattern',
    },
    colors: {
      available: COLORS.NEON_BLUE[700],
      provisionalBackground: COLORS.NEON_BLUE[50],
      notAvailable: COLORS.GREY[200],
      otherStatuses: COLORS.GOLD[400],
    },
  },
  [NEON_GREEN]: {
    ids: {
      mixedAvailableProvisional: 'neonGreenMixedAvailableProvisionalPattern',
      mixedSomeAvailability: 'neonGreenMixedSomeAvailabilityPattern',
      mixedNoAvailability: 'neonGreenMixedNoAvailabilityPattern',
    },
    colors: {
      available: NEON_GREEN_PALETTE.AVAILABLE,
      provisionalBackground: NEON_GREEN_PALETTE.PROVISIONAL_BACKGROUND,
      notAvailable: COLORS.GREY[200],
      otherStatuses: NEON_GREEN_PALETTE.PARTIAL,
    },
  },
  [COLOR_VISION_ACCESSIBLE]: {
    ids: {
      mixedAvailableProvisional: 'colorVisionAccessibleMixedAvailableProvisionalPattern',
      mixedSomeAvailability: 'colorVisionAccessibleMixedSomeAvailabilityPattern',
      mixedNoAvailability: 'colorVisionAccessibleMixedNoAvailabilityPattern',
    },
    colors: {
      available: COLOR_VISION_ACCESSIBLE_PALETTE.AVAILABLE,
      provisionalBackground: COLOR_VISION_ACCESSIBLE_PALETTE.PROVISIONAL_BACKGROUND,
      notAvailable: COLOR_VISION_ACCESSIBLE_PALETTE.NOT_AVAILABLE,
      otherStatuses: COLOR_VISION_ACCESSIBLE_PALETTE.NOT_COLLECTED,
    },
    stripedProvisionalHalf: true,
    borderlessSplits: true,
  },
};

const svgDefsDefaultProps = {
  colorScheme: DEFAULT_AVAILABILITY_COLOR_SCHEME,
};

// Patterns referenced by cells in a color scheme
export const SvgDefs = (inProps) => {
  const props = resolveProps(svgDefsDefaultProps, inProps);
  const { ids, colors, stripedProvisionalHalf } = MIXED_PATTERNS[
    resolveColorScheme(props.colorScheme)
  ];
  return (
    <svg width="0px" height="0px">
      <defs>
        {stripedProvisionalHalf ? (
          <HalfAndHalfPattern
            id={ids.mixedAvailableProvisional}
            color={colors.available}
            secondaryColor={colors.provisionalBackground}
          />
        ) : (
          <DiagHalfAndHalfPattern
            id={ids.mixedAvailableProvisional}
            color={colors.available}
            diagColor={colors.available}
            diagColorFillOpacity={0.25}
            secondaryDiagColor={colors.provisionalBackground}
          />
        )}
        <DiagLinesPattern
          id="partialSelectionPattern"
          color={COLORS.LIGHT_BLUE[300]}
          secondaryColor={COLORS.LIGHT_BLUE[100]}
        />
        <HalfAndHalfPattern
          id={ids.mixedSomeAvailability}
          color={colors.available}
          secondaryColor={colors.otherStatuses}
        />
        <HalfAndHalfPattern
          id={ids.mixedNoAvailability}
          color={colors.notAvailable}
          secondaryColor={colors.otherStatuses}
        />
      </defs>
    </svg>
  );
};
SvgDefs.propTypes = {
  colorScheme: AvailabilityPropTypes.colorScheme,
};

/**
   CELLS
*/
const thinStrokeAttrs = {
  strokeWidth: '0.8px',
  width: `${SVG.CELL_WIDTH - 0.8}px`,
  height: `${SVG.CELL_HEIGHT - 0.8}px`,
  rx: `${SVG.CELL_RX * 1.5}px`,
  nudge: 0.4,
};
const midStrokeAttrs = {
  strokeWidth: '1.15px',
  width: `${SVG.CELL_WIDTH - 1.15}px`,
  height: `${SVG.CELL_HEIGHT - 1.15}px`,
  rx: `${SVG.CELL_RX * 1.25}px`,
  nudge: 0.60,
};
const fatStrokeAttrs = {
  strokeWidth: '1.5px',
  width: `${SVG.CELL_WIDTH - 1.5}px`,
  height: `${SVG.CELL_HEIGHT - 1.5}px`,
  rx: `${SVG.CELL_RX}px`,
  nudge: 0.75,
};
const noStrokeAttrs = {
  stroke: null,
  strokeWidth: null,
  width: `${SVG.CELL_WIDTH}px`,
  height: `${SVG.CELL_HEIGHT}px`,
  rx: `${SVG.CELL_RX * 2}px`,
  nudge: 0,
};
// Mixed statuses are drawn the same in every color scheme, only in different colors (see SvgDefs),
// unless a color scheme draws them differently (see MIXED_PATTERNS)
const getMixedCellAttrs = (colorScheme) => {
  const { ids, colors, borderlessSplits } = MIXED_PATTERNS[colorScheme];
  const splitStrokeAttrs = borderlessSplits ? noStrokeAttrs : thinStrokeAttrs;
  return {
    'mixed-available-provisional': {
      fill: `url(#${ids.mixedAvailableProvisional})`,
      stroke: colors.available,
      ...thinStrokeAttrs,
    },
    'mixed some availability': {
      fill: `url(#${ids.mixedSomeAvailability})`,
      stroke: colors.available,
      ...splitStrokeAttrs,
    },
    'mixed no availability': {
      fill: `url(#${ids.mixedNoAvailability})`,
      stroke: colors.otherStatuses,
      ...splitStrokeAttrs,
    },
  };
};
// NEON blue color scheme
export const CELL_ATTRS = {
  available: {
    fill: COLORS.NEON_BLUE[700],
    ...noStrokeAttrs,
  },
  'available-provisional': {
    // Striped, see CELL_STRIPES
    fill: COLORS.NEON_BLUE[50],
    stroke: COLORS.NEON_BLUE[700],
    ...midStrokeAttrs,
  },
  'not available': {
    fill: COLORS.GREY[200],
    ...noStrokeAttrs,
  },
  tombstoned: {
    // #708090 slate gray
    // #5A6673 darker slate gray
    // #727C8C more modified hue towards gray
    // #272727 greyscale of available blue color (rgba(39, 39, 39, 0.9))
    // COLORS.GREY[500]
    fill: 'rgba(39, 39, 39, 0.9)',
    ...noStrokeAttrs,
  },
  'not collected': {
    fill: COLORS.GOLD[400],
    ...noStrokeAttrs,
  },
  expected: {
    fill: '#ffffff',
    stroke: COLORS.NEON_BLUE[700],
    ...fatStrokeAttrs,
  },
  tentative: {
    fill: '#ffffff',
    stroke: COLORS.BROWN[300],
    ...fatStrokeAttrs,
  },
  'not expected': {
    fill: '#ffffff',
    stroke: COLORS.GREY[200],
    ...fatStrokeAttrs,
  },
  partial: {
    // Striped, see CELL_STRIPES
    fill: '#ffffff',
    stroke: COLORS.GOLD[400],
    ...fatStrokeAttrs,
  },
  ...getMixedCellAttrs(NEON_BLUE),
};
// NEON green color scheme: released data are solid and only provisional data are striped
const NEON_GREEN_CELL_ATTRS = {
  available: {
    fill: NEON_GREEN_PALETTE.AVAILABLE,
    ...noStrokeAttrs,
  },
  'available-provisional': {
    // Striped, see CELL_STRIPES
    fill: NEON_GREEN_PALETTE.PROVISIONAL_BACKGROUND,
    stroke: NEON_GREEN_PALETTE.AVAILABLE,
    ...midStrokeAttrs,
  },
  // Statuses without a NEON green color are drawn as in the NEON blue scheme
  'not available': CELL_ATTRS['not available'],
  tombstoned: CELL_ATTRS.tombstoned,
  'not collected': {
    fill: NEON_GREEN_PALETTE.NOT_COLLECTED,
    ...noStrokeAttrs,
  },
  expected: {
    fill: NEON_GREEN_PALETTE.EXPECTED,
    ...noStrokeAttrs,
  },
  tentative: {
    fill: NEON_GREEN_PALETTE.POTENTIAL,
    ...noStrokeAttrs,
  },
  'not expected': {
    fill: NEON_GREEN_PALETTE.NOT_PLANNED,
    ...noStrokeAttrs,
  },
  partial: {
    fill: NEON_GREEN_PALETTE.PARTIAL,
    ...noStrokeAttrs,
  },
  ...getMixedCellAttrs(NEON_GREEN),
};
// Color vision accessible color scheme: final statuses are solid, partial versions of them are
// striped in the same color with a thin border, future statuses are outlined, and mixed statuses
// are split diagonally between the statuses they mix
const COLOR_VISION_ACCESSIBLE_CELL_ATTRS = {
  available: {
    fill: COLOR_VISION_ACCESSIBLE_PALETTE.AVAILABLE,
    ...noStrokeAttrs,
  },
  'available-provisional': {
    // Striped, see CELL_STRIPES
    fill: COLOR_VISION_ACCESSIBLE_PALETTE.PROVISIONAL_BACKGROUND,
    stroke: COLOR_VISION_ACCESSIBLE_PALETTE.AVAILABLE,
    ...thinStrokeAttrs,
  },
  'not available': {
    fill: COLOR_VISION_ACCESSIBLE_PALETTE.NOT_AVAILABLE,
    ...noStrokeAttrs,
  },
  tombstoned: CELL_ATTRS.tombstoned,
  'not collected': {
    fill: COLOR_VISION_ACCESSIBLE_PALETTE.NOT_COLLECTED,
    ...noStrokeAttrs,
  },
  partial: {
    // Striped, see CELL_STRIPES
    fill: '#ffffff',
    stroke: COLOR_VISION_ACCESSIBLE_PALETTE.NOT_COLLECTED,
    ...thinStrokeAttrs,
  },
  expected: {
    fill: '#ffffff',
    stroke: COLOR_VISION_ACCESSIBLE_PALETTE.EXPECTED,
    ...fatStrokeAttrs,
  },
  tentative: {
    fill: '#ffffff',
    stroke: COLOR_VISION_ACCESSIBLE_PALETTE.POTENTIAL,
    ...fatStrokeAttrs,
  },
  'not expected': {
    fill: '#ffffff',
    stroke: COLOR_VISION_ACCESSIBLE_PALETTE.NOT_PLANNED,
    ...fatStrokeAttrs,
  },
  ...getMixedCellAttrs(COLOR_VISION_ACCESSIBLE),
};
export const CELL_ATTRS_BY_COLOR_SCHEME = {
  [NEON_BLUE]: CELL_ATTRS,
  [NEON_GREEN]: NEON_GREEN_CELL_ATTRS,
  [COLOR_VISION_ACCESSIBLE]: COLOR_VISION_ACCESSIBLE_CELL_ATTRS,
};
export const getCellAttrs = (colorScheme) => (
  CELL_ATTRS_BY_COLOR_SCHEME[resolveColorScheme(colorScheme)]
);

/**
   CELL STRIPES
   Striped statuses are drawn as a cell with a solid fill and diagonal stripes on top as plain
   polygons, rather than filling each cell with a <pattern>. Browsers build a separate pattern
   tile for every element that references a pattern, which is slow to render with many striped
   cells in view. Stripes are the color of the cell border and are clipped to the middle of the
   border, so they blend into it without an anti-aliasing seam. They are the same for every cell,
   so they are computed once and placed at a cell with getPath(x, y), where x and y are the cell
   position as given to JsxCell. Which statuses are striped depends on the color scheme. A status
   may also be striped over only the provisional half of a cell split with a HalfAndHalfPattern
   (see MIXED_PATTERNS), where the stripes are clipped to the split as well.
*/
// Clip a convex polygon to the half plane where sign * ((y - x) - offset) >= 0
const clipToStripeEdge = (points, offset, sign) => {
  const clipped = [];
  points.forEach((point, idx) => {
    const next = points[(idx + 1) % points.length];
    const side = sign * ((point[1] - point[0]) - offset);
    const nextSide = sign * ((next[1] - next[0]) - offset);
    if (side >= 0) { clipped.push(point); }
    if ((side >= 0) !== (nextSide >= 0)) {
      const ratio = side / (side - nextSide);
      clipped.push([
        point[0] + (ratio * (next[0] - point[0])),
        point[1] + (ratio * (next[1] - point[1])),
      ]);
    }
  });
  return clipped;
};

// Polygons (with points in hundredths of a pixel) of the stripes within a convex polygon
const getStripePolygons = (polygon) => {
  const offsets = polygon.map(([x, y]) => y - x);
  const polygons = [];
  for (
    let stripeIdx = Math.floor(Math.min(...offsets) / STRIPE_PERIOD);
    (stripeIdx * STRIPE_PERIOD) < Math.max(...offsets);
    stripeIdx += 1
  ) {
    const offset = stripeIdx * STRIPE_PERIOD;
    const points = clipToStripeEdge(
      clipToStripeEdge(polygon, offset, 1),
      offset + STRIPE_WIDTH,
      -1,
    )
      .map(([x, y]) => [toHundredths(x), toHundredths(y)])
      .filter(([x, y], pointIdx, allPoints) => {
        const [prevX, prevY] = allPoints[(pointIdx + allPoints.length - 1) % allPoints.length];
        return (x !== prevX) || (y !== prevY);
      });
    // Skip stripes that only touch the polygon (no area)
    const doubleArea = points.reduce((acc, [x, y], pointIdx) => {
      const [nextX, nextY] = points[(pointIdx + 1) % points.length];
      return acc + ((x * nextY) - (nextX * y));
    }, 0);
    if (doubleArea !== 0) { polygons.push(points); }
  }
  return polygons;
};

// Stripes over a cell, or over only the lower right half of a cell split from its top right to
// its bottom left corner (the secondary half of a HalfAndHalfPattern fill)
const buildCellStripes = (cellAttrs, lowerRightHalf = false) => {
  const {
    nudge = 0,
    width,
    height,
    stroke: fill,
  } = cellAttrs;
  // The cell rect, i.e. the middle of its border
  const [x0, y0] = [nudge, nudge];
  const [x1, y1] = [nudge + parseFloat(width), nudge + parseFloat(height)];
  const polygons = getStripePolygons(lowerRightHalf
    ? [[x1, y0], [x1, y1], [x0, y1]]
    : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
  if (!polygons.length) { return { fill, getPath: () => '' }; }
  // Everything after the first point is relative path data, so it fits a cell at any position
  let relativePath = '';
  polygons.forEach((points, polygonIdx) => {
    if (polygonIdx > 0) {
      const [prevStartX, prevStartY] = polygons[polygonIdx - 1][0];
      const dx = formatHundredths(points[0][0] - prevStartX);
      const dy = formatHundredths(points[0][1] - prevStartY);
      relativePath += `m${dx},${dy}`;
    }
    points.forEach(([x, y], pointIdx) => {
      if (pointIdx === 0) { return; }
      const dx = x - points[pointIdx - 1][0];
      const dy = y - points[pointIdx - 1][1];
      if (dy === 0) {
        relativePath += `h${formatHundredths(dx)}`;
      } else if (dx === 0) {
        relativePath += `v${formatHundredths(dy)}`;
      } else {
        relativePath += `l${formatHundredths(dx)},${formatHundredths(dy)}`;
      }
    });
    relativePath += 'z';
  });
  const [startX, startY] = polygons[0][0];
  return {
    fill,
    getPath: (x, y) => {
      const pathX = formatHundredths(toHundredths(x) + startX);
      const pathY = formatHundredths(toHundredths(y) + startY);
      return `M${pathX},${pathY}${relativePath}`;
    },
  };
};

// NEON blue color scheme
export const CELL_STRIPES = {
  'available-provisional': buildCellStripes(CELL_ATTRS['available-provisional']),
  partial: buildCellStripes(CELL_ATTRS.partial),
};
export const CELL_STRIPES_BY_COLOR_SCHEME = {
  [NEON_BLUE]: CELL_STRIPES,
  [NEON_GREEN]: {
    'available-provisional': buildCellStripes(NEON_GREEN_CELL_ATTRS['available-provisional']),
  },
  [COLOR_VISION_ACCESSIBLE]: {
    'available-provisional': buildCellStripes(
      COLOR_VISION_ACCESSIBLE_CELL_ATTRS['available-provisional'],
    ),
    partial: buildCellStripes(COLOR_VISION_ACCESSIBLE_CELL_ATTRS.partial),
    'mixed-available-provisional': buildCellStripes(
      COLOR_VISION_ACCESSIBLE_CELL_ATTRS['mixed-available-provisional'],
      true,
    ),
  },
};
export const getCellStripes = (colorScheme) => (
  CELL_STRIPES_BY_COLOR_SCHEME[resolveColorScheme(colorScheme)]
);

/**
   Create a function that gets the stripes of all striped cells in a month column of a grid, as
   { key, fill, d } path data for each stripe fill. Columns are built once and cached, so panning
   only builds the months coming into view.
   * rowCount: number of rows in the grid
   * getStatus(rowIdx, month): status of a cell
   * getMonthX(month): x position of the cells for a month
   * getRowY(rowIdx): y position of the cells for a row
   * colorScheme: color scheme of the cells (defaults to DEFAULT_AVAILABILITY_COLOR_SCHEME)
*/
export const createStripeColumnGetter = ({
  rowCount,
  getStatus,
  getMonthX,
  getRowY,
  colorScheme = DEFAULT_AVAILABILITY_COLOR_SCHEME,
}) => {
  const cellStripes = getCellStripes(colorScheme);
  const columns = {};
  return (month) => {
    if (!columns[month]) {
      const x = getMonthX(month);
      const pathsByFill = {};
      for (let rowIdx = 0; rowIdx < rowCount; rowIdx += 1) {
        const stripes = cellStripes[getStatus(rowIdx, month)];
        if (stripes) {
          if (!pathsByFill[stripes.fill]) { pathsByFill[stripes.fill] = []; }
          pathsByFill[stripes.fill].push(stripes.getPath(x, getRowY(rowIdx)));
        }
      }
      columns[month] = Object.keys(pathsByFill).map((fill) => ({
        key: `${month} ${fill}`,
        fill,
        d: pathsByFill[fill].join(''),
      }));
    }
    return columns[month];
  };
};

const jsxCellDefaultProps = { x: 0, y: 0, colorScheme: DEFAULT_AVAILABILITY_COLOR_SCHEME };

export const JsxCell = (inProps) => {
  const props = resolveProps(jsxCellDefaultProps, inProps);
  const {
    status,
    x,
    y,
    colorScheme,
  } = props;
  const { nudge = 0, ...attrs } = getCellAttrs(colorScheme)[status];
  const stripes = getCellStripes(colorScheme)[status];
  return (
    <>
      <rect x={x + nudge} y={y + nudge} rx={`${SVG.CELL_RX}px`} {...attrs} />
      {stripes ? <path d={stripes.getPath(x, y)} fill={stripes.fill} /> : null}
    </>
  );
};
JsxCell.propTypes = {
  status: PropTypes.oneOf(Object.keys(VALID_ENHANCED_STATUSES)).isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  colorScheme: AvailabilityPropTypes.colorScheme,
};
