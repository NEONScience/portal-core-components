"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.COLORS = void 0;
var _react = _interopRequireDefault(require("react"));
var _CssBaseline = _interopRequireDefault(require("@material-ui/core/CssBaseline"));
var _styles = require("@material-ui/styles");
var _styles2 = require("@material-ui/core/styles");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Values defined here are based on the NEON Style Guide,
// expanded out through color scale generators.
// Examples:
// 50-700  https://gka.github.io/palettes/#/8|s|e1e3ea,002c77||1|1
// 700-900 https://gka.github.io/palettes/#/3|s|002c77,00034a||1|1

const COLORS = exports.COLORS = {
  NEON_BLUE: {
    50: '#e1e3ea',
    100: '#c5c6d9',
    200: '#a9aac9',
    300: '#8d8eb8',
    400: '#7174a8',
    500: '#545b97',
    600: '#354287',
    700: '#002c77',
    // Guide color
    800: '#001960',
    900: '#00034a'
  },
  LIGHT_BLUE: {
    50: '#e6f1fb',
    100: '#b8d8f4',
    200: '#8abfec',
    300: '#5ca6e3',
    400: '#0092e2',
    500: '#0073cf',
    // Guide color
    600: '#005eab',
    700: '#004986',
    800: '#003460',
    900: '#001e39'
  },
  GOLD: {
    50: '#fff5dc',
    100: '#ffe7b1',
    200: '#ffd984',
    300: '#ffcb4f',
    // Guide color
    400: '#f8bb32',
    500: '#f0ab00',
    // Guide color
    600: '#d39600',
    700: '#b68200',
    800: '#9b6e00',
    900: '#805b00'
  },
  BROWN: {
    50: '#f8f2ec',
    100: '#e2d0c3',
    200: '#cbb09c',
    300: '#b39076',
    400: '#9b7152',
    500: '#82542f',
    // Guide color
    600: '#66452f',
    700: '#4b372e',
    // Guide color
    800: '#352723',
    // Guide color
    900: '#2b201d'
  },
  GREEN: {
    50: '#f4f8ed',
    100: '#e4eed3',
    200: '#d4e4ba',
    300: '#c4daa1',
    // Guide color
    400: '#acc37e',
    // Guide color
    500: '#81a54a',
    600: '#558807',
    // Guide color
    700: '#3f660a',
    800: '#2a4509',
    900: '#182702'
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
    900: '#38000c'
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
    A700: '#343739'
  }
};
const PALETTES = {
  PRIMARY: {
    light: COLORS.LIGHT_BLUE[300],
    main: COLORS.LIGHT_BLUE[500],
    dark: COLORS.LIGHT_BLUE[700],
    contrastText: '#fff'
  },
  SECONDARY: {
    light: COLORS.NEON_BLUE[500],
    main: COLORS.NEON_BLUE[700],
    dark: COLORS.NEON_BLUE[900],
    contrastText: '#fff'
  },
  ERROR: {
    light: COLORS.GOLD[300],
    main: COLORS.GOLD[500],
    dark: COLORS.GOLD[800],
    contrastText: '#000'
  },
  GREY: COLORS.GREY
};
const COLOR_TEXT_PRIMARY = 'rgba(0, 0, 0, 0.9)';

// See all customizable Material UI theme keys here:
// https://material-ui.com/customization/default-theme/#explore

