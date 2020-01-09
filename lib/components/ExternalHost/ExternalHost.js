'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Link = require('@material-ui/core/Link');

var _Link2 = _interopRequireDefault(_Link);

var _sites = require('../../static/sites/sites.json');

var _sites2 = _interopRequireDefault(_sites);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HOST_TYPES = {
  ADDITIONAL_DATA: 'ADDITIONAL_DATA', // NEON and host offer different / complementary data
  REFORMATTED_DATA: 'REFORMATTED_DATA', // NEON and host offer same data in different formats
  EXCLUSIVE_DATA: 'EXCLUSIVE_DATA' // NEON does not offer any data, only host has it accessible
};

var LINK_TYPES = {
  BY_SITE: 'BY_SITE', // Show links to external host site page(s)
  BY_PRODUCT: 'BY_PRODUCT' // Show links to external host product page(s)
};

// JZ: Add DATA_SOURCE_TYPE to public API and remove these
// CPC: Since pulling this over from browse-refactor I've expanded it to
//      model additional info on _how_ some extrnal products link out.
//      API updates ideally should model all pertinent information.
var externalProducts = {
  'DP1.00001.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00002.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00003.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00004.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00005.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00006.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00007.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00014.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00022.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00023.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00024.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00033.001': {
    host: 'PHENOCAM'
  },
  'DP1.00034.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00035.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00040.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00041.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00042.001': {
    host: 'PHENOCAM'
  },
  'DP1.00043.001': {
    host: 'AERONET'
  },
  'DP1.00066.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00094.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00098.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00099.001': {
    host: 'AMERIFLUX'
  },
  'DP1.00100.001': {
    host: 'AMERIFLUX'
  },
  'DP1.10038.001': {
    host: 'BOLD',
    searches: [{ query: 'MOSN', title: 'Mosquito sequences DNA barcode' }, { query: 'MOSP', title: 'Mosquito sequences DNA barcode (Prototype Data)' }]
  },
  'DP1.10055.001': {
    host: 'NPN'
  },
  'DP1.10076.001': {
    host: 'BOLD',
    searches: [{ query: 'MAMN', title: 'Small mammal sequences DNA barcode' }, { query: 'MAMPR', title: 'Small mammal sequences DNA barcode (Prototype Data)' }]
  },
  'DP1.10107.001': {
    host: 'MGRAST',
    projects: [{ id: 'mgp13948', title: 'NEON Soil Metagenomes' }, { id: 'mgp3546', title: 'NEON Soils (Prototype Data)' }]
  },
  'DP1.10108.001': {
    host: 'MGRAST',
    projects: [] // unable to find associated project(s)
  },
  'DP1.20002.001': {
    host: 'PHENOCAM'
  },
  'DP1.20105.001': {
    host: 'BOLD',
    searches: [{ query: 'FSHN', title: 'Fish sequences DNA barcode' }]
  },
  'DP1.20212.001': {
    host: 'BOLD',
    searches: [] // unable to find associated search(es)
  },
  'DP1.20126.001': {
    host: 'MGRAST',
    projects: [{ id: 'mgp84670', title: 'NEON Macroinvertebrate DNA Barcodes - 2017' }]
  },
  'DP1.20279.001': {
    host: 'MGRAST',
    projects: [] // unable to find associated project(s)
  },
  'DP1.20280.001': {
    host: 'MGRAST',
    projects: [] // unable to find associated project(s)
  },
  'DP1.20281.001': {
    host: 'MGRAST',
    projects: [] // unable to find associated project(s)
  },
  'DP1.20282.001': {
    host: 'MGRAST',
    projects: [{ id: 'mgp84669', title: 'NEON Surface Water Microbe Marker Gene Sequences - 2014' }]
  },
  'DP1.20221.001': {
    host: 'MGRAST',
    projects: [{ id: 'mgp84672', title: 'NEON Zooplankton DNA Barcodes - 2017' }]
  },
  'DP4.00002.001': {
    host: 'AMERIFLUX'
  },
  'DP4.00007.001': {
    host: 'AMERIFLUX'
  },
  'DP4.00067.001': {
    host: 'AMERIFLUX'
  },
  'DP4.00137.001': {
    host: 'AMERIFLUX'
  },
  'DP4.00200.001': {
    host: 'AMERIFLUX'
  },
  'DP4.00201.001': {
    host: 'AMERIFLUX'
  }
};

