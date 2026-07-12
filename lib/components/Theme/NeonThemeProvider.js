import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { TssCacheProvider } from 'tss-react';
import Theme from './Theme';
const muiCache = createCache({
    key: 'mui',
    prepend: true
});
const tssCache = createCache({
    key: 'tss'
});
// Global CSS
const globalCss = {
    code: {
        fontSize: '115%',
        padding: Theme.spacing(0.25, 0.5),
        backgroundColor: 'rgba(0, 0, 0, 0.11)'
    }
};
const NeonThemeProvider = (props)=>{
    const { children } = props;
    return /*#__PURE__*/ _jsx(CacheProvider, {
        value: muiCache,
        children: /*#__PURE__*/ _jsx(TssCacheProvider, {
            value: tssCache,
            children: /*#__PURE__*/ _jsxs(ThemeProvider, {
                theme: Theme,
                children: [
                    /*#__PURE__*/ _jsx(CssBaseline, {}),
                    /*#__PURE__*/ _jsx(GlobalStyles, {
                        styles: globalCss
                    }),
                    children
                ]
            })
        })
    });
};
export default NeonThemeProvider;
