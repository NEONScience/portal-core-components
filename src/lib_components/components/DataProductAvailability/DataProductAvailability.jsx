import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

import { uniqueId } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';

import AscIcon from '@material-ui/icons/KeyboardArrowDown';
import DescIcon from '@material-ui/icons/KeyboardArrowUp';
import ClickIcon from '@material-ui/icons/TouchApp';
import DragIcon from '@material-ui/icons/VerticalAlignCenter';
import PanIcon from '@material-ui/icons/PanTool';

import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

import { AvailabilityGrid, SVG } from './AvailabilityGrid';
import AvailabilityLegend from './AvailabilityLegend';

import Theme from '../Theme/Theme';
import NeonContext from '../NeonContext/NeonContext';
import SiteChip from '../SiteChip/SiteChip';
import FullWidthVisualization from '../FullWidthVisualization/FullWidthVisualization';
import DownloadDataContext from '../DownloadDataContext/DownloadDataContext';

const getYearMonthMoment = yearMonth => moment(`${yearMonth}-01`);

/**
   Setup: CSS classes
*/
const svgMinWidth = (SVG.CELL_WIDTH + SVG.CELL_PADDING) * SVG.MIN_CELLS
  + Math.floor(SVG.MIN_CELLS / 12) * SVG.YEAR_PADDING;
const svgMinHeight = (SVG.CELL_HEIGHT + SVG.CELL_PADDING) * (SVG.MIN_ROWS + 1);
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
    minWidth: `${svgMinWidth}px`,
    minHeight: `${svgMinHeight}px`,
  },
  topFormHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  h5Small: {
    fontSize: '1.075rem',
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
  helpSnackbar: {
    backgroundColor: theme.palette.grey[50],
    color: '#000',
    border: `1px solid ${theme.palette.primary.main}80`,
    '& div.MuiSnackbarContent-message': {
      width: '100%',
    },
  },
  helpIcon: {
    color: theme.palette.grey[300],
    marginRight: theme.spacing(1),
  },
  helpGridContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(-1),
    marginRight: theme.spacing(-1),
  },
  helpGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const useSiteChipStyles = makeStyles(theme => ({
  deleteIcon: {
    marginLeft: theme.spacing(-0.25),
  },
}));

