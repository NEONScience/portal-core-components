import React, { useLayoutEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Warning';

import NeonContext from '../NeonContext/NeonContext';
import Theme, { COLORS } from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import SiteMapFilters from './SiteMapFilters';
import SiteMapLeaflet from './SiteMapLeaflet';
import SiteMapTable from './SiteMapTable';
import { VIEWS, getDynamicAspectRatio } from './SiteMapUtils';

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
  }, [aspectRatio]);

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
      </div>
    </div>
  );
};

export default SiteMapContainer;
