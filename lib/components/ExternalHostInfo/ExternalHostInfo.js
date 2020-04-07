"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styles = require("@material-ui/core/styles");

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _SnackbarContent = _interopRequireDefault(require("@material-ui/core/SnackbarContent"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _ExpandLess = _interopRequireDefault(require("@material-ui/icons/ExpandLess"));

var _ExpandMore = _interopRequireDefault(require("@material-ui/icons/ExpandMore"));

var _Info = _interopRequireDefault(require("@material-ui/icons/Info"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _ExternalHost = _interopRequireDefault(require("../ExternalHost/ExternalHost"));

var _ExternalHostProductSpecificLinks = _interopRequireDefault(require("../ExternalHostProductSpecificLinks/ExternalHostProductSpecificLinks"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    startFlex: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    infoSnackbar: {
      backgroundColor: theme.palette.grey[50],
      color: '#000',
      border: "1px solid ".concat(theme.palette.primary.main, "80"),
      margin: _Theme.default.spacing(0.5, 0, 3, 0),
      padding: _Theme.default.spacing(0, 2),
      '& div': {
        width: '100%'
      }
    },
    infoSnackbarIcon: {
      color: theme.palette.grey[300],
      marginRight: theme.spacing(2)
    }
  };
});

var ExternalHostInfo = function ExternalHostInfo(props) {
  var classes = useStyles(_Theme.default);

  var productCode = props.productCode,
      expandable = props.expandable,
      otherProps = _objectWithoutProperties(props, ["productCode", "expandable"]);

  var _useState = (0, _react.useState)(!expandable),
      _useState2 = _slicedToArray(_useState, 2),
      expanded = _useState2[0],
      setExpanded = _useState2[1];

  var externalHost = _ExternalHost.default.getByProductCode(productCode);

  if (!externalHost) {
    return null;
  } // Not only _should_ the info have specific links (links in addition to the top-level
  // one for the host), but _does_ it?


  var hasSpecificLinks = externalHost.linkType === _ExternalHost.default.LINK_TYPES.BY_PRODUCT && externalHost.getProductLinks(productCode).length || externalHost.linkType === _ExternalHost.default.LINK_TYPES.BY_SITE; // Remaining setup


  var externalGeneralLink = externalHost.renderLink(productCode);
  var expandTitle = "".concat(expanded ? 'hide' : 'show', " external host links to data");
  var rootProps = {};
  Object.keys(otherProps).filter(function (key) {
    return ['data-selenium', 'style', 'className'].includes(key);
  }).forEach(function (key) {
    rootProps[key] = otherProps[key];
  });
  var blurb = null;
  var dataVariety = externalHost.hostDataVariety || 'Data';

  if (externalHost.hostType === _ExternalHost.default.HOST_TYPES.REFORMATTED_DATA) {
    blurb = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "".concat(dataVariety, " for this product are available in other formats from"), "\xA0", externalGeneralLink);
  }

  if (externalHost.hostType === _ExternalHost.default.HOST_TYPES.EXCLUSIVE_DATA) {
    blurb = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "".concat(dataVariety, " for this product are only available from"), "\xA0", externalGeneralLink);
  } // Default: ExternalHost.HOST_TYPES.ADDITIONAL_DATA:


  if (!blurb) {
    dataVariety = externalHost.hostDataVariety || 'Additional data';
    var are = hasSpecificLinks ? 'are' : 'may be';
    blurb = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "".concat(dataVariety, " associated with this product ").concat(are, " available from"), "\xA0", externalGeneralLink);
  }

  var content = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: classes.startFlex,
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/_react.default.createElement(_Info.default, {
    fontSize: "large",
    className: classes.infoSnackbarIcon
  }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "subtitle2",
    style: {
      flexGrow: 1
    }
  }, blurb), hasSpecificLinks && expandable ? /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    title: expandTitle,
    "aria-label": expandTitle,
    onClick: function onClick() {
      return setExpanded(!expanded);
    },
    style: {
      marginLeft: _Theme.default.spacing(2)
    }
  }, expanded ? /*#__PURE__*/_react.default.createElement(_ExpandLess.default, null) : /*#__PURE__*/_react.default.createElement(_ExpandMore.default, null)) : null), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: '100%',
      display: hasSpecificLinks && expanded ? 'block' : 'none'
    }
  }, /*#__PURE__*/_react.default.createElement(_Divider.default, {
    style: {
      margin: _Theme.default.spacing(1.5, 0)
    }
  }), /*#__PURE__*/_react.default.createElement(_ExternalHostProductSpecificLinks.default, {
    productCode: productCode
  })));

  return /*#__PURE__*/_react.default.createElement("div", rootProps, /*#__PURE__*/_react.default.createElement(_SnackbarContent.default, {
    className: classes.infoSnackbar,
    message: content
  }));
};

ExternalHostInfo.propTypes = {
  productCode: _propTypes.default.string.isRequired,
  expandable: _propTypes.default.bool
};
ExternalHostInfo.defaultProps = {
  expandable: false
};
var _default = ExternalHostInfo;
exports.default = _default;