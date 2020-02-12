import React from 'react';

import TimeSeriesViewerContext from './TimeSeriesViewerContext';

export default function TimeSeriesViewerContainer() {
  const [state, dispatch] = TimeSeriesViewerContext.useTimeSeriesViewerState();
  console.log('CONTAINER', state, dispatch);
  return (
    <div>
      Time Series Viewer
      <br />
      {state.status}
      <br />
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}
