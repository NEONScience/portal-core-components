import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import NeonThemeProvider from '../../Theme/NeonThemeProvider';
import SiteMap from '../SiteMap';
const SiteMapStandalone = (inProps)=>/*#__PURE__*/ _jsx(NeonThemeProvider, {
        children: /*#__PURE__*/ _jsx(SiteMap, {
            ...inProps
        })
    });
export default SiteMapStandalone;
