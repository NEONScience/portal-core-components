import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ComponentErrorBoundary from '../Error/ComponentErrorBoundary';
import DataProductCitationContext from './DataProductCitation/Context';
import DataProductCitationView from './DataProductCitation/View';
import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';
const defaultProps = {
    release: undefined,
    showQuoteIcon: false,
    disableConditional: false,
    disableSkeleton: false,
    showTextOnly: false,
    textOnlyProps: undefined
};
const DataProductCitation = (inProps)=>{
    const props = resolveProps(defaultProps, inProps);
    const { productCode, release, showQuoteIcon, disableConditional, disableSkeleton, showTextOnly, textOnlyProps } = props;
    return /*#__PURE__*/ _jsx(ComponentErrorBoundary, {
        onReset: ()=>{},
        children: /*#__PURE__*/ _jsx(DataProductCitationContext.Provider, {
            productCode: productCode,
            release: release,
            children: /*#__PURE__*/ _jsx(DataProductCitationView, {
                showQuoteIcon: showQuoteIcon,
                disableConditional: disableConditional,
                disableSkeleton: disableSkeleton,
                showTextOnly: showTextOnly,
                textOnlyProps: textOnlyProps
            })
        })
    });
};
const WrappedDataProductCitation = Theme.getWrappedComponent(NeonContext.getWrappedComponent(DataProductCitation));
export default WrappedDataProductCitation;
