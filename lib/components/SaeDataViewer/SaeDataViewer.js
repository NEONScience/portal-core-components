import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import Grid from '@mui/material/Grid';
import SaeDataViewerContext from './SaeDataViewerContext';
import SaeDataViewerContainer from './SaeDataViewerContainer';
import ComponentErrorBoundary from '../Error/ComponentErrorBoundary';
import CustomComponentFallback from '../Error/CustomComponentFallback';
import ErrorCard from '../Card/ErrorCard';
import NeonContext from '../NeonContext/NeonContext';
import { resolveProps } from '../../util/defaultProps';
const SaeDataViewerFallbackComponent = (inProps)=>{
    const { resetErrorBoundary } = inProps;
    return /*#__PURE__*/ _jsx(CustomComponentFallback, {
        ...inProps,
        // eslint-disable-next-line react/no-unstable-nested-components
        FallbackComponent: ()=>/*#__PURE__*/ _jsx(Grid, {
                container: true,
                spacing: 2,
                children: /*#__PURE__*/ _jsx(Grid, {
                    size: {
                        xs: 12
                    },
                    children: /*#__PURE__*/ _jsx(ErrorCard, {
                        title: "Component Error",
                        message: "SAE Data Viewer encountered a problem",
                        actionLabel: "Reset",
                        onActionClick: resetErrorBoundary
                    })
                })
            })
    });
};
const defaultProps = {
    productCode: undefined
};
const SaeDataViewer = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    return /*#__PURE__*/ _jsx(ComponentErrorBoundary, {
        fallbackComponent: SaeDataViewerFallbackComponent,
        onReset: ()=>{},
        children: /*#__PURE__*/ _jsx(SaeDataViewerContext.Provider, {
            productCode: props.productCode,
            children: /*#__PURE__*/ _jsx(SaeDataViewerContainer, {})
        })
    });
};
const WrappedSaeDataViewer = NeonContext.getWrappedComponent(SaeDataViewer);
export default WrappedSaeDataViewer;
