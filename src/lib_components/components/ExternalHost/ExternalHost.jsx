import React from 'react';

import Link from '@material-ui/core/Link';

import allSites from '../../static/sites/sites.json';

const HOST_TYPES = {
  ADDITIONAL_DATA: 'ADDITIONAL_DATA', // NEON and host offer different / complementary data
  REFORMATTED_DATA: 'REFORMATTED_DATA', // NEON and host offer same data in different formats
  EXCLUSIVE_DATA: 'EXCLUSIVE_DATA', // NEON does not offer any data, only host has it accessible
};

const LINK_TYPES = {
  BY_SITE: 'BY_SITE', // Show links to external host site page(s)
  BY_PRODUCT: 'BY_PRODUCT', // Show links to external host product page(s)
};

// JZ: Add DATA_SOURCE_TYPE to public API and remove these
// CPC: Since pulling this over from browse-refactor I've expanded it to
//      model additional info on _how_ some extrnal products link out.
//      API updates ideally should model all pertinent information.
const externalProducts = {
  'DP1.00001.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00002.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00003.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00004.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00005.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00006.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00007.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00014.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00022.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00023.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00024.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00033.001': {
    host: 'PHENOCAM',
  },
  'DP1.00034.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00035.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00040.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00041.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00042.001': {
    host: 'PHENOCAM',
  },
  'DP1.00043.001': {
    host: 'AERONET',
  },
  'DP1.00066.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00094.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00098.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00099.001': {
    host: 'AMERIFLUX',
  },
  'DP1.00100.001': {
    host: 'AMERIFLUX',
  },
  'DP1.10038.001': {
    host: 'BOLD',
    searches: [
      { query: 'MOSN', title: 'Mosquito sequences DNA barcode' },
      { query: 'MOSP', title: 'Mosquito sequences DNA barcode (Prototype Data)' },
    ],
  },
  'DP1.10055.001': {
    host: 'NPN',
  },
  'DP1.10076.001': {
    host: 'BOLD',
    searches: [
      { query: 'MAMN', title: 'Small mammal sequences DNA barcode' },
      { query: 'MAMPR', title: 'Small mammal sequences DNA barcode (Prototype Data)' },
    ],
  },
  'DP1.10107.001': {
    host: 'MGRAST',
    projects: [
      { id: 'mgp13948', title: 'NEON Soil Metagenomes' },
      { id: 'mgp3546', title: 'NEON Soils (Prototype Data)' },
    ],
  },
  'DP1.10108.001': {
    host: 'MGRAST',
    projects: [], // unable to find associated project(s)
  },
  'DP1.20002.001': {
    host: 'PHENOCAM',
  },
  'DP1.20105.001': {
    host: 'BOLD',
    searches: [
      { query: 'FSHN', title: 'Fish sequences DNA barcode' },
    ],
  },
  'DP1.20212.001': {
    host: 'BOLD',
    searches: [], // unable to find associated search(es)
  },
  'DP1.20126.001': {
    host: 'MGRAST',
    projects: [
      { id: 'mgp84670', title: 'NEON Macroinvertebrate DNA Barcodes - 2017' },
    ],
  },
  'DP1.20279.001': {
    host: 'MGRAST',
    projects: [], // unable to find associated project(s)
  },
  'DP1.20280.001': {
    host: 'MGRAST',
    projects: [], // unable to find associated project(s)
  },
  'DP1.20281.001': {
    host: 'MGRAST',
    projects: [], // unable to find associated project(s)
  },
  'DP1.20282.001': {
    host: 'MGRAST',
    projects: [
      { id: 'mgp84669', title: 'NEON Surface Water Microbe Marker Gene Sequences - 2014' },
    ],
  },
  'DP1.20221.001': {
    host: 'MGRAST',
    projects: [
      { id: 'mgp84672', title: 'NEON Zooplankton DNA Barcodes - 2017' },
    ],
  },
  'DP4.00002.001': {
    host: 'AMERIFLUX',
  },
  'DP4.00007.001': {
    host: 'AMERIFLUX',
  },
  'DP4.00067.001': {
    host: 'AMERIFLUX',
  },
  'DP4.00137.001': {
    host: 'AMERIFLUX',
  },
  'DP4.00200.001': {
    host: 'AMERIFLUX',
  },
  'DP4.00201.001': {
    host: 'AMERIFLUX',
  },
};

const renderExternalLink = (href = '', text = '', annotation = '') => (
  <Link
    href={href}
    target="_blank"
    data-external={annotation}
    rel="noopener noreferrer"
  >
    {text}
  </Link>
);

