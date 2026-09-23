import React from 'react';

import NeonAuthContext from '../NeonContext/NeonAuthContext';
import NeonContext from '../NeonContext/NeonContext';

import TimeSeriesViewerContainer from './TimeSeriesViewerContainer';
import TimeSeriesViewerContext, { defaultProps } from './TimeSeriesViewerContext';

import { resolveProps } from '../../util/defaultProps';

const TimeSeriesViewer = (inProps) => {
  const props = resolveProps(defaultProps, inProps);
  return (
    <TimeSeriesViewerContext.Provider {...props}>
      <TimeSeriesViewerContainer />
    </TimeSeriesViewerContext.Provider>
  );
};

TimeSeriesViewer.propTypes = TimeSeriesViewerContext.TimeSeriesViewerPropTypes;

const WrappedTimeSeriesViewer = NeonContext.getWrappedComponent(
  NeonAuthContext.getWrappedComponent(TimeSeriesViewer),
);

export default WrappedTimeSeriesViewer;
