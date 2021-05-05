/* eslint-disable import/prefer-default-export, max-len */

import React from 'react';
import PropTypes from 'prop-types';

// import { select } from 'd3-selection';

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

export const SvgDefs = () => (
  <svg width="0px" height="0px">
    <defs>
      <DiagLinesPattern id="availableProvisionalPattern" color={COLORS.NEON_BLUE[700]} secondaryColor={COLORS.NEON_BLUE[100]} />
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
    ...fatStrokeAttrs,
  },
  'not available': {
    fill: Theme.palette.grey[200],
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
