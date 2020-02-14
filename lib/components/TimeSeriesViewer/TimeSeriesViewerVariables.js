"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewerVariables;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _clsx2 = _interopRequireDefault(require("clsx"));

var _reactSelect = _interopRequireDefault(require("react-select"));

var _styles = require("@material-ui/core/styles");

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _NoSsr = _interopRequireDefault(require("@material-ui/core/NoSsr"));

var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _Chip = _interopRequireDefault(require("@material-ui/core/Chip"));

var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));

var _Cancel = _interopRequireDefault(require("@material-ui/icons/Cancel"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _TimeSeriesViewerContext = _interopRequireDefault(require("./TimeSeriesViewerContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
    chip: {
      margin: theme.spacing(0.5, 0.25)
    },
    chipFocused: {
      backgroundColor: (0, _styles.emphasize)(theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700], 0.08)
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2)
    },
    singleValue: {
      fontSize: 16
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
    }
  };
});

function inputComponent(_ref) {
  var inputRef = _ref.inputRef,
      props = _objectWithoutProperties(_ref, ["inputRef"]);

  return _react.default.createElement("div", _extends({
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
      _props$selectProps = props.selectProps,
      classes = _props$selectProps.classes,
      TextFieldProps = _props$selectProps.TextFieldProps;
  return _react.default.createElement(_TextField.default, _extends({
    fullWidth: true,
    variant: "outlined",
    InputProps: {
      inputComponent: inputComponent,
      inputProps: _extends({
        className: classes.input,
        ref: innerRef,
        children: children
      }, innerProps)
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
      label = data.label,
      units = data.units,
      description = data.description;
  var textStyle = isDisabled ? {
    color: _Theme.default.palette.grey[200]
  } : {};
  return _react.default.createElement(_MenuItem.default, _extends({
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
  }, innerProps), _react.default.createElement(_Typography.default, {
    variant: "body1",
    style: _extends({}, textStyle)
  }, label, _react.default.createElement("span", {
    className: classes.optionSubtitle,
    style: _extends({}, textStyle, {
      marginLeft: '8px'
    })
  }, "(".concat(units, ")"))), _react.default.createElement(_Typography.default, {
    variant: "body2",
    className: classes.optionSubtitle,
    style: _extends({}, textStyle),
    gutterBottom: true
  }, description));
}

Option.propTypes = {
  children: _propTypes.default.node.isRequired,
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
  innerProps: null,
  innerRef: null,
  isDisabled: false
};

function Placeholder(props) {
  var selectProps = props.selectProps,
      _props$innerProps = props.innerProps,
      innerProps = _props$innerProps === void 0 ? {} : _props$innerProps,
      children = props.children;
  var placeholder = selectProps.classes.placeholder;
  return _react.default.createElement(_Typography.default, _extends({
    color: "textSecondary",
    className: placeholder
  }, innerProps), children);
}

Placeholder.propTypes = {
  children: _propTypes.default.node.isRequired,
  innerProps: _propTypes.default.object.isRequired,
  selectProps: _propTypes.default.object.isRequired
};

function ValueContainer(props) {
  var selectProps = props.selectProps,
      children = props.children;
  var valueContainer = selectProps.classes.valueContainer;
  return _react.default.createElement("div", {
    className: valueContainer
  }, children);
}

ValueContainer.propTypes = {
  children: _propTypes.default.node.isRequired,
  selectProps: _propTypes.default.object.isRequired
};

function MultiValue(props) {
  var selectProps = props.selectProps,
      removeProps = props.removeProps,
      isFocused = props.isFocused,
      children = props.children,
      data = props.data;
  var _selectProps$classes = selectProps.classes,
      chip = _selectProps$classes.chip,
      chipFocused = _selectProps$classes.chipFocused;
  var onClick = removeProps.onClick;
  return _react.default.createElement(_Chip.default, {
    key: data.value,
    tabIndex: -1,
    label: children,
    className: (0, _clsx2.default)(chip, _defineProperty({}, chipFocused, isFocused)),
    onDelete: data.count > 1 ? onClick : null,
    deleteIcon: _react.default.createElement(_Cancel.default, removeProps)
  });
}

MultiValue.propTypes = {
  children: _propTypes.default.node,
  isFocused: _propTypes.default.bool.isRequired,
  removeProps: _propTypes.default.shape({
    onClick: _propTypes.default.func.isRequired,
    onMouseDown: _propTypes.default.func.isRequired,
    onTouchEnd: _propTypes.default.func.isRequired
  }).isRequired,
  selectProps: _propTypes.default.object.isRequired,
  data: _propTypes.default.object.isRequired
};
MultiValue.defaultProps = {
  children: null
};

function Menu(props) {
  var selectProps = props.selectProps,
      innerProps = props.innerProps,
      children = props.children;
  var paper = selectProps.classes.paper;
  return _react.default.createElement(_Paper.default, _extends({
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
  MultiValue: MultiValue,
  Option: Option,
  Placeholder: Placeholder,
  ValueContainer: ValueContainer
};

function TimeSeriesViewerVariables() {
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont2 = _slicedToArray(_TimeSeriesViewerCont, 2),
      state = _TimeSeriesViewerCont2[0],
      dispatch = _TimeSeriesViewerCont2[1];

  var selectedVariables = state.selection.variables.map(function (variable) {
    return _extends({}, state.variables[variable], {
      value: variable,
      label: variable,
      key: variable,
      count: state.selection.variables.length
    });
  });
  var selectedUnits = Array.from(state.selection.variables.reduce(function (units, variable) {
    units.add(state.variables[variable].units);
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
      label: variable,
      value: variable,
      key: variable,
      isDisabled: isDisabled
    }));
    selectableVariablesCount += 1;
  }); // TODO: skeleton

  if (!selectableVariablesCount) {
    return null;
  }

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
  return _react.default.createElement("div", {
    className: classes.root
  }, _react.default.createElement(_NoSsr.default, null, _react.default.createElement(_reactSelect.default, {
    isMulti: true,
    clearable: false,
    classes: classes,
    styles: selectStyles,
    "aria-label": "Variables",
    "data-gtm": "time-series-viewer.variables",
    placeholder: "Select multiple variables",
    options: selectableVariables,
    components: components,
    value: selectedVariables,
    onChange: function onChange(value) {
      dispatch({
        type: 'selectVariables',
        variables: value.map(function (v) {
          return v.value;
        })
      });
    }
  })));
}