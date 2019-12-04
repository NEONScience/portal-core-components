'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ExternalHostProductSpecificLinks;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styles = require('@material-ui/core/styles');

var _useMediaQuery = require('@material-ui/core/useMediaQuery');

var _useMediaQuery2 = _interopRequireDefault(_useMediaQuery);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _Theme = require('../Theme/Theme');

var _Theme2 = _interopRequireDefault(_Theme);

var _ExternalHost = require('../ExternalHost/ExternalHost');

var _ExternalHost2 = _interopRequireDefault(_ExternalHost);

var _sites = require('../../static/sites/sites.json');

var _sites2 = _interopRequireDefault(_sites);

var _states = require('../../static/states/states.json');

var _states2 = _interopRequireDefault(_states);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useStyles = (0, _styles.makeStyles)(function (theme) {
  return {
    ulLinkList: {
      paddingLeft: _Theme2.default.spacing(2),
      margin: theme.spacing(0.5, 0)
    }
  };
});

function ExternalHostProductSpecificLinks(props) {
  var classes = useStyles(_Theme2.default);

  var belowSm = (0, _useMediaQuery2.default)(_Theme2.default.breakpoints.only('xs'));
  var belowMd = (0, _useMediaQuery2.default)(_Theme2.default.breakpoints.down('sm'));

  var productCode = props.productCode;


  var externalHost = _ExternalHost2.default.getByProductCode(productCode);
  if (!externalHost || !Object.keys(_ExternalHost2.default.LINK_TYPES).includes(externalHost.linkType)) {
    return null;
  }

  var columnBasis = '25%';
  if (belowMd) {
    columnBasis = '50%';
  }
  if (belowSm) {
    columnBasis = '100%';
  }
  var listDivStyle = { flex: '1 0 ' + columnBasis, padding: _Theme2.default.spacing(0, 2, 2, 0) };

  var renderLinksByProduct = function renderLinksByProduct() {
    if (typeof externalHost.getProductLinks !== 'function') {
      return null;
    }
    return _react2.default.createElement(
      'ul',
      { style: { marginTop: _Theme2.default.spacing(2) } },
      (externalHost.getProductLinks(productCode) || []).map(function (link) {
        return _react2.default.createElement(
          'li',
          { key: link.key },
          link.node
        );
      })
    );
  };

  var renderLinksBySite = function renderLinksBySite() {
    if (typeof externalHost.getSiteLink !== 'function') {
      return null;
    }
    var sitesByStateName = {};
    Object.keys(_sites2.default).sort().forEach(function (siteCode) {
      var stateName = _states2.default[_sites2.default[siteCode].stateCode].name;
      if (!sitesByStateName[stateName]) {
        sitesByStateName[stateName] = [];
      }
      sitesByStateName[stateName].push(siteCode);
    });
    return _react2.default.createElement(
      'div',
      { style: { display: 'flex', flexWrap: 'wrap', marginTop: _Theme2.default.spacing(3) } },
      Object.keys(sitesByStateName).sort().map(function (stateName) {
        var links = sitesByStateName[stateName].map(function (siteCode) {
          return { siteCode: siteCode, link: externalHost.getSiteLink(siteCode, productCode) };
        }).filter(function (entry) {
          return entry.link !== null;
        });
        if (!links.length) {
          return null;
        }
        return _react2.default.createElement(
          'div',
          { key: stateName, style: listDivStyle },
          _react2.default.createElement(
            _Typography2.default,
            { variant: 'h6', key: stateName },
            stateName
          ),
          _react2.default.createElement(
            'ul',
            { className: classes.ulLinkList },
            links.map(function (entry) {
              return _react2.default.createElement(
                'li',
                { key: entry.siteCode },
                entry.link
              );
            })
          )
        );
      })
    );
  };

  switch (externalHost.linkType) {
    case _ExternalHost2.default.LINK_TYPES.BY_PRODUCT:
      return renderLinksByProduct();
    case _ExternalHost2.default.LINK_TYPES.BY_SITE:
      return renderLinksBySite();
    default:
      return null;
  }
}

ExternalHostProductSpecificLinks.propTypes = {
  productCode: _propTypes2.default.string
};

ExternalHostProductSpecificLinks.defaultProps = {
  productCode: null
};