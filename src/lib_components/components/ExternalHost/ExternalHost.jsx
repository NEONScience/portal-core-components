import React from 'react';

import Link from '@material-ui/core/Link';

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
  'DP1.10020.001': {
    host: 'BOLD',
    searches: [
      { query: 'BETN', title: 'Ground beetle sequences DNA barcode' },
      { query: 'BETP', title: 'Ground beetle sequences DNA barcode (Prototype Data)' },
    ],
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
  'DP1.20002.001': {
    host: 'PHENOCAM',
  },
  'DP1.20105.001': {
    host: 'BOLD',
    searches: [
      { query: 'FSHN', title: 'Fish sequences DNA barcode' },
    ],
  },
  'DP2.00006.001': {
    host: 'AMERIFLUX',
    allowNoAvailability: true,
  },
  'DP2.00020.001': {
    host: 'AMERIFLUX',
    allowNoAvailability: true,
  },
  'DP2.00023.001': {
    host: 'AMERIFLUX',
    allowNoAvailability: true,
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

const renderExternalHostLink = (href = '', text = '', host = '', productCode = 'n/a') => (
  <Link
    href={href}
    target="_blank"
    data-gtm-external-host={host}
    data-gtm-product-code={productCode}
    rel="noopener noreferrer"
  >
    {text}
  </Link>
);

const externalHosts = {
  AERONET: {
    id: 'AERONET',
    name: 'AERONET',
    projectTitle: 'AERONET (the AErosol RObotic NETwork)',
    url: 'https://aeronet.gsfc.nasa.gov',
    hostType: HOST_TYPES.EXCLUSIVE_DATA,
    linkType: LINK_TYPES.BY_SITE,
    getSiteLink: (allSites = {}, siteCode = '', productCode = 'n/a') => {
      const hrefBase = 'https://aeronet.gsfc.nasa.gov/cgi-bin/data_display_aod_v3?site=';
      const nonStandardSites = {
        BART: 'NEON_Bartlett',
        CPER: 'NEON-CPER',
        DSNY: 'NEON-Disney',
        HARV: 'NEON_Harvard',
        SOAP: 'NEON-SoaprootSaddle',
        STER: 'NEON_Sterling',
      };
      const hrefSite = Object.keys(nonStandardSites).includes(siteCode)
        ? nonStandardSites[siteCode]
        : `NEON_${siteCode}`;
      const description = Object.keys(allSites).length
        ? ` - ${allSites[siteCode].description}`
        : '';
      const text = `${siteCode}${description}`;
      return renderExternalHostLink(`${hrefBase}${hrefSite}`, text, 'AERONET', productCode);
    },
  },
  AMERIFLUX: {
    id: 'AMERIFLUX',
    name: 'AmeriFlux',
    projectTitle: 'AmeriFlux',
    url: 'https://ameriflux.lbl.gov',
    hostType: HOST_TYPES.REFORMATTED_DATA,
    linkType: LINK_TYPES.BY_SITE,
    getSiteLink: (allSites = {}, siteCode = '', productCode = 'n/a') => {
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
      const description = Object.keys(allSites).length
        ? ` - ${allSites[siteCode].description}`
        : '';
      const text = `${siteCode} - ${description}`;
      return renderExternalHostLink(`${hrefBase}/${hrefSite}/`, text, 'AMERIFLUX', productCode);
    },
  },
  BOLD: {
    id: 'BOLD',
    name: 'BOLD',
    projectTitle: 'BOLD (Barcode of Life Datasystem)',
    url: 'https://boldsystems.org/',
    hostType: HOST_TYPES.ADDITIONAL_DATA,
    linkType: LINK_TYPES.BY_PRODUCT,
    hostDataVariety: 'Raw sequence data',
    getProductLinks: (productCode = '') => {
      if (!externalProducts[productCode]) { return []; }
      return externalProducts[productCode].searches.map((search) => ({
        key: search.query,
        node: renderExternalHostLink(
          `https://portal.boldsystems.org/recordset/${search.query}`,
          search.title,
          'BOLD',
          productCode,
        ),
      }));
    },
  },
  NPN: {
    id: 'NPN',
    name: 'USA-NPN',
    projectTitle: 'USA National Phenology Network (USA-NPN)',
    url: 'https://www.usanpn.org/usa-national-phenology-network',
    hostType: HOST_TYPES.REFORMATTED_DATA,
    linkType: null,
  },
  PHENOCAM: {
    id: 'PHENOCAM',
    name: 'PhenoCam',
    projectTitle: 'The PhenoCam Network',
    url: 'https://phenocam.nau.edu/webcam/about/',
    hostType: HOST_TYPES.EXCLUSIVE_DATA,
    linkType: LINK_TYPES.BY_SITE,
    getSiteLink: (allSites = {}, siteCode = '', productCode = '') => {
      if (!allSites[siteCode]) { return null; }
      const hrefBase = 'https://phenocam.nau.edu/webcam/sites';
      const hrefSite = `${allSites[siteCode].domainCode}.${siteCode}.${productCode.split('.').slice(0, 2).join('.')}`;
      const text = `${siteCode} - ${allSites[siteCode].description}`;
      return renderExternalHostLink(`${hrefBase}/NEON.${hrefSite}/`, text, 'PHENOCAM', productCode);
    },
  },
};
Object.keys(externalHosts).forEach((hostId) => {
  externalHosts[hostId].renderLink = (productCode = 'n/a') => renderExternalHostLink(
    externalHosts[hostId].url,
    externalHosts[hostId].projectTitle,
    hostId,
    productCode,
  );
  externalHosts[hostId].renderShortLink = (productCode = 'n/a') => renderExternalHostLink(
    externalHosts[hostId].url,
    externalHosts[hostId].name,
    hostId,
    productCode,
  );
});

const getByHostId = (hostId = '') => (
  externalHosts[hostId] || null
);

const getByProductCode = (productCode = '') => (
  externalProducts[productCode] ? externalHosts[externalProducts[productCode].host] : null
);

const getProductSpecificInfo = (productCode = '') => (
  externalProducts[productCode] ? externalProducts[productCode] : null
);

const ExternalHost = {
  HOST_TYPES,
  LINK_TYPES,
  getByHostId,
  getByProductCode,
  getProductSpecificInfo,
  renderExternalHostLink,
};

export default ExternalHost;
