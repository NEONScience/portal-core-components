/* eslint-disable max-len, no-unused-vars, prefer-destructuring */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import HelpIcon from '@mui/icons-material/HelpOutline';

import { SVG, VALID_ENHANCED_STATUSES } from './AvailabilityUtils';
import { JsxCell } from './AvailabilitySvgComponents';

import Theme, { COLORS } from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';

/**
   Setup: CSS classes
*/
const useStyles = makeStyles((theme) => ({
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

const defaultProps = {
  selectionEnabled: false,
  rollUpPresent: false,
};

/**
   Main Function
*/
export default function EnhancedAvailabilityKey(inProps) {
  const props = resolveProps(defaultProps, inProps);
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
    const fill = variant === 'all' ? Theme.palette.primary.main : 'url(#partialSelectionPattern)';
    const description = variant === 'all' ? ALL_SELECTED_TITLE : SOME_SELECTED_TITLE;
    const selectionWidth = 45;
    const selectionLabelX = selectionWidth + (3 * SVG.CELL_PADDING);
    const selectionSvgWidth = (label.length * labelLetterWidth) + selectionLabelX;
    const handleAttribs = {
      width: SVG.DATE_RANGE_HANDLE_WIDTH,
      height: SVG.CELL_HEIGHT,
      fill: COLORS.LIGHT_BLUE[300],
      stroke: Theme.palette.primary.main,
      strokeWidth: 1.5,
    };
    const graphic = (
      <>
        <rect x={0.5} y={1.5} width={selectionWidth} height={SVG.CELL_HEIGHT - 2} fill={fill} />
        <rect x={0.5} y={0.5} {...handleAttribs} />
        <rect x={selectionWidth - SVG.DATE_RANGE_HANDLE_WIDTH} y={0.5} {...handleAttribs} />
      </>
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
        <div style={{ marginBottom: Theme.spacing(2.5) }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              width={Math.ceil(SVG.CELL_WIDTH * 1.25)}
              height={Math.ceil(SVG.CELL_HEIGHT * 1.25)}
              viewBox={`0 0 ${SVG.CELL_WIDTH} ${SVG.CELL_HEIGHT}`}
              style={{ marginRight: Theme.spacing(1) }}
            >
              <JsxCell status={status} />
            </svg>
            <Typography variant="subtitle2" style={{ fontSize: '0.95rem', marginTop: '2px' }}>
              {title}
            </Typography>
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
          <DialogTitle id="availability-key-dialog-title">
            <span style={{ fontSize: '1.4rem', fontWeight: '600' }}>
              Data Availability Chart Key
            </span>
          </DialogTitle>
          <IconButton
            title="Close"
            aria-label="Close"
            onClick={() => setDialogOpen(false)}
            style={{ marginRight: Theme.spacing(1) }}
            size="large"
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
    <>
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
              <>
                {statusSvgs['mixed some availability']}
                {statusSvgs['mixed no availability']}
              </>
            )}
            {!selectionEnabled ? null : (
              <>
                {renderSelectionElement('all')}
                {renderSelectionElement('some')}
              </>
            )}
          </div>
        )}
      </div>
      {renderDialog()}
    </>
  );
}

EnhancedAvailabilityKey.propTypes = {
  selectionEnabled: PropTypes.bool,
  rollUpPresent: PropTypes.bool,
};
