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
  prepend: true,
});
const tssCache = createCache({
  key: 'tss',
});

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
    <CacheProvider value={muiCache}>
      <TssCacheProvider value={tssCache}>
        <ThemeProvider theme={Theme}>
          <CssBaseline />
          <GlobalStyles styles={globalCss} />
          {children}
        </ThemeProvider>
      </TssCacheProvider>
    </CacheProvider>
  );
};

export default NeonThemeProvider;
