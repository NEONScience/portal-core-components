/* eslint-disable no-unused-vars */

import React, {
  useCallback,
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';

import { uniqueId } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';

import AscIcon from '@material-ui/icons/KeyboardArrowDown';
import DescIcon from '@material-ui/icons/KeyboardArrowUp';

import AvailabilityContext from './AvailabilityContext';
import AvailabilityPending from './AvailabilityPending';
import FullWidthVisualization from '../FullWidthVisualization/FullWidthVisualization';
import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';

import EnhancedAvailabilityKey from './EnhancedAvailabilityKey';
import EnhancedAvailabilityGrid from './EnhancedAvailabilityGrid';
import { SVG, AvailabilityPropTypes } from './AvailabilityUtils';
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
const useStyles = makeStyles((theme) => ({
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

  const [
    { isFinal: neonContextIsFinal, hasError: neonContextHasError },
  ] = NeonContext.useNeonContextState();
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
     Render: NeonContext-related Loading and Error States
  */
  if (!neonContextIsFinal || neonContextHasError) {
    return <AvailabilityPending />;
  }

  /**
     Render: Breakout Options
  */
  const renderBreakoutOptions = () => {
    const handleChangeBreakouts = (event, newBreakouts) => {
      availabilityDispatch({ type: 'setBreakouts', breakouts: newBreakouts });
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
          value={breakouts}
          onChange={handleChangeBreakouts}
        >
          {validBreakouts.map((key) => (
            <ToggleButton key={key} value={key} size="small">
              {key}
            </ToggleButton>
          ))}
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
            value={breakouts.length ? breakouts[0] : 'n/a'}
            aria-label="Sort By"
            className={classes.sortSelect}
            onChange={(event) => {
              availabilityDispatch({ type: 'setSortMethod', method: event.target.value });
            }}
            data-selenium="data-product-availability.sort-options.method"
          >
            <MenuItem key="--" value="n/a" disabled>
              --
            </MenuItem>
            {validBreakouts.map((method) => (
              <MenuItem key={method} value={method}>
                {`${method.substr(0, 1).toUpperCase()}${method.substr(1)}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={breakouts.length ? sortDirection : null}
          onChange={(event, newSortDirection) => {
            availabilityDispatch({ type: 'setSortDirection', direction: newSortDirection });
          }}
          data-selenium="data-product-availability.sort-options.direction"
        >
          <ToggleButton
            key={SORT_DIRECTIONS.ASC}
            value={SORT_DIRECTIONS.ASC}
            style={breakouts.length ? null : { borderColor: 'unset' }}
            disabled={!breakouts.length}
            title="Sort Ascending (A-Z)"
            aria-label="Sort Ascending (A-Z)"
          >
            <AscIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton
            key={SORT_DIRECTIONS.DESC}
            value={SORT_DIRECTIONS.DESC}
            style={breakouts.length ? null : { borderColor: 'unset' }}
            disabled={!breakouts.length}
            title="Sort Descending (Z-A)"
            aria-label="Sort Descending (Z-A)"
          >
            <DescIcon fontSize="small" />
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
