import React, { useRef } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import TimeSeriesViewerContext from './TimeSeriesViewerContext';
import TimeSeriesViewerDateRange from './TimeSeriesViewerDateRange';
import TimeSeriesViewerVariables from './TimeSeriesViewerVariables';
import TimeSeriesViewerGraph from './TimeSeriesViewerGraph';

const preStyle = {
  whiteSpace: 'pre-wrap',
  border: '1px solid black',
  padding: '2px',
  overflowY: 'scroll',
};

export default function TimeSeriesViewerContainer() {
  const [state] = TimeSeriesViewerContext.useTimeSeriesViewerState();

  // Slider position is not controlled in state because doing so kills mouse drag performance.
  // Use a ref to deterministiaclly set slider position when range is changed from date pickers.
  const dateRangeSliderRef = useRef(null);

  return (
    <div>
      <b>
        {state.status}
      </b>
      <br />
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Typography variant="h6">Sites and Positions</Typography>
          (...)
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">Variables</Typography>
          <TimeSeriesViewerVariables />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">Date Range</Typography>
          <TimeSeriesViewerDateRange dateRangeSliderRef={dateRangeSliderRef} />
        </Grid>
      </Grid>
      <br />
      <TimeSeriesViewerGraph />
      <br />
      <pre style={{ ...preStyle, height: '25vh' }}>
        {JSON.stringify(state.selection, null, 2)}
      </pre>
      <pre style={{ ...preStyle, height: '55vh' }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}
