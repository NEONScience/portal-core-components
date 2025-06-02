/* eslint-disable react/forbid-prop-types */
import React, {
  useState,
  useLayoutEffect,
  useCallback,
  useRef,
} from 'react';

import PropTypes from 'prop-types';
import Select from 'react-select';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import NoSsr from '@material-ui/core/NoSsr';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import Skeleton from '@material-ui/lab/Skeleton';

import ClearIcon from '@material-ui/icons/Clear';
import ElevationIcon from '@material-ui/icons/Terrain';
import HistoryIcon from '@material-ui/icons/History';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import LocationIcon from '@material-ui/icons/MyLocation';
import NoneIcon from '@material-ui/icons/NotInterested';
import SearchIcon from '@material-ui/icons/Search';
import SelectIcon from '@material-ui/icons/TouchApp';

import Theme from '../Theme/Theme';
import NeonContext from '../NeonContext/NeonContext';
import MapSelectionButton from '../MapSelectionButton/MapSelectionButton';

import { exists, isStringNonEmpty } from '../../util/typeUtil';

import iconCoreTerrestrialSVG from '../SiteMap/svg/icon-site-core-terrestrial.svg';
import iconCoreAquaticSVG from '../SiteMap/svg/icon-site-core-aquatic.svg';
import iconGradientTerrestrialSVG from '../SiteMap/svg/icon-site-gradient-terrestrial.svg';
import iconGradientAquaticSVG from '../SiteMap/svg/icon-site-gradient-aquatic.svg';

import TimeSeriesViewerContext, {
  TabComponentPropTypes,
  POINTS_PERFORMANCE_LIMIT,
} from './TimeSeriesViewerContext';

