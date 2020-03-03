"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TimeSeriesViewerSites;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactSelect = _interopRequireDefault(require("react-select"));

var _reactCopyToClipboard = require("react-copy-to-clipboard");

var _styles = require("@material-ui/core/styles");

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Checkbox = _interopRequireDefault(require("@material-ui/core/Checkbox"));

var _Dialog = _interopRequireDefault(require("@material-ui/core/Dialog"));

var _DialogActions = _interopRequireDefault(require("@material-ui/core/DialogActions"));

var _DialogContent = _interopRequireDefault(require("@material-ui/core/DialogContent"));

var _DialogContentText = _interopRequireDefault(require("@material-ui/core/DialogContentText"));

var _DialogTitle = _interopRequireDefault(require("@material-ui/core/DialogTitle"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _InputAdornment = _interopRequireDefault(require("@material-ui/core/InputAdornment"));

var _List = _interopRequireDefault(require("@material-ui/core/List"));

var _ListItem = _interopRequireDefault(require("@material-ui/core/ListItem"));

var _ListItemIcon = _interopRequireDefault(require("@material-ui/core/ListItemIcon"));

var _ListItemText = _interopRequireDefault(require("@material-ui/core/ListItemText"));

var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));

var _NoSsr = _interopRequireDefault(require("@material-ui/core/NoSsr"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));

var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));

var _Clear = _interopRequireDefault(require("@material-ui/icons/Clear"));

var _Terrain = _interopRequireDefault(require("@material-ui/icons/Terrain"));

var _MyLocation = _interopRequireDefault(require("@material-ui/icons/MyLocation"));

var _Search = _interopRequireDefault(require("@material-ui/icons/Search"));

var _TouchApp = _interopRequireDefault(require("@material-ui/icons/TouchApp"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

var _iconCoreTerrestrial = _interopRequireDefault(require("../SiteMap/icon-core-terrestrial.svg"));

var _iconCoreAquatic = _interopRequireDefault(require("../SiteMap/icon-core-aquatic.svg"));

var _iconRelocatableTerrestrial = _interopRequireDefault(require("../SiteMap/icon-relocatable-terrestrial.svg"));

var _iconRelocatableAquatic = _interopRequireDefault(require("../SiteMap/icon-relocatable-aquatic.svg"));

var _TimeSeriesViewerContext = _interopRequireDefault(require("./TimeSeriesViewerContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ucWord = function ucWord(word) {
  return "".concat(word.slice(0, 1)).concat(word.slice(1).toLowerCase());
};

var ICON_SVGS = {
  CORE: {
    AQUATIC: _iconCoreAquatic.default,
    TERRESTRIAL: _iconCoreTerrestrial.default
  },
  RELOCATABLE: {
    AQUATIC: _iconRelocatableAquatic.default,
    TERRESTRIAL: _iconRelocatableTerrestrial.default
  }
};
/**
   Classes and Styles
*/

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    root: {
      flexGrow: 1,
      width: '100%'
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
      color: _Theme.default.palette.grey[500]
    },
    sitePaper: {
      padding: theme.spacing(1.5, 2, 1.5, 2),
      borderRadius: theme.spacing(2),
      width: '100%',
      backgroundColor: theme.palette.grey[50],
      marginTop: theme.spacing(3)
    },
    siteTitleContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: _Theme.default.spacing(1.5)
    },
    siteDetailsContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      marginBottom: _Theme.default.spacing(0.5)
    },
    siteDetail: {
      marginBottom: _Theme.default.spacing(1),
      marginRight: _Theme.default.spacing(4)
    },
    positionsTitleContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItmes: 'center'
    },
    positionPaper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: theme.spacing(0.5, 2, 0.5, 0.5),
      borderRadius: theme.spacing(2),
      width: '100%',
      backgroundColor: theme.palette.grey[100],
      marginTop: theme.spacing(1.5)
    },
    startFlex: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    },
    smallButton: {
      fontSize: '0.8rem',
      padding: theme.spacing(0.125, 0.75),
      whiteSpace: 'nowrap'
    },
    smallButtonIcon: {
      marginRight: theme.spacing(0.5),
      fontSize: '0.8rem'
    }
  };
});
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
   Common React-Select Components - used by both site-specific and position-specific react-selects
