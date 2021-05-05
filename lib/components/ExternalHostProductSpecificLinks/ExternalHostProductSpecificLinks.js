"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ExternalHostProductSpecificLinks;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styles = require("@material-ui/core/styles");

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _CircularProgress = _interopRequireDefault(require("@material-ui/core/CircularProgress"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));

var _Theme = _interopRequireDefault(require("../Theme/Theme"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

var _ExternalHost = _interopRequireDefault(require("../ExternalHost/ExternalHost"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    siteLinksContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      marginTop: theme.spacing(3)
    },
    siteLinksLoadingContainer: {
      marginTop: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
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
  var productCode = props.productCode,
      siteCodes = props.siteCodes;

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      _NeonContext$useNeonC3 = _NeonContext$useNeonC2[0],
      neonContextData = _NeonContext$useNeonC3.data,
      neonContextIsFinal = _NeonContext$useNeonC3.isFinal;

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
    } // What sites are available? If a list was not provided then show them all.
    // eslint-disable-next-line react/prop-types


    var filterByAvailability = Array.isArray(siteCodes) && siteCodes.length;
    var availableSites = allSites;

    if (filterByAvailability) {
      availableSites = Object.fromEntries( // eslint-disable-next-line react/prop-types
      siteCodes.map(function (siteCode) {
        return [siteCode, allSites[siteCode]];
      }));
    } // Sites still loading; render loading message


    if (!neonContextIsFinal) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: classes.siteLinksLoadingContainer
      }, /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
        size: 36,
        style: {
          margin: _Theme.default.spacing(4, 0)
        }
      }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body1",
        style: {
          marginBottom: _Theme.default.spacing(4)
        }
      }, "Loading sites..."));
    } // Sites failed to load; render failure


    if (!Object.keys(allSites).length) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: classes.siteLinksLoadingContainer
      }, /*#__PURE__*/_react.default.createElement(_Warning.default, {
        fontSize: "large",
        style: {
          margin: _Theme.default.spacing(4, 0),
          color: _Theme.default.palette.error.main
        }
      }), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "body1",
        style: {
          marginBottom: _Theme.default.spacing(4)
        }
      }, "Sites failed to load."));
    } // Sites loaded; build a structure of available sites grouped by state and render links as such


    var sitesByStateName = {};
    Object.keys(availableSites).sort().forEach(function (siteCode) {
      var stateName = allStates[allSites[siteCode].stateCode].name;

      if (!sitesByStateName[stateName]) {
        sitesByStateName[stateName] = [];
      }

      sitesByStateName[stateName].push(siteCode);
    });
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.siteLinksContainer
    }, Object.keys(sitesByStateName).sort().map(function (stateName) {
      var links = sitesByStateName[stateName] // eslint-disable-next-line react/prop-types
      .filter(function (siteCode) {
        return !filterByAvailability || siteCodes.includes(siteCode);
      }).map(function (siteCode) {
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
  productCode: _propTypes.default.string,
  siteCodes: _propTypes.default.arrayOf(_propTypes.default.string)
};
ExternalHostProductSpecificLinks.defaultProps = {
  productCode: null,
  siteCodes: null
};