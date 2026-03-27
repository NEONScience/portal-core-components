import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import NeonContext from '../NeonContext/NeonContext';
import TimeSeriesViewerContainer from './TimeSeriesViewerContainer';
import TimeSeriesViewerContext, { defaultProps } from './TimeSeriesViewerContext';
import { resolveProps } from '../../util/defaultProps';
const TimeSeriesViewer = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    return /*#__PURE__*/ _jsx(TimeSeriesViewerContext.Provider, {
        ...props,
        children: /*#__PURE__*/ _jsx(TimeSeriesViewerContainer, {})
    });
};
TimeSeriesViewer.propTypes = TimeSeriesViewerContext.TimeSeriesViewerPropTypes;
const WrappedTimeSeriesViewer = NeonContext.getWrappedComponent(TimeSeriesViewer);
export default WrappedTimeSeriesViewer;
