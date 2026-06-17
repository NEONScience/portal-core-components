import React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';

import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { withStyles } from 'tss-react/mui';

import Theme from '../Theme/Theme';

// Global CSS
// TODO jss-to-tss-react codemod: '@global' is not supported by tss-react.
// See https://mui.com/material-ui/customization/how-to-customize/#4-global-css-override for alternatives.
// const GlobalCss = withStyles(() => null, {
//   '@global': {
//     code: {
//       fontSize: '115%',
//       padding: Theme.spacing(0.25, 0.5),
//       backgroundColor: 'rgba(0, 0, 0, 0.11)',
//     },
//   },
// });

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
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        {/* <GlobalCss /> */}
        <GlobalStyles styles={globalCss} />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default NeonThemeProvider;