const externalHosts = {
  AERONET: {
    id: 'AERONET',
    name: 'AeroNet',
    projectTitle: 'AERONET (The AErosol RObotic NETwork) Project',
    url: 'https://aeronet.gsfc.nasa.gov',
    hostType: HOST_TYPES.EXCLUSIVE_DATA,
    linkType: LINK_TYPES.BY_SITE,
    getSiteLink: (siteCode = '') => {
      const hrefBase = 'http://aeronet.gsfc.nasa.gov/cgi-bin/webtool_inv_v3?stage=3&site=';
      const nonStandardSites = {
        BART: 'NEON_Bartlett',
        CPER: 'NEON-CPER',
        DSNY: 'NEON-Disney',
        HARV: 'NEON_Harvard',
        STER: 'NEON_Sterling',
      };
      const hrefSite = Object.keys(nonStandardSites).includes(siteCode)
        ? nonStandardSites[siteCode]
        : `NEON_${siteCode}`;
      return renderExternalLink(`${hrefBase}${hrefSite}`, `${siteCode} - ${allSites[siteCode].description}`, 'AERONET');
    },
  },
  AMERIFLUX: {
    id: 'AMERIFLUX',
    name: 'AmeriFlux',
    projectTitle: 'AmeriFlux Project',
    url: 'https://ameriflux.lbl.gov',
    hostType: HOST_TYPES.REFORMATTED_DATA,
    linkType: LINK_TYPES.BY_SITE,
    getSiteLink: (siteCode = '') => {
      const siteCodeMapping = {
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
        YELL: 'US-xYE',
      };
      if (!siteCodeMapping[siteCode]) { return null; }
      const hrefBase = 'https://ameriflux.lbl.gov/sites/siteinfo';
      const hrefSite = siteCodeMapping[siteCode];
      return renderExternalLink(`${hrefBase}/${hrefSite}/`, `${siteCode} - ${allSites[siteCode].description}`, 'AMERIFLUX');
    },
  },
  BOLD: {
    id: 'BOLD',
    name: 'BOLD',
    projectTitle: 'Barcode of Life Datasystem (BOLD) Project',
    url: 'http://www.barcodinglife.com/',
    hostType: HOST_TYPES.ADDITIONAL_DATA,
    linkType: LINK_TYPES.BY_PRODUCT,
    hostDataVariety: 'Raw sequence data',
    getProductLinks: (productCode = '') => {
      if (!externalProducts[productCode]) { return []; }
      return externalProducts[productCode].searches.map(search => ({
        key: search.query,
        node: renderExternalLink(
          `http://www.boldsystems.org/index.php/Public_SearchTerms?query=${search.query}`,
          search.title,
          'BOLD',
        ),
      }));
    },
  },
  MGRAST: {
    id: 'MGRAST',
    name: 'MG-RAST',
    projectTitle: 'MG-RAST (Metagenomics Rapid Annotation using Subsystem Technology) Project',
    url: 'https://mg-rast.org',
    hostType: HOST_TYPES.ADDITIONAL_DATA,
    hostDataVariety: 'Raw sequence data',
    linkType: LINK_TYPES.BY_PRODUCT,
    getProductLinks: (productCode = '') => {
      if (!externalProducts[productCode]) { return []; }
      return externalProducts[productCode].projects.map(project => ({
        key: project.id,
        node: renderExternalLink(
          `https://www.mg-rast.org/mgmain.html?mgpage=project&project=${project.id}`,
          project.title,
          'MGRAST',
        ),
      }));
    },
  },
  NPN: {
    id: 'NPN',
    name: 'NPN',
    projectTitle: 'USA National Phenology Network (USA-NPN)',
    url: 'https://www.usanpn.org/usa-national-phenology-network',
    hostType: HOST_TYPES.REFORMATTED_DATA,
    linkType: null,
  },
  PHENOCAM: {
    id: 'PHENOCAM',
    name: 'PhenoCam',
    projectTitle: 'PhenoCam Project',
    url: 'https://phenocam.sr.unh.edu/webcam/about/',
    hostType: HOST_TYPES.EXCLUSIVE_DATA,
    linkType: LINK_TYPES.BY_SITE,
    getSiteLink: (siteCode = '', productCode = '') => {
      const hrefBase = 'https://phenocam.sr.unh.edu/webcam/sites';
      const hrefSite = `${allSites[siteCode].domainCode}.${siteCode}.${productCode.split('.').slice(0, 2).join('.')}`;
      return renderExternalLink(`${hrefBase}/NEON.${hrefSite}/`, `${siteCode} - ${allSites[siteCode].description}`, 'PHENOCAM');
    },
  },
};
Object.keys(externalHosts).forEach((hostId) => {
  externalHosts[hostId].renderLink = () => renderExternalLink(
    externalHosts[hostId].url,
    externalHosts[hostId].projectTitle,
    hostId,
  );
  externalHosts[hostId].renderShortLink = () => renderExternalLink(
    externalHosts[hostId].url,
    externalHosts[hostId].name,
    hostId,
  );
});

const getByHostId = (hostId = '') => (
  externalHosts[hostId] || null
);

const getByProductCode = (productCode = '') => (
  externalProducts[productCode] ? externalHosts[externalProducts[productCode].host] : null
);

const ExternalHost = {
  HOST_TYPES,
  LINK_TYPES,
  getByHostId,
  getByProductCode,
  renderExternalLink,
};

export default ExternalHost;
