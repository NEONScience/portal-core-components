import React, { useRef, useEffect, useLayoutEffect } from 'react';

import uniq from 'lodash/uniq';

import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Warning';

import NeonContext from '../NeonContext/NeonContext';
import Theme, { COLORS } from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import SiteMapFilters from './SiteMapFilters';
import SiteMapLeaflet from './SiteMapLeaflet';
import SiteMapTable from './SiteMapTable';
import {
  VIEWS,
  FEATURES,
  FEATURE_TYPES,
  getDynamicAspectRatio,
} from './SiteMapUtils';

const progressId = `sitemap-progress-${uniq()}`;

const boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
const useStyles = makeStyles(theme => ({
  outerContainer: {
    width: '100%',
  },
  contentContainer: {
    width: '100%',
    height: '0px', // Necessary to set a fixed aspect ratio from props (using paddingBottom)
    position: 'relative',
    backgroundColor: COLORS.BLUE[200],
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    boxShadow,
  },
  contentPaper: {
    position: 'absolute',
    width: '70%',
    top: '50%',
    transform: 'translate(0%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  featuresContainer: {
    backgroundColor: 'white',
    height: '100%',
    position: 'absolute',
    zIndex: 1000,
    top: '0px',
    right: '0px',
    boxShadow: '-3px 0 5px 0px rgba(0,0,0,0.5)',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    overflowY: 'auto',
  },
  featureIcon: {
    width: '28px',
    height: '28px',
    marginRight: '4px',
    marginBottom: '-6px',
  },
}));