*/

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
/**
   Common React-Select PropTypes - used by both site-specific and position-specific components
*/

var ControlPropTypes = {
  children: _propTypes.default.node.isRequired,
  innerProps: _propTypes.default.shape({
    onMouseDown: _propTypes.default.func.isRequired
  }).isRequired,
  innerRef: _propTypes.default.oneOfType([_propTypes.default.oneOf([null]), _propTypes.default.func, _propTypes.default.shape({
    current: _propTypes.default.any.isRequired
  })]).isRequired,
  selectProps: _propTypes.default.object.isRequired
};
var OptionPropTypes = {
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
var OptionDefaultProps = {
  children: null,
  innerProps: null,
  innerRef: null,
  isDisabled: false
};
/**
   PositionDetail - Component to display neatly-formatted position content
*/

function PositionDetail(props) {
  var siteCode = props.siteCode,
      position = props.position,
      wide = props.wide;
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont2 = _slicedToArray(_TimeSeriesViewerCont, 1),
      state = _TimeSeriesViewerCont2[0];

  if (!state.product.sites[siteCode] || !state.product.sites[siteCode].positions[position]) {
    return _react.default.createElement(_Typography.default, {
      variant: "body1"
    }, position);
  }

  var _state$product$sites$ = state.product.sites[siteCode].positions[position],
      referenceElevation = _state$product$sites$.referenceElevation,
      xOffset = _state$product$sites$.xOffset,
      yOffset = _state$product$sites$.yOffset,
      zOffset = _state$product$sites$.zOffset;
  var elevation = (parseFloat(referenceElevation, 10) + parseFloat(zOffset, 10)).toFixed(2).toString();
  var fadeStyle = {
    color: _Theme.default.palette.grey[500]
  };
  var axisStyle = {
    marginRight: _Theme.default.spacing(1),
    fontWeight: 600
  };
  return wide ? _react.default.createElement("div", null, _react.default.createElement("div", {
    className: classes.startFlex,
    style: {
      alignItems: 'flex-end'
    }
  }, _react.default.createElement(_Typography.default, {
    variant: "body1",
    style: {
      fontWeight: 600,
      marginRight: _Theme.default.spacing(3)
    }
  }, "ID: ".concat(position)), _react.default.createElement("div", {
    className: classes.startFlex,
    style: _extends({
      alignItems: 'center'
    }, fadeStyle)
  }, _react.default.createElement(_Typography.default, {
    variant: "body2"
  }, "Elevation:"), _react.default.createElement(_Terrain.default, {
    fontSize: "small",
    style: {
      margin: _Theme.default.spacing(0, 0.5, 0, 1)
    }
  }), _react.default.createElement(_Typography.default, {
    variant: "body2"
  }, "".concat(elevation, "m")))), _react.default.createElement("div", {
    className: classes.startFlex
  }, _react.default.createElement(_Typography.default, {
    variant: "body2"
  }, _react.default.createElement("span", {
    style: _extends({}, axisStyle)
  }, "x / y / z:"), "".concat(xOffset, "m / ").concat(yOffset, "m / ").concat(zOffset, "m")))) : _react.default.createElement("div", {
    className: classes.startFlex,
    style: {
      alignItems: 'center'
    }
  }, _react.default.createElement("div", {
    style: {
      marginRight: _Theme.default.spacing(3)
    }
  }, _react.default.createElement(_Typography.default, {
    variant: "body1",
    style: {
      fontWeight: 600
    }
  }, "ID: ".concat(position)), _react.default.createElement(_Typography.default, {
    variant: "body2",
    style: _extends({}, fadeStyle)
  }, "Elevation:"), _react.default.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, _react.default.createElement(_Terrain.default, {
    fontSize: "small",
    style: _extends({
      marginRight: _Theme.default.spacing(0.5)
    }, fadeStyle)
  }), _react.default.createElement(_Typography.default, {
    variant: "body2",
    style: _extends({}, fadeStyle)
  }, "".concat(elevation, "m")))), _react.default.createElement("div", null, _react.default.createElement(_Typography.default, {
    variant: "body2"
  }, _react.default.createElement("span", {
    style: _extends({}, axisStyle)
  }, "x:"), "".concat(xOffset, "m"), _react.default.createElement("br", null), _react.default.createElement("span", {
    style: _extends({}, axisStyle)
  }, "y:"), "".concat(yOffset, "m"), _react.default.createElement("br", null), _react.default.createElement("span", {
    style: _extends({}, axisStyle)
  }, "z:"), "".concat(zOffset, "m"))));
}

