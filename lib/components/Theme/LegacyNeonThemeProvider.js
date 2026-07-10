import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { ThemeProvider } from '@mui/styles';
import Theme from './Theme';
/**
 * A legacy Material UI theme provider for compatibility with libraries and
 * components that still depend on the Material UI 4/5 style withStyles theme
 * application.
 */ const LegacyNeonThemeProvider = (props)=>{
    const { children } = props;
    return /*#__PURE__*/ _jsx(ThemeProvider, {
        theme: Theme,
        children: children
    });
};
export default LegacyNeonThemeProvider;
