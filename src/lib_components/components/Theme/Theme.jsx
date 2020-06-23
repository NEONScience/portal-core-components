import React from 'react';
import 'typeface-inter';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { useTheme, createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

// Values defined here are based on the NEON Style Guide,
// expanded out through color scale generators.
// Examples:
// 50-700  https://gka.github.io/palettes/#/8|s|e1e3ea,002c77||1|1
// 700-900 https://gka.github.io/palettes/#/3|s|002c77,00034a||1|1

export const COLORS = {
  NEON_BLUE: {
    50: '#e1e3ea',
    100: '#c5c6d9',
    200: '#a9aac9',
    300: '#8d8eb8',
    400: '#7174a8',
    500: '#545b97',
    600: '#354287',
    700: '#002c77',
    800: '#001960',
    900: '#00034a',
  },
  LIGHT_BLUE: {
    50: '#e6f1fb',
    100: '#b8d8f4',
    200: '#8abfec',
    300: '#5ca6e3',
    400: '#0092e2',
    500: '#0073cf',
    600: '#005eab',
    700: '#004986',
    800: '#003460',
    900: '#001e39',
  },
  ORANGE: {
    50: '#fff3e6',
    100: '#fcd7ac',
    200: '#f8bb73',
    300: '#f29f39',
    400: '#e98300',
    500: '#c76e00',
    600: '#a35a00',
    700: '#7e4500',
    800: '#593000',
    900: '#321b00',
  },
  YELLOW: {
    50: '#ffeec7',
    100: '#ffdd90',
    200: '#ffcb4f',
    300: '#e0b244',
    400: '#c29a3a',
    500: '#a58330',
    600: '#896c26',
    700: '#6e561d',
    800: '#544114',
    900: '#3b2d0b',
  },
  RED: {
    50: '#fbe5ea',
    100: '#eec6c9',
    200: '#dfa8a9',
    300: '#d08b8b',
    400: '#bf6d6d',
    500: '#ad5051',
    600: '#9a3036',
    700: '#86001d',
    800: '#5d0016',
    900: '#38000c',
  },
  GREY: {
    50: '#f5f6f7',
    100: '#e4e6e7',
    200: '#d7d9d9',
    300: '#a2a4a3',
    400: '#7c7f80',
    500: '#565a5c',
    600: '#4f5254',
    700: '#45484a',
    800: '#3c3f41',
    900: '#2b2e30',
    A100: '#bcbebe',
    A200: '#636768',
    A400: '#45484a',
    A700: '#343739',
  },
};

const PALETTES = {
  PRIMARY: {
    light: COLORS.LIGHT_BLUE[300],
    main: COLORS.LIGHT_BLUE[500],
    dark: COLORS.LIGHT_BLUE[700],
    contrastText: '#fff',
  },
  SECONDARY: {
    light: COLORS.NEON_BLUE[500],
    main: COLORS.NEON_BLUE[700],
    dark: COLORS.NEON_BLUE[900],
    contrastText: '#fff',
  },
  ERROR: {
    light: COLORS.ORANGE[400],
    main: COLORS.ORANGE[600],
    dark: COLORS.ORANGE[800],
    contrastText: '#000',
  },
  GREY: COLORS.GREY,
};

// See all customizable Material UI theme keys here:
// https://material-ui.com/customization/default-theme/#explore

const baseTheme = createMuiTheme({
  palette: {
    background: {
      default: PALETTES.GREY[50],
    },
    primary: PALETTES.PRIMARY,
    secondary: PALETTES.SECONDARY,
    error: PALETTES.ERROR,
    grey: PALETTES.GREY,
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontSize: 14,
    fontFamily: '"Inter",Helvetica,Arial,sans-serif',
    fontWeightLight: 200,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: {
      fontWeight: 400,
      fontSize: '4.5rem',
    },
    h2: {
      fontWeight: 400,
      fontSize: '3.5rem',
    },
    h3: {
      fontWeight: 400,
      fontSize: '2.6rem',
    },
    h4: {
      fontWeight: 400,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 400,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 400,
      fontSize: '1rem',
    },
    caption: {
      fontSize: '0.81rem',
    },
  },
  props: {
    MuiButton: {
      color: 'primary',
    },
    MuiLink: {
      color: 'primary',
      underline: 'always',
    },
  },
  overrides: {
    // We have lots of overrides. Please keep them alphabetized for easier maintenance!
    MuiButton: {
      root: {
        borderRadius: '2px',
        letterSpacing: '0.06em',
        fontSize: '0.7rem',
        padding: '8px 16px',
      },
      contained: {
        '&$disabled': {
          color: COLORS.GREY[300],
          backgroundColor: COLORS.GREY[100],
        },
      },
      containedPrimary: {
        padding: '8px 16px',
        '&:hover, &:active': {
          backgroundColor: COLORS.LIGHT_BLUE[400],
        },
      },
      outlined: {
        '&$disabled': {
          color: COLORS.GREY[300],
          borderColor: COLORS.GREY[300],
        },
      },
      outlinedPrimary: {
        padding: '8px 16px',
        border: `1px solid ${COLORS.LIGHT_BLUE[500]}`,
        '&:hover, &:active': {
          color: COLORS.LIGHT_BLUE[400],
          borderColor: COLORS.LIGHT_BLUE[400],
          textDecoration: 'underline',
        },
      },
      sizeSmall: {
        fontSize: '0.55rem',
        padding: '5px 10px',
      },
      sizeLarge: {
        fontSize: '0.9rem',
        padding: '12px 24px',
      },
      startIcon: {
        marginRight: '4px',
      },
      endIcon: {
        marginLeft: '4px',
      },
    },
    MuiButtonBase: {
      root: {
        fontWeight: 600,
        borderRadius: '2px',
        letterSpacing: '0.06em',
        fontSize: '0.7rem',
        padding: '8px 16px',
      },
    },
    MuiDialog: {
      root: {
        zIndex: '2100 !important',
      },
    },
    MuiInputBase: {
      root: {
        fontSize: '0.9rem',
      },
    },
    MuiLink: {
      root: {
        '&:hover, &:active': {
          color: COLORS.LIGHT_BLUE[400],
        },
      },
    },
    MuiTableCell: {
      root: {
        fontSize: '0.8rem',
      },
    },
    MuiToggleButton: {
      root: {
        height: 'unset',
        color: COLORS.LIGHT_BLUE[500],
        borderColor: COLORS.LIGHT_BLUE[500],
        fontSize: '0.7rem',
        padding: '8px 16px !important',
        whiteSpace: 'nowrap',
        '&$selected': {
          color: '#fff !important',
          backgroundColor: `${COLORS.LIGHT_BLUE[500]} !important`,
          textDecoration: 'none !important',
        },
        '&:hover, &:active': {
          color: COLORS.LIGHT_BLUE[400],
          borderColor: COLORS.LIGHT_BLUE[400],
          textDecoration: 'underline',
        },
      },
      sizeSmall: {
        height: 'unset',
        fontSize: '0.55rem',
        padding: '5px 10px !important',
      },
      sizeLarge: {
        height: 'unset',
        fontSize: '0.9rem',
        padding: '12px 24px !important',
      },
    },
    MuiToggleButtonGroup: {
      grouped: {
        '&:first-child': {
          borderTopLeftRadius: '2px',
          borderBottomLeftRadius: '2px',
        },
        '&:last-child': {
          borderTopRightRadius: '2px',
          borderBottomRightRadius: '2px',
        },
      },
    },
    MuiTypography: {
      body1: {
        fontSize: '0.95rem',
      },
      gutterBottom: {
        marginTop: '0.5em',
        marginBottom: '1em',
      },
    },
  },
});

const theme = responsiveFontSizes(baseTheme);
theme.isNeonTheme = true;

/**
   getWrappedComponent
   Function used to automatically wrap functional components in a ThemeProvider if not already
   present. Will not wrap in theme if running in jsdom so as not to inject themes into snapshots.
*/
theme.getWrappedComponent = Component => (props) => {
  const currentTheme = useTheme();
  const isJsdom = navigator.userAgent.includes('Node.js') || navigator.userAgent.includes('jsdom');
  if (!currentTheme.isNeonTheme && !isJsdom) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    );
  }
  return <Component {...props} />;
};

export default theme;
