/* eslint-disable no-unused-vars */

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { uniqueId } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
// import SnackbarContent from '@material-ui/core/SnackbarContent';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';

import AscIcon from '@material-ui/icons/KeyboardArrowDown';
import DescIcon from '@material-ui/icons/KeyboardArrowUp';

import AvailabilityContext from './AvailabilityContext';
import FullWidthVisualization from '../FullWidthVisualization/FullWidthVisualization';
import DownloadDataContext from '../DownloadDataContext/DownloadDataContext';
import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';

import EnhancedAvailabilityKey from './EnhancedAvailabilityKey';
import EnhancedAvailabilityGrid from './EnhancedAvailabilityGrid';
import { SVG, TIME, AvailabilityPropTypes } from './AvailabilityUtils';
import { SvgDefs } from './AvailabilitySvgComponents';

const preStyle = {
  width: '100%',
  height: '50vh',
  overflowY: 'scroll',
  padding: '2px',
  border: '1px dotted black',
};

/**
   Setup: CSS classes
*/
const useStyles = makeStyles(theme => ({
  optionButtonGroup: {
    height: theme.spacing(4),
  },
  optionButton: {
    height: theme.spacing(4),
    fontWeight: 600,
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    padding: theme.spacing(0, 1.5),
    whiteSpace: 'nowrap',
  },
  // Use !important here to override the Mui-selected class with higher priority
  optionButtonSelected: {
    color: '#fff !important',
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  svg: {
    minWidth: `${SVG.MIN_WIDTH}px`,
    minHeight: `${SVG.MIN_HEIGHT}px`,
  },
  h6Small: {
    fontSize: '0.95rem',
  },
  xsSelect: {
    height: theme.spacing(4),
    '& div': {
      padding: Theme.spacing(1, 3, 1, 1.5),
    },
  },
  sortSelect: {
    height: theme.spacing(4),
    '& div': {
      paddingRight: Theme.spacing(4.5),
    },
    marginRight: theme.spacing(2),
  },
  viewAndSortOptionsContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(3),
  },
}));

