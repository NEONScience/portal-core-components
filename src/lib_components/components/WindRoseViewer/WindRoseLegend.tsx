import React, { useId } from 'react';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import {
  getWindRosePalette,
  isWindRoseColorScheme,
  WIND_ROSE_COLOR_SCHEME_LABELS,
  WIND_ROSE_COLOR_SCHEMES,
  WindRoseColorScheme,
} from './colorSchemes';
import { VELOCITY_BIN_LABELS, VELOCITY_BINS, WindRoseAggregate } from './windRoseUtil';
import { formatPercent, getCalmPercent, getVelocityBinPercents } from './windRoseChartUtil';

import { COLORS } from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { Nullable } from '../../types/core';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  header: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '14px 64px minmax(24px, 1fr) 48px',
    alignItems: 'center',
    columnGap: theme.spacing(1),
    padding: theme.spacing(0.25, 0),
  },
  swatch: {
    width: '14px',
    height: '14px',
    borderRadius: '2px',
    boxShadow: `inset 0 0 0 1px ${COLORS.GREY[200]}`,
  },
  // Calm observations are not drawn on the wind rose so have no fill color
  calmSwatch: {
    backgroundColor: '#fff',
    boxShadow: `inset 0 0 0 1px ${COLORS.GREY[300]}`,
  },
  label: {
    fontSize: '0.8125rem',
    whiteSpace: 'nowrap',
  },
  barTrack: {
    height: '6px',
    borderRadius: '3px',
    backgroundColor: COLORS.GREY[50],
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 200ms ease-in-out',
  },
  value: {
    fontSize: '0.8125rem',
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
    color: theme.palette.text.secondary,
  },
  calmNote: {
    display: 'block',
    marginTop: theme.spacing(0.75),
    color: theme.palette.text.secondary,
  },
  paletteContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  paletteLabel: {
    color: theme.palette.text.secondary,
  },
}));

export interface WindRoseLegendProps {
  aggregate: Nullable<WindRoseAggregate>;
  colorScheme: WindRoseColorScheme;
  onColorSchemeChange: (colorScheme: WindRoseColorScheme) => void;
}

interface LegendRow {
  key: string;
  label: string;
  // Fill color, or null when the row is not drawn on the wind rose
  color: Nullable<string>;
  percent: number;
}

const CALM_BAR_COLOR = COLORS.GREY[300];

const WindRoseLegend: React.FC<WindRoseLegendProps> = (
  props: WindRoseLegendProps,
): React.JSX.Element => {
  const { classes, cx } = useStyles();
  const { aggregate, colorScheme, onColorSchemeChange }: WindRoseLegendProps = props;
  const titleId = useId();
  const paletteLabelId = useId();
  const palette = getWindRosePalette(colorScheme);
  const velocityBinPercents = getVelocityBinPercents(aggregate);
  const rows: LegendRow[] = [
    {
      key: 'calm',
      label: 'Calm',
      color: null,
      percent: getCalmPercent(aggregate),
    },
    ...VELOCITY_BINS.map((velocityBin: string, velocityIndex: number): LegendRow => ({
      key: velocityBin,
      label: VELOCITY_BIN_LABELS[velocityBin],
      color: palette[velocityIndex],
      percent: velocityBinPercents[velocityIndex],
    })),
  ];
  const maxPercent = Math.max(...rows.map((row: LegendRow): number => row.percent));
  const hasData = !!aggregate && (aggregate.samples > 0);
  return (
    <section aria-labelledby={titleId}>
      <div className={classes.header}>
        <Typography id={titleId} variant="subtitle2" component="h4">
          Wind speed (m/s)
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Share of observations
        </Typography>
      </div>
      <ul className={classes.list}>
        {rows.map((row: LegendRow): React.JSX.Element => {
          const barWidth = (maxPercent > 0) ? (row.percent / maxPercent) * 100 : 0;
          return (
            <li key={row.key} className={classes.row}>
              <span
                className={cx(classes.swatch, !row.color && classes.calmSwatch)}
                style={row.color ? { backgroundColor: row.color } : undefined}
              />
              <span className={classes.label}>{row.label}</span>
              <span className={classes.barTrack} aria-hidden="true">
                <span
                  className={classes.bar}
                  style={{
                    display: 'block',
                    width: `${barWidth}%`,
                    backgroundColor: row.color || CALM_BAR_COLOR,
                  }}
                />
              </span>
              <span className={classes.value}>{hasData ? formatPercent(row.percent) : '-'}</span>
            </li>
          );
        })}
      </ul>
      <Typography variant="caption" className={classes.calmNote}>
        Calm observations (0 m/s) have no direction and are not drawn on the wind rose.
      </Typography>
      <div className={classes.paletteContainer} data-windrose-download-exclude="true">
        <Typography id={paletteLabelId} variant="caption" className={classes.paletteLabel}>
          Color palette
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          color="primary"
          value={colorScheme}
          aria-labelledby={paletteLabelId}
          onChange={(event: React.MouseEvent<HTMLElement>, value: unknown) => {
            // Clicking the selected button would otherwise leave no color scheme selected
            if (isWindRoseColorScheme(value)) {
              onColorSchemeChange(value);
            }
          }}
        >
          {Object.values(WIND_ROSE_COLOR_SCHEMES).map((value: WindRoseColorScheme) => (
            <ToggleButton key={value} value={value}>
              {WIND_ROSE_COLOR_SCHEME_LABELS[value]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
    </section>
  );
};

export default WindRoseLegend;
