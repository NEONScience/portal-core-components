/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';

import PropTypes from 'prop-types';
import Select from 'react-select';

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
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import ClearIcon from '@material-ui/icons/Clear';
import ElevationIcon from '@material-ui/icons/Terrain';
import SearchIcon from '@material-ui/icons/Search';
import SelectIcon from '@material-ui/icons/TouchApp';

import Theme from '../Theme/Theme';
import NeonContext from '../NeonContext/NeonContext';

import iconCoreTerrestrialSVG from '../SiteMap/icon-core-terrestrial.svg';
import iconCoreAquaticSVG from '../SiteMap/icon-core-aquatic.svg';
import iconRelocatableTerrestrialSVG from '../SiteMap/icon-relocatable-terrestrial.svg';
import iconRelocatableAquaticSVG from '../SiteMap/icon-relocatable-aquatic.svg';

import TimeSeriesViewerContext from './TimeSeriesViewerContext';

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
  sitePaper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(1.5, 3, 1.5, 1),
    borderRadius: theme.spacing(2),
    width: '100%',
    backgroundColor: theme.palette.grey[50],
    marginBottom: theme.spacing(2),
  },
  sitePaperContainer: {
    lineHeight: '5em',
    marginTop: theme.spacing(2.5),
  },
  positionPaper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(0.5, 2, 0.5, 0.5),
    borderRadius: theme.spacing(2),
    width: '100%',
    backgroundColor: theme.palette.grey[100],
    marginBottom: theme.spacing(1.5),
  },
  startFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  smallButtonIcon: {
    marginRight: theme.spacing(1),
    fontSize: '1.2rem',
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
   PositionDetail - Component to display neatly-formatted position content
*/
function PositionDetail(props) {
  const { siteCode, position, wide } = props;
  const classes = useStyles(Theme);
  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  if (!state.product.sites[siteCode] || !state.product.sites[siteCode].positions[position]) {
    return <Typography variant="body1">{position}</Typography>;
  }
  const {
    referenceElevation,
    xOffset,
    yOffset,
    zOffset,
  } = state.product.sites[siteCode].positions[position];
  const elevation = (parseFloat(referenceElevation, 10) + parseFloat(zOffset, 10))
    .toFixed(2).toString();
  const fadeStyle = { color: Theme.palette.grey[500] };
  const axisStyle = { marginRight: Theme.spacing(1), fontWeight: 600 };
  return wide ? (
    <div>
      <div className={classes.startFlex} style={{ alignItems: 'flex-end' }}>
        <Typography variant="body1" style={{ fontWeight: 600, marginRight: Theme.spacing(3) }}>
          {`ID: ${position}`}
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
          {`ID: ${position}`}
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
  const availablePositions = Object.keys(state.product.sites[siteCode].positions);
  availablePositions.sort();
  const [dialogOpen, setDialogOpen] = useState(false);
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
    setDialogOpen(false);
    dispatch({ type: 'selectSitePositions', siteCode, positions: localSelectedPositions });
  };
  return (
    <React.Fragment>
      <Button
        color="primary"
        variant="outlined"
        onClick={() => { setDialogOpen(true); }}
        className={classes.smallButton}
      >
        <SelectIcon className={classes.smallButtonIcon} />
        Select Positions…
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); }}
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
          <Button onClick={() => { setDialogOpen(false); }} color="primary" variant="outlined">
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
      label="Search Sites"
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
            {`${terrainTypeTitle} - Domain ${domainCode} (${domainName}) - Lat/Lon: ${latitude}, ${longitude}`}
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
  const { site, disabled } = props;
  const { siteCode } = site;
  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { sites: allSites, domains: allDomains } = neonContextData;
  const [, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  let selectedSiteContent = <Typography variant="body1">{siteCode}</Typography>;
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
    const terrainTypeTitle = `${ucWord(terrain)} ${ucWord(type)}`;
    const domainName = allDomains[domainCode] ? allDomains[domainCode].name : null;
    const iconSvg = ICON_SVGS[type] && ICON_SVGS[type][terrain] ? ICON_SVGS[type][terrain] : null;
    selectedSiteContent = (
      <div className={classes.startFlex} style={{ flexBasis: '50%' }}>
        {iconSvg ? (
          <img
            src={iconSvg}
            alt={terrainTypeTitle}
            title={terrainTypeTitle}
            width={Theme.spacing(4)}
            height={Theme.spacing(4)}
            style={{ marginRight: Theme.spacing(1.5), marginTop: Theme.spacing(0.5), flexGrow: 0 }}
          />
        ) : null}
        <div style={{ flexGrow: 1 }}>
          <Typography variant="body1">
            {`${siteCode} - ${description}, ${stateCode}`}
          </Typography>
          <Typography variant="body2" className={classes.optionSubtitle}>
            {terrainTypeTitle}
            <br />
            {`Domain ${domainCode} (${domainName})`}
            <br />
            {`Lat/Lon: ${latitude}, ${longitude}`}
          </Typography>
          <SelectPositionsButton selectedSite={site} />
        </div>
      </div>
    );
  }
  return (
    <Paper key={siteCode} className={classes.sitePaper}>
      <IconButton
        aria-label={`remove site ${siteCode} and all its positions`}
        disabled={disabled}
        style={{ marginRight: Theme.spacing(1) }}
        onClick={() => {
          if (disabled) { return; }
          dispatch({ type: 'selectRemoveSite', siteCode });
        }}
      >
        <ClearIcon fontSize="small" />
      </IconButton>
      <div style={{ flexGrow: 1 }}>
        <div className={classes.startFlex}>
          {selectedSiteContent}
          <div className={classes.root} style={{ flexBasis: '50%' }}>
            <Typography variant="body1" style={{ fontWeight: 600 }} gutterBottom>
              Position(s):
            </Typography>
            {site.positions.map(position => (
              <SelectedPosition
                key={position}
                siteCode={siteCode}
                position={position}
                disabled={site.positions.length < 2}
              />
            ))}
          </div>
        </div>
      </div>
    </Paper>
  );
}

SelectedSite.propTypes = {
  site: PropTypes.shape({
    siteCode: PropTypes.string.isRequired,
    positions: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
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

  // TODO: skeleton
  if (!selectableSitesCount) {
    return null;
  }

  return (
    <NoSsr>
      <Select
        isMulti
        isSearchable
        clearable={false}
        classes={classes}
        styles={selectStyles}
        aria-label="Search Sites"
        data-gtm="time-series-viewer.search-sites"
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
export default function TimeSeriesViewerSites() {
  const classes = useStyles(Theme);
  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();

  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { sites: allSites } = neonContextData;

  // TODO: skeleton
  if (!state.selection.sites.length || !Object.keys(allSites).length) {
    return null;
  }

  return (
    <div className={classes.root}>
      <SitesSelect />
      <div className={classes.sitePaperContainer}>
        {state.selection.sites.map(site => (
          <SelectedSite
            key={site.siteCode}
            site={site}
            disabled={state.selection.sites.length < 2}
          />
        ))}
      </div>
    </div>
  );
}
