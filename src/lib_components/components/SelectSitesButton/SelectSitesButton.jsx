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
import {
  DEFAULT_STATE,
  SITE_MAP_PROP_TYPES,
} from '../SiteMap/SiteMapUtils';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
    paddingRight: '0px !important',
  },
  appBarTitle: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  toolbar: {
    padding: '0px 10px 0px 14px',
  },
  toolbarClose: {
    '&:hover': {
      backgroundColor: '#ffffff33',
    },
    '&:not(:hover):not(:focus)': {
      backgroundColor: '#ffffff11',
      border: `1px solid ${theme.palette.primary.main}11`,
    },
  },
  buttonIcon: {
    marginLeft: theme.spacing(1),
  },
}));

const SelectSitesButton = (props) => {
  const {
    label,
    icon,
    dialogTitle,
    buttonProps,
    siteMapProps,
    tooltipProps,
    validItems,
    selectedItems,
    selectionLimit,
    onSave,
  } = props;

  const classes = useStyles(Theme);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selection, setSelection] = useState(DEFAULT_STATE.selection);

  let selectSitesTitle = 'Select sites';
  if (typeof selectionLimit === 'number') {
    selectSitesTitle = selectionLimit === 1
      ? 'Select a site'
      : `Select ${selectionLimit.toString()} sites`;
  }
  if (Array.isArray(selectionLimit)) {
    const { 0: min, 1: max } = selectionLimit;
    selectSitesTitle = min === 1
      ? `Select up to ${max.toString()} sites`
      : `Select ${min.toString()}-${max.toString()} sites`;
  }

  const saveTooltipProps = selection.valid ? {} : {
    disableFocusListener: true,
    disableHoverListener: true,
    disableTouchListener: true,
  };

  const aspectRatio = (window.innerHeight - 64) / window.innerWidth;

  const embedProps = {
    fullscreen: true,
    selection: 'SITES',
    aspectRatio,
    validItems,
    selectedItems,
    selectionLimit,
    onSelectionChange: setSelection,
  };
  const finalEmbedProps = siteMapProps ? {
    ...siteMapProps,
    ...embedProps,
  } : embedProps;

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
          data-selenium="select-sites-button"
          {...buttonProps}
          onClick={() => setDialogOpen(true)}
        >
          {label}
          {icon ? <GlobeIcon className={classes.buttonIcon} fontSize="small" /> : null}
        </Button>
      </Tooltip>
      <Dialog
        fullScreen
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <AppBar color="secondary" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Tooltip
              title="Exit selection without saving"
              aria-label="Exit selection without saving"
            >
              <IconButton
                edge="start"
                color="primary"
                variant="contained"
                aria-label="close"
                size="small"
                className={classes.toolbarClose}
                onClick={() => setDialogOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h5" className={classes.appBarTitle}>
              {dialogTitle || selectSitesTitle}
            </Typography>
            <Tooltip
              title="Complete selection and return"
              aria-label="Complete selection and return"
              {...saveTooltipProps}
            >
              <div>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => { onSave(selection.set); setDialogOpen(false); }}
                  disabled={!selection.valid}
                >
                  Save
                  <DoneIcon className={classes.buttonIcon} />
                </Button>
              </div>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <SiteMap {...finalEmbedProps} />
      </Dialog>
    </div>
  );
};

SelectSitesButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.bool,
  dialogTitle: PropTypes.string,
  buttonProps: PropTypes.shape(Button.propTypes),
  siteMapProps: PropTypes.shape(SITE_MAP_PROP_TYPES),
  tooltipProps: PropTypes.shape(Tooltip.propTypes),
  validItems: SITE_MAP_PROP_TYPES.validItems,
  selectedItems: SITE_MAP_PROP_TYPES.selectedItems,
  selectionLimit: SITE_MAP_PROP_TYPES.selectionLimit,
  onSave: PropTypes.func,
};

SelectSitesButton.defaultProps = {
  label: 'Map',
  icon: true,
  dialogTitle: null,
  buttonProps: {},
  siteMapProps: null,
  tooltipProps: {},
  validItems: null,
  selectedItems: [],
  selectionLimit: null,
  onSave: () => {},
};

const WrappedDownloadDataButton = Theme.getWrappedComponent(SelectSitesButton);

export default WrappedDownloadDataButton;
