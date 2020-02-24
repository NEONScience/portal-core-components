import React, { useRef, useState } from 'react';
import moment from 'moment';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

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
  panelSummary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-arround',
  },
  panelSummaryTitleContainer: {
    flexGrow: 0,
    display: 'flex',
    alignItems: 'center',
    paddingRight: theme.spacing(3),
  },
  panelSummarySummaryContainer: {
    flexGrow: 1,
    textAlign: 'right',
    color: Theme.palette.grey[400],
  },
}));

/**
   Expansion Panel styled components
*/
const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: Theme.spacing(1.5, 0),
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles({
  root: {
    padding: Theme.spacing(2),
  },
})(MuiExpansionPanelDetails);

/**
   Define Panels
*/
const PANELS = {
  SITES: {
    title: 'Sites',
    Icon: SitesIcon,
    Component: TimeSeriesViewerSites,
  },
  DATE_RANGE: {
    title: 'Date Range',
    Icon: DateRangeIcon,
    Component: TimeSeriesViewerDateRange,
  },
  VARIABLES: {
    title: 'Variables',
    Icon: VariablesIcon,
    Component: TimeSeriesViewerVariables,
  },
  OPTIONS: {
    title: 'Options',
    Icon: OptionsIcon,
    Component: TimeSeriesViewerOptions,
  },
};

export default function TimeSeriesViewerContainer() {
  const classes = useStyles(Theme);
  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();

  const initialPanel = null;
  const [expandedPanel, setExpandedPanel] = useState(initialPanel);

  // Slider position is not controlled in state because doing so kills mouse drag performance.
  // Use a ref to deterministically set slider position for all slider-based features.
  const dateRangeSliderRef = useRef(null);

  const renderPanelComponent = (panelId) => {
    if (!Object.keys(PANELS).includes(panelId)) { return null; }
    const { Component: PanelComponent } = PANELS[panelId];
    let panelComponentProps = {};
    if (panelId === 'DATE_RANGE') { panelComponentProps = { dateRangeSliderRef }; }
    return <PanelComponent {...panelComponentProps} />;
  };

  const getSitesSummary = () => {
    const { sites } = state.selection;
    return sites.map((site) => {
      const { siteCode, positions } = site;
      return (
        <div key={siteCode}>
          {`${siteCode} - ${positions.join(', ')}`}
        </div>
      );
    });
  };

  const getDateRangeSummary = () => {
    const pluralize = (val, unit) => (val === 1 ? `${val} ${unit}` : `${val} ${unit}s`);
    const startMoment = moment(`${state.selection.dateRange[0]}-15`);
    const endMoment = moment(`${state.selection.dateRange[1]}-15`);
    const months = Math.ceil(endMoment.diff(startMoment, 'months', true)) + 1;
    const years = Math.floor(months / 12);
    let diff = `${pluralize(months, 'month')}`;
    if (years > 0) {
      diff = (!(months % 12))
        ? `${pluralize(years, 'year')}`
        : `${pluralize(years, 'year')}, ${pluralize(months % 12, 'month')}`;
    }
    return `${startMoment.format('MMM YYYY')} - ${endMoment.format('MMM YYYY')} (${diff})`;
  };

  const getVariablesSummary = () => state.selection.variables.join(', ');

  const getOptionsSummary = () => {
    const {
      timeStep,
      autoTimeStep,
      logscale,
      qualityFlags,
      rollPeriod,
    } = state.selection;
    const currentTimeStep = timeStep === 'auto' ? autoTimeStep : timeStep;
    const autoTimeStepDisplay = timeStep === 'auto' ? ` (${currentTimeStep})` : '';
    const options = [
      `${logscale ? 'Logarithmic' : 'Linear'} scale`,
      `${timeStep === 'auto' ? 'Auto' : timeStep} time step${autoTimeStepDisplay}`,
    ];
    if (rollPeriod > 1) {
      options.push(`${summarizeTimeSteps(rollPeriod, currentTimeStep, false)} roll period`);
    }
    return (
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
  };

  const renderPanelContentSummary = (panelId) => {
    switch (panelId) {
      case 'SITES':
        return getSitesSummary();
      case 'DATE_RANGE':
        return getDateRangeSummary();
      case 'VARIABLES':
        return getVariablesSummary();
      case 'OPTIONS':
        return getOptionsSummary();
      default:
        return <i>...</i>;
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <b>
        {state.status}
      </b>
      <TimeSeriesViewerGraph />
      <br />
      {Object.keys(PANELS).map((panelId) => {
        const panel = PANELS[panelId];
        const isExpanded = expandedPanel === panelId;
        const { Icon: PanelIcon } = PANELS[panelId];
        return (
          <ExpansionPanel
            square
            key={panelId}
            expanded={isExpanded}
            onChange={() => { setExpandedPanel(isExpanded ? null : panelId); }}
          >
            <ExpansionPanelSummary
              id={`${panelId}-header`}
              aria-controls={`${panelId}-content`}
              className={classes.panelSummary}
            >
              <div className={classes.panelSummaryTitleContainer}>
                <PanelIcon
                  style={{ marginRight: Theme.spacing(1) }}
                  color={isExpanded ? 'primary' : 'action'}
                />
                <Typography
                  style={{
                    fontWeight: 700,
                    color: isExpanded ? Theme.palette.primary.main : Theme.palette.grey[400],
                  }}
                >
                  {panel.title}
                </Typography>
              </div>
              <div className={classes.panelSummarySummaryContainer}>
                {renderPanelContentSummary(panelId)}
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {renderPanelComponent(panelId)}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        );
      })}
    </div>
  );
}