PositionDetail.propTypes = {
  siteCode: _propTypes.default.string.isRequired,
  position: _propTypes.default.string.isRequired,
  wide: _propTypes.default.bool
};
PositionDetail.defaultProps = {
  wide: false
};
/**
   Selected Position - Component for a single deletable position paper to show within a SelectedSite
*/

function SelectedPosition(props) {
  var classes = useStyles(_Theme.default);
  var siteCode = props.siteCode,
      position = props.position,
      disabled = props.disabled;

  var _TimeSeriesViewerCont3 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont4 = _slicedToArray(_TimeSeriesViewerCont3, 2),
      state = _TimeSeriesViewerCont4[0],
      dispatch = _TimeSeriesViewerCont4[1];

  return _react.default.createElement(_Paper.default, {
    key: position,
    className: classes.positionPaper
  }, _react.default.createElement(_IconButton.default, {
    "aria-label": "remove position ".concat(position, " from ").concat(siteCode),
    disabled: disabled,
    style: {
      marginRight: _Theme.default.spacing(1)
    },
    onClick: function onClick() {
      if (disabled) {
        return;
      }

      var selectedSiteIdx = state.selection.sites.findIndex(function (site) {
        return site.siteCode === siteCode;
      });
      dispatch({
        type: 'selectSitePositions',
        positions: state.selection.sites[selectedSiteIdx].positions.filter(function (p) {
          return p !== position;
        }),
        siteCode: siteCode
      });
    }
  }, _react.default.createElement(_Clear.default, {
    fontSize: "small"
  })), _react.default.createElement("div", {
    style: {
      flexGrow: 1
    }
  }, _react.default.createElement(PositionDetail, {
    siteCode: siteCode,
    position: position
  })));
}

SelectedPosition.propTypes = {
  siteCode: _propTypes.default.string.isRequired,
  position: _propTypes.default.string.isRequired,
  disabled: _propTypes.default.bool
};
SelectedPosition.defaultProps = {
  disabled: false
};
/**
   SelectPositionsButton - button that opens a dialog for position selection
*/

