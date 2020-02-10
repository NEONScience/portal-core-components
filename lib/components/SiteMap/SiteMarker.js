"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactLeaflet = require("react-leaflet");

var _styles = require("@material-ui/core/styles");

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _InfoOutlined = _interopRequireDefault(require("@material-ui/icons/InfoOutlined"));

var _InsertChartOutlined = _interopRequireDefault(require("@material-ui/icons/InsertChartOutlined"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _states = _interopRequireDefault(require("../../static/states/states.json"));

var _domains = _interopRequireDefault(require("../../static/domains/domains.json"));

var _SiteIcon = _interopRequireWildcard(require("./SiteIcon"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SITE_DETAILS_URL_BASE = 'https://www.neonscience.org/field-sites/field-sites-map/';
var EXPLORE_DATA_PRODUCTS_URL_BASE = 'https://data.neonscience.org/data-products/explore?site=';
var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    popup: {
      minWidth: '320px',
      '& a': {
        color: theme.palette.secondary.main
      },
      '& p': {
        margin: 'unset'
      },
      '& a.leaflet-popup-close-button': {
        top: theme.spacing(0.5),
        right: theme.spacing(0.5)
      }
    },
    popupButton: {
      width: '100%',
      whiteSpace: 'nowrap',
      marginBottom: theme.spacing(1),
      color: "".concat(_Theme.default.palette.primary.main, " !important"),
      borderColor: _Theme.default.palette.primary.main,
      '& span': {
        pointerEvents: 'none'
      }
    },
    popupSiteIcon: {
      width: '20px',
      height: '20px',
      margin: '0px 4px 4px 0px'
    },
    startFlex: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }
  };
});

var SiteMarker = function SiteMarker(props) {
  var classes = useStyles(_Theme.default);
  var zoom = props.zoom,
      site = props.site,
      isSelected = props.isSelected,
      popupHrefNew = props.popupHrefNew,
      popupExploreDataProductsButton = props.popupExploreDataProductsButton;
  var siteCode = site.siteCode,
      type = site.type,
      terrain = site.terrain,
      description = site.description,
      latitude = site.latitude,
      longitude = site.longitude,
      stateCode = site.stateCode,
      domainCode = site.domainCode;

  var renderPopup = function renderPopup() {
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
    var terrainTypeSubtitle = "(".concat(terrainSubtitle, ", ").concat(typeSubtitle, ")");

    var terrainIcon = _react.default.createElement(_SiteIcon.default, {
      siteCode: siteCode,
      type: type,
      terrain: terrain,
      width: _Theme.default.spacing(5),
      height: _Theme.default.spacing(5),
      style: {
        marginRight: _Theme.default.spacing(1)
      }
    });

    var target = popupHrefNew ? {
      target: '_blank'
    } : {};

    var siteDetailsButton = _react.default.createElement(_Button.default, _extends({
      className: classes.popupButton,
      variant: "outlined",
      color: "primary",
      endIcon: _react.default.createElement(_InfoOutlined.default, null),
      href: "".concat(SITE_DETAILS_URL_BASE).concat(siteCode)
    }, target), "Site Details");

    var exploreDataProductsButton = popupExploreDataProductsButton ? _react.default.createElement(_Button.default, _extends({
      className: classes.popupButton,
      variant: "outlined",
      color: "primary",
      endIcon: _react.default.createElement(_InsertChartOutlined.default, null),
      href: "".concat(EXPLORE_DATA_PRODUCTS_URL_BASE).concat(siteCode)
    }, target), "Explore Data Products") : null;

    var renderField = function renderField(title, value) {
      return _react.default.createElement("div", null, _react.default.createElement(_Typography.default, {
        variant: "subtitle2"
      }, title), _react.default.createElement(_Typography.default, {
        variant: "body2"
      }, value));
    };

    var stateFieldTitle = stateCode === 'PR' ? 'Territory' : 'State';
    return _react.default.createElement(_reactLeaflet.Popup, {
      className: classes.popup
    }, _react.default.createElement(_Typography.default, {
      variant: "h5",
      gutterBottom: true
    }, "".concat(description, " (").concat(siteCode, ")")), _react.default.createElement("div", {
      className: classes.startFlex,
      style: {
        marginBottom: _Theme.default.spacing(1.5)
      }
    }, terrainIcon, renderField(terrainTypeTitle, terrainTypeSubtitle)), _react.default.createElement(_Grid.default, {
      container: true,
      spacing: 2,
      style: {
        marginBottom: _Theme.default.spacing(1)
      }
    }, _react.default.createElement(_Grid.default, {
      item: true,
      xs: 4
    }, renderField(stateFieldTitle, _states.default[stateCode].name)), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 4
    }, renderField('Domain', "".concat(domainCode, " - ").concat(_domains.default[domainCode].name))), _react.default.createElement(_Grid.default, {
      item: true,
      xs: 4
    }, renderField('Lat./Lon.', "".concat(latitude, ", ").concat(longitude)))), siteDetailsButton, _react.default.createElement("br", null), exploreDataProductsButton);
  };

  var siteLeafletIcon = (0, _SiteIcon.getSiteLeafletIcon)({
    zoom: zoom,
    type: type,
    terrain: terrain,
    isSelected: isSelected
  });
  return siteLeafletIcon ? _react.default.createElement(_reactLeaflet.Marker, {
    key: siteCode,
    position: [latitude, longitude],
    icon: siteLeafletIcon
  }, renderPopup(site)) : null;
};

SiteMarker.propTypes = {
  zoom: _propTypes.default.number,
  isSelected: _propTypes.default.bool,
  popupHrefNew: _propTypes.default.bool,
  popupExploreDataProductsButton: _propTypes.default.bool,
  site: _propTypes.default.shape({
    siteCode: _propTypes.default.string.isRequired,
    description: _propTypes.default.string.isRequired,
    latitude: _propTypes.default.number.isRequired,
    longitude: _propTypes.default.number.isRequired,
    type: _propTypes.default.oneOf(['CORE', 'RELOCATABLE']).isRequired,
    terrain: _propTypes.default.oneOf(['TERRESTRIAL', 'AQUATIC']).isRequired,
    domainCode: _propTypes.default.string.isRequired,
    stateCode: _propTypes.default.string.isRequired
  }).isRequired
};
SiteMarker.defaultProps = {
  zoom: null,
  isSelected: false,
  popupHrefNew: true,
  popupExploreDataProductsButton: true
};
var _default = SiteMarker;
exports.default = _default;