import React, { Suspense, useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import GlobeIcon from '@mui/icons-material/Language';

import Theme from '../Theme/Theme';
import {
  FEATURE_TYPES,
  SITE_MAP_PROP_TYPES,
  getDefaultState,
} from '../SiteMap/SiteMapUtils';
import { resolveProps } from '../../util/defaultProps';

const SiteMap = React.lazy(() => import('../SiteMap/SiteMap'));

const useStyles = makeStyles((theme) => ({
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
  suspenseFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.grey[200],
    fontSize: '1.5em',
  },
}));

const defaultProps = {
  label: 'Map',
  icon: true,
  dialogTitle: null,
  buttonProps: {},
  siteMapProps: null,
  tooltipProps: { children: <div /> },
  validItems: null,
  selectedItems: [],
  selectionLimit: null,
  onSave: () => {},
};

const MapSelectionButton = (inProps) => {
  const props = resolveProps(defaultProps, inProps);
  const {
    label,
    icon,
    dialogTitle: dialogTitleProp,
    buttonProps,
    siteMapProps,
    tooltipProps,
    selection: selectionProp,
    validItems,
    selectedItems,
    selectionLimit,
    onSave,
  } = props;

  const classes = useStyles(Theme);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEntered, setDialogEntered] = useState(false);
  const [selection, setSelection] = useState(getDefaultState().selection);

  let unit = '';
  let units = '';
  if (selectionProp) {
    unit = FEATURE_TYPES[selectionProp].unit || '';
    units = FEATURE_TYPES[selectionProp].units || '';
  }

  let dialogTitle = `Select ${units}`;
  if (typeof selectionLimit === 'number') {
    dialogTitle = selectionLimit === 1
      ? `Select a ${unit}`
      : `Select ${selectionLimit.toString()} ${units}`;
  }
  if (Array.isArray(selectionLimit)) {
    const { 0: min, 1: max } = selectionLimit;
    dialogTitle = min === 1
      ? `Select up to ${max.toString()} ${units}`
      : `Select ${min.toString()}-${max.toString()} ${units}`;
  }

  const saveTooltipProps = selection.valid ? {} : {
    disableFocusListener: true,
    disableHoverListener: true,
    disableTouchListener: true,
  };

  const aspectRatio = (window.innerHeight - 64) / window.innerWidth;

  const embedProps = {
    fullscreen: true,
    selection: selectionProp,
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

  const suspenseFallback = (
    <div className={classes.suspenseFallback}>
      Loading Map...
    </div>
  );

  return (
    <div>
      <Tooltip
        title={`${dialogTitle} using the observatory map`}
        aria-label={`${dialogTitle} using the observatory map`}
        {...tooltipProps}
      >
        <Button
          color="primary"
          variant="contained"
          data-selenium="map-selection-button"
          startIcon={icon ? <GlobeIcon /> : null}
          {...buttonProps}
          onClick={() => setDialogOpen(true)}
        >
          {label}
        </Button>
      </Tooltip>
      <Dialog
        fullScreen
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        TransitionProps={{
          onEntered: () => setDialogEntered(true),
        }}
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
              {dialogTitleProp || dialogTitle}
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
        {!dialogEntered ? null : (
          <Suspense fallback={suspenseFallback}>
            <SiteMap {...finalEmbedProps} />
          </Suspense>
        )}
      </Dialog>
    </div>
  );
};

MapSelectionButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.bool,
  dialogTitle: PropTypes.string,
  buttonProps: PropTypes.shape(Button.propTypes),
  siteMapProps: PropTypes.shape(SITE_MAP_PROP_TYPES),
  tooltipProps: PropTypes.shape(Tooltip.propTypes),
  selection: SITE_MAP_PROP_TYPES.selection.isRequired,
  validItems: SITE_MAP_PROP_TYPES.validItems,
  selectedItems: SITE_MAP_PROP_TYPES.selectedItems,
  selectionLimit: SITE_MAP_PROP_TYPES.selectionLimit,
  onSave: PropTypes.func,
};

const WrappedMapSelectionButton = Theme.getWrappedComponent(MapSelectionButton);

export default WrappedMapSelectionButton;
