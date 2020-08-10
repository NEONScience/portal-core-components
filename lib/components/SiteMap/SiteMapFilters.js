"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styles = require("@material-ui/core/styles");

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));

var _ToggleButton = _interopRequireDefault(require("@material-ui/lab/ToggleButton"));

var _ToggleButtonGroup = _interopRequireDefault(require("@material-ui/lab/ToggleButtonGroup"));

var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));

var _ExpandLess = _interopRequireDefault(require("@material-ui/icons/ExpandLess"));

var _ExpandMore = _interopRequireDefault(require("@material-ui/icons/ExpandMore"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _SiteMapContext = _interopRequireDefault(require("./SiteMapContext"));

var _SiteMapUtils = require("./SiteMapUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useStyles = (0, _styles.makeStyles)(function () {
  return {
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  };
});

var SiteMapFilters = function SiteMapFilters() {
  var _viewTooltips;

  var classes = useStyles(_Theme.default);

  var _SiteMapContext$useSi = _SiteMapContext.default.useSiteMapContext(),
      _SiteMapContext$useSi2 = _slicedToArray(_SiteMapContext$useSi, 2),
      state = _SiteMapContext$useSi2[0],
      dispatch = _SiteMapContext$useSi2[1];

  var view = state.view.current,
      filters = state.filters;

  var handleChangeView = function handleChangeView(event, newView) {
    dispatch({
      type: 'setView',
      view: newView
    });
  };

  var toggleFeatures = function toggleFeatures() {
    dispatch({
      type: 'setFilterFeaturesOpen',
      open: !filters.features.open
    });
  };
  /**
     Focus Location Form
     TODO: Figure out where this goes long-term. Probably hidden until summoned
  */


  var FOCUS_DISPLAY = 'none'; // 'flex'

  var _useState = (0, _react.useState)(''),
      _useState2 = _slicedToArray(_useState, 2),
      location = _useState2[0],
      setLocation = _useState2[1];

  var jumpToLocation = function jumpToLocation(event) {
    event.preventDefault();

    if (location) {
      dispatch({
        type: 'setNewFocusLocation',
        location: location
      });
    }
  };

  var focusLocationError = state.focusLocation.fetch.status === _SiteMapUtils.FETCH_STATUS.ERROR;
  var helperText = focusLocationError ? state.focusLocation.fetch.error : 'Any named location with coordinates, e.g. CPER or D12';
  var formStyle = {
    display: FOCUS_DISPLAY,
    alignItems: 'center',
    margin: filters.position === 'top' ? _Theme.default.spacing(1, 0, 1.5, 0) : _Theme.default.spacing(2, 0, 0, 0)
  };

  var renderFocusLocationForm = function renderFocusLocationForm() {
    return /*#__PURE__*/_react.default.createElement("div", {
      style: formStyle
    }, /*#__PURE__*/_react.default.createElement("form", {
      onSubmit: jumpToLocation,
      "data-selenium": "sitemap-focusLocationForm"
    }, /*#__PURE__*/_react.default.createElement(_TextField.default, {
      margin: "dense",
      variant: "outlined",
      label: "Jump to Location",
      helperText: helperText,
      style: {
        margin: 'auto'
      },
      value: location,
      onChange: function onChange(event) {
        setLocation(event.target.value);
      },
      error: focusLocationError
    }), /*#__PURE__*/_react.default.createElement(_Button.default, {
      type: "submit",
      color: "primary",
      variant: "contained",
      style: {
        marginLeft: _Theme.default.spacing(1)
      }
    }, "Go")));
  };
  /**
     Main Render
  */


  var rowStyle = filters.position === 'top' ? {
    marginBottom: _Theme.default.spacing(1)
  } : {
    marginTop: _Theme.default.spacing(1)
  };
  var openIcon = filters.position === 'top' ? /*#__PURE__*/_react.default.createElement(_ExpandMore.default, null) : /*#__PURE__*/_react.default.createElement(_ExpandLess.default, null);
  var closeIcon = filters.position === 'top' ? /*#__PURE__*/_react.default.createElement(_ExpandLess.default, null) : /*#__PURE__*/_react.default.createElement(_ExpandMore.default, null);
  var viewTooltips = (_viewTooltips = {}, _defineProperty(_viewTooltips, _SiteMapUtils.VIEWS.MAP, 'Show the map'), _defineProperty(_viewTooltips, _SiteMapUtils.VIEWS.TABLE, 'Show a table of all locations currently visible in the map'), _viewTooltips);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.row,
    style: rowStyle
  }, /*#__PURE__*/_react.default.createElement(_ToggleButtonGroup.default, {
    exclusive: true,
    color: "primary",
    variant: "outlined",
    value: view,
    onChange: handleChangeView
  }, Object.keys(_SiteMapUtils.VIEWS).map(function (key) {
    return /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      key: key,
      title: viewTooltips[key],
      enterDelay: 500,
      enterNextDelay: 200,
      placement: filters.position === 'top' ? 'bottom-start' : 'top-start'
    }, /*#__PURE__*/_react.default.createElement(_ToggleButton.default, {
      value: key,
      selected: state.view.current === key,
      "data-selenium": "sitemap-viewButton-".concat(key)
    }, key));
  })), /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    enterDelay: 500,
    enterNextDelay: 200,
    title: "Toggle visibility of the list of features (the legend)",
    placement: filters.position === 'top' ? 'bottom-end' : 'top-end'
  }, /*#__PURE__*/_react.default.createElement(_Button.default, {
    color: "primary",
    variant: filters.features.open ? 'contained' : 'outlined',
    endIcon: filters.features.open ? closeIcon : openIcon,
    onClick: toggleFeatures,
    "data-selenium": "sitemap-featuresButton"
  }, "Features"))), renderFocusLocationForm());
};

var _default = SiteMapFilters;
exports.default = _default;