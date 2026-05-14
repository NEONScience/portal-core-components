import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { withStyles } from '@mui/styles';
import Theme from '../Theme/Theme';
// Global CSS
const GlobalCss = withStyles({
    '@global': {
        code: {
            fontSize: '115%',
            padding: Theme.spacing(0.25, 0.5),
            backgroundColor: 'rgba(0, 0, 0, 0.11)'
        }
    }
})(()=>null);
const NeonThemeProvider = (props)=>{
    const { children } = props;
    return /*#__PURE__*/ _jsx(StyledEngineProvider, {
        injectFirst: true,
        children: /*#__PURE__*/ _jsxs(ThemeProvider, {
            theme: Theme,
            children: [
                /*#__PURE__*/ _jsx(CssBaseline, {}),
                /*#__PURE__*/ _jsx(GlobalCss, {}),
                children
            ]
        })
    });
};
export default NeonThemeProvider;
