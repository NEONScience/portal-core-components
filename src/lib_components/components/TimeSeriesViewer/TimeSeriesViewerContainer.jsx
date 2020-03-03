import React, { useRef, useState } from 'react';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import SummaryIcon from '@material-ui/icons/Toc';
import SitesIcon from '@material-ui/icons/Place';
import DateRangeIcon from '@material-ui/icons/DateRange';
import VariablesIcon from '@material-ui/icons/ShowChart';
import OptionsIcon from '@material-ui/icons/Settings';

import TimeSeriesViewerContext, { summarizeTimeSteps } from './TimeSeriesViewerContext';
import TimeSeriesViewerSites from './TimeSeriesViewerSites';
import TimeSeriesViewerDateRange from './TimeSeriesViewerDateRange';
import TimeSeriesViewerVariables from './TimeSeriesViewerVariables';
import TimeSeriesViewerOptions from './TimeSeriesViewerOptions';
import TimeSeriesViewerGraph from './TimeSeriesViewerGraph';
import Theme from '../Theme/Theme';

const useStyles = makeStyles(theme => ({
  tabsContainer: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    borderRadius: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  tabsVertical: {
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: '128px',
    flexShrink: 0,
  },
  tabsHorizontal: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    flexShrink: 0,
  },
  tabPanelContainer: {
    padding: theme.spacing(2.5),
    width: '100%',
  },
}));

const useTabsStyles = makeStyles(theme => ({
  scrollButtons: {
    '&:hover, &:focus': {
      backgroundColor: theme.palette.grey[50],
    },
  },
}));

const useTabStyles = makeStyles(theme => ({
  labelIcon: {
    minHeight: theme.spacing(8),
    minWidth: theme.spacing(15),
    '&:hover, &:focus': {
      backgroundColor: theme.palette.grey[50],
    },
    [theme.breakpoints.down('sm')]: {
      minHeight: theme.spacing(6),
      minWidth: theme.spacing(17),
    },
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      margin: `${theme.spacing(0, 1, 0, 0)} !important`,
    },
  },
  selected: {
    color: 'white',
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
}));

