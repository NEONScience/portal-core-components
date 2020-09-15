import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import GlobeIcon from '@material-ui/icons/Language';

import SiteMap from '../SiteMap/SiteMap';
import Theme from '../Theme/Theme';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  appBarTitle: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  buttonIcon: {
    marginLeft: theme.spacing(1),
  },
}));

const SelectSitesButton = (props) => {
  const {
    label,
    buttonProps,
    tooltipProps,
    siteMapProps,
    selectionLimit,
  } = props;

  const classes = useStyles(Theme);
  const [dialogOpen, setDialogOpen] = useState(false);

  let selectSitesTitle = 'Select sites';
  if (typeof selectionLimit === 'number') {
    selectSitesTitle = `Select ${selectionLimit.toString()} site${selectionLimit === 1 ? '' : 's'}`;
  }
  if (Array.isArray(selectionLimit)) {
    const { 0: min, 1: max } = selectionLimit;
    selectSitesTitle = `Select ${min.toString()}-${max.toString()} sites`;
  }

  return (
    <div>
      <Tooltip
        title={`${selectSitesTitle} using the observatory map`}
        aria-label={`${selectSitesTitle} using the observatory map`}
        {...tooltipProps}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={() => setDialogOpen(true)}
          data-selenium="select-sites-button"
          {...buttonProps}
        >
          {label}
          <GlobeIcon className={classes.buttonIcon} />
        </Button>
      </Tooltip>
      <Dialog
        fullScreen
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <AppBar color="secondary" className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="close"
              onClick={() => setDialogOpen(false)}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.appBarTitle}>
              {selectSitesTitle}
            </Typography>
            <Tooltip
              title="Complete selection and return"
              aria-label="Complete selection and return"
            >
              <Button
                color="primary"
                variant="contained"
                onClick={() => {}}
              >
                Save
                <DoneIcon className={classes.buttonIcon} />
              </Button>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <SiteMap
          selection="SITES"
          {...siteMapProps}
        />
      </Dialog>
    </div>
  );
};

const SelectionLimitPropType = (props, propName) => {
  const { [propName]: prop } = props;
  if (typeof prop === 'number' && (!Number.isInteger(prop) || prop < 1)) {
    return new Error(
      `When setting ${propName} as a number it must be an integer greater than 0`,
    );
  }
  if (
    Array.isArray(prop) && (
      prop.length !== 2 || !prop.every(x => Number.isInteger(x) && x > 0) || prop[0] >= prop[1]
    )
  ) {
    return new Error(
      // eslint-disable-next-line max-len
      `When setting ${propName} as an array it must contain exactly two distinct non-zero positive integers in ascending order (e.g. [2, 5])`,
    );
  }
  if (prop !== null) {
    return new Error(
      // eslint-disable-next-line max-len
      `${propName} must be null, a positive non-zero integer, or an array of two ascending non-zero positive integers`,
    );
  }
  return null;
};

SelectSitesButton.propTypes = {
  label: PropTypes.string,
  buttonProps: PropTypes.shape(Button.propTypes),
  tooltipProps: PropTypes.shape(Tooltip.propTypes),
  siteMapProps: PropTypes.shape(SiteMap.propTypes),
  selectionLimit: SelectionLimitPropType,
};

SelectSitesButton.defaultProps = {
  label: 'Map',
  buttonProps: {},
  tooltipProps: {},
  siteMapProps: {},
  selectionLimit: null,
};

const WrappedDownloadDataButton = Theme.getWrappedComponent(SelectSitesButton);

export default WrappedDownloadDataButton;
