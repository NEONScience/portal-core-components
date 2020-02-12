import React, { useRef } from 'react';

import TimeSeriesViewerContext from './TimeSeriesViewerContext';
import TimeSeriesViewerDateRange from './TimeSeriesViewerDateRange';

const preStyle = {
  whiteSpace: 'pre-wrap',
  height: '80vh',
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
      Time Series Viewer
      <br />
      {state.status}
      <br />
      <TimeSeriesViewerDateRange dateRangeSliderRef={dateRangeSliderRef} />
      <pre style={preStyle}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}
