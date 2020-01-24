import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';

export const TYPES = {
  DATA_PRODUCTS: 'DATA_PRODUCTS',
  SITES: 'SITES',
};

export const DIMENSIONALITIES = {
  ONE: 'ONE',
  MANY: 'MANY',
};

const getQueryBody = (type = '', dimensionality = '', id = null) => {
  let query = '';
  switch (type) {
    case TYPES.DATA_PRODUCTS:
      if (dimensionality === DIMENSIONALITIES.ONE) {
        // TODO: Add support for deeper product data when querying for one
        query = `query Products {
          product (productCode: "${id}") {
            productCode
            productName
            productDescription
            productScienceTeam
            productHasExpanded
            productBasicDescription
            productExpandedDescription
            productPublicationFormatType
            keywords
            themes
            siteCodes {
              siteCode
              availableMonths
            }
          }
        }`;
      } else {
        query = `query Products {
          products {
            productCode
            productName
            productDescription
            productScienceTeam
            productHasExpanded
            productBasicDescription
            productExpandedDescription
            productPublicationFormatType
            keywords
            themes
            siteCodes {
              siteCode
              availableMonths
            }
          }
        }`;
      }
      break;
    case TYPES.SITES:
      if (dimensionality === DIMENSIONALITIES.ONE) {
        // TODO: Add support for deeper site data when querying for one
        query = `query Sites {
          site (siteCode: "${id}") {
            siteCode
            siteDescription
            siteType
            siteLatitude
            siteLongitude
            domainCode
            stateCode
          }
        }`;
      } else {
        query = `query Sites {
          sites {
            siteCode
            siteDescription
            siteType
            siteLatitude
            siteLongitude
            domainCode
            stateCode
          }
        }`;
      }
      break;
    default:
      break;
  }
  return JSON.stringify({ query });
};

const getObservable = (type = null, dimensionality = null, id = null) => {
  if (!TYPES[type] || !DIMENSIONALITIES[dimensionality]) { return of(null); }
  if (dimensionality === DIMENSIONALITIES.ONE && !id) { return of(null); }
  const query = getQueryBody(type, dimensionality, id);
  if (!query.length) { return of(null); }
  return ajax({
    method: 'POST',
    crossDomain: true,
    url: NeonEnvironment.getFullGraphqlPath(),
    headers: { 'Content-Type': 'application/json' },
    body: query,
    responseType: 'json',
  });
};

const NeonGraphQL = {};

NeonGraphQL.getDataProductByCode = code => (
  getObservable(TYPES.DATA_PRODUCTS, DIMENSIONALITIES.ONE, code)
);

NeonGraphQL.getAllDataProducts = () => (
  getObservable(TYPES.DATA_PRODUCTS, DIMENSIONALITIES.MANY)
);

NeonGraphQL.getSiteByCode = code => (
  getObservable(TYPES.SITES, DIMENSIONALITIES.ONE, code)
);

NeonGraphQL.getAllSites = () => (
  getObservable(TYPES.SITES, DIMENSIONALITIES.MANY)
);

Object.freeze(NeonEnvironment);

export default NeonGraphQL;