const ucWord = (word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`;

const ICON_SVGS = {
  CORE: {
    AQUATIC: iconCoreAquaticSVG,
    TERRESTRIAL: iconCoreTerrestrialSVG,
  },
  GRADIENT: {
    AQUATIC: iconGradientAquaticSVG,
    TERRESTRIAL: iconGradientTerrestrialSVG,
  },
};

/**
   Classes and Styles
*/
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  input: {
    display: 'flex',
    padding: '2px',
    height: 'auto',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    bottom: 6,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing(2),
  },
  optionSubtitle: {
    fontSize: '0.75rem',
    color: Theme.palette.grey[500],
  },
  sitesContainer: {
    display: 'flex',
    alignContent: 'flex-start',
    flexFlow: 'row wrap',
  },
  siteCard: {
    width: '100%',
    padding: theme.spacing(1.5, 2, 1.5, 2),
    backgroundColor: theme.palette.grey[50],
    marginTop: theme.spacing(3),
  },
  siteTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing(1.5),
  },
  siteDetailsRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'space-between',
  },
  siteDetailsColumn: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing(0.5),
  },
  siteDetail: {
    marginBottom: Theme.spacing(1),
    marginRight: Theme.spacing(4),
  },
  noneIcon: {
    color: theme.palette.grey[400],
    marginRight: theme.spacing(0.5),
    fontSize: '1rem',
  },
  noneLabel: {
    color: theme.palette.grey[400],
  },
  positionsTitleContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  positionsCardContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  positionCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(1, 2, 1, 0.5),
    backgroundColor: theme.palette.grey[100],
    marginTop: theme.spacing(1.5),
    marginRight: theme.spacing(1.5),
    width: '100%',
    maxWidth: '800px',
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
}));

const selectStyles = {
  input: (base) => ({
    ...base,
    color: Theme.palette.text.primary,
    '& input': {
      font: 'inherit',
    },
  }),
  clearIndicator: (base) => ({ ...base, display: 'none' }),
  indicatorSeparator: (base) => ({ ...base, display: 'none' }),
  dropdownIndicator: (base) => ({ ...base, cursor: 'pointer' }),
  groupHeading: (base) => ({
    ...base,
    fontSize: '1rem',
    fontWeight: 600,
    color: Theme.palette.primary.main,
  }),
};

/**
   Common React-Select Components - used by both site-specific and position-specific react-selects
*/
function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

inputComponent.propTypes = {
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]).isRequired,
};

function ValueContainer(props) {
  const { selectProps, children } = props;
  const { valueContainer } = selectProps.classes;
  return <div className={valueContainer}>{children}</div>;
}

ValueContainer.propTypes = {
  children: PropTypes.node.isRequired,
  selectProps: PropTypes.object.isRequired,
};

function Menu(props) {
  const { selectProps, innerProps, children } = props;
  const { paper } = selectProps.classes;
  return (
    <Paper square className={paper} {...innerProps}>
      {children}
    </Paper>
  );
}

Menu.propTypes = {
  children: PropTypes.element.isRequired,
  innerProps: PropTypes.object.isRequired,
  selectProps: PropTypes.object.isRequired,
};

/**
   Common React-Select PropTypes - used by both site-specific and position-specific components
*/
const ControlPropTypes = {
  children: PropTypes.node.isRequired,
  innerProps: PropTypes.shape({
    onMouseDown: PropTypes.func.isRequired,
  }).isRequired,
  innerRef: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]).isRequired,
  selectProps: PropTypes.object.isRequired,
};

const OptionPropTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.shape({
    id: PropTypes.string.isRequired,
    key: PropTypes.string,
    onClick: PropTypes.func,
    onMouseMove: PropTypes.func,
    onMouseOver: PropTypes.func,
    tabIndex: PropTypes.number.isRequired,
  }),
  innerRef: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired,
    }),
  ]),
  isFocused: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  data: PropTypes.object.isRequired,
};

const OptionDefaultProps = {
  children: null,
  innerProps: null,
  innerRef: null,
  isDisabled: false,
};

const positionsDescription = `
  Positions are distinct physical sensor locations at a given site. The x, y, and z coordinates
  describe where the sensor is located relative to the ground-level reference location.
  Positions may change over time.
`;

const positionsSeriesDescription = `
  Each position selected will become a distinct series in the chart for each variable (example: 2
  positions × 3 variables = 6 distinct series).
`;

/**
   PositionHistoryButton - button that opens a dialog to show all history for a given position
*/
function PositionHistoryButton(props) {
  const classes = useStyles(Theme);
  const {
    siteCode,
    position,
    history,
    fullWidth,
  } = props;
  const disabled = history.length < 2;
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  if (disabled) {
    return (
      <Button
        fullWidth={fullWidth}
        size="small"
        variant="outlined"
        title="This position has had no changes to physical locations since its creation"
        startIcon={<HistoryIcon />}
        disabled
      >
        No History
      </Button>
    );
  }
  return (
    <>
      <Button
        fullWidth={fullWidth}
        size="small"
        variant="outlined"
        onClick={() => { setHistoryDialogOpen(true); }}
        title="Click to show all changes to physical locations for this position over time"
        startIcon={<HistoryIcon />}
      >
        {`History (${history.length})`}
      </Button>
      <Dialog
        open={historyDialogOpen}
        onClose={() => { setHistoryDialogOpen(false); }}
        scroll="paper"
        aria-labelledby="position-history-dialog-title"
        aria-describedby="position-history-dialog-description"
      >
        <DialogTitle id="position-history-dialog-title" disableTypography>
          <Typography variant="h6" id="position-history-dialog-title">
            {`Position History: ${siteCode} - ${position}`}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="position-history-dialog-description" tabIndex={-1} variant="body2">
            {`${positionsDescription} The table below shows changes to the physical location of this position since its creation.`}
          </DialogContentText>
          <TableContainer>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow style={{ backgroundColor: Theme.palette.grey[50] }}>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell align="right">x</TableCell>
                  <TableCell align="right">y</TableCell>
                  <TableCell align="right">z</TableCell>
                  <TableCell align="right">Elevation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((row, idx) => {
                  const {
                    sensorStartDateTime = '',
                    sensorEndDateTime: rawEnd = '',
                    xOffset,
                    yOffset,
                    zOffset,
                    referenceLocationElevation,
                  } = row;
                  const hasReferenceElevation = exists(referenceLocationElevation)
                    && !isNaN(referenceLocationElevation);
                  const hasXOffset = exists(xOffset) && !isNaN(xOffset);
                  const hasYOffset = exists(yOffset) && !isNaN(yOffset);
                  const hasZOffset = exists(zOffset) && !isNaN(zOffset);
                  const parsedReferenceElevation = hasReferenceElevation
                    ? referenceLocationElevation
                    : NaN;
                  const parsedXOffset = hasXOffset ? xOffset : NaN;
                  const parsedYOffset = hasYOffset ? yOffset : NaN;
                  const parsedZOffset = hasZOffset ? zOffset : NaN;
                  let elevation = 'unknown';
                  if (!isNaN(parsedReferenceElevation)) {
                    if (!isNaN(parsedZOffset)) {
                      elevation = `${(parsedReferenceElevation + parsedZOffset).toFixed(2).toString()}m`;
                    } else {
                      elevation = `${parsedReferenceElevation}m`;
                    }
                  }
                  const displayXOffset = hasXOffset ? `${xOffset}m` : '--';
                  const displayYOffset = hasYOffset ? `${yOffset}m` : '--';
                  const displayZOffset = hasZOffset ? `${zOffset}m` : '--';
                  const end = rawEnd === '' ? 'Current' : rawEnd;
                  const cellStyle = idx !== history.length - 1 ? {}
                    : { fontWeight: '600', borderBottom: 'none' };
                  const key = `${sensorStartDateTime}${end}${parsedXOffset}${parsedYOffset}${parsedZOffset}`;
                  return (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row" style={cellStyle}>{sensorStartDateTime}</TableCell>
                      <TableCell component="th" scope="row" style={cellStyle}>{end}</TableCell>
                      <TableCell align="right" style={cellStyle}>{displayXOffset}</TableCell>
                      <TableCell align="right" style={cellStyle}>{displayYOffset}</TableCell>
                      <TableCell align="right" style={cellStyle}>{displayZOffset}</TableCell>
                      <TableCell align="right" style={cellStyle}>{elevation}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setHistoryDialogOpen(false); }} color="primary" variant="outlined">
            Return
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

PositionHistoryButton.propTypes = {
  siteCode: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  fullWidth: PropTypes.bool,
  history: PropTypes.arrayOf(PropTypes.shape({
    horVer: PropTypes.string.isRequired,
    azimuth: PropTypes.number,
    pitch: PropTypes.number,
    roll: PropTypes.number,
    sensorStartDateTime: PropTypes.string,
    sensorEndDateTime: PropTypes.string,
    xOffset: PropTypes.number,
    yOffset: PropTypes.number,
    zOffset: PropTypes.number,
    referenceLocationStartDateTime: PropTypes.string,
    referenceLocationEndDateTime: PropTypes.string,
    referenceLocationLatitude: PropTypes.number,
    referenceLocationLongitude: PropTypes.number,
    referenceLocationElevation: PropTypes.number,
  })).isRequired,
};

PositionHistoryButton.defaultProps = {
  fullWidth: false,
};

const POSITION_DETAIL_COMPONENT_XS_UPPER = 300;
const POSITION_DETAIL_COMPONENT_MD_LOWER = 600;

/**
   PositionDetail - Component to display neatly-formatted position content
*/
function PositionDetail(props) {
  const { siteCode, position, wide } = props;
  const classes = useStyles(Theme);
  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const containerRef = useRef();
  const [componentWidth, setComponentWidth] = useState(0);
  let atComponentXs = false;
  let atComponentMd = false;
  if (componentWidth > 0) {
    atComponentXs = (componentWidth <= POSITION_DETAIL_COMPONENT_XS_UPPER);
    atComponentMd = (componentWidth > POSITION_DETAIL_COMPONENT_MD_LOWER);
  }
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
  if (!state.product.sites[siteCode] || !state.product.sites[siteCode].positions[position]) {
    return <Typography variant="body1">{position}</Typography>;
  }
  const { history } = state.product.sites[siteCode].positions[position];
  const current = history.length - 1 || 0;
  const {
    sensorName,
    sensorDescription,
    referenceLocationName,
    referenceLocationDescription,
    referenceLocationElevation,
    xOffset,
    yOffset,
    zOffset,
  } = history[current] || {};
  const hasReferenceElevation = exists(referenceLocationElevation)
    && !isNaN(referenceLocationElevation);
  const hasXOffset = exists(xOffset) && !isNaN(xOffset);
  const hasYOffset = exists(yOffset) && !isNaN(yOffset);
  const hasZOffset = exists(zOffset) && !isNaN(zOffset);
  const parsedReferenceElevation = hasReferenceElevation
    ? referenceLocationElevation
    : NaN;
  const parsedZOffset = hasZOffset ? zOffset : NaN;
  const displayXOffset = hasXOffset ? `${xOffset}m` : '--';
  const displayYOffset = hasYOffset ? `${yOffset}m` : '--';
  const displayZOffset = hasZOffset ? `${zOffset}m` : '--';
  let elevation = '--';
  if (!isNaN(parsedReferenceElevation)) {
    if (!isNaN(parsedZOffset)) {
      elevation = `${(parsedReferenceElevation + parsedZOffset).toFixed(2).toString()}m`;
    } else {
      elevation = `${parsedReferenceElevation}m`;
    }
  }
  const fadeStyle = { color: Theme.palette.grey[500] };
  const axisStyle = { marginRight: Theme.spacing(1), fontWeight: 600 };
  const renderDescription = () => {
    const hasName = isStringNonEmpty(sensorName);
    const hasDescription = isStringNonEmpty(sensorDescription);
    const hasReferenceName = isStringNonEmpty(referenceLocationName);
    const hasReferenceDescription = isStringNonEmpty(referenceLocationDescription);
    const appliedName = hasName ? sensorName : 'N/A';
    const appliedDescription = hasDescription ? sensorDescription : 'N/A';
    const includeReference = hasReferenceName || hasReferenceDescription;
    const appliedReferenceName = hasReferenceName ? referenceLocationName : 'N/A';
    const appliedReferenceDescription = hasReferenceDescription
      ? referenceLocationDescription
      : 'N/A';
    return wide ? (
      <>
        <div
          className={classes.startFlex}
          style={{ ...fadeStyle, marginRight: Theme.spacing(3), marginTop: Theme.spacing(0.5) }}
        >
          <Typography variant="caption">
            <span style={{ fontWeight: 600 }}>Location: </span>
            {`${appliedDescription} (${appliedName})`}
          </Typography>
        </div>
        {!includeReference ? null : (
          <div
            className={classes.startFlex}
            style={{ ...fadeStyle, marginRight: Theme.spacing(3) }}
          >
            <Typography variant="caption">
              <span style={{ fontWeight: 600 }}>Reference Location: </span>
              {`${appliedReferenceDescription} (${appliedReferenceName})`}
            </Typography>
          </div>
        )}
      </>
    ) : (
      <div style={{ marginRight: Theme.spacing(3), marginTop: Theme.spacing(0.5) }}>
        <div>
          <Typography variant="body2" style={{ fontWeight: 600 }}>
            Location:
          </Typography>
        </div>
        <div style={{ ...fadeStyle }}>
          <Typography variant="body2">
            {`${appliedDescription} (${appliedName})`}
          </Typography>
        </div>
        {!includeReference ? null : (
          <>
            <div>
              <Typography variant="body2" style={{ fontWeight: 600 }}>
                Reference Location:
              </Typography>
            </div>
            <div style={{ ...fadeStyle }}>
              <Typography variant="body2">
                {`${appliedReferenceDescription} (${appliedReferenceName})`}
              </Typography>
            </div>
          </>
        )}
      </div>
    );
  };
  let positionContainerStyle = {
    alignItems: 'center',
    justifyContent: 'space-between',
  };
  let positionSectionsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
  };
  let historyButtonContainerStyle = {
    textAlign: 'right',
  };
  if (atComponentXs) {
    positionContainerStyle = {
      ...positionContainerStyle,
      alignItems: 'flex-start',
      flexDirection: 'column',
    };
    historyButtonContainerStyle = {
      ...historyButtonContainerStyle,
      textAlign: 'unset',
      marginTop: Theme.spacing(1),
      width: '100%',
    };
  }
  if (atComponentMd) {
    positionSectionsContainerStyle = {
      ...positionSectionsContainerStyle,
      flexDirection: 'row',
    };
  }
  return wide ? (
    <div ref={containerRef}>
      <div className={classes.startFlex} style={{ alignItems: 'flex-end' }}>
        <Typography variant="body1" style={{ fontWeight: 600, marginRight: Theme.spacing(3) }}>
          {position}
        </Typography>
        <div className={classes.startFlex} style={{ alignItems: 'center', ...fadeStyle }}>
          <Typography variant="body2">Elevation:</Typography>
          <ElevationIcon fontSize="small" style={{ margin: Theme.spacing(0, 0.5, 0, 1) }} />
          <Typography variant="body2">{elevation}</Typography>
        </div>
      </div>
      <div className={classes.startFlex}>
        <Typography variant="body2">
          <span style={{ ...axisStyle }}>x / y / z:</span>
          {`${displayXOffset} / ${displayYOffset} / ${displayZOffset}`}
        </Typography>
      </div>
      {renderDescription()}
    </div>
  ) : (
    <div
      ref={containerRef}
      className={classes.startFlex}
      style={positionContainerStyle}
    >
      <div style={positionSectionsContainerStyle}>
        <div className={classes.startFlex} style={{ alignItems: 'center' }}>
          <div style={{ marginRight: Theme.spacing(3) }}>
            <Typography variant="body1" style={{ fontWeight: 600 }}>
              {position}
            </Typography>
            <Typography variant="body2" style={{ ...fadeStyle }}>
              Elevation:
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ElevationIcon
                fontSize="small"
                style={{ marginRight: Theme.spacing(0.5), ...fadeStyle }}
              />
              <Typography variant="body2" style={{ ...fadeStyle }}>
                {elevation}
              </Typography>
            </div>
          </div>
          <div style={{ marginRight: Theme.spacing(3) }}>
            <Typography variant="body2">
              <span style={{ ...axisStyle }}>x:</span>
              {`${displayXOffset}`}
              <br />
              <span style={{ ...axisStyle }}>y:</span>
              {`${displayYOffset}`}
              <br />
              <span style={{ ...axisStyle }}>z:</span>
              {`${displayZOffset}`}
            </Typography>
          </div>
        </div>
        {renderDescription()}
      </div>
      <div style={historyButtonContainerStyle}>
        <PositionHistoryButton
          siteCode={siteCode}
          position={position}
          history={history}
          fullWidth={atComponentXs}
        />
      </div>
    </div>
  );
}

PositionDetail.propTypes = {
  siteCode: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  wide: PropTypes.bool,
};

PositionDetail.defaultProps = { wide: false };

/**
   Selected Position - Component for a single deletable position paper to show within a SelectedSite
*/
function SelectedPosition(props) {
  const classes = useStyles(Theme);
  const { siteCode, position, disabled } = props;
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  return (
    <Card key={position} variant="outlined" className={classes.positionCard}>
      <IconButton
        aria-label={`remove position ${position} from ${siteCode}`}
        disabled={disabled}
        style={{ marginLeft: Theme.spacing(1), marginRight: Theme.spacing(1) }}
        onClick={() => {
          if (disabled) { return; }
          const selectedSiteIdx = state.selection.sites
            .findIndex((site) => site.siteCode === siteCode);
          const positions = state.selection.sites[selectedSiteIdx].positions
            .filter((p) => p !== position);
          dispatch({ type: 'selectSitePositions', positions, siteCode });
        }}
      >
        <ClearIcon fontSize="small" />
      </IconButton>
      <div style={{ flexGrow: 1 }}>
        <PositionDetail siteCode={siteCode} position={position} />
      </div>
    </Card>
  );
}

SelectedPosition.propTypes = {
  siteCode: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

SelectedPosition.defaultProps = { disabled: false };

/**
   SelectPositionsButton - button that opens a dialog for position selection
*/
function SelectPositionsButton(props) {
  const { selectedSite } = props;
  const { siteCode, positions: selectedPositions } = selectedSite;
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const availablePositions = state.product.sites[siteCode]
    ? Object.keys(state.product.sites[siteCode].positions)
    : [];
  availablePositions.sort();
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  // Local state for position selections so that no fetches are fired until the dialog is submitted
  const [localSelectedPositions, setLocalSelectedPositions] = useState(selectedPositions);
  const togglePosition = (position) => {
    if (localSelectedPositions.includes(position)) {
      setLocalSelectedPositions(localSelectedPositions.filter((p) => p !== position));
    } else {
      setLocalSelectedPositions([...localSelectedPositions, position]);
    }
  };
  const handleApply = () => {
    if (!localSelectedPositions.length) { return; }
    setSelectDialogOpen(false);
    dispatch({ type: 'selectSitePositions', siteCode, positions: localSelectedPositions });
  };

  const isApplyButtonDisabled = (selectedPositions2) => {
    // state.selection does not include what was added by users dialog selections so exclude
    // current site from getPositionCount and use sites from localSelectedPositions
    const allCurrentPositions = selectedPositions2.length
      + TimeSeriesViewerContext.getPositionCount(state.selection.sites, siteCode);
    let isDisabled = false;

    if (!selectedPositions2.length) {
      isDisabled = true;
    } else if (TimeSeriesViewerContext.calcPredictedPointsForNewPosition(state, allCurrentPositions)
      > POINTS_PERFORMANCE_LIMIT) {
      isDisabled = true;
    }

    return isDisabled;
  };

  const isDisabled = TimeSeriesViewerContext.calcPredictedPointsForNewPosition(state)
    > POINTS_PERFORMANCE_LIMIT;

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        startIcon={<SelectIcon />}
        style={{ marginLeft: Theme.spacing(4) }}
        disabled={isDisabled}
        onClick={() => {
          setLocalSelectedPositions(selectedPositions);
          setSelectDialogOpen(true);
        }}
      >
        Select Positions…
      </Button>
      <Dialog
        open={selectDialogOpen}
        onClose={() => { setSelectDialogOpen(false); }}
        scroll="paper"
        aria-labelledby="add-positions-dialog-title"
        aria-describedby="add-positions-dialog-description"
      >
        <DialogTitle id="add-positions-dialog-title" disableTypography>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" id="add-positions-dialog-title">Select Positions</Typography>
            <Typography
              variant="subtitle2"
              color={!localSelectedPositions.length ? 'error' : 'textPrimary'}
              style={{ textAlign: 'right' }}
            >
              {`${localSelectedPositions.length} of ${availablePositions.length} selected`}
              <br />
              <span
                style={{ fontWeight: 300, color: Theme.palette.grey[500], fontStyle: 'italic' }}
              >
                at least one is required
              </span>
              <br />

              <span
                style={{
                  fontWeight: 300,
                  fontStyle: 'italic',
                  // eslint-disable-next-line max-len
                  visibility: isApplyButtonDisabled(localSelectedPositions) && localSelectedPositions.length > 0
                    ? 'visible'
                    : 'hidden',
                }}
                className="MuiTypography-colorError"
              >
                Number of positions selected may cause performance issues
              </span>
            </Typography>
            {/* <Typography
              variant="subtitle2"
              style={{ textAlign: 'right' }}
            >

            </Typography> */}
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="add-positions-dialog-description" tabIndex={-1} variant="body2">
            {positionsDescription}
            <br />
            <br />
            {positionsSeriesDescription}
          </DialogContentText>
          <List>
            {availablePositions.map((position) => {
              const labelId = `position-list-label-${position}`;
              return (
                <ListItem
                  key={position}
                  role={undefined}
                  dense
                  button
                  onClick={() => { togglePosition(position); }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={localSelectedPositions.includes(position)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={<PositionDetail siteCode={siteCode} position={position} wide />}
                  />
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setSelectDialogOpen(false); }} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            variant="contained"
            disabled={isApplyButtonDisabled(localSelectedPositions)}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

SelectPositionsButton.propTypes = {
  selectedSite: PropTypes.shape({
    siteCode: PropTypes.string.isRequired,
    positions: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

/**
   SitesControl - Component for the top-level Sites search field
*/
function SitesControl(props) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { TextFieldProps },
  } = props;

  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const labelText = TimeSeriesViewerContext.calcPredictedPointsForNewPosition(state)
    > POINTS_PERFORMANCE_LIMIT
    ? 'Add Sites (disabled)'
    : 'Add Sites';

  return (
    <TextField
      fullWidth
      label={labelText}
      variant="outlined"
      InputProps={{
        inputComponent,
        inputProps: {
          ref: innerRef,
          children,
          ...innerProps,
        },
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon color="disabled" />
          </InputAdornment>
        ),
      }}
      {...TextFieldProps}
    />
  );
}

SitesControl.propTypes = ControlPropTypes;

/**
   SiteOption - Component for a single site as it appears in the drop-down menu
*/
function SiteOption(props) {
  const classes = useStyles(Theme);
  const {
    innerRef,
    isFocused,
    isDisabled,
    innerProps,
    data,
  } = props;
  const {
    siteCode,
    description,
    type,
    terrain,
    domainCode,
    domainName,
    stateCode,
    latitude,
    longitude,
  } = data;
  const terrainTypeTitle = `${ucWord(terrain)} ${ucWord(type)}`;
  let optionContent = <Typography variant="body1" gutterBottom>{siteCode}</Typography>;
  if (stateCode) {
    const iconSvg = ICON_SVGS[type] && ICON_SVGS[type][terrain] ? ICON_SVGS[type][terrain] : null;
    optionContent = (
      <div className={classes.startFlex}>
        {iconSvg ? (
          <img
            src={iconSvg}
            alt={terrainTypeTitle}
            title={terrainTypeTitle}
            width={Theme.spacing(3)}
            height={Theme.spacing(3)}
            style={{ marginRight: Theme.spacing(1.5), marginTop: Theme.spacing(0.5), flexGrow: 0 }}
          />
        ) : null}
        <div style={{ flexGrow: 1 }}>
          <Typography variant="body1">
            {`${siteCode} - ${description}, ${stateCode}`}
          </Typography>
          <Typography variant="body2" className={classes.optionSubtitle} gutterBottom>
            {`${terrainTypeTitle} - Domain ${domainCode} (${domainName}) - Lat/Lon: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}
          </Typography>
        </div>
      </div>
    );
  }
  return (
    <MenuItem
      key={siteCode}
      ref={innerRef}
      selected={isFocused && !isDisabled}
      component="div"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
      }}
      {...innerProps}
    >
      {optionContent}
    </MenuItem>
  );
}

