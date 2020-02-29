import React from 'react';

import NeonContext from '../NeonContext/NeonContext';

import TimeSeriesViewerContainer from './TimeSeriesViewerContainer';
import TimeSeriesViewerContext from './TimeSeriesViewerContext';

const TimeSeriesViewer = props => (
  <TimeSeriesViewerContext.Provider {...props}>
    <TimeSeriesViewerContainer />
  </TimeSeriesViewerContext.Provider>
);

TimeSeriesViewer.propTypes = TimeSeriesViewerContext.TimeSeriesViewerPropTypes;
TimeSeriesViewer.defaultProps = TimeSeriesViewerContext.Provider.defaultProps;

const WrappedTimeSeriesViewer = NeonContext.getWrappedComponent(TimeSeriesViewer);

export default WrappedTimeSeriesViewer;
