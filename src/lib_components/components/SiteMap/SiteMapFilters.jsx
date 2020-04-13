import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Theme from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import { VIEWS } from './SiteMapUtils';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
}));

const SiteMapFilters = () => {
  const classes = useStyles(Theme);
  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  const { view, filters } = state;

  const toggleView = () => {
    dispatch({
      type: 'setView',
      view: view === VIEWS.MAP ? VIEWS.TABLE : VIEWS.MAP,
    });
  };

  const toggleFeatures = () => {
    dispatch({
      type: 'setFilterFeaturesOpen',
      open: !filters.features.open,
    });
  };

  return (
    <div className={classes.row}>
      <Button color="primary" variant="contained" onClick={toggleView}>
        {`View ${view === VIEWS.MAP ? 'Table' : 'Map'}`}
      </Button>
      <Button color="primary" variant="contained" onClick={toggleFeatures}>
        Features
      </Button>
    </div>
  );
};

export default SiteMapFilters;