function SelectPositionsButton(props) {
  var classes = useStyles(_Theme.default);
  var selectedSite = props.selectedSite;
  var siteCode = selectedSite.siteCode,
      selectedPositions = selectedSite.positions;

  var _TimeSeriesViewerCont5 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont6 = _slicedToArray(_TimeSeriesViewerCont5, 2),
      state = _TimeSeriesViewerCont6[0],
      dispatch = _TimeSeriesViewerCont6[1];

  var availablePositions = state.product.sites[siteCode] ? Object.keys(state.product.sites[siteCode].positions) : [];
  availablePositions.sort();

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      dialogOpen = _useState2[0],
      setDialogOpen = _useState2[1]; // Local state for position selections so that no fetches are fired until the dialog is submitted


  var _useState3 = (0, _react.useState)(selectedPositions),
      _useState4 = _slicedToArray(_useState3, 2),
      localSelectedPositions = _useState4[0],
      setLocalSelectedPositions = _useState4[1];

  var togglePosition = function togglePosition(position) {
    if (localSelectedPositions.includes(position)) {
      setLocalSelectedPositions(localSelectedPositions.filter(function (p) {
        return p !== position;
      }));
    } else {
      setLocalSelectedPositions([].concat(_toConsumableArray(localSelectedPositions), [position]));
    }
  };

  var handleApply = function handleApply() {
    if (!localSelectedPositions.length) {
      return;
    }

    setDialogOpen(false);
    dispatch({
      type: 'selectSitePositions',
      siteCode: siteCode,
      positions: localSelectedPositions
    });
  };

  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_Button.default, {
    color: "primary",
    variant: "outlined",
    onClick: function onClick() {
      setDialogOpen(true);
    },
    className: classes.smallButton
  }, _react.default.createElement(_TouchApp.default, {
    className: classes.smallButtonIcon
  }), "Select Positions\u2026"), _react.default.createElement(_Dialog.default, {
    open: dialogOpen,
    onClose: function onClose() {
      setDialogOpen(false);
    },
    scroll: "paper",
    "aria-labelledby": "add-positions-dialog-title",
    "aria-describedby": "add-positions-dialog-description"
  }, _react.default.createElement(_DialogTitle.default, {
    id: "add-positions-dialog-title",
    disableTypography: true
  }, _react.default.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, _react.default.createElement(_Typography.default, {
    variant: "h6",
    id: "add-positions-dialog-title"
  }, "Select Positions"), _react.default.createElement(_Typography.default, {
    variant: "subtitle2",
    color: !localSelectedPositions.length ? 'error' : 'textPrimary',
    style: {
      textAlign: 'right'
    }
  }, "".concat(localSelectedPositions.length, " of ").concat(availablePositions.length, " selected"), _react.default.createElement("br", null), _react.default.createElement("span", {
    style: {
      fontWeight: 300,
      color: _Theme.default.palette.grey[500],
      fontStyle: 'italic'
    }
  }, "at least one is required")))), _react.default.createElement(_DialogContent.default, {
    dividers: true
  }, _react.default.createElement(_DialogContentText.default, {
    id: "add-positions-dialog-description",
    tabIndex: -1,
    variant: "body2"
  }, "Positions are distinct physical sensor locations at a given site. The x, y, and z coordinates describe where the sensor is located relative to the ground-level reference point for the site. Each position selected will become a distinct series in the chart for each variable (example: 2 positions \xD7 3 variables = 6 distinct series)."), _react.default.createElement(_List.default, null, availablePositions.map(function (position) {
    var labelId = "position-list-label-".concat(position);
    return _react.default.createElement(_ListItem.default, {
      key: position,
      role: undefined,
      dense: true,
      button: true,
      onClick: function onClick() {
        togglePosition(position);
      }
    }, _react.default.createElement(_ListItemIcon.default, null, _react.default.createElement(_Checkbox.default, {
      edge: "start",
      checked: localSelectedPositions.includes(position),
      tabIndex: -1,
      disableRipple: true,
      inputProps: {
        'aria-labelledby': labelId
      }
    })), _react.default.createElement(_ListItemText.default, {
      id: labelId,
      primary: _react.default.createElement(PositionDetail, {
        siteCode: siteCode,
        position: position,
        wide: true
      })
    }));
  }))), _react.default.createElement(_DialogActions.default, null, _react.default.createElement(_Button.default, {
    onClick: function onClick() {
      setDialogOpen(false);
    },
    color: "primary",
    variant: "outlined"
  }, "Cancel"), _react.default.createElement(_Button.default, {
    onClick: handleApply,
    color: "primary",
    variant: "contained",
    disabled: !localSelectedPositions.length
  }, "Apply"))));
}

SelectPositionsButton.propTypes = {
  selectedSite: _propTypes.default.shape({
    siteCode: _propTypes.default.string.isRequired,
    positions: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
  }).isRequired
};
/**
   SitesControl - Component for the top-level Sites search field
*/

