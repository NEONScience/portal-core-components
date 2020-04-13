import React, { useLayoutEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import { VIEWS, FEATURES, getDynamicAspectRatio } from './SiteMapUtils';

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
    borderRadius: theme.spacing(1),
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
    // overflowY: 'scroll',
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

  const { view, aspectRatio } = state;
  const contentDivProps = {
    className: classes.contentContainer,
    style: { paddingBottom: `${aspectRatio.currentValue * 100}%` },
  };

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
     Render Method - Single Feature Option
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
    const icon = !feature.iconSvg ? null : (
      <img alt={feature.name} src={feature.iconSvg} className={classes.featureIcon} />
    );
    const label = (
      <React.Fragment>
        {icon}
        {feature.name}
      </React.Fragment>
    );
    const style = { marginLeft: feature.parent ? Theme.spacing(3) : 0 };
    let indeterminate = false;
    if (feature.isParent) {
      const allChildren = Object.keys(FEATURES).filter(f => FEATURES[f].parent === key);
      const visibleChildren = allChildren.filter(f => state.filters.features.visible[f]);
      indeterminate = visibleChildren.length > 0 && visibleChildren.length < allChildren.length;
    }
    return (
      <FormControlLabel
        key={key}
        label={label}
        style={style}
        control={(
          <Checkbox
            checked={state.filters.features.visible[key]}
            onChange={handleChange}
            color="secondary"
            indeterminate={indeterminate}
          />
        )}
      />
    );
  };

  /**
     Render - Functioning Component
  */
  return (
    <div className={classes.outerContainer}>
      <SiteMapFilters />
      <div {...contentDivProps}>
        {view === VIEWS.MAP ? (
          <SiteMapLeaflet />
        ) : (
          <SiteMapTable />
        )}
        {!state.filters.features.open ? null : (
          <div className={classes.featuresContainer}>
            {Object.keys(FEATURES)
              .filter(f => state.filters.features.available[f])
              .map(renderFeatureOption)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteMapContainer;
