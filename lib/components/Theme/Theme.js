"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.COLORS = void 0;

require("typeface-source-sans-pro");

var _styles = require("@material-ui/core/styles");

// Values defined here are based on the NEON Style Guide,
// expanded out through color scale generators.
// Examples:
// 50-700  https://gka.github.io/palettes/#/8|s|e1e3ea,002c77||1|1
// 700-900 https://gka.github.io/palettes/#/3|s|002c77,00034a||1|1
var COLORS = {
  BLUE: {
    50: '#e1e3ea',
    100: '#c5c6d9',
    200: '#a9aac9',
    300: '#8d8eb8',
    400: '#7174a8',
    500: '#545b97',
    600: '#354287',
    700: '#002c77',
    800: '#001960',
    900: '#00034a'
  },
  SECONDARY_BLUE: {
    50: '#e6f1fb',
    100: '#b8d8f4',
    200: '#8abfec',
    300: '#5ca6e3',
    400: '#2e8cd9',
    500: '#0073cf',
    600: '#005eab',
    700: '#004986',
    800: '#003460',
    900: '#001e39'
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
    900: '#321b00'
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
    900: '#3b2d0b'
  },
  GREY: {
    50: '#f3f5f5',
    100: '#cccece',
    200: '#abadae',
    300: '#898c8d',
    400: '#6f7374',
    500: '#565a5c',
    600: '#4f5254',
    700: '#45484a',
    800: '#3c3f41',
    900: '#2b2e30',
    A100: '#bcbebe',
    A200: '#636768',
    A400: '#45484a',
    A700: '#343739'
  }
};
exports.COLORS = COLORS;
var PALETTES = {
  PRIMARY: {
    light: COLORS.BLUE[500],
    main: COLORS.BLUE[700],
    dark: COLORS.BLUE[900],
    contrastText: '#fff'
  },
  SECONDARY: {
    light: COLORS.SECONDARY_BLUE[300],
    main: COLORS.SECONDARY_BLUE[500],
    dark: COLORS.SECONDARY_BLUE[700],
    contrastText: '#fff'
  },
  ERROR: {
    light: COLORS.ORANGE[400],
    main: COLORS.ORANGE[600],
    dark: COLORS.ORANGE[800],
    contrastText: '#000'
  },
  GREY: COLORS.GREY
}; // See all customizable Material UI theme keys here:
// https://material-ui.com/customization/default-theme/#explore

var baseTheme = (0, _styles.createMuiTheme)({
  palette: {
    background: {
      default: PALETTES.GREY[50]
    },
    primary: PALETTES.PRIMARY,
    secondary: PALETTES.SECONDARY,
    error: PALETTES.ERROR,
    grey: PALETTES.GREY
  },
  typography: {
    fontFamily: '"Source Sans Pro",Helvetica,Arial,sans-serif',
    fontWeightLight: 200,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: {
      fontWeight: 200,
      fontSize: '4.125rem'
    },
    h2: {
      fontWeight: 200,
      fontSize: '3.5rem'
    },
    h3: {
      fontWeight: 400,
      fontSize: '2.75rem'
    },
    h4: {
      fontWeight: 400,
      fontSize: '2.125rem'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem'
    },
    h6: {
      fontWeight: 700,
      fontSize: '1.15rem'
    }
  },
  props: {
    MuiLink: {
      color: 'secondary'
    }
  }
});
var theme = (0, _styles.responsiveFontSizes)(baseTheme);
var _default = theme;
exports.default = _default;