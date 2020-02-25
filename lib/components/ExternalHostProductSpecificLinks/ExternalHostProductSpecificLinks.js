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

var _NeonPage = _interopRequireDefault(require("../NeonPage/NeonPage"));

var _ExternalHost = _interopRequireDefault(require("../ExternalHost/ExternalHost"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    ulLinkList: {
      paddingLeft: _Theme.default.spacing(2),
      margin: theme.spacing(0.5, 0)
    }
  };
});

function ExternalHostProductSpecificLinks(props) {
  var classes = useStyles(_Theme.default);
  var productCode = props.productCode;

  var _NeonPage$useNeonCont = _NeonPage.default.useNeonContextState(),
      _NeonPage$useNeonCont2 = _slicedToArray(_NeonPage$useNeonCont, 1),
      neonContextData = _NeonPage$useNeonCont2[0].data;

  var allSites = neonContextData.sites,
      allStates = neonContextData.states;
  var belowSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('xs'));
  var belowMd = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('sm'));

  var externalHost = _ExternalHost.default.getByProductCode(productCode);

  if (!externalHost || !Object.keys(_ExternalHost.default.LINK_TYPES).includes(externalHost.linkType)) {
    return null;
  }

  var columnBasis = '25%';

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

    return _react.default.createElement("ul", {
      style: {
        marginTop: _Theme.default.spacing(2)
      }
    }, (externalHost.getProductLinks(productCode) || []).map(function (link) {
      return _react.default.createElement("li", {
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
    return _react.default.createElement("div", {
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

      return _react.default.createElement("div", {
        key: stateName,
        style: listDivStyle
      }, _react.default.createElement(_Typography.default, {
        variant: "h6",
        key: stateName
      }, stateName), _react.default.createElement("ul", {
        className: classes.ulLinkList
      }, links.map(function (entry) {
        return _react.default.createElement("li", {
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