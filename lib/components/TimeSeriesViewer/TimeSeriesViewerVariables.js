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
var _excluded = ["inputRef"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
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
  };
});
var ucWord = function ucWord(word) {
  return "".concat(word.slice(0, 1).toUpperCase()).concat(word.slice(1).toLowerCase());
};
function inputComponent(_ref) {
  var inputRef = _ref.inputRef,
    props = _objectWithoutProperties(_ref, _excluded);
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
  var children = props.children,
    innerProps = props.innerProps,
    innerRef = props.innerRef,
    TextFieldProps = props.selectProps.TextFieldProps;
  return /*#__PURE__*/_react.default.createElement(_TextField.default, _extends({
    fullWidth: true,
    label: "Add Variables",
    variant: "outlined",
    InputProps: {
      inputComponent: inputComponent,
      inputProps: _extends({
        ref: innerRef,
        children: children
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
  var classes = useStyles(_Theme.default);
  var innerRef = props.innerRef,
    isFocused = props.isFocused,
    isDisabled = props.isDisabled,
    innerProps = props.innerProps,
    data = props.data;
  var value = data.value,
    units = data.units,
    description = data.description;
  var textStyle = isDisabled ? {
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
  var selectProps = props.selectProps,
    children = props.children;
  var valueContainer = selectProps.classes.valueContainer;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: valueContainer
  }, children);
}
ValueContainer.propTypes = {
  children: _propTypes.default.node.isRequired,
  selectProps: _propTypes.default.object.isRequired
};
function Menu(props) {
  var selectProps = props.selectProps,
    innerProps = props.innerProps,
    children = props.children;
  var paper = selectProps.classes.paper;
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
var components = {
  Control: Control,
  Menu: Menu,
  Option: Option,
  ValueContainer: ValueContainer,
  Placeholder: function Placeholder() {
    return null;
  },
  MultiValue: function MultiValue() {
    return null;
  },
  IndicatorsContainer: function IndicatorsContainer() {
    return null;
  }
};
var selectStyles = {
  input: function input(base) {
    return _extends({}, base, {
      color: _Theme.default.palette.text.primary,
      '& input': {
        font: 'inherit'
      }
    });
  },
  clearIndicator: function clearIndicator(base) {
    return _extends({}, base, {
      display: 'none'
    });
  },
  indicatorSeparator: function indicatorSeparator(base) {
    return _extends({}, base, {
      display: 'none'
    });
  },
  dropdownIndicator: function dropdownIndicator(base) {
    return _extends({}, base, {
      cursor: 'pointer'
    });
  },
  groupHeading: function groupHeading(base) {
    return _extends({}, base, {
      fontSize: '1rem',
      fontWeight: 600,
      color: _Theme.default.palette.primary.main
    });
  }
};

/**
   Quality Flags
*/
var QualityFlags = function QualityFlags() {
  var classes = useStyles(_Theme.default);
  var _TimeSeriesViewerCont = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
    _TimeSeriesViewerCont2 = _slicedToArray(_TimeSeriesViewerCont, 2),
    state = _TimeSeriesViewerCont2[0],
    dispatch = _TimeSeriesViewerCont2[1];
  var availableQualityFlags = state.availableQualityFlags;
  var selectedQualityFlags = state.selection.qualityFlags;
  var toggleFlag = function toggleFlag(qualityFlag) {
    return function (event) {
      dispatch({
        type: 'selectToggleQualityFlag',
        qualityFlag: qualityFlag,
        selected: event.target.checked
      });
    };
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
  var organizedQualityFlags = {
    basic: [],
    expanded: []
  };
  Array.from(availableQualityFlags).forEach(function (qf) {
    if (!state.variables[qf]) {
      return;
    }
    var downloadPkg = state.variables[qf].downloadPkg;
    organizedQualityFlags[downloadPkg].push(qf);
  });
  organizedQualityFlags.basic.sort();
  organizedQualityFlags.expanded.sort();
  var downloadPkgs = ['basic', 'expanded'];
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, availableQualityFlags.size > 1 ? /*#__PURE__*/_react.default.createElement("div", {
    className: classes.qualityFlagsButtons
  }, /*#__PURE__*/_react.default.createElement(_Button.default, {
    size: "small",
    variant: "outlined",
    onClick: function onClick() {
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
    onClick: function onClick() {
      dispatch({
        type: 'selectAllQualityFlags'
      });
    },
    startIcon: /*#__PURE__*/_react.default.createElement(_DoneAll.default, null)
  }, "Select All (".concat(availableQualityFlags.size, ")"))) : null, /*#__PURE__*/_react.default.createElement(_FormGroup.default, null, downloadPkgs.map(function (downloadPkg) {
    return /*#__PURE__*/_react.default.createElement("div", {
      key: downloadPkg
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, ucWord(downloadPkg)), !organizedQualityFlags[downloadPkg].length ? /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "body2",
      className: classes.noneLabel
    }, "No ".concat(downloadPkg, " quality flags available")) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, organizedQualityFlags[downloadPkg].map(function (qf) {
      var checked = selectedQualityFlags.includes(qf);
      var captionStyle = {
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
    })));
  })));
};
function TimeSeriesViewerVariables() {
  var classes = useStyles(_Theme.default);
  var _TimeSeriesViewerCont3 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
    _TimeSeriesViewerCont4 = _slicedToArray(_TimeSeriesViewerCont3, 2),
    state = _TimeSeriesViewerCont4[0],
    dispatch = _TimeSeriesViewerCont4[1];
  var selectedVariables = state.selection.variables.map(function (variable) {
    return _extends({}, state.variables[variable], {
      value: variable
    });
  });
  var selectedUnits = Array.from(state.selection.variables.reduce(function (units, variable) {
    if (state.variables[variable]) {
      units.add(state.variables[variable].units);
    }
    return units;
  }, new Set()));
  var selectableVariables = [{
    label: 'Basic Variables',
    options: []
  }, {
    label: 'Expanded Variables',
    options: []
  }];
  var selectableVariablesCount = 0;
  Object.keys(state.variables).filter(function (variable) {
    return state.variables[variable].isSelectable;
  }).forEach(function (variable) {
    var groupIdx = state.variables[variable].downloadPkg === 'basic' ? 0 : 1;
    var isDisabled = selectedUnits.length === 2 && !selectedUnits.includes(state.variables[variable].units);
    selectableVariables[groupIdx].options.push(_extends({}, state.variables[variable], {
      value: variable,
      isDisabled: isDisabled
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
    filterOption: function filterOption(option, searchText) {
      return option.data.value.toLowerCase().includes(searchText.toLowerCase()) || option.data.units.toLowerCase().includes(searchText.toLowerCase()) || option.data.description.toLowerCase().includes(searchText.toLowerCase());
    },
    onChange: function onChange(value) {
      if (!value) {
        return;
      }
      dispatch({
        type: 'selectVariables',
        variables: value.map(function (v) {
          return v.value;
        })
      });
    }
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.variableCardContainer
  }, state.selection.variables.map(function (variable) {
    var _state$variables$vari = state.variables[variable],
      units = _state$variables$vari.units,
      description = _state$variables$vari.description;
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
      onClick: function onClick() {
        dispatch({
          type: 'selectVariables',
          variables: state.selection.variables.filter(function (v) {
            return v !== variable;
          })
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