"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactIdGenerator = require("react-id-generator");

var _styles = require("@material-ui/core/styles");

var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));

var _OutlinedInput = _interopRequireDefault(require("@material-ui/core/OutlinedInput"));

var _Select = _interopRequireDefault(require("@material-ui/core/Select"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Skeleton = _interopRequireDefault(require("@material-ui/lab/Skeleton"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    title: {
      fontWeight: 500,
      marginBottom: theme.spacing(1)
    },
    input: {
      width: '100%'
    },
    description: {
      display: 'block',
      marginTop: theme.spacing(1),
      color: theme.palette.grey[400]
    }
  };
});
var UNSPECIFIED = 'n/a';

var ReleaseFilter = function ReleaseFilter(props) {
  var classes = useStyles(_Theme.default);

  var maxWidth = props.maxWidth,
      onChange = props.onChange,
      releasesProp = props.releases,
      selected = props.selected,
      skeleton = props.skeleton,
      title = props.title,
      otherProps = _objectWithoutProperties(props, ["maxWidth", "onChange", "releases", "selected", "skeleton", "title"]);

  var _useId = (0, _reactIdGenerator.useId)(),
      _useId2 = _slicedToArray(_useId, 1),
      instanceId = _useId2[0];

  var inputId = "release-filter-input-".concat(instanceId);
  var labelId = "release-filter-label-".concat(instanceId);

  var releases = _toConsumableArray(releasesProp);

  releases.sort(function (a, b) {
    return a.name > b.name;
  });
  releases.unshift({
    name: UNSPECIFIED,
    doi: null,
    description: 'No release specified - show all released and provisional data'
  });

  var findRelease = function findRelease(name) {
    return releases.find(function (release) {
      return release.name === name;
    }) || releases[0];
  };

  var initialRelease = findRelease(selected);

  var _useState = (0, _react.useState)(initialRelease.name),
      _useState2 = _slicedToArray(_useState, 2),
      selectedRelease = _useState2[0],
      setSelectedRelease = _useState2[1];

  var currentRelease = findRelease(selectedRelease);

  var handleChange = function handleChange(newReleaseName) {
    var newRelease = findRelease(newReleaseName);
    setSelectedRelease(newRelease.name);
    onChange(newRelease.name);
  };

  var input = /*#__PURE__*/_react.default.createElement(_OutlinedInput.default, {
    id: inputId,
    name: inputId,
    margin: "dense",
    className: classes.input,
    style: {
      width: "".concat(maxWidth, "px")
    }
  });

  var titleNode = /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h5",
    component: "h3",
    className: classes.title,
    id: labelId
  }, title);

  if (skeleton) {
    var skeletonStyle = {
      marginBottom: _Theme.default.spacing(1)
    };
    return /*#__PURE__*/_react.default.createElement("div", _extends({}, otherProps || {}, {
      style: {
        maxWidth: "".concat(maxWidth, "px")
      }
    }), titleNode, /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      variant: "rect",
      width: maxWidth,
      height: 36,
      style: skeletonStyle
    }), /*#__PURE__*/_react.default.createElement(_Skeleton.default, {
      width: "70%",
      height: 16,
      style: skeletonStyle
    }));
  }

  return /*#__PURE__*/_react.default.createElement("div", _extends({}, otherProps, {
    style: {
      maxWidth: "".concat(maxWidth, "px")
    }
  }), titleNode, /*#__PURE__*/_react.default.createElement(_Select.default, {
    "data-selenium": "release-filter",
    value: selectedRelease,
    onChange: function onChange(event) {
      return handleChange(event.target.value);
    },
    input: input,
    "aria-labelledby": labelId,
    renderValue: function renderValue(value) {
      return value;
    },
    disabled: releases.length <= 1
  }, releases.map(function (release) {
    var name = release.name,
        doi = release.doi,
        description = release.description;
    return /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
      key: name,
      value: name
    }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      display: "block"
    }, name), /*#__PURE__*/_react.default.createElement(_Typography.default, {
      display: "block",
      variant: "caption"
    }, description || "DOI: ".concat(doi))));
  })), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "caption",
    className: classes.description
  }, currentRelease.description || "DOI: ".concat(currentRelease.doi || 'n/a')));
};

ReleaseFilter.propTypes = {
  maxWidth: _propTypes.default.number,
  onChange: _propTypes.default.func,
  releases: _propTypes.default.arrayOf(_propTypes.default.shape({
    name: _propTypes.default.string.isRequired,
    doi: _propTypes.default.string,
    description: _propTypes.default.string
  })).isRequired,
  selected: _propTypes.default.string,
  skeleton: _propTypes.default.bool,
  title: _propTypes.default.string
};
ReleaseFilter.defaultProps = {
  maxWidth: 300,
  onChange: function onChange() {},
  selected: null,
  skeleton: false,
  title: 'Release'
};

var WrappedReleaseFilter = _Theme.default.getWrappedComponent(ReleaseFilter);

var _default = WrappedReleaseFilter;
exports.default = _default;