import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonApi from '../NeonApi/NeonApi';

export const TYPES = {
  DATA_PRODUCTS: 'DATA_PRODUCTS',
  SITES: 'SITES',
};

export const DIMENSIONALITIES = {
  ONE: 'ONE',
  MANY: 'MANY',
};

const transformQuery = query => JSON.stringify({ query });

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
  return transformQuery(query);
};

const getAjaxRequest = (body, includeToken = true) => {
  const request = {
    method: 'POST',
    crossDomain: true,
    url: NeonEnvironment.getFullGraphqlPath(),
    headers: { 'Content-Type': 'application/json' },
    responseType: 'json',
    body,
  };
  if (includeToken) {
    request.headers = {
      ...request.headers,
      ...NeonApi.getApiTokenHeader(request.headers),
    };
  }
  return request;
};

const getObservable = (query) => {
  if (!query.length) { return of(null); }
  return ajax(getAjaxRequest(query));
};

const getObservableWith = (type = null, dimensionality = null, id = null) => {
  if (!TYPES[type] || !DIMENSIONALITIES[dimensionality]) { return of(null); }
  if (dimensionality === DIMENSIONALITIES.ONE && !id) { return of(null); }
  const query = getQueryBody(type, dimensionality, id);
  return getObservable(query);
};

const NeonGraphQL = {
  getDataProductByCode: code => getObservableWith(TYPES.DATA_PRODUCTS, DIMENSIONALITIES.ONE, code),
  getAllDataProducts: () => getObservableWith(TYPES.DATA_PRODUCTS, DIMENSIONALITIES.MANY),
  getSiteByCode: code => getObservableWith(TYPES.SITES, DIMENSIONALITIES.ONE, code),
  getAllSites: () => getObservableWith(TYPES.SITES, DIMENSIONALITIES.MANY),

  /**
   * Builds a custom GraphQL query
   * @param {string} query - The raw GraphQL query
   * @return The resulting RxJS Observable from the specified query
   */
  getGraphqlQuery: query => getObservable(transformQuery(query)),
  /**
   * Builds a custom GraphQL AjaxRequest
   * @param {string} query - The raw GraphQL query
   * @return The resulting RxJS AjaxRequest
   */
  getGraphqlAjaxRequest: query => getAjaxRequest(transformQuery(query)),
};

Object.freeze(NeonGraphQL);

export default NeonGraphQL;
