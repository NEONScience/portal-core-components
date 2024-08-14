import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';

import Theme from '../lib_components/components/Theme/Theme';

const MockTheme = ({ children }) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default MockTheme;
