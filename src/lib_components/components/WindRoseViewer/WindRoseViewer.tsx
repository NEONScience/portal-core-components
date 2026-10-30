import React, { useState } from 'react';

import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

import Provider, {
  FetchStatusState,
  LOGIN_REQUIRED_MESSAGE,
  useStateContext,
  useWindRoseViewerAccess,
  WindRoseAggregation,
  WindRoseViewerDataState,
  WindRoseViewerState,
} from './Context';
import WindRoseCalendar from './WindRoseCalendar';
import WindRoseChart from './WindRoseChart';
import WindRoseControls, { WindRoseAggregationToggle } from './WindRoseControls';
import WindRoseDayNavigator from './WindRoseDayNavigator';
import WindRoseLegend from './WindRoseLegend';
import WindRoseQualityMeter from './WindRoseQualityMeter';
import WindRoseViewerLimitedCard from './WindRoseViewerLimitedCard';
import {
  DEFAULT_WIND_ROSE_COLOR_SCHEME,
  resolveWindRoseColorScheme,
  WindRoseColorScheme,
} from './colorSchemes';
import { WindRoseAggregate, WindRoseQualityFilter } from './windRoseUtil';
import {
  buildSectors,
  formatCount,
  formatDay,
  formatMonth,
  formatSpeed,
  getPrevailingSector,
} from './windRoseChartUtil';

import ComponentErrorBoundary from '../Error/ComponentErrorBoundary';
import DataProductCitation from '../Citation/DataProductCitation';
import ErrorCard from '../Card/ErrorCard';
import ReleaseChip from '../Chip/ReleaseChip';
import NeonAuthContext from '../NeonContext/NeonAuthContext';
import NeonContext from '../NeonContext/NeonContext';
import { COLORS } from '../Theme/Theme';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { Nullable, Undef } from '../../types/core';
import { AsyncStateType } from '../../types/asyncFlow';
import { exists, isStringNonEmpty } from '../../util/typeUtil';
import { resolveProps } from '../../util/defaultProps';

import NeonLogo from '../../images/NSF-NEON-logo.png';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  root: {
    width: '100%',
  },
  card: {
    width: '100%',
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1, 2),
    padding: theme.spacing(2.5, 3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  productCode: {
    color: theme.palette.text.secondary,
  },
  controls: {
    padding: theme.spacing(2, 3),
    backgroundColor: COLORS.GREY[50],
    borderTop: `1px solid ${COLORS.GREY[200]}`,
    borderBottom: `1px solid ${COLORS.GREY[200]}`,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  body: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: theme.spacing(3, 5),
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  chartColumn: {
    flex: '3 1 400px',
    minWidth: 0,
  },
  chartHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing(1, 2),
  },
  sideColumn: {
    flex: '2 1 280px',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  overline: {
    display: 'block',
    lineHeight: 1.6,
    color: theme.palette.text.secondary,
  },
  stats: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1, 4),
    margin: theme.spacing(1.5, 0, 2, 0),
  },
  statLabel: {
    display: 'block',
    fontSize: '0.6875rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: theme.palette.text.secondary,
  },
  statValue: {
    fontWeight: 600,
  },
  chartContainer: {
    position: 'relative',
    maxWidth: '600px',
    margin: '0 auto',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  overlayMessage: {
    maxWidth: '360px',
  },
  errorIcon: {
    color: COLORS.RED[400],
  },
  infoIcon: {
    color: COLORS.GOLD[500],
  },
  navigator: {
    marginTop: theme.spacing(2),
  },
  loading: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  citationContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2, 3),
    borderTop: `1px solid ${COLORS.GREY[200]}`,
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start',
      padding: theme.spacing(2),
    },
  },
  neonLogo: {
    flexShrink: 0,
    maxHeight: theme.spacing(5),
  },
  citationText: {
    flex: '1 1 auto',
    minWidth: 0,
  },
  citation: {
    color: theme.palette.grey[400],
  },
}));

interface StatProps {
  label: string;
  value: React.ReactNode;
}

const Stat: React.FC<StatProps> = (props: StatProps): React.JSX.Element => {
  const { classes } = useStyles();
  const { label, value }: StatProps = props;
  return (
    <div>
      <span className={classes.statLabel}>{label}</span>
      {(typeof value !== 'string') ? value : (
        <Typography variant="body1" component="span" className={classes.statValue}>
          {value}
        </Typography>
      )}
    </div>
  );
};

interface WindRoseViewerContentProps {
  colorScheme: WindRoseColorScheme;
}

interface ColorSchemeSelection {
  colorScheme: WindRoseColorScheme;
  // The colorScheme prop when the selection was made
  propColorScheme: WindRoseColorScheme;
}