/**
   Main Function
*/
const DataProductAvailability = (props) => {
  const classes = useStyles(Theme);
  const atXs = useMediaQuery(Theme.breakpoints.only('xs'));
  const atSm = useMediaQuery(Theme.breakpoints.only('sm'));
  const siteChipClasses = useSiteChipStyles(Theme);
  const { ...other } = props;

  const [{ data: neonContextData }] = NeonContext.useNeonContextState();
  const { sites: allSites, states: allStates, domains: allDomains } = neonContextData;

  /**
     Sort methods and directions
  */
  const SORT_METHODS = {
    states: {
      label: 'by State',
      getSortFunction: ret => (a, b) => {
        const aState = allStates[allSites[a].stateCode].name;
        const bState = allStates[allSites[b].stateCode].name;
        if (aState === bState) { return (a < b ? ret[0] : ret[1]); }
        return aState < bState ? ret[0] : ret[1];
      },
    },
    domains: {
      label: 'by Domain',
      getSortFunction: ret => (a, b) => {
        const aDomain = allSites[a].domainCode;
        const bDomain = allSites[b].domainCode;
        if (aDomain === bDomain) { return (a < b ? ret[0] : ret[1]); }
        return aDomain < bDomain ? ret[0] : ret[1];
      },
    },
    sites: {
      label: 'by Site',
      getSortFunction: ret => (a, b) => (a < b ? ret[0] : ret[1]),
    },
  };
  const SORT_DIRECTIONS = ['ASC', 'DESC'];

  /**
     State: Views
     Contain and sort the availability data.
     Afford different methods for presenting/grouping data along the y-axis (geospatial)
  */
  const views = {
    summary: {
      view: 'summary',
      name: 'Summary',
      selectable: true,
      rows: {
        summary: {},
      },
      getLabel: {
        text: () => 'ALL ',
        title: () => 'All Sites',
      },
    },
    sites: {
      view: 'sites',
      name: 'Site',
      selectable: true,
      rows: {},
      getLabel: {
        text: key => key,
        title: key => allSites[key].description,
      },
    },
    states: {
      view: 'states',
      name: 'State',
      selectable: true,
      rows: {},
      getLabel: {
        text: key => ` ${key} `,
        title: key => allStates[key].name,
      },
    },
    domains: {
      view: 'domains',
      name: 'Domain',
      selectable: true,
      rows: {},
      getLabel: {
        text: key => `${key} `,
        title: key => allDomains[key].name,
      },
    },
    ungrouped: {
      view: 'ungrouped',
      name: 'Ungrouped',
      selectable: false,
      getLabel: {
        text: key => `${allSites[key].stateCode}-${allSites[key].domainCode}-${key}`,
        title: (key) => {
          const siteTitle = allSites[key].description;
          const domainTitle = allDomains[allSites[key].domainCode].name;
          const stateTitle = allStates[allSites[key].stateCode].name;
          return `${stateTitle} - ${domainTitle} - ${siteTitle}`;
        },
      },
    },
  };
  views.ungrouped.rows = views.sites.rows;
  const selectableViewKeys = Object.keys(views).filter(key => views[key].selectable);

  /**
     State: Context-Derived Stuff
  */
  const [
    {
      downloadContextIsActive,
      requiredSteps,
      productData,
      sites,
      dateRange,
      availabilityView: contextView,
      availabilitySortMethod: contextSortMethod,
      availabilitySortDirection: contextSortDirection,
    },
    dispatchSelection,
  ] = DownloadDataContext.useDownloadDataState();

  const { disableSelection } = props;
  const selectionEnabled = !disableSelection
    && requiredSteps.some(step => step.key === 'sitesAndDateRange');

  /**
     State: Current View
     View mode can be set from the view prop or pulled from a download context.
     Prop overrides context. If neither are set then default to 'sites' if selection
     is currently enabled and 'summary' if not.
  */
  const { view: propsView } = props;
  let initialView = propsView;
  if (!initialView) { initialView = contextView; }
  if (!initialView) { initialView = selectionEnabled ? 'sites' : 'summary'; }
  const [currentView, setCurrentView] = useState(initialView);

  /**
     State: Current Sort Method and Sort Direction
     Only applies for "ungrouped" view mode.
  */
  const { sortMethod: propsSortMethod, sortDirection: propsSortDirection } = props;
  let initialSortMethod = propsSortMethod;
  if (!initialSortMethod) { initialSortMethod = contextSortMethod; }
  if (!initialSortMethod) { initialSortMethod = 'states'; }
  let initialSortDirection = propsSortDirection;
  if (!initialSortDirection) { initialSortDirection = contextSortDirection; }
  if (!initialSortDirection) { initialSortDirection = 'ASC'; }
  const [currentSortMethod, setCurrentSortMethod] = useState(initialSortMethod);
  const [currentSortDirection, setCurrentSortDirection] = useState(initialSortDirection);

  const setSitesValue = useCallback(sitesValue => dispatchSelection({
    type: 'setValidatableValue',
    key: 'sites',
    value: sitesValue,
  }), [dispatchSelection]);
  const setDateRangeValue = useCallback(dateRangeValue => dispatchSelection({
    type: 'setValidatableValue',
    key: 'dateRange',
    value: dateRangeValue,
  }), [dispatchSelection]);
  const handleSelectAllSites = () => {
    setSitesValue(sites.validValues);
  };
  const handleSelectNoneSites = () => {
    setSitesValue([]);
  };
  const handleSelectAllDateRange = () => {
    setDateRangeValue(dateRange.validValues);
  };
  const handleSelectLatestYearDateRange = () => {
    const start = getYearMonthMoment(dateRange.validValues[1]).subtract(11, 'months').format('YYYY-MM');
    setDateRangeValue([
      start < dateRange.validValues[0] ? dateRange.validValues[0] : start,
      dateRange.validValues[1],
    ]);
  };
  const handleChangeStartDate = (newStartDate) => {
    setDateRangeValue([
      newStartDate.format('YYYY-MM'),
      dateRange.value[1],
    ]);
  };
  const handleChangeEndDate = (newEndDate) => {
    setDateRangeValue([
      dateRange.value[0],
      newEndDate.format('YYYY-MM'),
    ]);
  };
  const handleChangeView = (event, newView) => {
    if (
      !selectableViewKeys.includes(newView)
      || currentView === newView
    ) { return; }
    if (downloadContextIsActive) {
      dispatchSelection({
        type: 'setAvailabilityView',
        value: newView,
      });
    }
    setCurrentView(newView);
  };

  let sortedSites = [];
  const applySort = () => {
    if (currentView !== 'ungrouped') { return; }
    // NOTE - these returns are backwards because the rendering in the chart is bottom-up
    // (though of course a user will read it top-down).
    const sortReturns = [
      currentSortDirection === 'ASC' ? 1 : -1,
      currentSortDirection === 'ASC' ? -1 : 1,
    ];
    sortedSites = Object.keys(views.ungrouped.rows);
    sortedSites.sort(SORT_METHODS[currentSortMethod].getSortFunction(sortReturns));
  };
  const handleChangeSortMethod = (event) => {
    const newSortMethod = event.target.value;
    if (
      !Object.keys(SORT_METHODS).includes(newSortMethod)
      || currentSortMethod === newSortMethod
    ) { return; }
    if (downloadContextIsActive) {
      dispatchSelection({
        type: 'setAvailabilitySortMethod',
        value: newSortMethod,
      });
    }
    setCurrentSortMethod(newSortMethod);
    applySort();
  };
  const handleChangeSortDirection = (event, newSortDirection) => {
    if (
      !SORT_DIRECTIONS.includes(newSortDirection)
      || currentSortDirection === newSortDirection
    ) { return; }
    if (downloadContextIsActive) {
      dispatchSelection({
        type: 'setAvailabilitySortDirection',
        value: newSortDirection,
      });
    }
    setCurrentSortDirection(newSortDirection);
    applySort();
  };

  /**
     Product Data: Map to Views
     Statically loaded in via props or pulled from context. If both, props wins.
     Should not change in render lifecycle.
     Create mappings of the shape row => year-month => status for
     all aggregation views.
     TODO: Add other statuses. Currently the only status is "available".
  */
  let siteCodes = [];
  const { siteCodes: propsSiteCodes } = props;
  const { siteCodes: contextSiteCodes } = productData;
  if (propsSiteCodes && propsSiteCodes.length) {
    siteCodes = propsSiteCodes;
  } else if (contextSiteCodes && contextSiteCodes.length) {
    siteCodes = contextSiteCodes;
  }
  siteCodes.forEach((site) => {
    const { siteCode, availableMonths } = site;
    if (!allSites[siteCode]) { return; }
    const { stateCode, domainCode } = allSites[siteCode];
    if (!downloadContextIsActive) { sites.validValues.push(siteCode); }
    views.sites.rows[siteCode] = {};
    views.states.rows[stateCode] = views.states.rows[stateCode] || {};
    views.domains.rows[domainCode] = views.domains.rows[domainCode] || {};
    availableMonths.forEach((month) => {
      views.summary.rows.summary[month] = 'available';
      views.sites.rows[siteCode][month] = 'available';
      views.states.rows[stateCode][month] = 'available';
      views.domains.rows[domainCode][month] = 'available';
    });
  });
  if (!downloadContextIsActive) {
    const summaryMonths = Object.keys(views.summary.rows.summary).sort();
    dateRange.validValues[0] = summaryMonths[0]; // eslint-disable-line prefer-destructuring
    dateRange.validValues[1] = summaryMonths.pop();
  }

  /**
     Redraw setup
  */
  const svgRef = useRef(null);

  const handleSvgRedraw = useCallback(() => {
    AvailabilityGrid({
      data: views[currentView],
      svgRef,
      allSites,
      sites,
      sortedSites,
      setSitesValue,
      dateRange,
      setDateRangeValue,
      selectionEnabled,
    });
  }, [
    svgRef,
    views,
    currentView,
    allSites,
    sites,
    sortedSites,
    setSitesValue,
    dateRange,
    setDateRangeValue,
    selectionEnabled,
  ]);

  useEffect(() => {
    applySort();
    handleSvgRedraw();
  });

  let justify = 'end';
  if (currentView === 'ungrouped') {
    justify = atXs || atSm ? 'start' : 'end';
  } else {
    justify = atXs ? 'start' : 'end';
  }
  const optionDivStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: `flex-${justify}`,
  };

  /**
     Render: View Options
  */
  const renderViewOptions = () => {
    const renderToggleButton = (key) => {
      let className = classes.optionButton;
      if (key === currentView) {
        className = `${className} ${classes.optionButtonSelected}`;
      }
      return (
        <ToggleButton key={key} value={key} size="small" className={className}>
          {views[key].name}
        </ToggleButton>
      );
    };
    return (
      <div
        style={optionDivStyle}
        data-selenium="data-product-availability.view-options"
      >
        <Typography
          variant="h6"
          className={classes.h6Small}
          style={{ marginRight: Theme.spacing(1.5), whiteSpace: 'nowrap' }}
        >
          View By:
        </Typography>
        <Hidden smDown key="viewMdUp">
          <ToggleButtonGroup
            exclusive
            color="primary"
            variant="outlined"
            size="small"
            className={classes.optionButtonGroup}
            value={currentView}
            onChange={handleChangeView}
          >
            {selectableViewKeys.map(key => renderToggleButton(key))}
          </ToggleButtonGroup>
        </Hidden>
        <Hidden mdUp key="viewSmDown">
          <FormControl variant="filled">
            <Select
              value={currentView}
              onChange={event => handleChangeView(event, event.target.value)}
              input={<OutlinedInput margin="dense" className={selectionEnabled ? null : classes.xsSelect} />}
              variant="filled"
            >
              {selectableViewKeys.map(key => (
                <MenuItem key={key} value={key}>{views[key].name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Hidden>
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
            value={currentSortMethod}
            aria-label="Sort Method"
            className={classes.sortSelect}
            onChange={handleChangeSortMethod}
            data-selenium="data-product-availability.sort-options.method"
          >
            {Object.keys(SORT_METHODS).map(method => (
              <MenuItem
                key={method}
                value={method}
              >
                {SORT_METHODS[method].label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ToggleButtonGroup
          exclusive
          value={currentSortDirection}
          className={classes.optionButtonGroup}
          onChange={handleChangeSortDirection}
          data-selenium="data-product-availability.sort-options.direction"
        >
          <ToggleButton
            size="small"
            key={SORT_DIRECTIONS[0]}
            value={SORT_DIRECTIONS[0]}
            className={`${classes.optionButton} ${currentSortDirection === SORT_DIRECTIONS[0] ? classes.optionButtonSelected : ''}`}
            title="Sort Ascending (A-Z)"
            aria-label="Sort Ascending (A-Z)"
          >
            <AscIcon />
          </ToggleButton>
          <ToggleButton
            size="small"
            key={SORT_DIRECTIONS[1]}
            value={SORT_DIRECTIONS[1]}
            className={`${classes.optionButton} ${currentSortDirection === SORT_DIRECTIONS[1] ? classes.optionButtonSelected : ''}`}
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
     Render: Selection
  */
  const renderSelection = () => {
    if (!selectionEnabled) { return null; }
    const sitesPlural = sites.value.length > 1 ? 's' : '';
    const siteChipLabel = `${sites.value.length} site${sitesPlural}`;
    const siteChipProps = {
      size: 'large',
      classes: siteChipClasses,
      label: sites.value.length ? siteChipLabel : 'no sites selected',
      variant: sites.value.length ? 'default' : 'outlined',
      onDelete: sites.value.length ? handleSelectNoneSites : null,
    };
    const selectionButtonProps = { size: 'small', color: 'primary', variant: 'outlined' };
    const datePickerProps = {
      inputVariant: 'outlined',
      margin: 'dense',
      views: ['month', 'year'],
      openTo: 'month',
    };
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5} md={6}>
          <div className={classes.topFormHeader}>
            <Typography variant="h6" className={classes.h6Small}>Sites</Typography>
          </div>
          <div style={{ marginTop: Theme.spacing(1), marginBottom: Theme.spacing(1.5) }}>
            <SiteChip {...siteChipProps} />
          </div>
          <div style={{ display: 'flex' }}>
            <Button
              {...selectionButtonProps}
              data-selenium="data-product-availability.select-all-sites-button"
              onClick={handleSelectAllSites}
            >
              Select All Sites
            </Button>
            {/* Show/enable when site selection widget exists and cab be used here */}
            <Button
              {...selectionButtonProps}
              data-selenium="data-product-availability.browse-sites-button"
              style={{ marginLeft: Theme.spacing(1), display: 'none' }}
              disabled
            >
              Browse Sites…
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} sm={7} md={6}>
          <Typography variant="h6" className={classes.h6Small}>Date Range</Typography>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
              <DatePicker
                {...datePickerProps}
                label="Start"
                data-selenium="data-product-availability.date-range-start"
                value={getYearMonthMoment(dateRange.value[0])}
                onChange={newDate => handleChangeStartDate(newDate)}
                minDate={getYearMonthMoment(dateRange.validValues[0])}
                maxDate={getYearMonthMoment(dateRange.value[1])}
                style={{ marginRight: Theme.spacing(1.5) }}
              />
              <DatePicker
                {...datePickerProps}
                label="End"
                data-selenium="data-product-availability.date-range-end"
                value={getYearMonthMoment(dateRange.value[1])}
                onChange={newDate => handleChangeEndDate(newDate)}
                minDate={getYearMonthMoment(dateRange.value[0])}
                maxDate={getYearMonthMoment(dateRange.validValues[1])}
              />
            </div>
          </MuiPickersUtilsProvider>
          <div style={{ display: 'flex', marginTop: Theme.spacing(1) }}>
            <Button
              {...selectionButtonProps}
              data-selenium="data-product-availability.all-years-button"
              onClick={handleSelectAllDateRange}
            >
              Select All Years
            </Button>
            <Button
              {...selectionButtonProps}
              data-selenium="data-product-availability.latest-year-button"
              onClick={handleSelectLatestYearDateRange}
              style={{ marginLeft: Theme.spacing(1) }}
            >
              Select Latest Year
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} style={{ marginBottom: Theme.spacing(1) }}>
          <SnackbarContent
            className={classes.helpSnackbar}
            style={{ justifyContent: 'center' }}
            message={(
              <div className={classes.helpGridContainer}>
                <div className={classes.helpGrid}>
                  <PanIcon className={classes.helpIcon} />
                  <Typography variant="body1" component="div" style={{ flexGrow: 1 }}>
                    Drag the grid to pan across time
                  </Typography>
                </div>
                <div className={classes.helpGrid}>
                  <ClickIcon className={classes.helpIcon} />
                  <Typography variant="body1" component="div" style={{ flexGrow: 1 }}>
                    Click rows to select sites
                  </Typography>
                </div>
                <div className={classes.helpGrid}>
                  <DragIcon className={classes.helpIcon} style={{ transform: 'rotate(90deg)' }} />
                  <Typography variant="body1" component="div" style={{ flexGrow: 1 }}>
                    Drag selection edges to adjust dates
                  </Typography>
                </div>
              </div>
            )}
          />
        </Grid>
      </Grid>
    );
  };

  /**
     Render: Final Component
  */
  const currentRows = views[currentView].rows;
  const currentRowCount = Object.keys(currentRows).length;
  const svgHeight = SVG.CELL_PADDING
    + (SVG.CELL_HEIGHT + SVG.CELL_PADDING) * (currentRowCount + 1);
  return (
    <FullWidthVisualization
      vizRef={svgRef}
      minWidth={svgMinWidth}
      handleRedraw={handleSvgRedraw}
      data-selenium="data-product-availability"
      {...other}
    >
      <Grid
        container
        spacing={2}
        direction="row-reverse"
        style={{ marginBottom: Theme.spacing(1) }}
      >
        {selectionEnabled ? (
          <Grid item xs={12} sm={12}>
            {renderSelection()}
          </Grid>
        ) : null}
        <Grid item xs={12} sm={currentView === 'ungrouped' ? 12 : 5} md={6}>
          {currentView === 'ungrouped' ? renderSortOptions() : renderViewOptions()}
        </Grid>
        <Grid
          item
          xs={12}
          sm={currentView === 'ungrouped' ? 12 : 7}
          md={6}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Typography
            variant="h6"
            className={classes.h6Small}
            style={{ marginRight: Theme.spacing(1.5) }}
          >
            Key:
          </Typography>
          <AvailabilityLegend selectionEnabled={selectionEnabled} style={{ flexGrow: 1 }} />
        </Grid>
      </Grid>
      <svg
        id={uniqueId('dpa-')}
        ref={svgRef}
        height={svgHeight}
        className={classes.svg}
      />
    </FullWidthVisualization>
  );
};

DataProductAvailability.propTypes = {
  siteCodes: PropTypes.arrayOf( // eslint-disable-line react/no-unused-prop-types
    PropTypes.shape({
      siteCode: PropTypes.string.isRequired,
      availableMonths: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ),
  view: PropTypes.oneOf(['summary', 'sites', 'states', 'domains', 'ungrouped']),
  sortMethod: PropTypes.oneOf(['sites', 'states', 'domains']),
  sortDirection: PropTypes.oneOf(['ASC', 'DESC']),
  disableSelection: PropTypes.bool,
};

DataProductAvailability.defaultProps = {
  siteCodes: [],
  view: null,
  sortMethod: null,
  sortDirection: 'ASC',
  disableSelection: false,
};

const WrappedDataProductAvailability = Theme.getWrappedComponent(
  NeonContext.getWrappedComponent(DataProductAvailability),
);

export default WrappedDataProductAvailability;