function SitesControl(props) {
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

SitesControl.propTypes = ControlPropTypes;
/**
   SiteOption - Component for a single site as it appears in the drop-down menu
*/

function SiteOption(props) {
  var classes = useStyles(_Theme.default);
  var innerRef = props.innerRef,
      isFocused = props.isFocused,
      isDisabled = props.isDisabled,
      innerProps = props.innerProps,
      data = props.data;
  var siteCode = data.siteCode,
      description = data.description,
      type = data.type,
      terrain = data.terrain,
      domainCode = data.domainCode,
      domainName = data.domainName,
      stateCode = data.stateCode,
      latitude = data.latitude,
      longitude = data.longitude;
  var terrainTypeTitle = "".concat(ucWord(terrain), " ").concat(ucWord(type));

  var optionContent = _react.default.createElement(_Typography.default, {
    variant: "body1",
    gutterBottom: true
  }, siteCode);

  if (stateCode) {
    var iconSvg = ICON_SVGS[type] && ICON_SVGS[type][terrain] ? ICON_SVGS[type][terrain] : null;
    optionContent = _react.default.createElement("div", {
      className: classes.startFlex
    }, iconSvg ? _react.default.createElement("img", {
      src: iconSvg,
      alt: terrainTypeTitle,
      title: terrainTypeTitle,
      width: _Theme.default.spacing(3),
      height: _Theme.default.spacing(3),
      style: {
        marginRight: _Theme.default.spacing(1.5),
        marginTop: _Theme.default.spacing(0.5),
        flexGrow: 0
      }
    }) : null, _react.default.createElement("div", {
      style: {
        flexGrow: 1
      }
    }, _react.default.createElement(_Typography.default, {
      variant: "body1"
    }, "".concat(siteCode, " - ").concat(description, ", ").concat(stateCode)), _react.default.createElement(_Typography.default, {
      variant: "body2",
      className: classes.optionSubtitle,
      gutterBottom: true
    }, "".concat(terrainTypeTitle, " - Domain ").concat(domainCode, " (").concat(domainName, ") - Lat/Lon: ").concat(latitude, ", ").concat(longitude))));
  }

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
  }, innerProps), optionContent);
}

SiteOption.propTypes = OptionPropTypes;
SiteOption.defaultProps = OptionDefaultProps;
/**
   Selected Site - Component for a single deletable site paper to show below the search box
*/

