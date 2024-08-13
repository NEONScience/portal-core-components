import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles';

const MockTheme = ({ children }) => {
  const theme = createTheme({});
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default MockTheme;
