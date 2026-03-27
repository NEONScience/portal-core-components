import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import ComponentErrorBoundary from '../Error/ComponentErrorBoundary';
import CustomComponentFallback from '../Error/CustomComponentFallback';
import ErrorCard from '../Card/ErrorCard';
import NeonContext from '../NeonContext/NeonContext';
import Theme from '../Theme/Theme';
import { resolveProps } from '../../util/defaultProps';
import SiteMapContext from './SiteMapContext';
import SiteMapContainer from './SiteMapContainer';
import { SITE_MAP_PROP_TYPES, SITE_MAP_DEFAULT_PROPS } from './SiteMapUtils';
const SiteMapFallbackComponent = (props)=>{
    const { resetErrorBoundary } = props;
    return /*#__PURE__*/ _jsx(CustomComponentFallback, {
        // eslint-disable-next-line react/no-unstable-nested-components
        FallbackComponent: ()=>/*#__PURE__*/ _jsx(Grid, {
                container: true,
                spacing: 2,
                children: /*#__PURE__*/ _jsx(Grid, {
                    item: true,
                    xs: 12,
                    children: /*#__PURE__*/ _jsx(ErrorCard, {
                        title: "Component Error",
                        message: "Site map encountered a problem",
                        actionLabel: "Reset",
                        onActionClick: resetErrorBoundary
                    })
                })
            })
    });
};
SiteMapFallbackComponent.propTypes = {
    resetErrorBoundary: PropTypes.func.isRequired
};
const SiteMap = (inProps)=>{
    const props = resolveProps(SITE_MAP_DEFAULT_PROPS, inProps);
    // no need to store this in state, just pass it thru
    const { unusableVerticalSpace = 0, mapUniqueId = 0 } = props;
    return /*#__PURE__*/ _jsx(ComponentErrorBoundary, {
        fallbackComponent: SiteMapFallbackComponent,
        onReset: ()=>{},
        children: /*#__PURE__*/ _jsx(SiteMapContext.Provider, {
            ...props,
            children: /*#__PURE__*/ _jsx(SiteMapContainer, {
                unusableVerticalSpace: unusableVerticalSpace,
                mapUniqueId: mapUniqueId
            })
        })
    });
};
SiteMap.propTypes = SITE_MAP_PROP_TYPES;
const WrappedSiteMap = Theme.getWrappedComponent(NeonContext.getWrappedComponent(SiteMap));
export default WrappedSiteMap;
