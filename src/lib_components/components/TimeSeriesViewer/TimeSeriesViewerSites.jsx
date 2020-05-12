/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';

import PropTypes from 'prop-types';
import Select from 'react-select';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
import LocationIcon from '@material-ui/icons/MyLocation';
import NoneIcon from '@material-ui/icons/NotInterested';
import SearchIcon from '@material-ui/icons/Search';
import SelectIcon from '@material-ui/icons/TouchApp';

import Theme from '../Theme/Theme';
import NeonContext from '../NeonContext/NeonContext';

import iconCoreTerrestrialSVG from '../SiteMap/svg/icon-core-terrestrial.svg';
import iconCoreAquaticSVG from '../SiteMap/svg/icon-core-aquatic.svg';
import iconRelocatableTerrestrialSVG from '../SiteMap/svg/icon-relocatable-terrestrial.svg';
import iconRelocatableAquaticSVG from '../SiteMap/svg/icon-relocatable-aquatic.svg';

import TimeSeriesViewerContext, { TabComponentPropTypes } from './TimeSeriesViewerContext';

const ucWord = word => `${word.slice(0, 1)}${word.slice(1).toLowerCase()}`;

const ICON_SVGS = {
  CORE: {
    AQUATIC: iconCoreAquaticSVG,
    TERRESTRIAL: iconCoreTerrestrialSVG,
  },
  RELOCATABLE: {
    AQUATIC: iconRelocatableAquaticSVG,
    TERRESTRIAL: iconRelocatableTerrestrialSVG,
  },
};


