import React from 'react';

import TimeSeriesViewerContainer from './TimeSeriesViewerContainer';
import TimeSeriesViewerContext from './TimeSeriesViewerContext';

export default function TimeSeriesViewer(props) {
  return (
    <TimeSeriesViewerContext.Provider {...props}>
      <TimeSeriesViewerContainer />
    </TimeSeriesViewerContext.Provider>
  );
}

TimeSeriesViewer.propTypes = TimeSeriesViewerContext.TimeSeriesViewerPropTypes;
TimeSeriesViewer.defaultProps = TimeSeriesViewerContext.Provider.defaultProps;