const WindRoseViewer: React.FC<WindRoseViewerContentProps> = (
  props: WindRoseViewerContentProps,
): React.JSX.Element => {
  const { classes, cx } = useStyles();
  const { colorScheme: propColorScheme }: WindRoseViewerContentProps = props;
  const state: WindRoseViewerState = useStateContext();
  const { isLoginRequired } = useWindRoseViewerAccess();
  const [
    colorSchemeSelection,
    setColorSchemeSelection,
  ] = useState<Nullable<ColorSchemeSelection>>(null);
  // A palette chosen in the legend applies until the colorScheme prop changes
  const colorScheme = (colorSchemeSelection?.propColorScheme === propColorScheme)
    ? colorSchemeSelection.colorScheme
    : propColorScheme;
  const {
    product,
    productCode,
    release,
    fetchState,
    dataStateMessage,
    query,
    aggregation,
    qualityFilter,
    selectedDay,
    data,
    dataSets,
  }: WindRoseViewerState = state;
  const productFetchState = fetchState.product as Nullable<FetchStatusState>;
  // Without signing in, the product and data of a release are never fetched
  if (!exists(product) && !isLoginRequired) {
    if (productFetchState?.status === AsyncStateType.FAILED) {
      return (
        <div className={classes.root}>
          <WindRoseViewerLimitedCard />
          <ErrorCard
            title="Wind Rose Viewer"
            message="The data product could not be loaded. Please try again later."
          />
        </div>
      );
    }
    return (
      <div className={classes.root}>
        <WindRoseViewerLimitedCard />
        <Skeleton variant="rectangular" width="100%" height={640} />
      </div>
    );
  }
  const dataFetchState = fetchState.data as Nullable<FetchStatusState>;
  const dataStatus = dataFetchState ? dataFetchState.status : AsyncStateType.IDLE;
  const isLoading = !isLoginRequired && ((dataStatus === AsyncStateType.IDLE)
    || (dataStatus === AsyncStateType.WORKING));
  const isDaily = aggregation === WindRoseAggregation.DAILY;
  const site = query.sites[0] || '';
  const month = query.months[0] || null;
  const getPeriodAggregate = (dataSet: WindRoseViewerDataState): Nullable<WindRoseAggregate> => {
    if (!isDaily) {
      return dataSet.monthly;
    }
    return (selectedDay && dataSet.daily[selectedDay]) || null;
  };
  const aggregate = getPeriodAggregate(data);
  const hasData = !!aggregate && (aggregate.samples > 0);
  const hasOnlyUnvalidatedData = (qualityFilter === WindRoseQualityFilter.VALIDATED)
    && (data.days.length <= 0)
    && (dataSets[WindRoseQualityFilter.ALL].days.length > 0);
  // Calm observations have no direction, so are not drawn on the wind rose
  const isAllCalm = !!aggregate && (aggregate.samples > 0)
    && (aggregate.calm >= aggregate.samples);
  const prevailing = getPrevailingSector(buildSectors(aggregate));
  let heading = month ? formatMonth(month) : '';
  if (isDaily) {
    heading = selectedDay ? formatDay(selectedDay, 'dddd, MMMM D, YYYY') : '';
  }
  const aggregationLabel = isDaily ? 'Daily wind rose' : 'Monthly wind rose';
  const chartTitle = [aggregationLabel, site, heading].filter(isStringNonEmpty).join(', ');
  const productNameValue = exists(product)
    ? (product as Record<string, unknown>).productName
    : null;
  const productName = isStringNonEmpty(productNameValue) ? productNameValue as string : null;

  const renderOverlay = (): Nullable<React.JSX.Element> => {
    if (isLoginRequired) {
      return (
        <div className={classes.overlay} role="status">
          <InfoIcon fontSize="large" className={classes.infoIcon} />
          <Typography variant="subtitle2" className={classes.overlayMessage}>
            {LOGIN_REQUIRED_MESSAGE}
          </Typography>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div className={classes.overlay} role="status">
          <CircularProgress />
          <Typography variant="subtitle2">Loading wind data…</Typography>
        </div>
      );
    }
    if (dataStatus === AsyncStateType.FAILED) {
      return (
        <div className={classes.overlay} role="status">
          <ErrorIcon fontSize="large" className={classes.errorIcon} />
          <Typography variant="subtitle2" className={classes.overlayMessage}>
            No wind rose data is available for the selected site, month and sensor positions.
          </Typography>
        </div>
      );
    }
    if (hasOnlyUnvalidatedData) {
      return (
        <div className={classes.overlay} role="status">
          <InfoIcon fontSize="large" className={classes.infoIcon} />
          <Typography variant="subtitle2" className={classes.overlayMessage}>
            {'No Quality Flag validated observations are available for this month. '
              + 'Select All to include observations that fail a quality flag.'}
          </Typography>
        </div>
      );
    }
    if (!hasData) {
      const period = isDaily ? 'day' : 'month';
      const message = isStringNonEmpty(dataStateMessage) ? ` ${dataStateMessage}` : '';
      return (
        <div className={classes.overlay} role="status">
          <InfoIcon fontSize="large" className={classes.infoIcon} />
          <Typography variant="subtitle2" className={classes.overlayMessage}>
            {`No wind rose data is available for this ${period}.${message}`}
          </Typography>
        </div>
      );
    }
    if (isAllCalm) {
      return (
        <div className={classes.overlay} role="status">
          <InfoIcon fontSize="large" className={classes.infoIcon} />
          <Typography variant="subtitle2" className={classes.overlayMessage}>
            {`Every observation for this ${isDaily ? 'day' : 'month'} was calm (0 m/s), `
              + 'so there are no wind directions to show.'}
          </Typography>
        </div>
      );
    }
    return null;
  };

  const renderCitation = (): Nullable<React.JSX.Element> => {
    if (!isStringNonEmpty(productCode)) {
      return null;
    }
    return (
      <div className={classes.citationContainer}>
        <img
          title="NEON"
          alt="NEON Logo"
          className={classes.neonLogo}
          src={NeonLogo.src}
        />
        <div className={classes.citationText}>
          <DataProductCitation
            showTextOnly
            disableConditional
            productCode={productCode as string}
            release={release}
            textOnlyProps={{ variant: 'caption', cssClass: classes.citation }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <WindRoseViewerLimitedCard />
      <Card className={classes.card}>
        <div className={classes.header}>
          <div>
            <Typography variant="h5" component="h3">{productName || productCode}</Typography>
            {!productName ? null : (
              <Typography variant="body2" className={classes.productCode}>
                {productCode}
              </Typography>
            )}
          </div>
          {!isStringNonEmpty(release) ? null : (
            <ReleaseChip
              chipLabel={release as string}
              tooltipTitle={`Showing data from ${release}`}
            />
          )}
        </div>
        <div className={classes.controls}>
          <WindRoseControls />
        </div>
        <div className={classes.body}>
          <div className={classes.chartColumn}>
            <div className={classes.chartHeader}>
              <div>
                <Typography variant="overline" component="div" className={classes.overline}>
                  {[aggregationLabel, site].filter(isStringNonEmpty).join(' · ')}
                </Typography>
                <Typography variant="h5" component="h4">
                  {heading || '\u00a0'}
                </Typography>
              </div>
              <WindRoseAggregationToggle />
            </div>
            <div className={classes.stats}>
              <Stat
                label="Observations"
                value={hasData ? formatCount((aggregate as WindRoseAggregate).samples) : '-'}
              />
              <Stat
                label="Quality Flag validated"
                value={!hasData ? '-' : (
                  <WindRoseQualityMeter
                    validated={
                      getPeriodAggregate(dataSets[WindRoseQualityFilter.VALIDATED])?.samples || 0
                    }
                    all={getPeriodAggregate(dataSets[WindRoseQualityFilter.ALL])?.samples || 0}
                    qualityFilter={qualityFilter}
                  />
                )}
              />
              <Stat
                label="Prevailing wind from"
                value={prevailing ? `${prevailing.direction} (${prevailing.degrees}°)` : '-'}
              />
              <Stat
                label="Mean speed"
                value={hasData ? formatSpeed((aggregate as WindRoseAggregate).meanSpeed) : '-'}
              />
            </div>
            <div className={classes.chartContainer}>
              <WindRoseChart aggregate={aggregate} colorScheme={colorScheme} title={chartTitle} />
              {renderOverlay()}
            </div>
            {!isDaily ? null : (
              <div className={classes.navigator}>
                <WindRoseDayNavigator />
              </div>
            )}
          </div>
          <div className={classes.sideColumn}>
            <WindRoseLegend
              aggregate={hasData ? aggregate : null}
              colorScheme={colorScheme}
              onColorSchemeChange={(nextColorScheme: WindRoseColorScheme) => {
                setColorSchemeSelection({ colorScheme: nextColorScheme, propColorScheme });
              }}
            />
            {!month ? null : (
              <>
                <Divider />
                <div className={cx(isLoading && classes.loading)}>
                  <WindRoseCalendar colorScheme={colorScheme} />
                </div>
              </>
            )}
          </div>
        </div>
        {renderCitation()}
      </Card>
    </div>
  );
};

export interface WindRoseViewerProps {
  productCode: Nullable<string>;
  release: Undef<string>;
  // Color scheme to draw the wind speed bins in, one of WIND_ROSE_COLOR_SCHEMES.
  // Users may switch color schemes with the palette toggle in the legend.
  colorScheme?: WindRoseColorScheme;
}
const windRoseViewerDefaultProps: WindRoseViewerProps = {
  productCode: null,
  release: undefined,
  colorScheme: DEFAULT_WIND_ROSE_COLOR_SCHEME,
};

const WindRoseViewerContainer: React.FC<WindRoseViewerProps> = (
  inProps: WindRoseViewerProps,
): React.JSX.Element => {
  const props = resolveProps(windRoseViewerDefaultProps, inProps) as WindRoseViewerProps;
  const { productCode, release, colorScheme }: WindRoseViewerProps = props;
  return (
    <ComponentErrorBoundary onReset={() => { /* noop for boundary reset */ }}>
      <Provider productCode={productCode} release={release}>
        <WindRoseViewer colorScheme={resolveWindRoseColorScheme(colorScheme)} />
      </Provider>
    </ComponentErrorBoundary>
  );
};

const WrappedWindRoseViewerContainer = NeonContext.getWrappedComponent(
  NeonAuthContext.getWrappedComponent(WindRoseViewerContainer),
);

export default WrappedWindRoseViewerContainer;