/**
   Classes and Styles
*/
const useStyles = makeStyles(theme => ({
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
  sitePaper: {
    padding: theme.spacing(1.5, 2, 1.5, 2),
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(3),
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  positionPaper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(0.5, 2, 0.5, 0.5),
    borderRadius: theme.spacing(2),
    width: '100%',
    backgroundColor: theme.palette.grey[100],
    marginTop: theme.spacing(1.5),
  },
  smallButton: {
    fontSize: '0.8rem',
    padding: theme.spacing(0.125, 0.75),
    whiteSpace: 'nowrap',
  },
  smallButtonIcon: {
    marginRight: theme.spacing(0.5),
    fontSize: '0.8rem',
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
}));

const selectStyles = {
  input: base => ({
    ...base,
    color: Theme.palette.text.primary,
    '& input': {
      font: 'inherit',
    },
  }),
  clearIndicator: base => ({ ...base, display: 'none' }),
  indicatorSeparator: base => ({ ...base, display: 'none' }),
  dropdownIndicator: base => ({ ...base, cursor: 'pointer' }),
  groupHeading: base => ({
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

/**
   PositionHistoryButton - button that opens a dialog to show all history for a given position
*/
function PositionHistoryButton(props) {
  const classes = useStyles(Theme);
  const { siteCode, position, history } = props;
  const disabled = history.length < 2;
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  if (disabled) {
    return (
      <Button
        variant="outlined"
        className={classes.smallButton}
        title="This position has had no changes to physical locations since its creation"
        disabled
      >
        <HistoryIcon className={classes.smallButtonIcon} />
        No History
      </Button>
    );
  }
  return (
    <React.Fragment>
      <Button
        color="primary"
        variant="outlined"
        onClick={() => { setHistoryDialogOpen(true); }}
        className={classes.smallButton}
        title="Click to show all changes to physical locations for this position over time"
      >
        <HistoryIcon className={classes.smallButtonIcon} />
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
            Positions are distinct physical sensor locations at a given site. The x, y, and z
            coordinates describe where the sensor is located relative to the ground-level
            reference point for the site. Positions may change over time. The table below shows
            changes to the physical location of this position since its creation.
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
                    start,
                    end: rawEnd,
                    xOffset,
                    yOffset,
                    zOffset,
                    referenceElevation,
                  } = row;
                  const elevation = referenceElevation === null || zOffset === null
                    ? 'unknown'
                    : `${(parseFloat(referenceElevation, 10) + parseFloat(zOffset, 10)).toFixed(2).toString()}m`; // eslint-disable-line max-len
                  const end = rawEnd === '' ? 'Current' : rawEnd;
                  const cellStyle = idx !== history.length - 1 ? {}
                    : { fontWeight: '600', borderBottom: 'none' };
                  return (
                    <TableRow key={row.start}>
                      <TableCell component="th" scope="row" style={cellStyle}>{start}</TableCell>
                      <TableCell component="th" scope="row" style={cellStyle}>{end}</TableCell>
                      <TableCell align="right" style={cellStyle}>{`${xOffset}m`}</TableCell>
                      <TableCell align="right" style={cellStyle}>{`${yOffset}m`}</TableCell>
                      <TableCell align="right" style={cellStyle}>{`${zOffset}m`}</TableCell>
                      <TableCell align="right" style={cellStyle}>{`${elevation}m`}</TableCell>
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
    </React.Fragment>
  );
}

PositionHistoryButton.propTypes = {
  siteCode: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  history: PropTypes.arrayOf(PropTypes.shape({
    'HOR.VER': PropTypes.string.isRequired,
    azimuth: PropTypes.string.isRequired,
    pitch: PropTypes.string.isRequired,
    roll: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    xOffset: PropTypes.string.isRequired,
    yOffset: PropTypes.string.isRequired,
    zOffset: PropTypes.string.isRequired,
    referenceStart: PropTypes.string.isRequired,
    referenceEnd: PropTypes.string.isRequired,
    referenceLatitude: PropTypes.string.isRequired,
    referenceLongitude: PropTypes.string.isRequired,
    referenceElevation: PropTypes.string.isRequired,
  })).isRequired,
};

/**
   PositionDetail - Component to display neatly-formatted position content
*/
function PositionDetail(props) {
  const { siteCode, position, wide } = props;
  const classes = useStyles(Theme);
  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  if (!state.product.sites[siteCode] || !state.product.sites[siteCode].positions[position]) {
    return <Typography variant="body1">{position}</Typography>;
  }
  const { history } = state.product.sites[siteCode].positions[position];
  const current = history.length - 1 || 0;
  const {
    referenceElevation = '--',
    xOffset = '--',
    yOffset = '--',
    zOffset = '--',
  } = history[current] || {};
  const elevation = referenceElevation === '--' ? '--'
    : (parseFloat(referenceElevation, 10) + parseFloat(zOffset, 10)).toFixed(2).toString();
  const fadeStyle = { color: Theme.palette.grey[500] };
  const axisStyle = { marginRight: Theme.spacing(1), fontWeight: 600 };
  return wide ? (
    <div>
      <div className={classes.startFlex} style={{ alignItems: 'flex-end' }}>
        <Typography variant="body1" style={{ fontWeight: 600, marginRight: Theme.spacing(3) }}>
          {position}
        </Typography>
        <div className={classes.startFlex} style={{ alignItems: 'center', ...fadeStyle }}>
          <Typography variant="body2">Elevation:</Typography>
          <ElevationIcon fontSize="small" style={{ margin: Theme.spacing(0, 0.5, 0, 1) }} />
          <Typography variant="body2">{`${elevation}m`}</Typography>
        </div>
      </div>
      <div className={classes.startFlex}>
        <Typography variant="body2">
          <span style={{ ...axisStyle }}>x / y / z:</span>
          {`${xOffset}m / ${yOffset}m / ${zOffset}m`}
        </Typography>
      </div>
    </div>
  ) : (
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
            {`${elevation}m`}
          </Typography>
        </div>
      </div>
      <div>
        <Typography variant="body2">
          <span style={{ ...axisStyle }}>x:</span>
          {`${xOffset}m`}
          <br />
          <span style={{ ...axisStyle }}>y:</span>
          {`${yOffset}m`}
          <br />
          <span style={{ ...axisStyle }}>z:</span>
          {`${zOffset}m`}
        </Typography>
      </div>
      <div style={{ flexGrow: 1, textAlign: 'right' }}>
        <PositionHistoryButton siteCode={siteCode} position={position} history={history} />
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
    <Paper key={position} className={classes.positionPaper}>
      <IconButton
        aria-label={`remove position ${position} from ${siteCode}`}
        disabled={disabled}
        style={{ marginRight: Theme.spacing(1) }}
        onClick={() => {
          if (disabled) { return; }
          const selectedSiteIdx = state.selection.sites
            .findIndex(site => site.siteCode === siteCode);
          dispatch({
            type: 'selectSitePositions',
            positions: state.selection.sites[selectedSiteIdx].positions.filter(p => p !== position),
            siteCode,
          });
        }}
      >
        <ClearIcon fontSize="small" />
      </IconButton>
      <div style={{ flexGrow: 1 }}>
        <PositionDetail siteCode={siteCode} position={position} />
      </div>
    </Paper>
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
  const classes = useStyles(Theme);
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
      setLocalSelectedPositions(localSelectedPositions.filter(p => p !== position));
    } else {
      setLocalSelectedPositions([...localSelectedPositions, position]);
    }
  };
  const handleApply = () => {
    if (!localSelectedPositions.length) { return; }
    setSelectDialogOpen(false);
    dispatch({ type: 'selectSitePositions', siteCode, positions: localSelectedPositions });
  };
  return (
    <React.Fragment>
      <Button
        color="primary"
        variant="outlined"
        onClick={() => {
          setLocalSelectedPositions(selectedPositions);
          setSelectDialogOpen(true);
        }}
        className={classes.smallButton}
      >
        <SelectIcon className={classes.smallButtonIcon} />
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
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="add-positions-dialog-description" tabIndex={-1} variant="body2">
            Positions are distinct physical sensor locations at a given site. The x, y, and z
            coordinates describe where the sensor is located relative to the ground-level
            reference point for the site. Each position selected will become a distinct series
            in the chart for each variable (example: 2 positions × 3 variables = 6 distinct series).
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
          <Button onClick={() => { setSelectDialogOpen(false); }} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            color="primary"
            variant="contained"
            disabled={!localSelectedPositions.length}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
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
  return (
    <TextField
      fullWidth
      label="Add Sites"
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
      color="primary"
      variant="outlined"
      onClick={() => {
        if (disabled) { return; }
        dispatch({ type: 'selectRemoveSite', siteCode });
      }}
      className={classes.smallButton}
      style={{ minWidth: Theme.spacing(13) }}
      disabled={disabled}
    >
      <ClearIcon className={classes.smallButtonIcon} />
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
    if (type === 'RELOCATABLE') {
      typeTitle = 'Relocatable';
      typeSubtitle = 'location may change';
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
    <Paper key={siteCode} className={classes.sitePaper}>
      {selectedSiteContent}
      {positions.length ? (
        <div>
          <div className={classes.positionsTitleContainer}>
            <Typography variant="h6">
              Position(s):
            </Typography>
            <SelectPositionsButton selectedSite={site} />
          </div>
          {positions.map(position => (
            <SelectedPosition
              key={position}
              siteCode={siteCode}
              position={position}
              disabled={positions.length < 2}
            />
          ))}
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
    </Paper>
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

  // Build list of selectable sites grouped by US state
  const selectableSiteCodes = Object.keys(state.product.sites);
  let selectableSitesCount = 0;
  const selectableSites = Object.keys(allStates).map(stateCode => (
    { label: allStates[stateCode].name, stateCode, options: [] }
  ));
  Object.keys(state.product.sites)
    .filter(siteCode => selectableSiteCodes.includes(siteCode))
    .forEach((siteCode) => {
      const groupIdx = selectableSites.findIndex(group => (
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
    .map(site => site.siteCode)
    .filter(siteCode => selectableSiteCodes.includes(siteCode));

  if (!selectableSitesCount) { return null; }

  return (
    <NoSsr>
      <Select
        isMulti
        isSearchable
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
    </NoSsr>
  );
};

/**
   Primary Component
*/
export default function TimeSeriesViewerSites(props) {
  const classes = useStyles(Theme);
  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();

  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { sites: allSites } = neonContextData;

  if (!state.selection.sites.length || !Object.keys(allSites).length) {
    return (
      <Skeleton variant="rect" width="100%" height={56} />
    );
  }

  return (
    <div className={classes.root}>
      <SitesSelect />
      <div className={classes.sitesContainer}>
        {state.selection.sites.map(site => (
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
