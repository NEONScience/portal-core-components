import React from 'react';

import { ThemeProvider } from '@mui/styles';

import Theme from './Theme';

interface LegacyNeonThemeProviderProps {
  children: React.ReactNode;
}

/**
 * A legacy Material UI theme provider for compatibility with libraries and
 * components that still depend on the Material UI 4/5 style withStyles theme
 * application.
 */
const LegacyNeonThemeProvider = (props: LegacyNeonThemeProviderProps): React.JSX.Element => {
  const { children }: LegacyNeonThemeProviderProps = props;
  return (
    <ThemeProvider theme={Theme}>
      {children}
    </ThemeProvider>
  );
};

export default LegacyNeonThemeProvider;
