"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewerVariables;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactSelect = _interopRequireDefault(require("react-select"));
var _styles = require("@material-ui/core/styles");
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _Card = _interopRequireDefault(require("@material-ui/core/Card"));
var _Checkbox = _interopRequireDefault(require("@material-ui/core/Checkbox"));
var _FormControlLabel = _interopRequireDefault(require("@material-ui/core/FormControlLabel"));
var _FormGroup = _interopRequireDefault(require("@material-ui/core/FormGroup"));
var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));
var _InputAdornment = _interopRequireDefault(require("@material-ui/core/InputAdornment"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _NoSsr = _interopRequireDefault(require("@material-ui/core/NoSsr"));
var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));
var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));
var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));
var _Clear = _interopRequireDefault(require("@material-ui/icons/Clear"));
var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));
var _NotInterested = _interopRequireDefault(require("@material-ui/icons/NotInterested"));
var _Search = _interopRequireDefault(require("@material-ui/icons/Search"));
var _DoneAll = _interopRequireDefault(require("@material-ui/icons/DoneAll"));
var _Theme = _interopRequireDefault(require("../Theme/Theme"));
var _TimeSeriesViewerContext = _interopRequireDefault(require("./TimeSeriesViewerContext"));
const _excluded = ["inputRef"];
/* eslint-disable react/forbid-prop-types */
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
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
const ucWord = word => "".concat(word.slice(0, 1).toUpperCase()).concat(word.slice(1).toLowerCase());
function inputComponent(_ref) {
  let {
      inputRef
    } = _ref,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  return /*#__PURE__*/_react.default.createElement("div", _extends({
    ref: inputRef
  }, props));
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
  return /*#__PURE__*/_react.default.createElement(_TextField.default, _extends({
    fullWidth: true,
    label: "Add Variables",
    variant: "outlined",
    InputProps: {
      inputComponent,
      inputProps: _extends({
        ref: innerRef,
        children
      }, innerProps),
      endAdornment: /*#__PURE__*/_react.default.createElement(_InputAdornment.default, {
        position: "end"
      }, /*#__PURE__*/_react.default.createElement(_Search.default, {
        color: "disabled"
      }))
    }
  }, TextFieldProps));
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
  return /*#__PURE__*/_react.default.createElement(_MenuItem.default, _extends({
    key: value,
    ref: innerRef,
    selected: isFocused && !isDisabled,
    component: "div",
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      cursor: isDisabled ? 'not-allowed' : 'pointer'
    }
  }, innerProps), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body1",
    style: _extends({}, textStyle)
  }, value, /*#__PURE__*/_react.default.createElement("span", {
    className: classes.optionSubtitle,
    style: _extends({}, textStyle, {
      marginLeft: '8px'
    })
  }, "(".concat(units, ")"))), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2",
    className: classes.optionSubtitle,
    style: _extends({}, textStyle)
  }, description));
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
  return /*#__PURE__*/_react.default.createElement("div", {
    className: valueContainer
  }, children);
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
  return /*#__PURE__*/_react.default.createElement(_Paper.default, _extends({
    square: true,
    className: paper
  }, innerProps), children);
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
  input: base => _extends({}, base, {
    color: _Theme.default.palette.text.primary,
    '& input': {
      font: 'inherit'
    }
  }),
  clearIndicator: base => _extends({}, base, {
    display: 'none'
  }),
  indicatorSeparator: base => _extends({}, base, {
    display: 'none'
  }),
  dropdownIndicator: base => _extends({}, base, {
    cursor: 'pointer'
  }),
  groupHeading: base => _extends({}, base, {
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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.noneContainer
    }, /*#__PURE__*/_react.default.createElement(_NotInterested.default, {
      className: classes.noneIcon
    }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body1",
      className: classes.noneLabel
    }, "No Quality Flags Available"));
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
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, availableQualityFlags.size > 1 ? /*#__PURE__*/_react.default.createElement("div", {
    className: classes.qualityFlagsButtons
  }, /*#__PURE__*/_react.default.createElement(_Button.default, {
    size: "small",
    variant: "outlined",
    onClick: () => {
      dispatch({
        type: 'selectNoneQualityFlags'
      });
    },
    startIcon: /*#__PURE__*/_react.default.createElement(_Clear.default, null),
    style: {
      marginRight: _Theme.default.spacing(2)
    }
  }, "Select None"), /*#__PURE__*/_react.default.createElement(_Button.default, {
    size: "small",
    variant: "outlined",
    onClick: () => {
      dispatch({
        type: 'selectAllQualityFlags'
      });
    },
    startIcon: /*#__PURE__*/_react.default.createElement(_DoneAll.default, null)
  }, "Select All (".concat(availableQualityFlags.size, ")"))) : null, /*#__PURE__*/_react.default.createElement(_FormGroup.default, null, downloadPkgs.map(downloadPkg => /*#__PURE__*/_react.default.createElement("div", {
    key: downloadPkg
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle2"
  }, ucWord(downloadPkg)), !organizedQualityFlags[downloadPkg].length ? /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "body2",
    className: classes.noneLabel
  }, "No ".concat(downloadPkg, " quality flags available")) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, organizedQualityFlags[downloadPkg].map(qf => {
    const checked = selectedQualityFlags.includes(qf);
    const captionStyle = {
      display: 'block',
      color: _Theme.default.palette.grey[400]
    };
    return /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
      key: qf,
      style: {
        alignItems: 'flex-start',
        marginBottom: _Theme.default.spacing(1)
      },
      control: /*#__PURE__*/_react.default.createElement(_Checkbox.default, {
        value: qf,
        color: "primary",
        checked: checked,
        onChange: toggleFlag(qf)
      }),
      label: /*#__PURE__*/_react.default.createElement("div", {
        style: {
          paddingTop: _Theme.default.spacing(0.5)
        }
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body2"
      }, qf, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "caption",
        style: captionStyle
      }, state.variables[qf].description)))
    });
  }))))));
};
function TimeSeriesViewerVariables() {
  const classes = useStyles(_Theme.default);
  const [state, dispatch] = _TimeSeriesViewerContext.default.useTimeSeriesViewerState();
  const selectedVariables = state.selection.variables.map(variable => _extends({}, state.variables[variable], {
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
    selectableVariables[groupIdx].options.push(_extends({}, state.variables[variable], {
      value: variable,
      isDisabled
    }));
    selectableVariablesCount += 1;
  });
  if (!selectableVariablesCount) {
    return /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      variant: "rect",
      width: "100%",
      height: 56
    });
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes.root
  }, /*#__PURE__*/_react.default.createElement(_NoSsr.default, null, /*#__PURE__*/_react.default.createElement(_reactSelect.default, {
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
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.variableCardContainer
  }, state.selection.variables.map(variable => {
    const {
      units,
      description
    } = state.variables[variable];
    return /*#__PURE__*/_react.default.createElement(_Card.default, {
      key: variable,
      variant: "outlined",
      className: classes.variableCard
    }, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
      "aria-label": "remove variable ".concat(variable),
      disabled: state.selection.variables.length < 2,
      style: {
        marginRight: _Theme.default.spacing(1)
      },
      onClick: () => {
        dispatch({
          type: 'selectVariables',
          variables: state.selection.variables.filter(v => v !== variable)
        });
      }
    }, /*#__PURE__*/_react.default.createElement(_Clear.default, {
      fontSize: "small"
    })), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        flexGrow: 1
      }
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body1"
    }, variable, /*#__PURE__*/_react.default.createElement("span", {
      className: classes.optionSubtitle,
      style: {
        marginLeft: '8px'
      }
    }, "(".concat(units, ")"))), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      className: classes.optionSubtitle,
      gutterBottom: true
    }, description)));
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.qualityFlagsContainer
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle1",
    className: classes.qualityFlagsHeading
  }, "Quality Flags"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "caption",
    style: {
      color: _Theme.default.palette.grey[400]
    }
  }, "Enabling one or more quality flags will highlight regions on the chart to illustrate the results of data quality tests."), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: '100%',
      marginTop: _Theme.default.spacing(1)
    }
  }, /*#__PURE__*/_react.default.createElement(QualityFlags, null))));
}