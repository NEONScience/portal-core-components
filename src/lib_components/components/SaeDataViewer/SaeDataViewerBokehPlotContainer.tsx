import React, { useLayoutEffect, useRef, useId } from 'react';

import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import ErrorCard from '../Card/ErrorCard';
import WarningCard from '../Card/WarningCard';
import { makeStyles } from '../Theme/makeStyles';
import { NeonTheme } from '../Theme/types';
import { exists, isStringNonEmpty } from '../../util/typeUtil';

import SaeDataViewerContext, {
  SaeDataViewerContextState,
  FetchStatus,
  BokehPlotStatus,
  ControlStatus,
  BokehDataStatus,
} from './SaeDataViewerContext';

import './bokeh-overrides.css';

const useStyles = makeStyles()((theme: NeonTheme) => ({
  stateContainer: {
    margin: theme.spacing(4, 0, 4, 0),
  },
  loadingInfoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(6, 0, 3, 0),
  },
  progressContainer: {
    marginRight: theme.spacing(3),
  },
  skeletonTitle: {
    margin: theme.spacing(1, 0, 0, 0),
  },
  skeletonContainer: {
    padding: theme.spacing(0, 4, 0, 4),
  },
  skeleton: {
    margin: theme.spacing(1, 0, 4, 0),
  },
}));

const SaeDataViewerBokehPlotContainer: React.FC = (): React.JSX.Element => {
  const { classes } = useStyles();
  const bokehPlotId = useId();
  const bokehPlotContainerRef = useRef<HTMLDivElement | null>(null);
  const state = SaeDataViewerContext.useSaeDataViewerContextState();
  const dispatch = SaeDataViewerContext.useSaeDataViewerContextDispatch();
  const {
    bokehPlot: {
      plotStatus,
      data,
      dataStatus,
      message: bokehPlotDataMessage,
    },
    bokehPlotFetch: {
      fetchStatus,
    },
    controlsState: {
      status: controlStatus,
      statusMessage: controlStatusMessage,
    },
  }: SaeDataViewerContextState = state;
  const loading = (fetchStatus === FetchStatus.FETCHING)
    || (fetchStatus === FetchStatus.IDLE)
    || ((plotStatus === BokehPlotStatus.IDLE) && (dataStatus === BokehDataStatus.DATA_AVAILABLE));
  const hasInvalidControlState = (controlStatus === ControlStatus.INVALID);
  const hasErrorState = (fetchStatus === FetchStatus.ERROR);
  const plotRendering = (plotStatus === BokehPlotStatus.RENDERING_DATA);
  const hasData = (dataStatus === BokehDataStatus.DATA_AVAILABLE);
  const displayBokehPlot = (plotStatus === BokehPlotStatus.COMPLETED)
    && !hasInvalidControlState
    && hasData;
  useLayoutEffect(() => {
    if (!exists(bokehPlotContainerRef) || !exists(bokehPlotContainerRef.current)) {
      return () => {};
    }
    const bokehPlotContainer = (bokehPlotContainerRef.current as HTMLDivElement);
    // Use MutationObserver to detect when the DOM updates with the plot
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          if (dispatch) {
            dispatch({ type: 'setBokehPlotStatusCompleted' });
          }
        }
      });
    });
    // Start observing the plot element for changes
    mutationObserver.observe(bokehPlotContainer, { childList: true, subtree: true });
    return () => {
      if (!mutationObserver) { return; }
      mutationObserver.disconnect();
    };
  }, [dispatch, bokehPlotContainerRef]);
  useLayoutEffect(() => {
    if (!exists(bokehPlotContainerRef) || !exists(bokehPlotContainerRef.current)) {
      return;
    }
    const bokehPlotContainer = (bokehPlotContainerRef.current as HTMLDivElement);
    if (!exists(data) || !hasData) {
      bokehPlotContainer.innerHTML = '';
      return;
    }
    if (dispatch) {
      dispatch({ type: 'setBokehPlotStatusRendering' });
    }
    // Intentionally disabling type checking here for the window.Bokeh property
    // as we would prefer to not have to leak the "Bokeh" property into
    // the portal-core-components library (and elsewhere) as a whole
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.Bokeh.embed.embed_item(data, bokehPlotContainer.id);
  }, [dispatch, bokehPlotContainerRef, data, hasData]);
  const bokehPlotStyle = {
    display: displayBokehPlot ? 'block' : 'none',
  };
  const renderErrorState = (): React.JSX.Element => {
    if (!hasErrorState) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }
    return (
      <div className={classes.stateContainer}>
        <ErrorCard
          title="SAE Data Viewer Error"
          message="An error occurred while generating the SAE Data Viewer. Please try again momentarily."
        />
      </div>
    );
  };
  const renderNoDataState = (): React.JSX.Element => {
    if (hasData || loading || plotRendering) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }
    const details = isStringNonEmpty(bokehPlotDataMessage)
      ? bokehPlotDataMessage as string
      : 'There is currently no data available for the specified data product, site, or date range.';
    return (
      <div className={classes.stateContainer}>
        <WarningCard
          title="SAE Data Viewer - No Data Available for Selection"
          message={details}
        />
      </div>
    );
  };
  const renderInvalidControlState = (): React.JSX.Element => {
    if (!hasInvalidControlState) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }
    return (
      <div className={classes.stateContainer}>
        <WarningCard
          title="SAE Data Viewer Invalid Selection"
          message={controlStatusMessage || 'Invalid selection detected'}
        />
      </div>
    );
  };
  const renderLoadingState = (): React.JSX.Element => {
    if (hasErrorState) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }
    if (!loading && !plotRendering) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }
    const details = plotRendering
      ? 'Generating plots...'
      : 'Loading data...';
    return (
      <div className={classes.stateContainer}>
        <div className={classes.loadingInfoContainer}>
          <CircularProgress className={classes.progressContainer} />
          <Typography variant="h5" component="h3">
            {details}
          </Typography>
        </div>
        <div className={classes.skeletonContainer}>
          <Skeleton variant="rectangular" height={20} width={200} className={classes.skeletonTitle} />
          <Skeleton variant="rectangular" height={370} width="100%" className={classes.skeleton} />
        </div>
        <div className={classes.skeletonContainer}>
          <Skeleton variant="rectangular" height={20} width={200} className={classes.skeletonTitle} />
          <Skeleton variant="rectangular" height={370} width="100%" className={classes.skeleton} />
        </div>
      </div>
    );
  };
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        {renderErrorState()}
        {renderInvalidControlState()}
        {renderNoDataState()}
        {renderLoadingState()}
        { /* eslint-disable-next-line react/self-closing-comp */ }
        <div
          id={`bokehPlot-${bokehPlotId}`}
          className="bokehPlot"
          ref={bokehPlotContainerRef}
          style={bokehPlotStyle}
        >
        </div>
      </Grid>
    </Grid>
  );
};

export default SaeDataViewerBokehPlotContainer;
