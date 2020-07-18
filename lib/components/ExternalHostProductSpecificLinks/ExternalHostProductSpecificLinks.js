"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ExternalHostProductSpecificLinks;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

var _ExternalHost = _interopRequireDefault(require("../ExternalHost/ExternalHost"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    ulLinkList: {
      paddingLeft: theme.spacing(2),
      margin: theme.spacing(0.5, 0),
      fontSize: '0.85rem',
      '& > li': {
        marginBottom: theme.spacing(0.5)
      }
    }
  };
});

function ExternalHostProductSpecificLinks(props) {
  var classes = useStyles(_Theme.default);
  var productCode = props.productCode;

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      neonContextData = _NeonContext$useNeonC2[0].data;

  var allSites = neonContextData.sites,
      allStates = neonContextData.states;
  var belowSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('xs'));
  var belowMd = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('sm'));
  var belowLg = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('md'));

  var externalHost = _ExternalHost.default.getByProductCode(productCode);

  if (!externalHost || !Object.keys(_ExternalHost.default.LINK_TYPES).includes(externalHost.linkType)) {
    return null;
  }

  var columnBasis = '25%';

  if (belowLg) {
    columnBasis = '33.33%';
  }

  if (belowMd) {
    columnBasis = '50%';
  }

  if (belowSm) {
    columnBasis = '100%';
  }

  var listDivStyle = {
    flex: "1 0 ".concat(columnBasis),
    padding: _Theme.default.spacing(0, 2, 2, 0)
  };

  var renderLinksByProduct = function renderLinksByProduct() {
    if (typeof externalHost.getProductLinks !== 'function') {
      return null;
    }

    return /*#__PURE__*/_react.default.createElement("ul", {
      style: {
        marginTop: _Theme.default.spacing(3),
        marginBottom: _Theme.default.spacing(0.75)
      }
    }, (externalHost.getProductLinks(productCode) || []).map(function (link) {
      return /*#__PURE__*/_react.default.createElement("li", {
        key: link.key
      }, link.node);
    }));
  };

  var renderLinksBySite = function renderLinksBySite() {
    if (typeof externalHost.getSiteLink !== 'function') {
      return null;
    }

    var sitesByStateName = {};
    Object.keys(allSites).sort().forEach(function (siteCode) {
      var stateName = allStates[allSites[siteCode].stateCode].name;

      if (!sitesByStateName[stateName]) {
        sitesByStateName[stateName] = [];
      }

      sitesByStateName[stateName].push(siteCode);
    });
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: _Theme.default.spacing(3)
      }
    }, Object.keys(sitesByStateName).sort().map(function (stateName) {
      var links = sitesByStateName[stateName].map(function (siteCode) {
        return {
          siteCode: siteCode,
          link: externalHost.getSiteLink(allSites, siteCode, productCode)
        };
      }).filter(function (entry) {
        return entry.link !== null;
      });

      if (!links.length) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement("div", {
        key: stateName,
        style: listDivStyle
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle2",
        key: stateName
      }, stateName), /*#__PURE__*/_react.default.createElement("ul", {
        className: classes.ulLinkList
      }, links.map(function (entry) {
        return /*#__PURE__*/_react.default.createElement("li", {
          key: entry.siteCode
        }, entry.link);
      })));
    }));
  };

  switch (externalHost.linkType) {
    case _ExternalHost.default.LINK_TYPES.BY_PRODUCT:
      return renderLinksByProduct();

    case _ExternalHost.default.LINK_TYPES.BY_SITE:
      return renderLinksBySite();

    default:
      return null;
  }
}

ExternalHostProductSpecificLinks.propTypes = {
  productCode: _propTypes.default.string
};
ExternalHostProductSpecificLinks.defaultProps = {
  productCode: null
};