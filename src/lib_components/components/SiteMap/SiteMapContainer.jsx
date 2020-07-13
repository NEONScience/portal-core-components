import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';

import uniqueId from 'lodash/uniqueId';

import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Warning';
import DownArrowIcon from '@material-ui/icons/ArrowDropDown';
import LeftArrowIcon from '@material-ui/icons/ArrowLeft';
import VertResizeIcon from '@material-ui/icons/Height';

import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import SiteMapFilters from './SiteMapFilters';
import SiteMapLeaflet from './SiteMapLeaflet';
import SiteMapTable from './SiteMapTable';
import {
  VIEWS,
  FEATURES,
  FEATURE_TYPES,
  MIN_CONTAINER_HEIGHT,
  getDynamicAspectRatio,
} from './SiteMapUtils';

const progressId = `sitemap-progress-${uniqueId()}`;

const boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';
const useStyles = makeStyles(theme => ({
  outerContainer: {
    zIndex: 0,
    width: '100%',
    position: 'relative',
  },
  contentContainer: {
    width: '100%',
    height: '0px', // Necessary to set a fixed aspect ratio from props (using paddingBottom)
    position: 'relative',
    backgroundColor: theme.colors.NEON_BLUE[200],
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
    borderRadius: '2px',
  },
  featuresContainer: {
    backgroundColor: theme.palette.grey[100],
    height: '100%',
    position: 'absolute',
    zIndex: 1000,
    top: '0px',
    right: '0px',
    boxShadow: '-3px 0 5px 0px rgba(0,0,0,0.5)',
    padding: theme.spacing(1),
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
    margin: 0,
    '& > span:nth-child(2)': {
      width: '100%',
    },
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
  resizeButton: {
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 999,
    bottom: '0px',
    right: '0px',
    width: '26px',
    height: '26px',
    padding: 'unset',
    borderRadius: '2px 0px 2px 0px',
    border: `1px solid ${theme.colors.LIGHT_BLUE[500]}`,
    cursor: 'grab',
    '&:hover, &:active': {
      color: theme.colors.LIGHT_BLUE[400],
      borderColor: theme.colors.LIGHT_BLUE[400],
      backgroundColor: theme.palette.grey[50],
    },
    '&:active': {
      cursor: 'row-resize !important',
    },
    '& svg': {
      fontSize: '1.15rem !important',
    },
  },
  resizeBorder: {
    position: 'absolute',
    border: `3px solid ${theme.colors.LIGHT_BLUE[500]}`,
    top: '0px',
    left: '0px',
    width: '100%',
    zIndex: 998,
    display: 'none',
  },
}));

const SiteMapContainer = (props) => {
  const classes = useStyles(Theme);
  const { unusableVerticalSpace = 0 } = props;

  const [neonContextState] = NeonContext.useNeonContextState();

  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  console.log('CONTAINER STATE:', state);
  const isLoading = state.overallFetch.expected !== state.overallFetch.completed;

  const { aspectRatio, view: { current: view } } = state;
  const contentDivProps = {
    className: classes.contentContainer,
    style: { paddingBottom: `${(aspectRatio.currentValue || 0.75) * 100}%` },
  };

  const featuresRef = useRef(null);
  const contentDivRef = useRef(null);
  const resizeBorderRef = useRef(null);
  const resizeButtonRef = useRef(null);

  /**
     Vertical Resize Hooks
  */
  const [resizeDragging, setResizeDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(null);
  const dragDeltaY = useRef(null);
  const resizeVerticallyDragStart = useCallback((event) => {
    if (!resizeBorderRef.current || !contentDivRef.current) { return; }
    setDragStartY(event.clientY);
    setResizeDragging(true);
    dragDeltaY.current = 0;
    resizeBorderRef.current.style.display = 'block';
    resizeBorderRef.current.style.height = `${contentDivRef.current.clientHeight}px`;
  }, [setDragStartY, setResizeDragging, dragDeltaY]);
  const resizeVerticallyDrag = useCallback((event) => {
    if (
      !resizeDragging || !resizeBorderRef.current
        || dragStartY === null || event.clientY === 0
    ) { return; }
    dragDeltaY.current = event.clientY - dragStartY;
    const newHeight = Math.max(
      contentDivRef.current.clientHeight + dragDeltaY.current,
      MIN_CONTAINER_HEIGHT,
    );
    resizeBorderRef.current.style.height = `${newHeight}px`;
  }, [resizeDragging, dragStartY, dragDeltaY]);
  const resizeVerticallyDragEnd = useCallback(() => {
    const finalHeight = Math.max(
      contentDivRef.current.clientHeight + dragDeltaY.current,
      MIN_CONTAINER_HEIGHT,
    );
    setDragStartY(null);
    setResizeDragging(false);
    dragDeltaY.current = null;
    resizeBorderRef.current.style.display = 'none';
    resizeButtonRef.current.blur();
    const newAspectRatio = finalHeight / aspectRatio.widthReference;
    dispatch({
      type: 'setAspectRatio',
      aspectRatio: newAspectRatio,
      widthReference: aspectRatio.widthReference,
    });
  }, [
    aspectRatio.widthReference,
    dispatch,
    setDragStartY,
    setResizeDragging,
    dragDeltaY,
  ]);

  /**
     Effect - Register event listener to dynamically adjust aspect ratio from viewport dimensions
  */
  useLayoutEffect(() => {
    const handleResize = () => {
      const newAspectRatio = aspectRatio.isDynamic
        ? getDynamicAspectRatio(unusableVerticalSpace)
        : aspectRatio.currentValue;
      dispatch({
        type: 'setAspectRatio',
        aspectRatio: newAspectRatio,
        widthReference: contentDivRef.current ? contentDivRef.current.clientWidth : 0,
      });
    };
    if (!aspectRatio.isDynamic || aspectRatio.currentValue !== null) { return () => {}; }
    handleResize();
    if (!aspectRatio.isDynamic || aspectRatio.resizeEventListenerInitialized) { return () => {}; }
    window.addEventListener('resize', handleResize);
    dispatch({ type: 'setAspectRatioResizeEventListenerInitialized' });
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [unusableVerticalSpace, aspectRatio, dispatch]);

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

  const containerProps = {
    className: classes.outerContainer,
    'aria-busy': isLoading ? 'true' : 'false',
    'data-selenium': 'siteMap-container',
  };

  /**
     Render - Loading Sites
  */
  if (!neonContextState.isFinal) {
    return (
      <div {...containerProps}>
        <div ref={contentDivRef} {...contentDivProps}>
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
      <div {...containerProps}>
        <div ref={contentDivRef} {...contentDivProps}>
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
     Render - Vertical resize Elements
  */
  const renderVerticalResizeButton = () => (
    <IconButton
      draggable
      type="button"
      ref={resizeButtonRef}
      title={`Resize ${view === VIEWS.MAP ? 'map' : 'table'} vertically`}
      className={classes.resizeButton}
      onDragStart={resizeVerticallyDragStart}
      onDrag={resizeVerticallyDrag}
      onDragEnd={resizeVerticallyDragEnd}
    >
      <VertResizeIcon fontSize="small" />
    </IconButton>
  );

  /**
     Render - Single Feature Option
  */
  const renderFeatureOption = (key) => {
    if (!FEATURES[key]) { return null; }
    const feature = FEATURES[key];
    const {
      name: featureName,
      iconSvg,
      featureShape,
      style: featureStyle = {},
    } = feature;
    const handleChange = (event) => {
      dispatch({
        type: 'setFilterFeatureVisibility',
        feature: key,
        visible: event.target.checked,
      });
    };
    let icon = null;
    if (iconSvg) {
      icon = <img alt={featureName} src={iconSvg} className={classes.featureIcon} />;
    } else if (featureShape === 'Circle') {
      const circleProps = {
        cx: 14,
        cy: 14,
        r: 8,
        style: {
          fill: featureStyle.color ? `${featureStyle.color}88` : 'none',
          stroke: featureStyle.color || null,
          strokeWidth: 3,
        },
      };
      icon = (
        <svg width="28" height="28" className={classes.featureIcon}>
          <circle {...circleProps} />
        </svg>
      );
    } else if (featureShape === 'Polyline') {
      const polylineProps = {
        points: '1.5,21.5 15,18.5 13,9.5 26.5,6.5',
        style: {
          fill: 'none',
          stroke: featureStyle.color || null,
          strokeWidth: 3,
          strokeLinejoin: 'bevel',
        },
      };
      icon = (
        <svg width="28" height="28" className={classes.featureIcon}>
          <polyline {...polylineProps} />
        </svg>
      );
    } else if (featureShape === 'Polygon') {
      const rectProps = {
        width: 25,
        height: 15,
        x: 1.5,
        y: 6.5,
        rx: 3,
        style: {
          fill: featureStyle.color || null,
          stroke: featureStyle.color || null,
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
    let allChildren = [];
    let visibleChildren = [];
    let indeterminate = false;
    let collapsed = false;
    let label = null;
    const tooltip = feature.description || null;
    if (feature.type === FEATURE_TYPES.GROUP) {
      collapsed = state.filters.features.collapsed.has(key);
      const collapseTitle = `${collapsed ? 'Expand' : 'Collapse'} ${feature.name}`;
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
      label = (
        <div className={classes.featureOptionLabel} style={{ justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600 }}>
            {feature.name}
          </span>
          <IconButton
            size="small"
            title={collapseTitle}
            aria-label={collapseTitle}
            onClick={(event) => {
              event.preventDefault();
              // We use a setTimeout here so the icon doesn't change before the click event bubbles
              // Without it the target of the click event is an SVG that no longer exists in the
              // DOM tree, and is thus not contained in the features container, and is thus seen as
              // a click outside that will close the features container, when we know it's not.
              window.setTimeout(() => {
                dispatch({
                  type: `setFilterFeature${collapsed ? 'Expanded' : 'Collapsed'}`,
                  feature: key,
                });
              }, 0);
            }}
          >
            {collapsed ? (
              <LeftArrowIcon fontSize="inherit" />
            ) : (
              <DownArrowIcon fontSize="inherit" />
            )}
          </IconButton>
        </div>
      );
    } else {
      label = (
        <div className={classes.featureOptionLabel}>
          {icon}
          <span>
            {feature.name}
          </span>
        </div>
      );
    }
    const formControl = (
      <FormControlLabel
        key={key}
        label={label}
        aria-label={tooltip}
        className={classes.featureOptionFormControlLabel}
        control={(
          <Checkbox
            checked={state.filters.features.visible[key]}
            onChange={handleChange}
            color="primary"
            indeterminate={indeterminate}
          />
        )}
      />
    );
    return (
      <div key={key} style={{ width: '100%' }}>
        {tooltip ? (
          <Tooltip
            title={tooltip}
            placement="bottom-start"
            PopperProps={{ className: classes.popper }}
            TransitionComponent={({ children }) => children} // set no transition by mock component
          >
            {formControl}
          </Tooltip>
        ) : formControl}
        {!allChildren.length || collapsed ? null : (
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
  // MuiButtonBase-root MuiIconButton-root makeStyles-resizeButton-201 MuiIconButton-colorPrimary
  return (
    <div {...containerProps} aria-describedby={progressId}>
      {state.filters.position === 'top' ? <SiteMapFilters /> : null}
      <div ref={contentDivRef} {...contentDivProps}>
        {view === VIEWS.MAP ? <SiteMapLeaflet /> : null }
        {view === VIEWS.TABLE ? <SiteMapTable /> : null }
        {renderVerticalResizeButton()}
        {!state.filters.features.open ? null : (
          <div ref={featuresRef} className={classes.featuresContainer}>
            {Object.keys(FEATURES)
              .filter(f => state.filters.features.available[f] && !FEATURES[f].parent)
              .map(renderFeatureOption)}
          </div>
        )}
      </div>
      {renderProgress()}
      {state.filters.position === 'bottom' ? <SiteMapFilters /> : null}
      <div ref={resizeBorderRef} className={classes.resizeBorder} />
    </div>
  );
};

SiteMapContainer.propTypes = {
  unusableVerticalSpace: PropTypes.number,
};

SiteMapContainer.defaultProps = {
  unusableVerticalSpace: 0,
};

export default SiteMapContainer;