const SiteMapContainer = () => {
  const classes = useStyles(Theme);

  const [neonContextState] = NeonContext.useNeonContextState();

  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  console.log('CONTAINER STATE:', state);
  const isLoading = state.overallFetch.expected !== state.overallFetch.completed;

  const { view, aspectRatio } = state;
  const contentDivProps = {
    className: classes.contentContainer,
    style: { paddingBottom: `${aspectRatio.currentValue * 100}%` },
  };

  const featuresRef = useRef(null);

  /**
     Effect - Dynamically adjust aspect ratio of content area from viewport dimensions
  */
  useLayoutEffect(() => {
    if (!aspectRatio.isDynamic) { return () => {}; }
    const handleResize = () => {
      const newAspectRatio = getDynamicAspectRatio();
      if (newAspectRatio !== aspectRatio.currentValue) {
        dispatch({ type: 'setAspectRatio', aspectRatio: newAspectRatio });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [aspectRatio, dispatch]);

  /**
     Effect - Monitor all click events and close the features pane if open and clicked outside
  */
  useEffect(() => {
    if (!state.filters.features.open || !featuresRef.current) { return () => {}; }
    const handleClick = (event) => {
      if (featuresRef.current && !featuresRef.current.contains(event.target)) {
        dispatch({ type: 'setFilterFeaturesOpen', open: false });
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [state.filters.features.open, featuresRef, dispatch]);

  /**
     Effect - If NeonContext Data is now available and has not been hydrated into state then do so.
  */
  useEffect(() => {
    if (state.neonContextHydrated || !(neonContextState.isFinal && !neonContextState.hasError)) {
      return;
    }
    dispatch({
      type: 'hydrateNeonContextData',
      neonContextData: neonContextState.data,
    });
  }, [
    state.neonContextHydrated,
    neonContextState.isFinal,
    neonContextState.hasError,
    neonContextState.data,
    dispatch,
  ]);

  /**
     Render - Loading Sites
  */
  if (!neonContextState.isFinal) {
    return (
      <div className={classes.outerContainer}>
        <div {...contentDivProps}>
          <Paper className={classes.contentPaper}>
            <Typography variant="h6" component="h3" gutterBottom>
              Loading Sites...
            </Typography>
            <CircularProgress />
          </Paper>
        </div>
      </div>
    );
  }

  /**
     Render - Error (sites did not loaded)
  */
  if (neonContextState.hasError) {
    return (
      <div className={classes.outerContainer}>
        <div {...contentDivProps}>
          <Paper className={classes.contentPaper}>
            <ErrorIcon fontSize="large" color="error" />
            <Typography variant="h6" component="h3" style={{ marginTop: Theme.spacing(1) }}>
              {`Unable to load sites: ${neonContextState.fetches.sites.error}`}
            </Typography>
          </Paper>
        </div>
      </div>
    );
  }

  /**
     Render - Single Feature Option
  */
  const renderFeatureOption = (key) => {
    if (!FEATURES[key]) { return null; }
    const feature = FEATURES[key];
    const handleChange = (event) => {
      dispatch({
        type: 'setFilterFeatureVisibility',
        feature: key,
        visible: event.target.checked,
      });
    };
    let icon = null;
    if (feature.iconSvg) {
      icon = <img alt={feature.name} src={feature.iconSvg} className={classes.featureIcon} />;
    }
    if (feature.polygonStyle || feature.rectStyle) {
      const featureStyle = (feature.polygonStyle || feature.rectStyle);
      const rectProps = {
        width: feature.rectStyle ? 20 : 25,
        height: feature.rectStyle ? 20 : 15,
        x: feature.rectStyle ? 4 : 1.5,
        y: feature.rectStyle ? 4 : 6.5,
        rx: feature.rectStyle ? 0 : 3,
        style: {
          fill: featureStyle.color,
          stroke: featureStyle.color,
          strokeWidth: 2.5,
          fillOpacity: 0.2,
          strokeOpacity: 0.85,
          strokeLinecap: 'round',
          strokeDasharray: featureStyle.dashArray || null,
        },
      };
      icon = (
        <svg width="28" height="28" className={classes.featureIcon}>
          <rect {...rectProps} />
        </svg>
      );
    }
    const label = (
      <React.Fragment>
        {icon}
        {feature.name}
      </React.Fragment>
    );
    let allChildren = [];
    let visibleChildren = [];
    let indeterminate = false;
    const formControlLabelStyle = {};
    if (feature.type === FEATURE_TYPES.GROUP) {
      allChildren = Object.keys(FEATURES).filter(f => FEATURES[f].parent === key);
      visibleChildren = allChildren.filter(f => state.filters.features.visible[f]);
      indeterminate = visibleChildren.length > 0 && visibleChildren.length < allChildren.length;
      formControlLabelStyle.fontWeight = 600;
    }
    return (
      <div key={key}>
        <FormControlLabel
          key={key}
          label={label}
          style={formControlLabelStyle}
          control={(
            <Checkbox
              checked={state.filters.features.visible[key]}
              onChange={handleChange}
              color="secondary"
              indeterminate={indeterminate}
            />
          )}
        />
        {!allChildren.length ? null : (
          <div style={{ marginLeft: Theme.spacing(3) }}>
            {allChildren
              .filter(f => state.filters.features.available[f])
              .map(renderFeatureOption)}
          </div>
        )}
      </div>
    );
  };

  // TODO: hook this up to a UI element somewhere
  window.jumpTo = location => dispatch({ type: 'setNewFocusLocation', location });

  /**
     Render - Progress Indicator
  */
  const renderProgress = () => {
    const progress = !isLoading || state.overallFetch.expected === 0 ? 0
      : (state.overallFetch.completed / state.overallFetch.expected) * 100;
    const style = isLoading ? {} : { opacity: 0 };
    let variant = 'determinate';
    if (isLoading && state.overallFetch.pendingHierarchy > 0) {
      variant = 'query';
    }
    return <LinearProgress id={progressId} variant={variant} value={progress} style={style} />;
  };

  /**
     Render - Full Component
  */
  return (
    <div
      className={classes.outerContainer}
      aria-describedby={progressId}
      aria-busy={isLoading ? 'true' : 'false'}
    >
      <SiteMapFilters />
      <div {...contentDivProps}>
        {view === VIEWS.MAP ? (
          <SiteMapLeaflet />
        ) : (
          <SiteMapTable />
        )}
        {!state.filters.features.open ? null : (
          <div ref={featuresRef} className={classes.featuresContainer}>
            {Object.keys(FEATURES)
              .filter(f => state.filters.features.available[f] && !FEATURES[f].parent)
              .map(renderFeatureOption)}
          </div>
        )}
      </div>
      {renderProgress()}
    </div>
  );
};

export default SiteMapContainer;
