import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Theme from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import { VIEWS, FETCH_STATUS } from './SiteMapUtils';

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

  const [location, setLocation] = useState('');

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

  const jumpToLocation = (event) => {
    event.preventDefault();
    if (location) {
      dispatch({ type: 'setNewFocusLocation', location });
    }
  };

  const error = state.focusLocation.fetch.status === FETCH_STATUS.ERROR;
  const helperText = error
    ? state.focusLocation.fetch.error
    : 'Any named location with coordinates, e.g. CPER or D12';

  return (
    <div className={classes.row}>
      <Button color="primary" variant="contained" onClick={toggleView}>
        {`View ${view === VIEWS.MAP ? 'Table' : 'Map'}`}
      </Button>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <form onSubmit={jumpToLocation}>
          <TextField
            margin="dense"
            variant="outlined"
            label="Jump to Location"
            helperText={helperText}
            style={{ margin: 'auto' }}
            value={location}
            onChange={(event) => { setLocation(event.target.value); }}
            error={error}
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={{ marginLeft: Theme.spacing(1) }}
          >
            Go
          </Button>
        </form>
      </div>
      <Button color="primary" variant="contained" onClick={toggleFeatures}>
        Features
      </Button>
    </div>
  );
};

export default SiteMapFilters;
