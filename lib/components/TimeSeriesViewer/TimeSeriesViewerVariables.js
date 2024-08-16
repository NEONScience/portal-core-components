"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewerVariables;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactSelect = _interopRequireDefault(require("react-select"));
var _styles = require("@mui/styles");
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _Card = _interopRequireDefault(require("@mui/material/Card"));
var _Checkbox = _interopRequireDefault(require("@mui/material/Checkbox"));
var _FormControlLabel = _interopRequireDefault(require("@mui/material/FormControlLabel"));
var _FormGroup = _interopRequireDefault(require("@mui/material/FormGroup"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _InputAdornment = _interopRequireDefault(require("@mui/material/InputAdornment"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _NoSsr = _interopRequireDefault(require("@mui/material/NoSsr"));
var _TextField = _interopRequireDefault(require("@mui/material/TextField"));
var _Paper = _interopRequireDefault(require("@mui/material/Paper"));
var _Skeleton = _interopRequireDefault(require("@mui/lab/Skeleton"));
var _Clear = _interopRequireDefault(require("@mui/icons-material/Clear"));
var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));
var _NotInterested = _interopRequireDefault(require("@mui/icons-material/NotInterested"));
var _Search = _interopRequireDefault(require("@mui/icons-material/Search"));
var _DoneAll = _interopRequireDefault(require("@mui/icons-material/DoneAll"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _TimeSeriesViewerContext = _interopRequireDefault(require("./TimeSeriesViewerContext"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* eslint-disable react/forbid-prop-types */

const useStyles = (0, _styles.makeStyles)(theme => ({
  root: {
    flexGrow: 1
  },
  input: {
    display: 'flex',
    padding: '2px',
    height: 'auto'
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2)
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    bottom: 6,
    fontSize: 16
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing(2)
  },
  optionSubtitle: {
    fontSize: '0.75rem',
    color: _Theme.default.palette.grey[400]
  },
  variableCard: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(1, 3, 1, 1),
    width: 'fit-content',
    backgroundColor: theme.palette.grey[50],
    marginRight: theme.spacing(2)
  },
  variableCardContainer: {
    lineHeight: '7em',
    marginTop: theme.spacing(2)
  },
  noneContainer: {
    color: theme.palette.grey[400],
    display: 'flex',
    alignItems: 'flex-start'
  },
  noneIcon: {
    color: theme.palette.grey[400],
    margin: theme.spacing(0.375, 0.5, 0, 0),
    fontSize: '1rem'
  },
  noneLabel: {
    fontSize: '0.95rem'
  },
  qualityFlagsContainer: {
    marginTop: theme.spacing(2)
  },
  qualityFlagsHeading: {
    fontWeight: 600,
    marginBottom: _Theme.default.spacing(0.5)
  },
  qualityFlagsButtons: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
}));
const ucWord = word => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`;
function inputComponent(_ref) {
  let {
    inputRef,
    ...props
  } = _ref;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    ref: inputRef,
    ...props
  });
}
inputComponent.propTypes = {
  inputRef: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.shape({
    current: _propTypes.default.any.isRequired
  })]).isRequired
};
function Control(props) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: {
      TextFieldProps
    }
  } = props;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_TextField.default, {
    fullWidth: true,
    label: "Add Variables",
    variant: "outlined",
    InputProps: {
      inputComponent,
      inputProps: {
        ref: innerRef,
        children,
        ...innerProps
      },
      endAdornment: /*#__PURE__*/(0, _jsxRuntime.jsx)(_InputAdornment.default, {
        position: "end",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Search.default, {
          color: "disabled"
        })
      })
    },
    ...TextFieldProps
  });
}
Control.propTypes = {
  children: _propTypes.default.node.isRequired,
  innerProps: _propTypes.default.shape({
    onMouseDown: _propTypes.default.func.isRequired
  }).isRequired,
  innerRef: _propTypes.default.oneOfType([_propTypes.default.oneOf([null]), _propTypes.default.func, _propTypes.default.shape({
    current: _propTypes.default.any.isRequired
  })]).isRequired,
  selectProps: _propTypes.default.object.isRequired
};
function Option(props) {
  const classes = useStyles(_Theme.default);
  const {
    innerRef,
    isFocused,
    isDisabled,
    innerProps,
    data
  } = props;
  const {
    value,
    units,
    description
  } = data;
  const textStyle = isDisabled ? {
    color: _Theme.default.palette.grey[200]
  } : {};
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_MenuItem.default, {
    ref: innerRef,
    selected: isFocused && !isDisabled,
    component: "div",
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      cursor: isDisabled ? 'not-allowed' : 'pointer'
    },
    ...innerProps,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
      variant: "body1",
      style: {
        ...textStyle
      },
      children: [value, /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: classes.optionSubtitle,
        style: {
          ...textStyle,
          marginLeft: '8px'
        },
        children: `(${units})`
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
      variant: "body2",
      className: classes.optionSubtitle,
      style: {
        ...textStyle
      },
      children: description
    })]
  }, value);
}
Option.propTypes = {
  children: _propTypes.default.node,
  innerProps: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    key: _propTypes.default.string,
    onClick: _propTypes.default.func,
    onMouseMove: _propTypes.default.func,
    onMouseOver: _propTypes.default.func,
    tabIndex: _propTypes.default.number.isRequired
  }),
  innerRef: _propTypes.default.oneOfType([_propTypes.default.oneOf([null]), _propTypes.default.func, _propTypes.default.shape({
    current: _propTypes.default.any.isRequired
  })]),
  isFocused: _propTypes.default.bool.isRequired,
  isSelected: _propTypes.default.bool.isRequired,
  isDisabled: _propTypes.default.bool,
  data: _propTypes.default.object.isRequired
};
Option.defaultProps = {
  children: null,
  innerProps: null,
  innerRef: null,
  isDisabled: false
};
function ValueContainer(props) {
  const {
    selectProps,
    children
  } = props;
  const {
    valueContainer
  } = selectProps.classes;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: valueContainer,
    children: children
  });
}
ValueContainer.propTypes = {
  children: _propTypes.default.node.isRequired,
  selectProps: _propTypes.default.object.isRequired
};
function Menu(props) {
  const {
    selectProps,
    innerProps,
    children
  } = props;
  const {
    paper
  } = selectProps.classes;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Paper.default, {
    square: true,
    className: paper,
    ...innerProps,
    children: children
  });
}
Menu.propTypes = {
  children: _propTypes.default.element.isRequired,
  innerProps: _propTypes.default.object.isRequired,
  selectProps: _propTypes.default.object.isRequired
};
const components = {
  Control,
  Menu,
  Option,
  ValueContainer,
  Placeholder: () => null,
  MultiValue: () => null,
  IndicatorsContainer: () => null
};
const selectStyles = {
  input: base => ({
    ...base,
    color: _Theme.default.palette.text.primary,
    '& input': {
      font: 'inherit'
    }
  }),
  clearIndicator: base => ({
    ...base,
    display: 'none'
  }),
  indicatorSeparator: base => ({
    ...base,
    display: 'none'
  }),
  dropdownIndicator: base => ({
    ...base,
    cursor: 'pointer'
  }),
  groupHeading: base => ({
    ...base,
    fontSize: '1rem',
    fontWeight: 600,
    color: _Theme.default.palette.primary.main
  })
};

/**
   Quality Flags
*/
const QualityFlags = () => {
  const classes = useStyles(_Theme.default);
  const [state, dispatch] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const {
    availableQualityFlags
  } = state;
  const {
    qualityFlags: selectedQualityFlags
  } = state.selection;
  const toggleFlag = qualityFlag => event => {
    dispatch({
      type: 'selectToggleQualityFlag',
      qualityFlag,
      selected: event.target.checked
    });
  };
  if (!availableQualityFlags.size) {
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.noneContainer,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_NotInterested.default, {
        className: classes.noneIcon
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "body1",
        className: classes.noneLabel,
        children: "No Quality Flags Available"
      })]
    });
  }
  const organizedQualityFlags = {
    basic: [],
    expanded: []
  };
  Array.from(availableQualityFlags).forEach(qf => {
    if (!state.variables[qf]) {
      return;
    }
    const {
      downloadPkg
    } = state.variables[qf];
    organizedQualityFlags[downloadPkg].push(qf);
  });
  organizedQualityFlags.basic.sort();
  organizedQualityFlags.expanded.sort();
  const downloadPkgs = ['basic', 'expanded'];
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [availableQualityFlags.size > 1 ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.qualityFlagsButtons,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
        size: "small",
        variant: "outlined",
        onClick: () => {
          dispatch({
            type: 'selectNoneQualityFlags'
          });
        },
        startIcon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Clear.default, {}),
        style: {
          marginRight: _Theme.default.spacing(2)
        },
        children: "Select None"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
        size: "small",
        variant: "outlined",
        onClick: () => {
          dispatch({
            type: 'selectAllQualityFlags'
          });
        },
        startIcon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_DoneAll.default, {}),
        children: `Select All (${availableQualityFlags.size})`
      })]
    }) : null, /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormGroup.default, {
      children: downloadPkgs.map(downloadPkg => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "subtitle2",
          children: ucWord(downloadPkg)
        }), !organizedQualityFlags[downloadPkg].length ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "body2",
          className: classes.noneLabel,
          children: `No ${downloadPkg} quality flags available`
        }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
          children: organizedQualityFlags[downloadPkg].map(qf => {
            const checked = selectedQualityFlags.includes(qf);
            const captionStyle = {
              display: 'block',
              color: _Theme.default.palette.grey[400]
            };
            return /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormControlLabel.default, {
              style: {
                alignItems: 'flex-start',
                marginBottom: _Theme.default.spacing(1)
              },
              control: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Checkbox.default, {
                value: qf,
                color: "primary",
                checked: checked,
                onChange: toggleFlag(qf)
              }),
              label: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                style: {
                  paddingTop: _Theme.default.spacing(0.5)
                },
                children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
                  variant: "body2",
                  children: [qf, /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                    variant: "caption",
                    style: captionStyle,
                    children: state.variables[qf].description
                  })]
                })
              })
            }, qf);
          })
        })]
      }, downloadPkg))
    })]
  });
};
function TimeSeriesViewerVariables() {
  const classes = useStyles(_Theme.default);
  const [state, dispatch] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const selectedVariables = state.selection.variables.map(variable => ({
    ...state.variables[variable],
    value: variable
  }));
  const selectedUnits = Array.from(state.selection.variables.reduce((units, variable) => {
    if (state.variables[variable]) {
      units.add(state.variables[variable].units);
    }
    return units;
  }, new Set()));
  const selectableVariables = [{
    label: 'Basic Variables',
    options: []
  }, {
    label: 'Expanded Variables',
    options: []
  }];
  let selectableVariablesCount = 0;
  Object.keys(state.variables).filter(variable => state.variables[variable].isSelectable).forEach(variable => {
    const groupIdx = state.variables[variable].downloadPkg === 'basic' ? 0 : 1;
    const isDisabled = selectedUnits.length === 2 && !selectedUnits.includes(state.variables[variable].units);
    selectableVariables[groupIdx].options.push({
      ...state.variables[variable],
      value: variable,
      isDisabled
    });
    selectableVariablesCount += 1;
  });
  if (!selectableVariablesCount) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Skeleton.default, {
      variant: "rectangular",
      width: "100%",
      height: 56
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: classes.root,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_NoSsr.default, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactSelect.default, {
        isMulti: true,
        isSearchable: true,
        clearable: false,
        classes: classes,
        styles: selectStyles,
        "aria-label": "Add Variables",
        "data-gtm": "time-series-viewer.add-variables",
        options: selectableVariables,
        components: components,
        value: selectedVariables,
        controlShouldRenderValue: false,
        filterOption: (option, searchText) => option.data.value.toLowerCase().includes(searchText.toLowerCase()) || option.data.units.toLowerCase().includes(searchText.toLowerCase()) || option.data.description.toLowerCase().includes(searchText.toLowerCase()),
        onChange: value => {
          if (!value) {
            return;
          }
          dispatch({
            type: 'selectVariables',
            variables: value.map(v => v.value)
          });
        }
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.variableCardContainer,
      children: state.selection.variables.map(variable => {
        const {
          units,
          description
        } = state.variables[variable];
        return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Card.default, {
          variant: "outlined",
          className: classes.variableCard,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
            "aria-label": `remove variable ${variable}`,
            disabled: state.selection.variables.length < 2,
            style: {
              marginRight: _Theme.default.spacing(1)
            },
            onClick: () => {
              dispatch({
                type: 'selectVariables',
                variables: state.selection.variables.filter(v => v !== variable)
              });
            },
            size: "large",
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Clear.default, {
              fontSize: "small"
            })
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            style: {
              flexGrow: 1
            },
            children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Typography.default, {
              variant: "body1",
              children: [variable, /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                className: classes.optionSubtitle,
                style: {
                  marginLeft: '8px'
                },
                children: `(${units})`
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
              variant: "body2",
              className: classes.optionSubtitle,
              gutterBottom: true,
              children: description
            })]
          })]
        }, variable);
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.qualityFlagsContainer,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "subtitle1",
        className: classes.qualityFlagsHeading,
        children: "Quality Flags"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "caption",
        style: {
          color: _Theme.default.palette.grey[400]
        },
        children: "Enabling one or more quality flags will highlight regions on the chart to illustrate the results of data quality tests."
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        style: {
          width: '100%',
          marginTop: _Theme.default.spacing(1)
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(QualityFlags, {})
      })]
    })]
  });
}