import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import NeonApi from '../NeonApi/NeonApi';
import { isStringNonEmpty } from '../../util/typeUtil';

export const TYPES = {
  DATA_PRODUCTS: 'DATA_PRODUCTS',
  SITES: 'SITES',
  LOCATIONS: 'LOCATIONS',
};

export const DIMENSIONALITIES = {
  ONE: 'ONE',
  MANY: 'MANY',
};

const transformQuery = (query) => JSON.stringify({ query });

const getAvailableReleaseClause = (args) => {
  if (!args) return '';
  const hasRelease = isStringNonEmpty(args.release);
  let availableReleases = '';
  if ((args.includeAvailableReleases === true) && !hasRelease) {
    availableReleases = `availableReleases {
      release
      availableMonths
    }`;
  }
  return availableReleases;
};

const getQueryBody = (type = '', dimensionality = '', args = {}) => {
  let query = '';
  switch (type) {
    case TYPES.DATA_PRODUCTS:
      if (dimensionality === DIMENSIONALITIES.ONE) {
        // TODO: Add support for deeper product data when querying for one
        const releaseArgument = !args.release ? '' : `, release: "${args.release}"`;
        const availableReleases = getAvailableReleaseClause(args);
        query = `query Products {
          product (productCode: "${args.productCode}"${releaseArgument}) {
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
              ${availableReleases}
            }
            releases {
              release
              generationDate
              url
            }
          }
        }`;
      } else {
        const releaseArgument = !args.release ? '' : `(release: "${args.release}")`;
        const availableReleases = getAvailableReleaseClause(args);
        query = `query Products {
          products ${releaseArgument}{
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
              ${availableReleases}
            }
            releases {
              release
              generationDate
              url
            }
          }
        }`;
      }
      break;

    case TYPES.SITES:
      if (dimensionality === DIMENSIONALITIES.ONE) {
        // TODO: Add support for deeper site data when querying for one
        query = `query Sites {
          site (siteCode: "${args.siteCode}") {
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

    case TYPES.LOCATIONS:
      if (dimensionality === DIMENSIONALITIES.ONE) {
        query = `query Location {
          location(name: "${args.locationName}") {
            locationName
            locationDescription
            locationType
            domainCode
            siteCode
            locationDecimalLatitude
            locationDecimalLongitude
            locationElevation
            locationPolygon {
              coordinates {
                latitude
                longitude
                elevation
              }
            }
            locationProperties {
              locationPropertyName
              locationPropertyValue
            }
          }
        }`;
      } else {
        query = `query findLocations {
          locations: findLocations(
            query: {
              locationNames: ${JSON.stringify(args.locationNames)}
            }
          ) {
            locationName
            locationDescription
            locationParent
            locationType
            domainCode
            siteCode
            locationDecimalLatitude
            locationDecimalLongitude
            locationElevation
            locationPolygon {
              coordinates {
                latitude
                longitude
                elevation
              }
            }
            locationProperties {
              locationPropertyName
              locationPropertyValue
            }
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

const getObservableWith = (type = null, dimensionality = null, args = null) => {
  const argsHaveAtLeastOneDefinedKey = (
    args !== null && typeof args === 'object' && Object.keys(args).length > 0
      && Object.keys(args).some((key) => (typeof args[key] !== 'undefined'))
  );
  // Type and Dimensionality must exist
  if (!TYPES[type] || !DIMENSIONALITIES[dimensionality]) { return of(null); }
  // Dimensionality of ONE always requires some argument (looking up one thing)
  if (dimensionality === DIMENSIONALITIES.ONE && !argsHaveAtLeastOneDefinedKey) { return of(null); }
  const query = getQueryBody(type, dimensionality, args);
  return getObservable(query);
};

const NeonGraphQL = {
  getDataProductByCode: (productCode, release) => getObservableWith(
    TYPES.DATA_PRODUCTS,
    DIMENSIONALITIES.ONE,
    { productCode, release },
  ),
  getAllDataProducts: (release, includeAvailableReleases = false) => getObservableWith(
    TYPES.DATA_PRODUCTS,
    DIMENSIONALITIES.MANY,
    { release, includeAvailableReleases },
  ),
  getSiteByCode: (siteCode) => getObservableWith(
    TYPES.SITES,
    DIMENSIONALITIES.ONE,
    { siteCode },
  ),
  getAllSites: () => getObservableWith(
    TYPES.SITES,
    DIMENSIONALITIES.MANY,
  ),
  getLocationByName: (locationName) => getObservableWith(
    TYPES.LOCATIONS,
    DIMENSIONALITIES.ONE,
    { locationName },
  ),
  getManyLocationsByName: (locationNames = []) => {
    if (
      !Array.isArray(locationNames) || !locationNames.length
        || !locationNames.every((name) => typeof name === 'string')
    ) { return of(null); }
    return getObservableWith(
      TYPES.LOCATIONS,
      DIMENSIONALITIES.MANY,
      { locationNames },
    );
  },

  /**
   * Builds a custom GraphQL query
   * @param {string} query - The raw GraphQL query
   * @return The resulting RxJS Observable from the specified query
   */
  getGraphqlQuery: (query) => getObservable(transformQuery(query)),
  /**
   * Builds a custom GraphQL AjaxRequest
   * @param {string} query - The raw GraphQL query
   * @return The resulting RxJS AjaxRequest
   */
  getGraphqlAjaxRequest: (query) => getAjaxRequest(transformQuery(query)),
};

Object.freeze(NeonGraphQL);

export default NeonGraphQL;