function SelectedSite(props) {
  var classes = useStyles(_Theme.default);
  var site = props.site,
      disabled = props.disabled;
  var siteCode = site.siteCode,
      positions = site.positions;

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      neonContextData = _NeonContext$useNeonC2[0].data;

  var allSites = neonContextData.sites,
      allStates = neonContextData.states,
      allDomains = neonContextData.domains;

  var _TimeSeriesViewerCont7 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont8 = _slicedToArray(_TimeSeriesViewerCont7, 2),
      dispatch = _TimeSeriesViewerCont8[1];

  var removeSiteButton = _react.default.createElement(_Button.default, {
    color: "primary",
    variant: "outlined",
    onClick: function onClick() {
      if (disabled) {
        return;
      }

      dispatch({
        type: 'selectRemoveSite',
        siteCode: siteCode
      });
    },
    className: classes.smallButton,
    disabled: disabled
  }, _react.default.createElement(_Clear.default, {
    className: classes.smallButtonIcon
  }), "Remove Site");

  var selectedSiteContent = _react.default.createElement("div", null, _react.default.createElement(_Typography.default, {
    variant: "body1",
    gutterBottom: true
  }, "".concat(siteCode, " (loading site details\u2026)")), removeSiteButton);

  if (allSites[siteCode]) {
    var _allSites$siteCode = allSites[siteCode],
        description = _allSites$siteCode.description,
        type = _allSites$siteCode.type,
        terrain = _allSites$siteCode.terrain,
        domainCode = _allSites$siteCode.domainCode,
        stateCode = _allSites$siteCode.stateCode,
        latitude = _allSites$siteCode.latitude,
        longitude = _allSites$siteCode.longitude;
    var typeTitle = 'Core';
    var typeSubtitle = 'fixed location';

    if (type === 'RELOCATABLE') {
      typeTitle = 'Relocatable';
      typeSubtitle = 'location may change';
    }

    var terrainTitle = 'Terrestrial';
    var terrainSubtitle = 'land-based';

    if (terrain === 'AQUATIC') {
      terrainTitle = 'Aquatic';
      terrainSubtitle = 'water-based';
    }

    var terrainTypeTitle = "".concat(terrainTitle, " ").concat(typeTitle);
    var terrainTypeSubtitle = "".concat(terrainSubtitle, "; ").concat(typeSubtitle);
    var domainName = allDomains[domainCode] ? allDomains[domainCode].name : null;
    var stateName = allStates[stateCode] ? allStates[stateCode].name : null;
    var stateFieldTitle = stateCode === 'PR' ? 'Territory' : 'State';
    var iconSvg = ICON_SVGS[type] && ICON_SVGS[type][terrain] ? ICON_SVGS[type][terrain] : null;
    var terrainIcon = iconSvg ? _react.default.createElement("img", {
      src: iconSvg,
      alt: terrainTypeTitle,
      title: terrainTypeTitle,
      width: _Theme.default.spacing(4),
      height: _Theme.default.spacing(4),
      style: {
        marginRight: _Theme.default.spacing(1),
        flexGrow: 0
      }
    }) : null;
    selectedSiteContent = _react.default.createElement("div", null, _react.default.createElement("div", {
      className: classes.siteTitleContainer
    }, terrainIcon, _react.default.createElement(_Typography.default, {
      variant: "h6",
      style: {
        lineHeight: '1.4rem',
        flexGrow: 1
      }
    }, "".concat(description, " (").concat(siteCode, ")")), removeSiteButton), _react.default.createElement("div", {
      className: classes.siteDetailsContainer
    }, _react.default.createElement("div", {
      className: classes.siteDetail
    }, _react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, terrainTypeTitle), _react.default.createElement(_Typography.default, {
      variant: "body2",
      style: {
        fontSize: '0.8rem'
      }
    }, _react.default.createElement("i", null, terrainTypeSubtitle))), _react.default.createElement("div", {
      className: classes.siteDetail
    }, _react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, stateFieldTitle), _react.default.createElement(_Typography.default, {
      variant: "body2"
    }, stateName)), _react.default.createElement("div", {
      className: classes.siteDetail
    }, _react.default.createElement(_Typography.default, {
      variant: "subtitle2"
    }, "Domain"), _react.default.createElement(_Typography.default, {
      variant: "body2"
    }, "".concat(domainCode, " - ").concat(domainName))), _react.default.createElement("div", {
      className: classes.siteDetail
    }, _react.default.createElement("div", {
      className: classes.startFlex,
      style: {
        alignItems: 'center'
      }
    }, _react.default.createElement(_reactCopyToClipboard.CopyToClipboard, {
      text: "".concat(latitude, " ").concat(longitude)
    }, _react.default.createElement(_Tooltip.default, {
      title: "Latitude / Longitude (click to copy)"
    }, _react.default.createElement(_IconButton.default, {
      size: "small",
      style: {
        marginRight: _Theme.default.spacing(0.5)
      },
      "aria-label": "Latitude / Longitude (click to copy)"
    }, _react.default.createElement(_MyLocation.default, null)))), _react.default.createElement(_Typography.default, {
      variant: "caption",
      "aria-label": "Latitude / Longitude",
      style: {
        fontFamily: 'monospace',
        textAlign: 'right'
      }
    }, latitude, _react.default.createElement("br", null), longitude)))));
  }

  return _react.default.createElement(_Paper.default, {
    key: siteCode,
    className: classes.sitePaper
  }, selectedSiteContent, _react.default.createElement("div", null, _react.default.createElement("div", {
    className: classes.positionsTitleContainer
  }, _react.default.createElement(_Typography.default, {
    variant: "subtitle2"
  }, "Position(s):"), _react.default.createElement(SelectPositionsButton, {
    selectedSite: site
  })), positions.map(function (position) {
    return _react.default.createElement(SelectedPosition, {
      key: position,
      siteCode: siteCode,
      position: position,
      disabled: positions.length < 2
    });
  })));
}

SelectedSite.propTypes = {
  site: _propTypes.default.shape({
    siteCode: _propTypes.default.string.isRequired,
    positions: _propTypes.default.arrayOf(_propTypes.default.string).isRequired
  }).isRequired,
  disabled: _propTypes.default.bool
};
SelectedSite.defaultProps = {
  disabled: false
};
/**
   Complete Select for Sites
*/

