import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import ExpandUpIcon from '@material-ui/icons/ExpandLess';
import ExpandDownIcon from '@material-ui/icons/ExpandMore';

import Theme from '../Theme/Theme';

import SiteMapContext from './SiteMapContext';
import { VIEWS, FETCH_STATUS } from './SiteMapUtils';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleButtonGroup: {
    height: theme.spacing(4),
  },
  toggleButton: {
    height: theme.spacing(4),
    fontWeight: 600,
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    padding: theme.spacing(0, 1.5),
    whiteSpace: 'nowrap',
  },
  // Use !important here to override the Mui-selected class with higher priority
  toggleButtonSelected: {
    color: '#fff !important',
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
}));

const SiteMapFilters = () => {
  const classes = useStyles(Theme);
  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  const { view: { current: view }, filters } = state;

  const handleChangeView = (event, newView) => {
    dispatch({
      type: 'setView',
      view: newView,
    });
  };

  const toggleFeatures = () => {
    dispatch({
      type: 'setFilterFeaturesOpen',
      open: !filters.features.open,
    });
  };

  /**
     Focus Location Form
     TODO: Figure out where this goes long-term. Probably hidden until summoned
  */
  const FOCUS_DISPLAY = 'none'; // 'flex'
  const [location, setLocation] = useState('');
  const jumpToLocation = (event) => {
    event.preventDefault();
    if (location) {
      dispatch({ type: 'setNewFocusLocation', location });
    }
  };
  const focusLocationError = state.focusLocation.fetch.status === FETCH_STATUS.ERROR;
  const helperText = focusLocationError
    ? state.focusLocation.fetch.error
    : 'Any named location with coordinates, e.g. CPER or D12';
  const formStyle = {
    display: FOCUS_DISPLAY,
    alignItems: 'center',
    margin: filters.position === 'top' ? Theme.spacing(1, 0, 1.5, 0) : Theme.spacing(2, 0, 0, 0),
  };
  const renderFocusLocationForm = () => (
    <div style={formStyle}>
      <form onSubmit={jumpToLocation} data-selenium="sitemap-focusLocationForm">
        <TextField
          margin="dense"
          variant="outlined"
          label="Jump to Location"
          helperText={helperText}
          style={{ margin: 'auto' }}
          value={location}
          onChange={(event) => { setLocation(event.target.value); }}
          error={focusLocationError}
        />
        <Button
          size="small"
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginLeft: Theme.spacing(1) }}
        >
          Go
        </Button>
      </form>
    </div>
  );

  /**
     Main Render
  */
  const rowStyle = filters.position === 'top'
    ? { marginBottom: Theme.spacing(1) }
    : { marginTop: Theme.spacing(1) };
  const openIcon = filters.position === 'top' ? <ExpandDownIcon /> : <ExpandUpIcon />;
  const closeIcon = filters.position === 'top' ? <ExpandUpIcon /> : <ExpandDownIcon />;
  return (
    <React.Fragment>
      <div className={classes.row} style={rowStyle}>
        <ToggleButtonGroup
          exclusive
          color="primary"
          variant="outlined"
          size="small"
          className={classes.toggleButtonGroup}
          value={view}
          onChange={handleChangeView}
        >
          {Object.keys(VIEWS).map((key) => {
            const className = key === view
              ? `${classes.toggleButton} ${classes.toggleButtonSelected}`
              : classes.toggleButton;
            return (
              <ToggleButton
                key={key}
                value={key}
                size="small"
                className={className}
                data-selenium={`sitemap-viewButton-${key}`}
              >
                {key}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
        <Button
          size="small"
          color="primary"
          variant={filters.features.open ? 'contained' : 'outlined'}
          endIcon={filters.features.open ? closeIcon : openIcon}
          onClick={toggleFeatures}
          data-selenium="sitemap-featuresButton"
        >
          Features
        </Button>
      </div>
      {renderFocusLocationForm()}
    </React.Fragment>
  );
};

export default SiteMapFilters;
