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

var _ExternalHost = _interopRequireDefault(require("../ExternalHost/ExternalHost"));

var _sites = _interopRequireDefault(require("../../static/sites/sites.json"));

var _states = _interopRequireDefault(require("../../static/states/states.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  var belowSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('xs'));
  var belowMd = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('sm'));
  var productCode = props.productCode;

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
    Object.keys(_sites.default).sort().forEach(function (siteCode) {
      var stateName = _states.default[_sites.default[siteCode].stateCode].name;

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
          link: externalHost.getSiteLink(siteCode, productCode)
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