const EnhancedAvailabilityInterface = (props) => {
  const { sites: availabilitySites, ...other } = props;

  const classes = useStyles(Theme);
  const atXs = useMediaQuery(Theme.breakpoints.only('xs'));
  const atSm = useMediaQuery(Theme.breakpoints.only('sm'));

  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { sites: allSites, states: allStates, domains: allDomains } = neonContextData;

  const { SORT_DIRECTIONS, useAvailabilityState } = AvailabilityContext;
  const [availabilityState, availabilityDispatch] = useAvailabilityState();
  const {
    rows,
    rowLabels,
    rowTitles,
    tables,
    breakouts,
    validBreakouts,
    sortDirection,
  } = availabilityState;

  /**
     Context-Derived Stuff
  */
  const downloadContextIsActive = false;
  const selectionEnabled = false;

  /**
     Redraw setup
  */
  const svgRef = useRef(null);
  const handleSvgRedraw = useCallback(() => {
    if (!rowLabels.length) { return; }
    EnhancedAvailabilityGrid({
      rows,
      rowLabels,
      rowTitles,
      svgRef,
      selectionEnabled,
    });
  }, [
    svgRef,
    rows,
    rowLabels,
    rowTitles,
    selectionEnabled,
  ]);
  useEffect(() => { handleSvgRedraw(); });

  /*
  let justify = 'end';
  if (currentView === 'ungrouped') {
    justify = atXs || atSm ? 'start' : 'end';
  } else {
    justify = atXs ? 'start' : 'end';
  }
  */
  const optionDivStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  };

  /**
     Render: Breakout Options
  */
  const renderBreakoutOptions = () => {
    const handleChangeBreakouts = (event, newBreakouts) => {
      availabilityDispatch({ type: 'setBreakouts', breakouts: newBreakouts });
    };
    const renderToggleButton = (key) => {
      let className = classes.optionButton;
      if (breakouts.includes(key)) {
        className = `${className} ${classes.optionButtonSelected}`;
      }
      return (
        <ToggleButton key={key} value={key} size="small" className={className}>
          {key}
        </ToggleButton>
      );
    };
    return (
      <div
        style={{ ...optionDivStyle, marginRight: Theme.spacing(3) }}
        data-selenium="data-product-availability.breakout-options"
      >
        <Typography
          variant="h6"
          className={classes.h6Small}
          style={{ marginRight: Theme.spacing(1.5), whiteSpace: 'nowrap' }}
        >
          View By:
        </Typography>
        <ToggleButtonGroup
          color="primary"
          variant="outlined"
          size="small"
          className={classes.optionButtonGroup}
          value={breakouts}
          onChange={handleChangeBreakouts}
        >
          {validBreakouts.map(key => renderToggleButton(key))}
        </ToggleButtonGroup>
      </div>
    );
  };

  /**
     Render: Sort Options
  */
  const renderSortOptions = () => (
    <div
      style={optionDivStyle}
      data-selenium="data-product-availability.sort-options"
    >
      <Typography
        variant="h6"
        className={classes.h6Small}
        style={{ marginRight: Theme.spacing(1.5), whiteSpace: 'nowrap' }}
      >
        Sort By:
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl variant="outlined">
          <Select
            value={breakouts.length ? breakouts[0] : ''}
            aria-label="Sort By"
            className={classes.sortSelect}
            disabled={!breakouts.length}
            onChange={(event) => {
              availabilityDispatch({ type: 'setSortMethod', method: event.target.value });
            }}
            data-selenium="data-product-availability.sort-options.method"
          >
            {validBreakouts.map(method => (
              <MenuItem
                key={method}
                value={method}
              >
                {method}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ToggleButtonGroup
          exclusive
          value={breakouts.length ? sortDirection : null}
          className={classes.optionButtonGroup}
          onChange={(event, newSortDirection) => {
            availabilityDispatch({ type: 'setSortDirection', direction: newSortDirection });
          }}
          data-selenium="data-product-availability.sort-options.direction"
        >
          <ToggleButton
            size="small"
            key={SORT_DIRECTIONS.ASC}
            value={SORT_DIRECTIONS.ASC}
            className={`${classes.optionButton} ${breakouts.length && sortDirection === SORT_DIRECTIONS.ASC ? classes.optionButtonSelected : ''}`}
            style={breakouts.length ? null : { borderColor: 'unset' }}
            disabled={!breakouts.length}
            title="Sort Ascending (A-Z)"
            aria-label="Sort Ascending (A-Z)"
          >
            <AscIcon />
          </ToggleButton>
          <ToggleButton
            size="small"
            key={SORT_DIRECTIONS.DESC}
            value={SORT_DIRECTIONS.DESC}
            className={`${classes.optionButton} ${breakouts.length && sortDirection === SORT_DIRECTIONS.DESC ? classes.optionButtonSelected : ''}`}
            style={breakouts.length ? null : { borderColor: 'unset' }}
            disabled={!breakouts.length}
            title="Sort Descending (Z-A)"
            aria-label="Sort Descending (Z-A)"
          >
            <DescIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );

  /**
     Main Render
  */
  const svgHeight = SVG.CELL_PADDING
    + (SVG.CELL_HEIGHT + SVG.CELL_PADDING) * (rowLabels.length + 1);
  const rollUpPresent = !(breakouts.includes('sites') && breakouts.includes('tables'));
  return (
    <FullWidthVisualization
      vizRef={svgRef}
      minWidth={SVG.MIN_WIDTH}
      handleRedraw={handleSvgRedraw}
      data-selenium="data-product-availability"
      {...other}
    >
      <SvgDefs />
      <div className={classes.viewAndSortOptionsContainer}>
        {renderBreakoutOptions()}
        {renderSortOptions()}
      </div>
      <EnhancedAvailabilityKey selectionEnabled rollUpPresent={rollUpPresent} />
      <br />
      <svg id={uniqueId('dpa-')} ref={svgRef} height={svgHeight} className={classes.svg} />
      <br />
      <br />
      <br />
      <pre style={preStyle}>
        {JSON.stringify(tables, null, 2)}
      </pre>
    </FullWidthVisualization>
  );
};

EnhancedAvailabilityInterface.propTypes = {
  sites: AvailabilityPropTypes.enhancedSites,
  view: PropTypes.oneOf(['summary', 'sites', 'states', 'domains', 'ungrouped']),
  table: PropTypes.string,
  sortMethod: PropTypes.oneOf(['sites', 'states', 'domains']),
  sortDirection: PropTypes.oneOf(['ASC', 'DESC']),
  disableSelection: PropTypes.bool,
};

EnhancedAvailabilityInterface.defaultProps = {
  sites: [],
  view: null,
  table: 'ALL',
  sortMethod: null,
  sortDirection: 'ASC',
  disableSelection: false,
};

export default EnhancedAvailabilityInterface;