/**
   Summary Component
*/
function TimeSeriesViewerSummary() {
  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();

  const {
    sites,
    dateRange,
    variables,
    timeStep,
    autoTimeStep,
    logscale,
    qualityFlags,
    rollPeriod,
  } = state.selection;

  // Sites
  const sitesSummary = sites.map((site) => {
    const { siteCode, positions } = site;
    return (
      <div key={siteCode}>
        {`${siteCode} - ${positions.join(', ')}`}
      </div>
    );
  });

  // Date Range
  const pluralize = (val, unit) => (val === 1 ? `${val} ${unit}` : `${val} ${unit}s`);
  const startMoment = moment(`${dateRange[0]}-15`);
  const endMoment = moment(`${dateRange[1]}-15`);
  const months = Math.ceil(endMoment.diff(startMoment, 'months', true)) + 1;
  const years = Math.floor(months / 12);
  let diff = `${pluralize(months, 'month')}`;
  if (years > 0) {
    diff = (!(months % 12))
      ? `${pluralize(years, 'year')}`
      : `${pluralize(years, 'year')}, ${pluralize(months % 12, 'month')}`;
  }
  const dateRangeSummary = `${startMoment.format('MMM YYYY')} - ${endMoment.format('MMM YYYY')} (${diff})`;

  // Variables
  const variablesSummary = variables.join(', ');

  // Options
  const currentTimeStep = timeStep === 'auto' ? autoTimeStep : timeStep;
  const autoTimeStepDisplay = timeStep === 'auto' ? ` (${currentTimeStep})` : '';
  const options = [
    `${logscale ? 'Logarithmic' : 'Linear'} scale`,
    `${timeStep === 'auto' ? 'Auto' : timeStep} time step${autoTimeStepDisplay}`,
  ];
  if (rollPeriod > 1) {
    options.push(`${summarizeTimeSteps(rollPeriod, currentTimeStep, false)} roll period`);
  }
  const optionsSummary = (
    <React.Fragment>
      {options.join(' · ')}
      {qualityFlags.length > 0 ? (
        <React.Fragment>
          <br />
          {`Quality flags: ${qualityFlags.join(', ')}`}
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );

  return (
    <div>
      <Typography variant="h6">Sites</Typography>
      <div style={{ marginBottom: Theme.spacing(1) }}>{sitesSummary}</div>
      <Typography variant="h6">Date Range</Typography>
      <div style={{ marginBottom: Theme.spacing(1) }}>{dateRangeSummary}</div>
      <Typography variant="h6">Variables</Typography>
      <div style={{ marginBottom: Theme.spacing(1) }}>{variablesSummary}</div>
      <Typography variant="h6">Options</Typography>
      <div style={{ marginBottom: Theme.spacing(1) }}>{optionsSummary}</div>
    </div>
  );
}

/**
   Define Tabs
*/
const TABS = {
  SUMMARY: {
    label: 'Summary',
    Icon: SummaryIcon,
    Component: TimeSeriesViewerSummary,
  },
  SITES: {
    label: 'Sites',
    Icon: SitesIcon,
    Component: TimeSeriesViewerSites,
  },
  DATE_RANGE: {
    label: 'Date Range',
    Icon: DateRangeIcon,
    Component: TimeSeriesViewerDateRange,
  },
  VARIABLES: {
    label: 'Variables',
    Icon: VariablesIcon,
    Component: TimeSeriesViewerVariables,
  },
  OPTIONS: {
    label: 'Options',
    Icon: OptionsIcon,
    Component: TimeSeriesViewerOptions,
  },
};

export default function TimeSeriesViewerContainer() {
  const classes = useStyles(Theme);
  const tabClasses = useTabStyles(Theme);
  const tabsClasses = useTabsStyles(Theme);
  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  const belowMd = useMediaQuery(Theme.breakpoints.down('sm'));

  const initialTab = 'SUMMARY';
  const [selectedTab, setSelectedTab] = useState(initialTab);

  // Slider position is not controlled in state because doing so kills mouse drag performance.
  // Use a ref to deterministically set slider position for all slider-based features.
  const dateRangeSliderRef = useRef(null);

  const renderTabs = () => (
    <Tabs
      orientation={belowMd ? 'horizontal' : 'vertical'}
      variant="scrollable"
      value={selectedTab}
      className={belowMd ? classes.tabsHorizontal : classes.tabsVertical}
      classes={tabsClasses}
      aria-label="Time Series Viewer Controls"
      onChange={(event, newTab) => { setSelectedTab(newTab); }}
      TabIndicatorProps={{ style: { display: 'none' } }}
    >
      {Object.keys(TABS).map((tabId) => {
        const { label, Icon: TabIcon } = TABS[tabId];
        const style = {};
        if (tabId === 'SUMMARY' && !belowMd) { style.borderTopLeftRadius = Theme.spacing(1); }
        return (
          <Tab
            key={tabId}
            value={tabId}
            label={label}
            icon={<TabIcon />}
            classes={tabClasses}
            style={style}
            id={`time-series-viewer-tab-${tabId}`}
            aria-controls={`time-series-viewer-tabpanel-${tabId}`}
          />
        );
      })}
    </Tabs>
  );

  const renderTabPanels = () => (
    <div style={{ flexGrow: 1 }}>
      {Object.keys(TABS).map((tabId) => {
        const { Component: TabComponent } = TABS[tabId];
        let tabComponentProps = {};
        if (tabId === 'DATE_RANGE') { tabComponentProps = { dateRangeSliderRef }; }
        return (
          <div
            key={tabId}
            role="tabpanel"
            id={`time-series-viewer-tabpanel-${tabId}`}
            aria-labelledby={`time-series-viewer-tab-${tabId}`}
            style={{ display: selectedTab === tabId ? 'block' : 'none' }}
            className={classes.tabPanelContainer}
          >
            <TabComponent {...tabComponentProps} />
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      <b>
        {state.status}
      </b>
      <TimeSeriesViewerGraph />
      <br />
      <div className={classes.tabsContainer}>
        {renderTabs()}
        {renderTabPanels()}
      </div>
    </div>
  );
}
