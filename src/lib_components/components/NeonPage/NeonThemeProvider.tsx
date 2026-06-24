import React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Theme from '../Theme/Theme';

// Global CSS
const globalCss = {
  code: {
    fontSize: '115%',
    padding: Theme.spacing(0.25, 0.5),
    backgroundColor: 'rgba(0, 0, 0, 0.11)',
  },
};

interface NeonThemeProviderProps {
  children: React.ReactNode;
}

const NeonThemeProvider = (props: NeonThemeProviderProps): React.JSX.Element => {
  const { children }: NeonThemeProviderProps = props;
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <GlobalStyles styles={globalCss} />
      {children}
    </ThemeProvider>
  );
};

export default NeonThemeProvider;