var SitesSelectComponents = {
  Control: SitesControl,
  Option: SiteOption,
  Menu: Menu,
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

var SitesSelect = function SitesSelect() {
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont9 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont10 = _slicedToArray(_TimeSeriesViewerCont9, 2),
      state = _TimeSeriesViewerCont10[0],
      dispatch = _TimeSeriesViewerCont10[1];

  var _NeonContext$useNeonC3 = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC4 = _slicedToArray(_NeonContext$useNeonC3, 1),
      neonContextData = _NeonContext$useNeonC4[0].data;

  var allStates = neonContextData.states,
      allSites = neonContextData.sites,
      allDomains = neonContextData.domains; // Build list of selectable sites grouped by US state

  var selectableSiteCodes = Object.keys(state.product.sites);
  var selectableSitesCount = 0;
  var selectableSites = Object.keys(allStates).map(function (stateCode) {
    return {
      label: allStates[stateCode].name,
      stateCode: stateCode,
      options: []
    };
  });
  Object.keys(state.product.sites).filter(function (siteCode) {
    return selectableSiteCodes.includes(siteCode);
  }).forEach(function (siteCode) {
    var groupIdx = selectableSites.findIndex(function (group) {
      return allSites[siteCode] && group.stateCode === allSites[siteCode].stateCode;
    });

    if (groupIdx === -1) {
      return;
    }

    var domain = allDomains[allSites[siteCode].domainCode] || {};
    var usState = allStates[allSites[siteCode].stateCode] || {};
    var search = [siteCode, allSites[siteCode].description, allSites[siteCode].domainCode, allSites[siteCode].stateCode, allSites[siteCode].type, allSites[siteCode].terrain, domain.name || '', usState.name || ''].join(' ').toLowerCase();
    selectableSites[groupIdx].options.push(_extends({
      value: siteCode,
      domainName: domain.name || null
    }, allSites[siteCode], {
      search: search
    }));
    selectableSitesCount += 1;
  });
  var selectedSites = state.selection.sites.map(function (site) {
    return site.siteCode;
  }).filter(function (siteCode) {
    return selectableSiteCodes.includes(siteCode);
  });

  if (!selectableSitesCount) {
    return null;
  }

  return _react.default.createElement(_NoSsr.default, null, _react.default.createElement(_reactSelect.default, {
    isMulti: true,
    isSearchable: true,
    clearable: false,
    classes: classes,
    styles: selectStyles,
    "aria-label": "Search Sites",
    "data-gtm": "time-series-viewer.search-sites",
    options: selectableSites,
    components: SitesSelectComponents,
    value: selectedSites,
    controlShouldRenderValue: false,
    filterOption: function filterOption(option, searchText) {
      return option.data.search.includes(searchText.toLowerCase());
    },
    onChange: function onChange(value, change) {
      if (change.action !== 'select-option') {
        return;
      }

      dispatch({
        type: 'selectAddSite',
        siteCode: change.option.siteCode
      });
    }
  }));
};
/**
   Primary Component
*/


function TimeSeriesViewerSites() {
  var classes = useStyles(_Theme.default);

  var _TimeSeriesViewerCont11 = _TimeSeriesViewerContext.default.useTimeSeriesViewerState(),
      _TimeSeriesViewerCont12 = _slicedToArray(_TimeSeriesViewerCont11, 1),
      state = _TimeSeriesViewerCont12[0];

  var _NeonContext$useNeonC5 = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC6 = _slicedToArray(_NeonContext$useNeonC5, 1),
      neonContextData = _NeonContext$useNeonC6[0].data;

  var allSites = neonContextData.sites; // TODO: skeleton

  if (!state.selection.sites.length || !Object.keys(allSites).length) {
    return _react.default.createElement(_Skeleton.default, {
      variant: "rect",
      width: "100%",
      height: 56
    });
  }

  return _react.default.createElement("div", {
    className: classes.root
  }, _react.default.createElement(SitesSelect, null), state.selection.sites.map(function (site) {
    return _react.default.createElement(SelectedSite, {
      key: site.siteCode,
      site: site,
      disabled: state.selection.sites.length < 2
    });
  }));
}