const baseTheme = (0, _styles2.createTheme)({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1600
    }
  },
  palette: {
    background: {
      default: '#fff'
    },
    primary: PALETTES.PRIMARY,
    secondary: PALETTES.SECONDARY,
    error: PALETTES.ERROR,
    grey: PALETTES.GREY,
    text: {
      primary: COLOR_TEXT_PRIMARY
    }
  },
  shape: {
    borderRadius: 0
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
      fontSize: '4.5rem'
    },
    h2: {
      fontWeight: 400,
      fontSize: '3.5rem'
    },
    h3: {
      fontWeight: 400,
      fontSize: '2.6rem'
    },
    h4: {
      fontWeight: 400,
      fontSize: '1.75rem'
    },
    h5: {
      fontWeight: 400,
      fontSize: '1.25rem'
    },
    h6: {
      fontWeight: 400,
      fontSize: '1rem'
    },
    body1: {
      fontSize: '0.9rem'
    },
    body2: {
      fontSize: '0.8rem'
    },
    caption: {
      fontSize: '0.7rem'
    }
  },
  props: {
    MuiBackdrop: {
      timeout: 0
    },
    MuiBreadcrumbs: {
      separator: '/'
    },
    MuiButton: {
      color: 'primary'
    },
    MuiButtonGroup: {
      color: 'primary'
    },
    MuiCard: {
      variant: 'outlined'
    },
    MuiCheckbox: {
      color: 'primary',
      size: 'small'
    },
    MuiIconButton: {
      color: 'primary'
    },
    MuiLink: {
      color: 'primary',
      underline: 'always'
    },
    MuiRadio: {
      color: 'primary',
      size: 'small'
    },
    MuiSwitch: {
      color: 'primary',
      size: 'small'
    }
  },
  overrides: {
    // We have lots of overrides. Please keep them alphabetized for easier maintenance!
    MuiAccordion: {
      root: {
        border: "1px solid ".concat(COLORS.GREY[300]),
        boxShadow: 'none',
        '&:hover, &:active': {
          border: "1px solid ".concat(COLORS.LIGHT_BLUE[400]),
          backgroundColor: "".concat(COLORS.LIGHT_BLUE[500], "08")
        },
        '&$expanded': {
          margin: '0px',
          border: "1px solid ".concat(COLORS.LIGHT_BLUE[400]),
          '&:hover, &:active': {
            backgroundColor: '#fff'
          }
        }
      },
      rounded: {
        '&:first-child': {
          borderTopLeftRadius: '2px',
          borderTopRightRadius: '2px'
        },
        '&:last-child': {
          borderBottomLeftRadius: '2px',
          borderBottomRightRadius: '2px'
        },
        '&:not(:first-child)': {
          borderTopWidth: '0px'
        }
      }
    },
    MuiAccordionActions: {
      root: {
        padding: '16px 24px'
      }
    },
    MuiAccordionDetails: {
      root: {
        padding: '0px 24px 24px 24px',
        '&:not(:last-child)': {
          paddingBottom: '0px'
        }
      }
    },
    MuiAccordionSummary: {
      root: {
        padding: '12px 24px'
      },
      content: {
        fontSize: '0.95rem',
        fontWeight: 500
      },
      expandIcon: {
        '&:hover': {
          backgroundColor: "".concat(COLORS.LIGHT_BLUE[500], "14")
        }
      }
    },
    MuiBackdrop: {
      root: {
        zIndex: 50
      }
    },
    MuiBreadcrumbs: {
      root: {
        padding: '8px 0px',
        marginBottom: '16px',
        '@media (max-width:599.95px)': {
          marginBottom: '8px'
        }
      },
      separator: {
        fontSize: '1.1rem',
        fontWeight: 700,
        color: COLORS.GREY[200]
      }
    },
    MuiButton: {
      root: {
        borderRadius: '2px',
        letterSpacing: '0.06em',
        fontSize: '0.7rem',
        padding: '8px 16px'
      },
      contained: {
        '&$disabled': {
          color: COLORS.GREY[300],
          backgroundColor: COLORS.GREY[100]
        }
      },
      containedPrimary: {
        padding: '8px 16px',
        '&:hover, &:active': {
          backgroundColor: COLORS.LIGHT_BLUE[400]
        }
      },
      outlined: {
        '&$disabled': {
          color: COLORS.GREY[300],
          borderColor: COLORS.GREY[300]
        }
      },
      outlinedPrimary: {
        padding: '8px 16px',
        border: "1px solid ".concat(COLORS.LIGHT_BLUE[500]),
        '&:hover, &:active': {
          color: COLORS.LIGHT_BLUE[400],
          borderColor: COLORS.LIGHT_BLUE[400],
          textDecoration: 'underline'
        }
      },
      text: {
        '&$disabled': {
          color: COLORS.GREY[300]
        }
      },
      textPrimary: {
        padding: '8px 16px',
        border: '1px solid transparent',
        '&:focus': {
          border: "1px dashed ".concat(COLORS.GOLD[500], "ff")
        },
        '&:hover, &:active': {
          color: COLORS.LIGHT_BLUE[400],
          textDecoration: 'underline',
          border: "1px solid ".concat(COLORS.LIGHT_BLUE[400], "ff")
        }
      },
      sizeSmall: {
        fontSize: '0.55rem',
        padding: '5px 10px'
      },
      sizeLarge: {
        fontSize: '0.9rem',
        padding: '12px 24px'
      },
      startIcon: {
        marginRight: '4px'
      },
      endIcon: {
        marginLeft: '4px'
      }
    },
    MuiButtonBase: {
      root: {
        fontWeight: 600,
        borderRadius: '2px',
        letterSpacing: '0.06em',
        fontSize: '0.7rem',
        padding: '8px 16px'
      }
    },
    MuiButtonGroup: {
      groupedOutlinedPrimary: {
        '&:hover, &:active': {
          color: COLORS.LIGHT_BLUE[400],
          borderColor: COLORS.LIGHT_BLUE[400],
          textDecoration: 'underline'
        }
      },
      groupedTextPrimary: {
        border: '1px solid transparent !important',
        '&:hover, &:active': {
          color: COLORS.LIGHT_BLUE[400],
          borderColor: "".concat(COLORS.LIGHT_BLUE[400], " !important"),
          textDecoration: 'underline'
        },
        '&:not(:last-child)': {
          borderRightColor: "".concat(COLORS.LIGHT_BLUE[500], " !important")
        },
        '&:not(:first-child)': {
          marginLeft: '-1px'
        }
      }
    },
    MuiCard: {
      root: {
        borderRadius: '4px',
        border: "1px solid ".concat(COLORS.GREY[200])
      }
    },
    MuiCardContent: {
      root: {
        padding: '24px',
        '@media (max-width:959.95px)': {
          padding: '16px',
          '&:last-child': {
            paddingBottom: '16px'
          }
        }
      }
    },
    MuiCardActions: {
      root: {
        padding: '0px 24px 24px 24px'
      }
    },
    MuiCheckbox: {
      root: {
        padding: '6px'
      }
    },
    MuiChip: {
      root: {
        backgroundColor: COLORS.GREY[200]
      }
    },
    MuiDialog: {
      root: {
        zIndex: 105
      },
      paper: {
        zIndex: 60
      }
    },
    MuiFormControlLabel: {
      root: {
        marginLeft: '-8px'
      },
      label: {
        marginLeft: '4px',
        marginBottom: '-1px'
      }
    },
    MuiIconButton: {
      root: {
        padding: '12px'
      },
      sizeSmall: {
        padding: '6px',
        '& svg': {
          fontSize: '1.2rem'
        }
      },
      colorPrimary: {
        backgroundColor: "".concat(COLORS.LIGHT_BLUE[500], "00"),
        border: "1px solid ".concat(COLORS.LIGHT_BLUE[500], "00"),
        '&:focus': {
          border: "1px dashed ".concat(COLORS.GOLD[500], "ff")
        },
        '&:hover, &:active': {
          color: COLORS.LIGHT_BLUE[400],
          backgroundColor: "".concat(COLORS.LIGHT_BLUE[400], "14"),
          border: "1px solid ".concat(COLORS.LIGHT_BLUE[400], "ff")
        }
      }
    },
    MuiInputBase: {
      root: {
        fontSize: '0.85rem'
      }
    },
    MuiLink: {
      root: {
        '&:hover, &:active': {
          color: COLORS.LIGHT_BLUE[400]
        }
      }
    },
    MuiRadio: {
      root: {
        padding: '6px'
      }
    },
    MuiSlider: {
      root: {
        '&$disabled': {
          '& $rail': {
            backgroundColor: COLORS.GREY[300]
          },
          '& $track': {
            backgroundColor: COLORS.GREY[300]
          },
          '& $mark': {
            backgroundColor: COLORS.GREY[300]
          },
          '& $markLabel': {
            color: "".concat(COLORS.GREY[300], " !important")
          },
          '& $markLabelActive': {
            color: "".concat(COLORS.GREY[300], " !important")
          }
        }
      },
      rail: {
        height: 2,
        opacity: 1,
        backgroundColor: COLORS.LIGHT_BLUE[300],
        '&$disabled': {
          backgroundColor: COLORS.GREY[300]
        }
      },
      track: {
        height: 7,
        marginTop: -2.5,
        '&$disabled': {
          backgroundColor: COLORS.GREY[300]
        }
      },
      marked: {
        marginBottom: 26
      },
      mark: {
        width: 2,
        height: 12,
        marginTop: -5,
        backgroundColor: COLORS.LIGHT_BLUE[300]
      },
      markActive: {
        width: 3,
        height: 12,
        marginTop: -5,
        marginLeft: -1,
        backgroundColor: COLORS.LIGHT_BLUE[500]
      },
      markLabel: {
        marginTop: 12
      },
      thumb: {
        height: 28,
        width: 12,
        marginTop: -13,
        marginLeft: -6,
        borderRadius: 2,
        backgroundColor: COLORS.GREY[50],
        border: "2px solid ".concat(COLORS.LIGHT_BLUE[500]),
        '&$disabled': {
          height: 28,
          width: 12,
          marginTop: -13,
          marginLeft: -6,
          border: "2px solid ".concat(COLORS.GREY[300])
        }
      },
      valueLabel: {
        left: 'initial',
        fontWeight: 600,
        top: -28,
        whiteSpace: 'nowrap',
        '& span': {
          width: 'auto',
          height: 'auto',
          padding: '4px 8px',
          borderRadius: 2,
          transform: 'none',
          '& span': {
            transform: 'none',
            padding: 0,
            borderRadius: 0
          }
        }
      },
      vertical: {
        '& $track': {
          width: '7px !important',
          marginLeft: -2,
          left: 20
        },
        '& $marked': {
          marginRight: 34
        },
        '& $mark': {
          height: 2,
          width: 12,
          marginLeft: 2
        },
        '& $markActive': {
          height: 3,
          width: 12,
          marginLeft: 2,
          marginTop: -1
        },
        '& $markLabel': {
          marginTop: 0,
          left: '46px !important'
        },
        '& $rail': {
          width: '2px !important',
          left: 20
        },
        '& $thumb': {
          height: 12,
          width: 27,
          marginTop: -6,
          marginLeft: -14,
          '&$disabled': {
            height: 12,
            width: 27,
            marginTop: -6,
            marginLeft: '-5px !important'
          }
        }
      }
    },
    MuiSnackbar: {
      root: {
        borderRadius: '4px'
      }
    },
    MuiSwitch: {
      sizeSmall: {
        width: '42px',
        height: '26px'
      }
    },
    MuiTab: {
      root: {
        color: COLORS.LIGHT_BLUE[500],
        backgroundColor: COLORS.GREY[50],
        border: "1.5px solid ".concat(COLORS.GREY[200]),
        borderRadius: '0px',
        fontSize: '0.75rem',
        '&$selected': {
          zIndex: 1,
          backgroundColor: '#fff',
          borderColor: COLORS.LIGHT_BLUE[500]
        },
        '&:hover, &:active': {
          backgroundColor: '#fff'
        }
      },
      textColorInherit: {
        color: COLORS.LIGHT_BLUE[500]
      },
      textColorPrimary: {
        color: COLORS.LIGHT_BLUE[500]
      }
    },
    MuiTabScrollButton: {
      root: {
        color: COLORS.LIGHT_BLUE[500],
        backgroundColor: COLORS.GREY[50],
        border: "1.5px solid ".concat(COLORS.GREY[200]),
        borderRadius: '0px',
        '&:hover, &:active': {
          zIndex: 1,
          backgroundColor: '#fff',
          borderColor: COLORS.LIGHT_BLUE[500]
        }
      }
    },
    MuiTableCell: {
      root: {
        fontSize: '0.8rem',
        '&:not(:last-child)': {
          borderRight: "1px solid ".concat(COLORS.GREY[200])
        }
      },
      head: {
        color: '#fff',
        backgroundColor: "".concat(COLORS.LIGHT_BLUE[500], " !important"),
        borderBottom: "1.5px solid ".concat(COLORS.NEON_BLUE[700]),
        '&:not(:last-child)': {
          borderRight: "1px solid ".concat(COLORS.NEON_BLUE[700])
        }
      },
      stickyHeader: {
        zIndex: 'auto',
        color: '#fff',
        backgroundColor: COLORS.LIGHT_BLUE[500],
        borderBottom: "1.5px solid ".concat(COLORS.NEON_BLUE[700])
      }
    },
    MuiTableSortLabel: {
      root: {
        '&:hover, &:active': {
          color: COLORS.LIGHT_BLUE[100],
          textDecoration: 'underline'
        }
      },
      active: {
        color: "".concat(COLORS.LIGHT_BLUE[100], " !important"),
        textDecoration: 'underline',
        '& svg': {
          color: "".concat(COLORS.LIGHT_BLUE[100], " !important")
        }
      }
    },
    MuiTablePagination: {
      toolbar: {
        '& .MuiIconButton-root': {
          borderRadius: '2px',
          padding: '4px',
          '& svg': {
            fontSize: '1.4rem'
          }
        },
        '& .MuiTypography-caption': {
          margin: '0px 8px'
        }
      }
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
          backgroundColor: "".concat(COLORS.LIGHT_BLUE[500], " !important"),
          textDecoration: 'none !important'
        },
        '&:hover, &:active': {
          color: COLORS.LIGHT_BLUE[400],
          borderColor: COLORS.LIGHT_BLUE[400],
          textDecoration: 'underline'
        }
      },
      sizeSmall: {
        height: 'unset',
        fontSize: '0.55rem',
        padding: '5px 10px !important'
      },
      sizeLarge: {
        height: 'unset',
        fontSize: '0.9rem',
        padding: '12px 24px !important'
      }
    },
    MuiToggleButtonGroup: {
      grouped: {
        '&:first-child': {
          borderTopLeftRadius: '2px',
          borderBottomLeftRadius: '2px'
        },
        '&:last-child': {
          borderTopRightRadius: '2px',
          borderBottomRightRadius: '2px'
        }
      }
    },
    MuiTooltip: {
      popper: {
        zIndex: 2500
      },
      tooltip: {
        backgroundColor: COLORS.GREY[50],
        border: "1px solid ".concat(COLORS.GREY[600]),
        color: COLOR_TEXT_PRIMARY,
        borderRadius: '2px',
        padding: '12px 16px',
        fontSize: '0.9rem',
        fontWeight: 400,
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px',
        '& a': {
          color: COLORS.LIGHT_BLUE[500],
          '&:hover, &:active': {
            color: COLORS.LIGHT_BLUE[400],
            borderColor: COLORS.LIGHT_BLUE[400],
            textDecoration: 'underline'
          }
        }
      }
    },
    MuiTypography: {
      body1: {
        fontSize: '0.95rem'
      },
      gutterBottom: {
        marginBottom: '1em'
      }
    }
  }
});
const theme = (0, _styles2.responsiveFontSizes)(baseTheme);
theme.isNeonTheme = true;
theme.colors = COLORS;

/**
   getWrappedComponent
   Function used to automatically wrap functional components in a ThemeProvider if not already
   present. Will not wrap in theme if running in jsdom so as not to inject themes into snapshots.
*/
theme.getWrappedComponent = Component => props => {
  const currentTheme = (0, _styles2.useTheme)();
  const isJsdom = navigator.userAgent.includes('Node.js') || navigator.userAgent.includes('jsdom');
  if (!currentTheme.isNeonTheme && !isJsdom) {
    return /*#__PURE__*/_react.default.createElement(_styles.ThemeProvider, {
      theme: theme
    }, /*#__PURE__*/_react.default.createElement(_CssBaseline.default, null), /*#__PURE__*/_react.default.createElement(Component, props));
  }
  return /*#__PURE__*/_react.default.createElement(Component, props);
};
var _default = exports.default = theme;