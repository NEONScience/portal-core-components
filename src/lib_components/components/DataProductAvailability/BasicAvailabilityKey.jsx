import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import HelpIcon from '@material-ui/icons/HelpOutline';

import { SVG, VALID_ENHANCED_STATUSES } from './AvailabilityUtils';
import { JsxCell } from './AvailabilitySvgComponents';

import Theme, { COLORS } from '../Theme/Theme';
import { exists } from '../../util/typeUtil';

const useStyles = makeStyles((theme) => ({
  legendContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
    width: '100%',
  },
  legendTitle: {
    fontSize: '0.95rem',
    display: 'inline-flex',
  },
  legendTitleIcon: {
    marginTop: theme.spacing(-0.25),
  },
  legendTitleContainer: {
    margin: theme.spacing(-1, 1, 0.5, 0),
  },
  legendElement: {
    margin: theme.spacing(0, 0, 0, 0),
  },
  legendElementText: {
    textAnchor: 'start',
    whiteSpace: 'pre',
    fontFamily: '"Cutive Mono","Lucida Console",Monaco,monospace',
    fontWeight: 400,
    fontSize: `${SVG.LABEL_FONT_SIZE}px`,
    fill: Theme.palette.grey[700],
  },
}));

const CONTAINER_WIDTH_BREAKPOINT_XS_FLEX_COL = 250;
const CONTAINER_WIDTH_BREAKPOINT_XS = 360;
const CONTAINER_WIDTH_BREAKPOINT_XS_SELECTION = 200;
const CONTAINER_WIDTH_BREAKPOINT_SM_SELECTION = 425;

const ALL_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then all sites rolled into a given row are selected';
const SOME_SELECTED_TITLE = 'If the chart is presenting a roll-up (e.g. view by state) then one or more but not all of the sites rolled into a given row are selected';

const StatusLegendElement = (props) => {
  const classes = useStyles(Theme);
  const { status, dialog } = props;
  if (!exists(status) || !VALID_ENHANCED_STATUSES[status]) {
    return null;
  }
  const statusSvgHeight = SVG.CELL_HEIGHT + 2;
  const labelLetterWidth = 8;
  const labelY = SVG.LABEL_FONT_SIZE - SVG.CELL_PADDING + 2;
  const statusLabelX = SVG.CELL_WIDTH + (2 * SVG.CELL_PADDING);
  const { title, description } = VALID_ENHANCED_STATUSES[status];
  const statusSvgWidth = (title.length * labelLetterWidth) + statusLabelX;
  return dialog ? (
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
  ) : (
    <div className={classes.legendElement} title={description}>
      <svg width={statusSvgWidth} height={statusSvgHeight}>
        <JsxCell status={status} />
        <text className={classes.legendElementText} x={statusLabelX} y={labelY}>
          {title}
        </text>
      </svg>
    </div>
  );
};

StatusLegendElement.propTypes = {
  status: PropTypes.oneOf(Object.keys(VALID_ENHANCED_STATUSES)),
  dialog: PropTypes.bool,
};

StatusLegendElement.defaultProps = {
  status: null,
  dialog: false,
};

const SelectionLegendElement = (props) => {
  const classes = useStyles(Theme);
  const { variant, dialog } = props;
  if (!['all', 'some'].includes(variant)) {
    return null;
  }
  const statusSvgHeight = SVG.CELL_HEIGHT + 2;
  const labelLetterWidth = 8;
  const labelY = SVG.LABEL_FONT_SIZE - SVG.CELL_PADDING + 2;
  const selectionSvgHeight = SVG.CELL_HEIGHT + 2;
  const label = variant === 'all' ? 'All sites selected' : 'Some sites selected';
  const fill = variant === 'all' ? Theme.palette.primary.main : COLORS.LIGHT_BLUE[200];
  const description = variant === 'all' ? ALL_SELECTED_TITLE : SOME_SELECTED_TITLE;
  const selectionWidth = 30;
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
  return dialog ? (
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
    <div className={classes.legendElement} title={description}>
      <svg width={selectionSvgWidth} height={statusSvgHeight}>
        {graphic}
        <text className={classes.legendElementText} x={selectionLabelX} y={labelY}>
          {label}
        </text>
      </svg>
    </div>
  );
};

SelectionLegendElement.propTypes = {
  variant: PropTypes.oneOf(['all', 'some']).isRequired,
  dialog: PropTypes.bool,
};

SelectionLegendElement.defaultProps = {
  dialog: false,
};

