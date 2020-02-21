"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewerSites;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactSelect = _interopRequireDefault(require("react-select"));

var _styles = require("@material-ui/core/styles");

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _InputAdornment = _interopRequireDefault(require("@material-ui/core/InputAdornment"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _NoSsr = _interopRequireDefault(require("@material-ui/core/NoSsr"));

var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));

var _Clear = _interopRequireDefault(require("@material-ui/icons/Clear"));

var _Search = _interopRequireDefault(require("@material-ui/icons/Search"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _TimeSeriesViewerContext = _interopRequireDefault(require("./TimeSeriesViewerContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// import sitesJSON from '../../static/sites/sites.json';
// import statesJSON from '../../static/states/states.json';
// import domainsJSON from '../../static/domains/domains.json';
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
    sitePaper: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: theme.spacing(1, 3, 1, 1),
      borderRadius: theme.spacing(2),
      width: 'fit-content',
      backgroundColor: theme.palette.grey[50],
      marginRight: theme.spacing(2)
    },
    sitePaperContainer: {
      lineHeight: '5em',
      marginTop: theme.spacing(2.5)
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
      TextFieldProps = props.selectProps.TextFieldProps;
  return _react.default.createElement(_TextField.default, _extends({
    fullWidth: true,
    label: "Search Sites",
    variant: "outlined",
    InputProps: {
      inputComponent: inputComponent,
      inputProps: _extends({
        ref: innerRef,
        children: children
      }, innerProps),
      endAdornment: _react.default.createElement(_InputAdornment.default, {
        position: "end"
      }, _react.default.createElement(_Search.default, {
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
  var siteCode = data.siteCode,
      description = data.description;
  var textStyle = isDisabled ? {
    color: _Theme.default.palette.grey[200]
  } : {};
  return _react.default.createElement(_MenuItem.default, _extends({
    key: siteCode,
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
  }, siteCode), _react.default.createElement(_Typography.default, {
    variant: "body2",
    className: classes.optionSubtitle,
    style: _extends({}, textStyle),
    gutterBottom: true
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
  return _react.default.createElement("div", {
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

function TimeSeriesViewerSites() {
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont2 = _slicedToArray(_TimeSeriesViewerCont, 1),
      state = _TimeSeriesViewerCont2[0]; // console.log(state.product.sites);


  var selectableSites = Object.keys(state.product.sites).map(function (siteCode) {
    return _extends({}, state.product.sites[siteCode], {
      value: siteCode,
      siteCode: siteCode
    });
  });
  var selectedSiteCodes = state.selection.sites.map(function (site) {
    return site.siteCode;
  });
  var selectedSites = selectableSites.filter(function (site) {
    return selectedSiteCodes.includes(site.siteCode);
  }); // TODO: skeleton

  if (!selectableSites.length) {
    return null;
  }

  return _react.default.createElement("div", {
    className: classes.root
  }, _react.default.createElement(_NoSsr.default, null, _react.default.createElement(_reactSelect.default, {
    isMulti: true,
    isSearchable: true,
    clearable: false,
    classes: classes,
    styles: selectStyles,
    "aria-label": "Search Sites",
    "data-gtm": "time-series-viewer.search-sites",
    options: selectableSites,
    components: components,
    value: selectedSites,
    controlShouldRenderValue: false,
    filterOption: function filterOption(option, searchText) {
      return option.data.value.toLowerCase().includes(searchText.toLowerCase());
    },
    onChange: function onChange(value) {
      if (!value) {
        return;
      }

      console.log('selectSites', value); // dispatch({ type: 'selectVariables', variables: value.map(v => v.value) });
    }
  })), _react.default.createElement("div", {
    className: classes.sitePaperContainer
  }, state.selection.sites.map(function (site) {
    var siteCode = site.siteCode;
    var description = state.product.sites[siteCode].description;
    return _react.default.createElement(_Paper.default, {
      key: siteCode,
      className: classes.sitePaper
    }, _react.default.createElement(_IconButton.default, {
      "aria-label": "remove site ".concat(siteCode, " and all its positions"),
      style: {
        marginRight: _Theme.default.spacing(1)
      },
      onClick: function onClick() {
        console.log('removeSite');
        /*
        dispatch({
          type: 'selectSites',
          variables: state.selection.variables.filter(v => v !== variable),
        });
        */
      }
    }, _react.default.createElement(_Clear.default, {
      fontSize: "small"
    })), _react.default.createElement("div", {
      style: {
        flexGrow: 1
      }
    }, _react.default.createElement(_Typography.default, {
      variant: "body1"
    }, siteCode), _react.default.createElement(_Typography.default, {
      variant: "body2",
      className: classes.optionSubtitle,
      gutterBottom: true
    }, description)));
  })));
}