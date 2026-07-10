import React from 'react';
interface LegacyNeonThemeProviderProps {
    children: React.ReactNode;
}
/**
 * A legacy Material UI theme provider for compatibility with libraries and
 * components that still depend on the Material UI 4/5 style withStyles theme
 * application.
 */
declare const LegacyNeonThemeProvider: (props: LegacyNeonThemeProviderProps) => React.JSX.Element;
export default LegacyNeonThemeProvider;