const LegendDialog = (props) => {
  const {
    dialogOpen,
    setDialogOpen,
    selectionEnabled,
    delineateRelease,
    availabilityStatusType,
  } = props;
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
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </div>
      <DialogContent style={{ marginBottom: Theme.spacing(2) }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <StatusLegendElement status={availabilityStatusType} dialog />
          </Grid>
          {!delineateRelease ? null : (
            <Grid item xs={12} sm={6}>
              <StatusLegendElement status="available-provisional" dialog />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <StatusLegendElement status="not available" dialog />
          </Grid>
          {!delineateRelease ? null : (
            <Grid item xs={12} sm={6}>
              <StatusLegendElement status="mixed-available-provisional" dialog />
            </Grid>
          )}
          {!selectionEnabled ? null : (
            <>
              <Grid item xs={12} sm={6}>
                <SelectionLegendElement variant="all" dialog />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectionLegendElement variant="some" dialog />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

LegendDialog.propTypes = {
  dialogOpen: PropTypes.bool.isRequired,
  setDialogOpen: PropTypes.func.isRequired,
  selectionEnabled: PropTypes.bool,
  delineateRelease: PropTypes.bool,
  availabilityStatusType: PropTypes.oneOf(['available', 'tombstoned']),
};

LegendDialog.defaultProps = {
  selectionEnabled: false,
  delineateRelease: false,
  availabilityStatusType: 'available',
};

const BasicAvailabilityKey = (props) => {
  const classes = useStyles(Theme);
  const {
    selectionEnabled,
    delineateRelease,
    availabilityStatusType,
    dialogOnly,
  } = props;
  const appliedAvaStatusType = !exists(availabilityStatusType)
    ? 'available'
    : availabilityStatusType;
  const containerRef = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [componentWidth, setComponentWidth] = useState(0);
  let atContainerWidthXsFlexCol = false;
  let atContainerWidthXs = false;
  let atContainerWidthSelectionXs = false;
  let atContainerWidthSelectionSm = false;
  if (componentWidth > 0) {
    atContainerWidthXsFlexCol = (componentWidth <= CONTAINER_WIDTH_BREAKPOINT_XS_FLEX_COL);
    atContainerWidthXs = (componentWidth <= CONTAINER_WIDTH_BREAKPOINT_XS);
    atContainerWidthSelectionXs = (componentWidth <= CONTAINER_WIDTH_BREAKPOINT_XS_SELECTION);
    atContainerWidthSelectionSm = (componentWidth <= CONTAINER_WIDTH_BREAKPOINT_SM_SELECTION);
  }
  const containerStyleProps = atContainerWidthXsFlexCol
    ? { flexDirection: 'column' }
    : {};
  const handleResizeCb = useCallback(() => {
    const container = containerRef.current;
    if (!container) { return; }
    if (container.clientWidth === componentWidth) { return; }
    setComponentWidth(container.clientWidth);
  }, [containerRef, componentWidth, setComponentWidth]);
  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) { return () => {}; }
    handleResizeCb();
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', handleResizeCb);
      return () => {
        window.removeEventListener('resize', handleResizeCb);
      };
    }
    let resizeObserver = new ResizeObserver(handleResizeCb);
    resizeObserver.observe(element);
    return () => {
      if (!resizeObserver) { return; }
      resizeObserver.disconnect();
      resizeObserver = null;
    };
  }, [containerRef, handleResizeCb]);

  const renderLegendItems = () => {
    if (dialogOnly) return null;
    if (selectionEnabled) {
      return (
        <>
          <div>
            <StatusLegendElement status={appliedAvaStatusType} dialog={false} />
            {!delineateRelease ? null : (
              <StatusLegendElement status="available-provisional" dialog={false} />
            )}
            <StatusLegendElement status="not available" dialog={false} />
            {!delineateRelease ? null : (
              <StatusLegendElement status="mixed-available-provisional" dialog={false} />
            )}
          </div>
          {!selectionEnabled ? null : (
            <div>
              <SelectionLegendElement variant="all" dialog={false} />
              <SelectionLegendElement variant="some" dialog={false} />
            </div>
          )}
        </>
      );
    }
    return (
      <>
        <div>
          <StatusLegendElement status={appliedAvaStatusType} dialog={false} />
          {!delineateRelease ? null : (
            <StatusLegendElement status="available-provisional" dialog={false} />
          )}
        </div>
        <div>
          <StatusLegendElement status="not available" dialog={false} />
          {!delineateRelease ? null : (
            <StatusLegendElement status="mixed-available-provisional" dialog={false} />
          )}
        </div>
      </>
    );
  };

  const renderLegendItemsContainer = () => {
    if (dialogOnly || atContainerWidthSelectionXs) return null;
    if (selectionEnabled) {
      if (atContainerWidthSelectionSm) {
        // If at sm selection container width, wrap in containing div
        // to display all statuses vertically in single row
        return (<div>{renderLegendItems()}</div>);
      }
      return renderLegendItems();
    }
    // If at xs container width, wrap in containing div
    // to display all statuses vertically in single row
    if (atContainerWidthXs) {
      return (<div>{renderLegendItems()}</div>);
    }
    return renderLegendItems();
  };

  return (
    <>
      <div
        ref={containerRef}
        className={classes.legendContainer}
        style={containerStyleProps}
      >
        <div className={classes.legendTitleContainer}>
          <Typography variant="h6" className={classes.legendTitle}>
            Key:
          </Typography>
          <IconButton
            size="small"
            color="primary"
            title="Help - Data Availability Chart Key"
            aria-label="Help - Data Availability Chart Key"
            onClick={() => setDialogOpen(true)}
            className={classes.legendTitleIcon}
          >
            <HelpIcon fontSize="small" />
          </IconButton>
        </div>
        {renderLegendItemsContainer()}
      </div>
      <LegendDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        selectionEnabled={selectionEnabled}
        delineateRelease={delineateRelease}
        availabilityStatusType={appliedAvaStatusType}
      />
    </>
  );
};

BasicAvailabilityKey.propTypes = {
  selectionEnabled: PropTypes.bool,
  delineateRelease: PropTypes.bool,
  availabilityStatusType: PropTypes.oneOf(['available', 'tombstoned']),
  dialogOnly: PropTypes.bool,
};

BasicAvailabilityKey.defaultProps = {
  selectionEnabled: false,
  delineateRelease: false,
  availabilityStatusType: 'available',
  dialogOnly: false,
};

export default BasicAvailabilityKey;
