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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const useStyles = (0, _styles.makeStyles)(theme => ({
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
}));
function ExternalHostProductSpecificLinks(props) {
  const classes = useStyles(_Theme.default);
  const {
    productCode,
    siteCodes
  } = props;
  const [{
    data: neonContextData,
    isFinal: neonContextIsFinal
  }] = _NeonContext.default.useNeonContextState();
  const {
    sites: allSites,
    states: allStates
  } = neonContextData;
  const belowSm = (0, _useMediaQuery.default)(_Theme.default.breakpoints.only('xs'));
  const belowMd = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('sm'));
  const belowLg = (0, _useMediaQuery.default)(_Theme.default.breakpoints.down('md'));
  const externalHost = _ExternalHost.default.getByProductCode(productCode);
  if (!externalHost || !Object.keys(_ExternalHost.default.LINK_TYPES).includes(externalHost.linkType)) {
    return null;
  }
  let columnBasis = '25%';
  if (belowLg) {
    columnBasis = '33.33%';
  }
  if (belowMd) {
    columnBasis = '50%';
  }
  if (belowSm) {
    columnBasis = '100%';
  }
  const listDivStyle = {
    flex: "1 0 ".concat(columnBasis),
    padding: _Theme.default.spacing(0, 2, 2, 0)
  };
  const renderLinksByProduct = () => {
    if (typeof externalHost.getProductLinks !== 'function') {
      return null;
    }
    return /*#__PURE__*/_react.default.createElement("ul", {
      style: {
        marginTop: _Theme.default.spacing(3),
        marginBottom: _Theme.default.spacing(0.75)
      }
    }, (externalHost.getProductLinks(productCode) || []).map(link => /*#__PURE__*/_react.default.createElement("li", {
      key: link.key
    }, link.node)));
  };
  const renderLinksBySite = () => {
    if (typeof externalHost.getSiteLink !== 'function') {
      return null;
    }
    // What sites are available? If a list was not provided then show them all.
    // eslint-disable-next-line react/prop-types
    const filterByAvailability = Array.isArray(siteCodes) && siteCodes.length;
    let availableSites = allSites;
    if (filterByAvailability) {
      availableSites = Object.fromEntries(
      // eslint-disable-next-line react/prop-types
      siteCodes.map(siteCode => [siteCode, allSites[siteCode]]));
    }
    // Sites still loading; render loading message
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
    }
    // Sites failed to load; render failure
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
    }
    // Sites loaded; build a structure of available sites grouped by state and render links as such
    const sitesByStateName = {};
    Object.keys(availableSites).sort().forEach(siteCode => {
      const stateName = allStates[allSites[siteCode].stateCode].name;
      if (!sitesByStateName[stateName]) {
        sitesByStateName[stateName] = [];
      }
      sitesByStateName[stateName].push(siteCode);
    });
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.siteLinksContainer
    }, Object.keys(sitesByStateName).sort().map(stateName => {
      const links = sitesByStateName[stateName]
      // eslint-disable-next-line react/prop-types
      .filter(siteCode => !filterByAvailability || siteCodes.includes(siteCode)).map(siteCode => ({
        siteCode,
        link: externalHost.getSiteLink(allSites, siteCode, productCode)
      })).filter(entry => entry.link !== null);
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
      }, links.map(entry => /*#__PURE__*/_react.default.createElement("li", {
        key: entry.siteCode
      }, entry.link))));
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