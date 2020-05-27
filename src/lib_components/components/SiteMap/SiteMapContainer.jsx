import React, { useRef, useEffect, useLayoutEffect } from 'react';

import uniq from 'lodash/uniq';

import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
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
    backgroundColor: theme.palette.grey[75],
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
    marginRight: theme.spacing(1),
  },
  featureOptionFormControlLabel: {
    width: '100%',
    paddingRight: theme.spacing(1),
    '&:hover, &:focus': {
      backgroundColor: theme.palette.grey[100],
    },
  },
  featureOptionLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  popper: {
    marginLeft: theme.spacing(5),
    marginTop: theme.spacing(0.5),
    zIndex: 1001,
    '& > div': {
      margin: 0,
      padding: theme.spacing(1, 1.5),
      fontSize: '0.85rem',
      fontWeight: 300,
      backgroundColor: theme.palette.grey[800],
    },
    '& a': {
      color: theme.palette.grey[100],
    },
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
    style: { paddingBottom: `${(aspectRatio.currentValue || 0.75) * 100}%` },
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
    if (aspectRatio.currentValue === null) { handleResize(); }
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
    } else if (feature.polylineStyle) {
      const polylineProps = {
        points: '1.5,21.5 15,18.5 13,9.5 26.5,6.5',
        style: {
          fill: 'none',
          stroke: feature.polylineStyle.color || null,
          strokeWidth: 3,
          strokeLinejoin: 'bevel',
        },
      };
      icon = (
        <svg width="28" height="28" className={classes.featureIcon}>
          <polyline {...polylineProps} />
        </svg>
      );
    } else if (feature.style) {
      const rectProps = {
        width: 25,
        height: 15,
        x: 1.5,
        y: 6.5,
        rx: 3,
        style: {
          fill: feature.style.color || null,
          stroke: feature.style.color || null,
          strokeWidth: 2.5,
          fillOpacity: 0.2,
          strokeOpacity: 0.85,
          strokeLinecap: 'round',
          strokeDasharray: feature.style.dashArray || null,
        },
      };
      icon = (
        <svg width="28" height="28" className={classes.featureIcon}>
          <rect {...rectProps} />
        </svg>
      );
    }
    let allChildren = [];
    let visibleChildren = [];
    let indeterminate = false;
    const formControlLabelStyle = {};
    if (feature.type === FEATURE_TYPES.GROUP) {
      allChildren = Object.keys(FEATURES).filter(f => FEATURES[f].parent === key);
      allChildren.sort((a, b) => {
        const { type: aType, name: aName } = FEATURES[a];
        const { type: bType, name: bName } = FEATURES[b];
        if (aType !== bType && (aType === FEATURE_TYPES.GROUP || bType === FEATURE_TYPES.GROUP)) {
          return (bType === FEATURE_TYPES.GROUP ? -1 : 1);
        }
        return (aName < bName ? -1 : 1);
      });
      visibleChildren = allChildren.filter(f => state.filters.features.visible[f]);
      indeterminate = visibleChildren.length > 0 && visibleChildren.length < allChildren.length;
      formControlLabelStyle.fontWeight = 600;
    }
    const tooltip = feature.description || '...';
    const label = (
      <div className={classes.featureOptionLabel}>
        {icon}
        <span style={formControlLabelStyle}>
          {feature.name}
        </span>
      </div>
    );
    return (
      <div key={key}>
        <Tooltip
          title={tooltip}
          placement="bottom-start"
          PopperProps={{ className: classes.popper }}
          TransitionComponent={({ children }) => children} // no transition, must use mock component
        >
          <FormControlLabel
            key={key}
            label={label}
            aria-label={tooltip}
            className={classes.featureOptionFormControlLabel}
            control={(
              <Checkbox
                checked={state.filters.features.visible[key]}
                onChange={handleChange}
                color="secondary"
                indeterminate={indeterminate}
              />
            )}
          />
        </Tooltip>
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

  /**
     Render - Progress Indicator
  */
  const renderProgress = () => {
    const progress = !isLoading || state.overallFetch.expected === 0 ? 0
      : Math.floor((state.overallFetch.completed / state.overallFetch.expected) * 10) * 10;
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
