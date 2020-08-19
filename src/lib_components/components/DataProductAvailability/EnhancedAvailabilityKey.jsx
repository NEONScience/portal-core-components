/* eslint-disable max-len, no-unused-vars, prefer-destructuring */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import HelpIcon from '@material-ui/icons/HelpOutline';

import { SVG, VALID_ENHANCED_STATUSES } from './AvailabilityUtils';
import { JsxCell } from './AvailabilitySvgComponents';

import Theme, { COLORS } from '../Theme/Theme';

/**
   Setup: CSS classes
*/
const useStyles = makeStyles(theme => ({
  keyContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  keyElement: {
    cursor: 'help',
    margin: theme.spacing(0, 3, 0.25, 0),
  },
  keyElementText: {
    textAnchor: 'start',
    whiteSpace: 'pre',
    fontFamily: '"Cutive Mono","Lucida Console",Monaco,monospace',
    fontWeight: 400,
    fontSize: `${SVG.LABEL_FONT_SIZE}px`,
    fill: Theme.palette.grey[700],
  },
  h6Small: {
    fontSize: '0.95rem',
  },
}));

const ALL_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then all sites rolled into a given row are selected';
const SOME_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then one or more but not all of the sites rolled into a given row are selected';

/**
   Main Function
*/
export default function EnhancedAvailabilityKey(props) {
  const classes = useStyles(Theme);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { selectionEnabled, rollUpPresent } = props;

  const statusSvgHeight = SVG.CELL_HEIGHT + 2;
  const labelLetterWidth = 8;
  const labelY = SVG.LABEL_FONT_SIZE - SVG.CELL_PADDING + 1;
  const statusLabelX = SVG.CELL_WIDTH + (2 * SVG.CELL_PADDING);

  // Let each element in the key be clickable to open the help dialog.
  // This is in addition to the help button, but we should still provide aria attributes.
  const dialogOpenerProps = {
    role: 'button',
    onClick: () => setDialogOpen(true),
  };

  const statusSvgs = {};
  Object.keys(VALID_ENHANCED_STATUSES).forEach((status) => {
    const label = VALID_ENHANCED_STATUSES[status].title;
    const description = VALID_ENHANCED_STATUSES[status].description;
    const statusSvgWidth = (label.length * labelLetterWidth) + statusLabelX;
    statusSvgs[status] = (
      <div className={classes.keyElement} title={description} {...dialogOpenerProps}>
        <svg width={statusSvgWidth} height={statusSvgHeight}>
          <JsxCell status={status} />
          <text className={classes.keyElementText} x={statusLabelX} y={labelY}>
            {label}
          </text>
        </svg>
      </div>
    );
  });

  const renderSelectionElement = (variant, inDialog = false) => {
    if (!['all', 'some'].includes(variant)) { return null; }
    const selectionSvgHeight = SVG.CELL_HEIGHT + 2;
    const label = variant === 'all' ? 'All sites selected' : 'Some sites selected';
    const fill = variant === 'all' ? Theme.palette.secondary.main : 'url(#partialSelectionPattern)';
    const description = variant === 'all' ? ALL_SELECTED_TITLE : SOME_SELECTED_TITLE;
    const selectionWidth = 45;
    const selectionLabelX = selectionWidth + (3 * SVG.CELL_PADDING);
    const selectionSvgWidth = (label.length * labelLetterWidth) + selectionLabelX;
    const handleAttribs = {
      width: SVG.DATE_RANGE_HANDLE_WIDTH,
      height: SVG.CELL_HEIGHT,
      fill: COLORS.LIGHT_BLUE[300],
      stroke: Theme.palette.secondary.main,
      strokeWidth: 1.5,
    };
    const graphic = (
      <React.Fragment>
        <rect x={0.5} y={1.5} width={selectionWidth} height={SVG.CELL_HEIGHT - 2} fill={fill} />
        <rect x={0.5} y={0.5} {...handleAttribs} />
        <rect x={selectionWidth - SVG.DATE_RANGE_HANDLE_WIDTH} y={0.5} {...handleAttribs} />
      </React.Fragment>
    );
    return inDialog ? (
      <div style={{ marginBottom: Theme.spacing(2) }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg
            width={Math.ceil(selectionWidth * 1.25)}
            height={Math.ceil(selectionSvgHeight * 1.25)}
            viewBox={`0 0 ${selectionWidth} ${selectionSvgHeight}`}
            style={{ marginRight: Theme.spacing(1) }}
          >
            {graphic}
          </svg>
          <Typography variant="subtitle2" style={{ fontSize: '1.05rem' }}>{label}</Typography>
        </div>
        <Typography variant="body2">{description}</Typography>
      </div>
    ) : (
      <div className={classes.keyElement} title={description} {...dialogOpenerProps}>
        <svg width={selectionSvgWidth} height={statusSvgHeight}>
          {graphic}
          <text className={classes.keyElementText} x={selectionLabelX} y={labelY}>
            {label}
          </text>
        </svg>
      </div>
    );
  };

  const renderDialog = () => {
    const renderStatus = (status) => {
      const { title, description } = VALID_ENHANCED_STATUSES[status];
      return (
        <div style={{ marginBottom: Theme.spacing(2) }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              width={Math.ceil(SVG.CELL_WIDTH * 1.25)}
              height={Math.ceil(SVG.CELL_HEIGHT * 1.25)}
              viewBox={`0 0 ${SVG.CELL_WIDTH} ${SVG.CELL_HEIGHT}`}
              style={{ marginRight: Theme.spacing(1) }}
            >
              <JsxCell status={status} />
            </svg>
            <Typography variant="subtitle2" style={{ fontSize: '1.05rem' }}>{title}</Typography>
          </div>
          <Typography variant="body2">{description}</Typography>
        </div>
      );
    };
    return (
      <Dialog
        open={dialogOpen}
        maxWidth="md"
        onClose={() => setDialogOpen(false)}
        aria-labelledby="availability-key-dialog-title"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DialogTitle id="availability-key-dialog-title">Data Availability Chart Key</DialogTitle>
          <IconButton
            title="Close"
            aria-label="Close"
            onClick={() => setDialogOpen(false)}
            style={{ marginRight: Theme.spacing(1) }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </div>
        <DialogContent style={{ marginBottom: Theme.spacing(2) }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: '50%', marginRight: Theme.spacing(2) }}>
              {renderStatus('available')}
              {renderStatus('being processed')}
              {renderStatus('expected')}
              {renderStatus('not expected')}
            </div>
            <div style={{ flex: '50%' }}>
              {renderStatus('not available')}
              {renderStatus('not collected')}
              {renderStatus('delayed')}
              {renderStatus('tentative')}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: '50%', marginRight: Theme.spacing(2) }}>
              {renderStatus('mixed some availability')}
            </div>
            <div style={{ flex: '50%' }}>
              {renderStatus('mixed no availability')}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: '50%', marginRight: Theme.spacing(2) }}>
              {renderSelectionElement('all', true)}
            </div>
            <div style={{ flex: '50%' }}>
              {renderSelectionElement('some', true)}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <React.Fragment>
      <div className={classes.keyContainer}>
        <div>
          <Typography
            variant="h6"
            className={classes.h6Small}
            style={{ margin: Theme.spacing(-0.75, 3, 0.5, 0) }}
          >
            Key:
          </Typography>
          <IconButton
            size="small"
            color="primary"
            title="Help - Data Availability Chart Key"
            aria-label="Help - Data Availability Chart Key"
            onClick={() => setDialogOpen(true)}
            style={{ marginLeft: '-3px' }}
          >
            <HelpIcon fontSize="inherit" />
          </IconButton>
        </div>
        <div>
          {statusSvgs.available}
          {statusSvgs['being processed']}
          {statusSvgs.expected}
          {statusSvgs['not expected']}
        </div>
        <div>
          {statusSvgs['not available']}
          {statusSvgs['not collected']}
          {statusSvgs.delayed}
          {statusSvgs.tentative}
        </div>
        {!(selectionEnabled || rollUpPresent) ? null : (
          <div>
            {!rollUpPresent ? null : (
              <React.Fragment>
                {statusSvgs['mixed some availability']}
                {statusSvgs['mixed no availability']}
              </React.Fragment>
            )}
            {!selectionEnabled ? null : (
              <React.Fragment>
                {renderSelectionElement('all')}
                {renderSelectionElement('some')}
              </React.Fragment>
            )}
          </div>
        )}
      </div>
      {renderDialog()}
    </React.Fragment>
  );
}

EnhancedAvailabilityKey.propTypes = {
  selectionEnabled: PropTypes.bool,
  rollUpPresent: PropTypes.bool,
};

EnhancedAvailabilityKey.defaultProps = {
  selectionEnabled: false,
  rollUpPresent: false,
};
