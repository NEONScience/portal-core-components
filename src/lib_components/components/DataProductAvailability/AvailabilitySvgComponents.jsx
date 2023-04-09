/* eslint-disable import/prefer-default-export, max-len */

import React from 'react';
import PropTypes from 'prop-types';

import { SVG, VALID_ENHANCED_STATUSES } from './AvailabilityUtils';

import Theme, { COLORS } from '../Theme/Theme';

/**
   SVG_DEFS
*/
const DiagLinesPattern = (props) => {
  const { id, color, secondaryColor } = props;
  const width = SVG.CELL_WIDTH;
  const height = SVG.CELL_HEIGHT / 4;
  return (
    <pattern
      id={id}
      width={width}
      height={height}
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <rect x={0} y={0} width={width} height={(height / 2) - 0.25} fill={color} />
      <rect x={0} y={(height / 2) - 0.25} width={width} height={(height / 2) + 0.25} fill={secondaryColor} />
    </pattern>
  );
};
DiagLinesPattern.propTypes = {
  id: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  secondaryColor: PropTypes.string,
};
DiagLinesPattern.defaultProps = {
  secondaryColor: '#ffffff',
};
const HalfAndHalfPattern = (props) => {
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
HalfAndHalfPattern.defaultProps = {
  secondaryColor: '#ffffff',
};
const DiagHalfAndHalfPattern = (props) => {
  const {
    id,
    color,
    diagColor,
    secondaryDiagColor,
  } = props;
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
  const extendBoundsPadding = 2;
  const w = SVG.CELL_WIDTH + extendBoundsPadding;
  const h = SVG.CELL_HEIGHT + extendBoundsPadding;
  // Nudge the half fill color to prevent background from initial
  // line from top right corner consuming the color at normal
  // viewing levels. Ensures it looks visually appropriate for half color
  // fill and half diag line pattern.
  // Will be based on initDist
  const nudgeDiagFill = 0;
  const numLines = 4;
  // Distance of initial line to top right corner, as opposed to starting
  // at point (0, w)
  const initDist = 2.5;
  // Distance of furthest potential end line to bottom left corner
  const trailingDist = 0;
  // Distance of the diagonal of the rectangle
  const diagLength = Math.sqrt((cellW ** 2) + (cellH ** 2)) - (initDist + trailingDist);
  // Distance between parallel lines
  const diagLineGap = (diagLength / numLines);
  const diagLineStrokeWidth = 1;
  // Compute the initial x coordinate of the first line based on specified
  // initial distance from top right corner
  // 45 degree lines means perpendicular line to top right corner
  // c^2 = a^2 + b^2 where a == b
  // Find the initial x coordinate (y == 0) to derive linear function from
  const initXCoordDist = (w - Math.sqrt(2 * (initDist ** 2)));
  const coords = [];
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
    coords.push({
      x1: (x1 - (extendBoundsPadding / 2)).toFixed(2),
      y1: (y1 - (extendBoundsPadding / 2)).toFixed(2),
      x2: (x2 - (extendBoundsPadding / 2)).toFixed(2),
      y2: (y2 - (extendBoundsPadding / 2)).toFixed(2),
    });
  }
  return (
    <pattern
      id={id}
      width={1}
      height={1}
      patternContentUnits="userSpaceOnUse"
    >
      {/* Diagonal lines background */}
      <polygon points={`0,${cellH} ${cellW},0 ${cellW},${cellH}`} fill={secondaryDiagColor} />
      {/* Diagonal lines, top right to bottom left, 45 degree angle (slope = 1) */}
      {coords.map((coord) => (
        <line
          key={`DiagHalfAndHalfPatternKey-${coord.x1}-${coord.y1}-${coord.x2}-${coord.y2}`}
          x1={coord.x1}
          y1={coord.y1}
          x2={coord.x2}
          y2={coord.y2}
          stroke={diagColor}
          strokeWidth={diagLineStrokeWidth}
        />
      ))}
      {/* Half solid fill foreground */}
      <polygon points={`0,0 ${cellW - nudgeDiagFill},0 0,${cellH - nudgeDiagFill}`} fill={color} />
    </pattern>
  );
};
DiagHalfAndHalfPattern.propTypes = {
  id: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  diagColor: PropTypes.string.isRequired,
  secondaryDiagColor: PropTypes.string,
};
DiagHalfAndHalfPattern.defaultProps = {
  secondaryDiagColor: '#ffffff',
};

