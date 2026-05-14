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
      backgroundColor: 'rgba(0, 0, 0, 0.11)',
    },
  },
})(() => null);

interface NeonThemeProviderProps {
  children: React.ReactNode;
}

const NeonThemeProvider = (props: NeonThemeProviderProps): React.JSX.Element => {
  const { children }: NeonThemeProviderProps = props;
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <GlobalCss />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default NeonThemeProvider;