var renderExternalLink = function renderExternalLink() {
  var href = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var annotation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return _react2.default.createElement(
    _Link2.default,
    {
      href: href,
      target: '_blank',
      'data-external': annotation,
      rel: 'noopener noreferrer'
    },
    text
  );
};

var externalHosts = {
  AERONET: {
    id: 'AERONET',
    name: 'AERONET',
    projectTitle: 'AERONET (the AErosol RObotic NETwork)',
    url: 'https://aeronet.gsfc.nasa.gov',
    hostType: HOST_TYPES.EXCLUSIVE_DATA,
    linkType: LINK_TYPES.BY_SITE,
    getSiteLink: function getSiteLink() {
      var siteCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var hrefBase = 'http://aeronet.gsfc.nasa.gov/cgi-bin/webtool_inv_v3?stage=3&site=';
      var nonStandardSites = {
        BART: 'NEON_Bartlett',
        CPER: 'NEON-CPER',
        DSNY: 'NEON-Disney',
        HARV: 'NEON_Harvard',
        STER: 'NEON_Sterling'
      };
      var hrefSite = Object.keys(nonStandardSites).includes(siteCode) ? nonStandardSites[siteCode] : 'NEON_' + siteCode;
      return renderExternalLink('' + hrefBase + hrefSite, siteCode + ' - ' + _sites2.default[siteCode].description, 'AERONET');
    }
  },
  AMERIFLUX: {
    id: 'AMERIFLUX',
    name: 'AmeriFlux',
    projectTitle: 'AmeriFlux',
    url: 'https://ameriflux.lbl.gov',
    hostType: HOST_TYPES.REFORMATTED_DATA,
    linkType: LINK_TYPES.BY_SITE,
    getSiteLink: function getSiteLink() {
      var siteCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var siteCodeMapping = {
        GUAN: 'PR-xGU',
        LAJA: 'PR-xLA',
        ABBY: 'US-xAB',
        OAES: 'US-xAE',
        BARR: 'US-xBA',
        BLAN: 'US-xBL',
        BONA: 'US-xBN',
        BART: 'US-xBR',
        CLBJ: 'US-xCL',
        CPER: 'US-xCP',
        DCFS: 'US-xDC',
        DEJU: 'US-xDJ',
        DELA: 'US-xDL',
        DSNY: 'US-xDS',
        GRSM: 'US-xGR',
        HARV: 'US-xHA',
        HEAL: 'US-xHE',
        JERC: 'US-xJE',
        JORN: 'US-xJR',
        KONA: 'US-xKA',
        KONZ: 'US-xKZ',
        LENO: 'US-xLE',
        MOAB: 'US-xMB',
        MLBS: 'US-xML',
        NOGP: 'US-xNG',
        ONAQ: 'US-xNQ',
        NIWO: 'US-xNW',
        PUUM: 'US-xPU',
        RMNP: 'US-xRM',
        ORNL: 'US-xRN',
        OSBS: 'US-xSB',
        SCBI: 'US-xSC',
        SERC: 'US-xSE',
        STER: 'US-xSL',
        SOAP: 'US-xSP',
        SRER: 'US-xSR',
        STEI: 'US-xST',
        TALL: 'US-xTA',
        TEAK: 'US-xTE',
        TOOL: 'US-xTL',
        TREE: 'US-xTR',
        UKFS: 'US-xUK',
        UNDE: 'US-xUN',
        WOOD: 'US-xWD',
        WREF: 'US-xWR',
        YELL: 'US-xYE'
      };
      if (!siteCodeMapping[siteCode]) {
        return null;
      }
      var hrefBase = 'https://ameriflux.lbl.gov/sites/siteinfo';
      var hrefSite = siteCodeMapping[siteCode];
      return renderExternalLink(hrefBase + '/' + hrefSite + '/', siteCode + ' - ' + _sites2.default[siteCode].description, 'AMERIFLUX');
    }
  },
  BOLD: {
    id: 'BOLD',
    name: 'BOLD',
    projectTitle: 'BOLD (Barcode of Life Datasystem)',
    url: 'http://www.barcodinglife.com/',
    hostType: HOST_TYPES.ADDITIONAL_DATA,
    linkType: LINK_TYPES.BY_PRODUCT,
    hostDataVariety: 'Raw sequence data',
    getProductLinks: function getProductLinks() {
      var productCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (!externalProducts[productCode]) {
        return [];
      }
      return externalProducts[productCode].searches.map(function (search) {
        return {
          key: search.query,
          node: renderExternalLink('http://www.boldsystems.org/index.php/Public_SearchTerms?query=' + search.query, search.title, 'BOLD')
        };
      });
    }
  },
  MGRAST: {
    id: 'MGRAST',
    name: 'MG-RAST',
    projectTitle: 'MG-RAST (Metagenomics Rapid Annotation using Subsystem Technology)',
    url: 'https://mg-rast.org',
    hostType: HOST_TYPES.ADDITIONAL_DATA,
    hostDataVariety: 'Raw sequence data',
    linkType: LINK_TYPES.BY_PRODUCT,
    getProductLinks: function getProductLinks() {
      var productCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (!externalProducts[productCode]) {
        return [];
      }
      return externalProducts[productCode].projects.map(function (project) {
        return {
          key: project.id,
          node: renderExternalLink('https://www.mg-rast.org/mgmain.html?mgpage=project&project=' + project.id, project.title, 'MGRAST')
        };
      });
    }
  },
  NPN: {
    id: 'NPN',
    name: 'USA-NPN',
    projectTitle: 'USA National Phenology Network (USA-NPN)',
    url: 'https://www.usanpn.org/usa-national-phenology-network',
    hostType: HOST_TYPES.REFORMATTED_DATA,
    linkType: null
  },
  PHENOCAM: {
    id: 'PHENOCAM',
    name: 'PhenoCam',
    projectTitle: 'The PhenoCam Network',
    url: 'https://phenocam.sr.unh.edu/webcam/about/',
    hostType: HOST_TYPES.EXCLUSIVE_DATA,
    linkType: LINK_TYPES.BY_SITE,
    getSiteLink: function getSiteLink() {
      var siteCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var productCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      var hrefBase = 'https://phenocam.sr.unh.edu/webcam/sites';
      var hrefSite = _sites2.default[siteCode].domainCode + '.' + siteCode + '.' + productCode.split('.').slice(0, 2).join('.');
      return renderExternalLink(hrefBase + '/NEON.' + hrefSite + '/', siteCode + ' - ' + _sites2.default[siteCode].description, 'PHENOCAM');
    }
  }
};
Object.keys(externalHosts).forEach(function (hostId) {
  externalHosts[hostId].renderLink = function () {
    return renderExternalLink(externalHosts[hostId].url, externalHosts[hostId].projectTitle, hostId);
  };
  externalHosts[hostId].renderShortLink = function () {
    return renderExternalLink(externalHosts[hostId].url, externalHosts[hostId].name, hostId);
  };
});

var getByHostId = function getByHostId() {
  var hostId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return externalHosts[hostId] || null;
};

var getByProductCode = function getByProductCode() {
  var productCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return externalProducts[productCode] ? externalHosts[externalProducts[productCode].host] : null;
};

var ExternalHost = {
  HOST_TYPES: HOST_TYPES,
  LINK_TYPES: LINK_TYPES,
  getByHostId: getByHostId,
  getByProductCode: getByProductCode,
  renderExternalLink: renderExternalLink
};

exports.default = ExternalHost;