SiteOption.propTypes = OptionPropTypes;
SiteOption.defaultProps = OptionDefaultProps;

/**
   Selected Site - Component for a single deletable site paper to show below the search box
*/
function SelectedSite(props) {
  const classes = useStyles(Theme);
  const {
    site,
    disabled,
    setSelectedTab,
    TAB_IDS,
  } = props;
  const { siteCode, positions } = site;
  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { sites: allSites, states: allStates, domains: allDomains } = neonContextData;
  const [, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  // style={{ fontSize: '0.8rem', fontWeight: 600 }}
  const dateRangeTabButton = (
    <Button
      size="small"
      color="secondary"
      onClick={() => { setSelectedTab(TAB_IDS.DATE_RANGE); }}
      style={{ padding: '0px 2px', marginTop: '-4px', fontStyle: 'italic' }}
    >
      Date Range
    </Button>
  );
  const removeSiteButton = (
    <Button
      size="small"
      variant="outlined"
      onClick={() => {
        if (disabled) { return; }
        dispatch({ type: 'selectRemoveSite', siteCode });
      }}
      style={{ minWidth: Theme.spacing(13), whiteSpace: 'nowrap' }}
      disabled={disabled}
      startIcon={<ClearIcon />}
    >
      Remove Site
    </Button>
  );
  let selectedSiteContent = (
    <div>
      <Typography variant="body1" gutterBottom>
        {`${siteCode} (loading site details…)`}
      </Typography>
      {removeSiteButton}
    </div>
  );
  if (allSites[siteCode]) {
    const {
      description,
      type,
      terrain,
      domainCode,
      stateCode,
      latitude,
      longitude,
    } = allSites[siteCode];
    let typeTitle = 'Core';
    let typeSubtitle = 'fixed location';
    if (type === 'GRADIENT') {
      typeTitle = 'Gradient';
      typeSubtitle = 'gradient location';
    }
    let terrainTitle = 'Terrestrial';
    let terrainSubtitle = 'land-based';
    if (terrain === 'AQUATIC') {
      terrainTitle = 'Aquatic';
      terrainSubtitle = 'water-based';
    }
    const terrainTypeTitle = `${terrainTitle} ${typeTitle}`;
    const terrainTypeSubtitle = `${terrainSubtitle}; ${typeSubtitle}`;
    const domainName = allDomains[domainCode] ? allDomains[domainCode].name : null;
    const stateName = allStates[stateCode] ? allStates[stateCode].name : null;
    const stateFieldTitle = (stateCode === 'PR' ? 'Territory' : 'State');
    const iconSvg = ICON_SVGS[type] && ICON_SVGS[type][terrain] ? ICON_SVGS[type][terrain] : null;
    const terrainIcon = iconSvg ? (
      <img
        src={iconSvg}
        alt={terrainTypeTitle}
        title={terrainTypeTitle}
        width={Theme.spacing(4)}
        height={Theme.spacing(4)}
        style={{ marginRight: Theme.spacing(1), flexGrow: 0 }}
      />
    ) : null;
    selectedSiteContent = (
      <div>
        <div className={classes.siteTitleContainer}>
          {terrainIcon}
          <Typography variant="h6" style={{ lineHeight: '1.4rem', flexGrow: 1 }}>
            {`${description} (${siteCode})`}
          </Typography>
          {removeSiteButton}
        </div>
        <div className={classes.siteDetailsRow}>
          <div className={classes.siteDetailsColumn}>
            {/* Terrain and Type */}
            <div className={classes.siteDetail}>
              <Typography variant="subtitle2">{terrainTypeTitle}</Typography>
              <Typography variant="body2" style={{ fontSize: '0.8rem' }}>
                <i>{terrainTypeSubtitle}</i>
              </Typography>
            </div>
            {/* Latitude/Longitude */}
            <div className={classes.siteDetail}>
              <div className={classes.startFlex} style={{ alignItems: 'center' }}>
                <CopyToClipboard text={`${latitude} ${longitude}`}>
                  <Tooltip title="Latitude / Longitude (click to copy)">
                    <IconButton
                      size="small"
                      style={{ marginRight: Theme.spacing(0.5) }}
                      aria-label="Latitude / Longitude (click to copy)"
                    >
                      <LocationIcon />
                    </IconButton>
                  </Tooltip>
                </CopyToClipboard>
                <Typography
                  variant="caption"
                  aria-label="Latitude / Longitude"
                  style={{ fontFamily: 'monospace', textAlign: 'right', fontSize: '0.85rem' }}
                >
                  {latitude}
                  <br />
                  {longitude}
                </Typography>
              </div>
            </div>
          </div>
          <div className={classes.siteDetailsColumn}>
            {/* State/Territory */}
            <div className={classes.siteDetail}>
              <Typography variant="subtitle2">{stateFieldTitle}</Typography>
              <Typography variant="body2">{stateName}</Typography>
            </div>
            {/* Domain */}
            <div className={classes.siteDetail}>
              <Typography variant="subtitle2">Domain</Typography>
              <Typography variant="body2">
                {`${domainCode} - ${domainName}`}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Card key={siteCode} variant="outlined" className={classes.siteCard}>
      {selectedSiteContent}
      {positions.length ? (
        <div>
          <div className={classes.positionsTitleContainer}>
            <Typography variant="subtitle2">
              Position(s)
            </Typography>
            <Tooltip
              title={(
                <>
                  {positionsDescription}
                  <br />
                  <br />
                  {positionsSeriesDescription}
                </>
              )}
            >
              <IconButton size="small" style={{ marginLeft: Theme.spacing(1) }}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <SelectPositionsButton selectedSite={site} />
          </div>
          <div className={classes.positionsCardContainer}>
            {positions.map((position) => (
              <SelectedPosition
                key={position}
                siteCode={siteCode}
                position={position}
                disabled={positions.length < 2}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className={classes.startFlex} style={{ alignItems: 'center' }}>
            <NoneIcon className={classes.noneIcon} />
            <Typography variant="body1" className={classes.noneLabel} style={{ fontWeight: 600 }}>
              No Positions Available.
            </Typography>
          </div>
          <Typography variant="body2" className={classes.noneLabel} style={{ fontSize: '0.8rem' }}>
            <i>
              {/* eslint-disable react/jsx-one-expression-per-line */}
              This site has no available data for the current selected date range, and thus
              no positions. See {dateRangeTabButton} to compare selection with availability.
              {/* eslint-enable react/jsx-one-expression-per-line */}
            </i>
          </Typography>
        </div>
      )}
    </Card>
  );
}

SelectedSite.propTypes = {
  site: PropTypes.shape({
    siteCode: PropTypes.string.isRequired,
    positions: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
  ...TabComponentPropTypes,
};
SelectedSite.defaultProps = { disabled: false };

/**
   Complete Select for Sites
*/
const SitesSelectComponents = {
  Control: SitesControl,
  Option: SiteOption,
  Menu,
  ValueContainer,
  Placeholder: () => null,
  MultiValue: () => null,
  IndicatorsContainer: () => null,
};
const SitesSelect = () => {
  const classes = useStyles(Theme);
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();

  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { states: allStates, sites: allSites, domains: allDomains } = neonContextData;
  let isDisabled = false;

  // Build list of selectable sites grouped by US state
  const selectableSiteCodes = Object.keys(state.product.sites);
  let selectableSitesCount = 0;
  const selectableSites = Object.keys(allStates).map((stateCode) => (
    { label: allStates[stateCode].name, stateCode, options: [] }
  ));
  Object.keys(state.product.sites)
    .filter((siteCode) => selectableSiteCodes.includes(siteCode))
    .forEach((siteCode) => {
      const groupIdx = selectableSites.findIndex((group) => (
        allSites[siteCode] && group.stateCode === allSites[siteCode].stateCode
      ));
      if (groupIdx === -1) { return; }
      const domain = allDomains[allSites[siteCode].domainCode] || {};
      const usState = allStates[allSites[siteCode].stateCode] || {};
      const search = [
        siteCode,
        allSites[siteCode].description,
        allSites[siteCode].domainCode,
        allSites[siteCode].stateCode,
        allSites[siteCode].type,
        allSites[siteCode].terrain,
        domain.name || '',
        usState.name || '',
      ].join(' ').toLowerCase();
      selectableSites[groupIdx].options.push({
        value: siteCode,
        domainName: domain.name || null,
        ...allSites[siteCode],
        search,
      });
      selectableSitesCount += 1;
    });

  const selectedSites = state.selection.sites
    .map((site) => site.siteCode)
    .filter((siteCode) => selectableSiteCodes.includes(siteCode));

  if (!selectableSitesCount) { return null; }

  isDisabled = TimeSeriesViewerContext.calcPredictedPointsForNewPosition(state)
    > POINTS_PERFORMANCE_LIMIT;

  return (
    <NoSsr>
      <div style={{ flex: 1 }}>
        <Select
          isMulti
          isSearchable
          isDisabled={isDisabled}
          clearable={false}
          classes={classes}
          styles={selectStyles}
          aria-label="Add Sites"
          data-gtm="time-series-viewer.add-sites"
          options={selectableSites}
          components={SitesSelectComponents}
          value={selectedSites}
          controlShouldRenderValue={false}
          filterOption={(option, searchText) => (
            option.data.search.includes(searchText.toLowerCase())
          )}
          onChange={(value, change) => {
            if (change.action !== 'select-option') { return; }
            dispatch({ type: 'selectAddSite', siteCode: change.option.siteCode });
          }}
        />
      </div>
    </NoSsr>
  );
};

/**
   Primary Component
*/
export default function TimeSeriesViewerSites(props) {
  const classes = useStyles(Theme);
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();

  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { sites: allSites } = neonContextData;

  if (!state.selection.sites.length || !Object.keys(allSites).length) {
    return (
      <Skeleton variant="rect" width="100%" height={56} />
    );
  }

  const calcUpperSelectionLimit = () => {
    let upperLimit = 0;
    const currentPositionCount = TimeSeriesViewerContext.getPositionCount(state.selection.sites);

    for (let upperLimitCandidate = 1; upperLimitCandidate <= 5; upperLimitCandidate += 1) {
      const numNewPositions = currentPositionCount + upperLimitCandidate;

      if (TimeSeriesViewerContext.calcPredictedPointsForNewPosition(state, numNewPositions)
        < POINTS_PERFORMANCE_LIMIT) {
        upperLimit = upperLimitCandidate;
      }
    }

    return upperLimit;
  };

  const selectedItems = state.selection.sites.map((site) => site.siteCode);
  const isDisabled = TimeSeriesViewerContext.calcPredictedPointsForNewPosition(state)
    > POINTS_PERFORMANCE_LIMIT;
  const upperLimit = Math.min(calcUpperSelectionLimit() + selectedItems.length, 5);

  return (
    <div className={classes.root}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <SitesSelect />
        <MapSelectionButton
          selection="SITES"
          selectionLimit={[1, upperLimit]}
          selectedItems={selectedItems}
          validItems={Object.keys(state.product.sites)}
          buttonProps={{ style: { size: 'large', marginLeft: Theme.spacing(1.5) }, disabled: isDisabled }}
          onSave={(newSites) => { dispatch({ type: 'updateSelectedSites', siteCodes: newSites }); }}
        />
      </div>
      <div className={classes.sitesContainer}>
        {state.selection.sites.map((site) => (
          <SelectedSite
            key={site.siteCode}
            site={site}
            disabled={state.selection.sites.length < 2}
            {...props}
          />
        ))}
      </div>
    </div>
  );
}

TimeSeriesViewerSites.propTypes = TabComponentPropTypes;

// Additional items exported for unit testing
export const getTestableItems = () => (
  process.env.NODE_ENV !== 'test' ? {} : {
    ucWord,
    PositionHistoryButton,
    PositionDetail,
    SelectedPosition,
    SelectPositionsButton,
    SitesControl,
    SiteOption,
    SelectedSite,
  }
);