export const SvgDefs = () => (
  <svg width="0px" height="0px">
    <defs>
      <DiagLinesPattern id="availableProvisionalPattern" color={COLORS.NEON_BLUE[700]} secondaryColor={COLORS.NEON_BLUE[50]} />
      <DiagHalfAndHalfPattern
        id="mixedAvailableProvisionalPattern"
        color={COLORS.NEON_BLUE[700]}
        diagColor={COLORS.NEON_BLUE[700]}
        secondaryDiagColor="#ffffff"
      />
      <DiagLinesPattern id="beingProcessedPattern" color={COLORS.NEON_BLUE[700]} />
      <DiagLinesPattern id="delayedPattern" color={COLORS.GOLD[400]} />
      <DiagLinesPattern id="partialSelectionPattern" color={COLORS.LIGHT_BLUE[300]} secondaryColor={COLORS.LIGHT_BLUE[100]} />
      <HalfAndHalfPattern id="mixedSomeAvailabilityPattern" color={COLORS.NEON_BLUE[700]} secondaryColor={COLORS.GOLD[400]} />
      <HalfAndHalfPattern id="mixedNoAvailabilityPattern" color={Theme.palette.grey[200]} secondaryColor={COLORS.GOLD[400]} />
    </defs>
  </svg>
);

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
export const CELL_ATTRS = {
  available: {
    fill: COLORS.NEON_BLUE[700],
    ...noStrokeAttrs,
  },
  'available-provisional': {
    fill: 'url(#availableProvisionalPattern)',
    stroke: COLORS.NEON_BLUE[700],
    ...midStrokeAttrs,
  },
  'mixed-available-provisional': {
    fill: 'url(#mixedAvailableProvisionalPattern)',
    stroke: COLORS.NEON_BLUE[700],
    ...thinStrokeAttrs,
  },
  'not available': {
    fill: Theme.palette.grey[200],
    ...noStrokeAttrs,
  },
  tombstoned: {
    // #708090 slate gray
    // #5A6673 darker slate gray
    // #727C8C more modified hue towards gray
    // #272727 greyscale of available blue color (rgba(39, 39, 39, 0.9))
    // Theme.palette.grey[500]
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
    stroke: Theme.palette.grey[200],
    ...fatStrokeAttrs,
  },
  'being processed': {
    fill: 'url(#beingProcessedPattern)',
    stroke: COLORS.NEON_BLUE[700],
    ...fatStrokeAttrs,
  },
  delayed: {
    fill: 'url(#delayedPattern)',
    stroke: COLORS.GOLD[400],
    ...fatStrokeAttrs,
  },
  'mixed some availability': {
    fill: 'url(#mixedSomeAvailabilityPattern)',
    stroke: COLORS.NEON_BLUE[700],
    ...thinStrokeAttrs,
  },
  'mixed no availability': {
    fill: 'url(#mixedNoAvailabilityPattern)',
    stroke: COLORS.GOLD[400],
    ...thinStrokeAttrs,
  },
};

export const JsxCell = (props) => {
  const { status, x, y } = props;
  const { nudge = 0, ...attrs } = CELL_ATTRS[status];
  return (
    <rect x={x + nudge} y={y + nudge} rx={`${SVG.CELL_RX}px`} {...attrs} />
  );
};
JsxCell.propTypes = {
  status: PropTypes.oneOf(Object.keys(VALID_ENHANCED_STATUSES)).isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
};
JsxCell.defaultProps = { x: 0, y: 0 };
