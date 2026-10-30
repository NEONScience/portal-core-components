import React from 'react';

import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { keyframes } from 'tss-react';

import { formatCount, formatShare } from './windRoseChartUtil';
import { WindRoseQualityFilter } from './windRoseUtil';

import { COLORS } from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';

const SIZE = 40;
const CENTER = SIZE / 2;
const STROKE_WIDTH = 5;
const RADIUS = CENTER - (STROKE_WIDTH / 2) - 1;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CHECK_PATH = 'M14 20.5L18 24.5L26 15.5';
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_OUT_BACK = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const fillIn = keyframes`
  from {
    stroke-dashoffset: ${CIRCUMFERENCE};
  }
`;

const popIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.3);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const useStyles = makeStyles()((theme: NeonTheme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  ring: {
    display: 'block',
    flexShrink: 0,
    width: `${SIZE}px`,
    height: `${SIZE}px`,
  },
  // Neutral so the unvalidated share is not mistaken for a wind speed bin color
  track: {
    fill: 'none',
    stroke: COLORS.GREY[100],
    strokeWidth: STROKE_WIDTH,
  },
  arc: {
    fill: 'none',
    stroke: COLORS.GREEN[600],
    strokeWidth: STROKE_WIDTH,
    strokeLinecap: 'round',
    strokeDasharray: CIRCUMFERENCE,
    transition: `stroke-dashoffset 700ms ${EASE_OUT}, opacity 150ms linear`,
    animation: `${fillIn} 900ms ${EASE_OUT}`,
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      animation: 'none',
    },
  },
  // A round line cap would otherwise draw a dot for an empty arc
  arcEmpty: {
    opacity: 0,
  },
  check: {
    fill: 'none',
    stroke: COLORS.GREEN[600],
    strokeWidth: 2.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    transformBox: 'fill-box',
    transformOrigin: 'center',
    // Pops in as the ring finishes filling
    animation: `${popIn} 400ms ${EASE_OUT_BACK} 450ms both`,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
  value: {
    display: 'block',
    fontWeight: 600,
    lineHeight: 1.3,
    fontVariantNumeric: 'tabular-nums',
  },
  caption: {
    display: 'block',
    lineHeight: 1.3,
    color: theme.palette.text.secondary,
    fontVariantNumeric: 'tabular-nums',
  },
}));

export interface WindRoseQualityMeterProps {
  // Number of Quality Flag validated observations in the period
  validated: number;
  // Number of observations in the period, regardless of quality flags
  all: number;
  qualityFilter: WindRoseQualityFilter;
}

/**
 * Ring showing the share of the shown observations that are Quality Flag validated
 */
const WindRoseQualityMeter: React.FC<WindRoseQualityMeterProps> = (
  props: WindRoseQualityMeterProps,
): React.JSX.Element => {
  const { classes, cx } = useStyles();
  const { validated, all, qualityFilter }: WindRoseQualityMeterProps = props;
  const isValidatedOnly = qualityFilter === WindRoseQualityFilter.VALIDATED;
  const shown = isValidatedOnly ? validated : all;
  const share = (shown > 0) ? Math.min(validated / shown, 1) : 0;
  const isComplete = (shown > 0) && (validated >= shown);
  const tooltip = isValidatedOnly
    ? `Showing only Quality Flag validated observations (${formatShare(validated, all)} of all `
      + `${formatCount(all)})`
    : `${formatCount(all - validated)} of ${formatCount(all)} observations fail `
      + 'windSpeedFinalQF or windDirFinalQF';
  return (
    <Tooltip title={tooltip} describeChild disableInteractive>
      <div className={classes.root}>
        <svg
          className={classes.ring}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
          focusable="false"
        >
          <circle className={classes.track} cx={CENTER} cy={CENTER} r={RADIUS} />
          <circle
            className={cx(classes.arc, (validated <= 0) && classes.arcEmpty)}
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
            style={{ strokeDashoffset: CIRCUMFERENCE * (1 - share) }}
          />
          {!isComplete ? null : <path className={classes.check} d={CHECK_PATH} />}
        </svg>
        <div>
          <Typography variant="body1" component="span" className={classes.value}>
            {formatShare(validated, shown)}
          </Typography>
          <Typography variant="caption" component="span" className={classes.caption}>
            {`${formatCount(validated)} of ${formatCount(shown)}`}
          </Typography>
        </div>
      </div>
    </Tooltip>
  );
};

export default WindRoseQualityMeter;
