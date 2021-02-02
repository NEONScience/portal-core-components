import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import NeonApi from '../NeonApi/NeonApi';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';

import parseDomainHierarchy from '../../workers/parseDomainHierarchy';
import parseLocationsArray from '../../workers/parseLocationsArray';

const domainIsValid = (domainString) => {
  if (typeof domainString !== 'string') { return false; }
  const domainTest = /^D([0-9]{2})$/.exec(domainString);
  if (!domainTest) { return false; }
  const domainNumber = Number.parseInt(domainTest[1], 10);
  if (Number.isNaN(domainNumber) || domainNumber < 1 || domainNumber > 20) { return false; }
  return true;
};

export const fetchDomainHierarchy = (domain = '') => {
  if (!domainIsValid(domain)) {
    return Promise.reject(new Error('Domain is not valid'));
  }
  // Execute Locations REST API hierarchy fetch
  return new Promise((resolve, reject) => {
    NeonApi.getSiteLocationHierarchyObservable(domain).pipe(
      map((response) => {
        if (response && response.data) {
          resolve(response.data);
          return of(true);
        }
        reject(new Error('Malformed response'));
        return of(false);
      }),
      catchError((error) => {
        reject(new Error(error.message));
        return of(false);
      }),
    ).subscribe();
  }).then((data) => parseDomainHierarchy(data));
};

export const fetchSingleLocationREST = (location) => {
  if (typeof location !== 'string' || !location.length) {
    return Promise.reject(
      new Error('Location is not valid; must be non-empty string'),
    );
  }
  // Execute REST query and pipe results to processing function
  return new Promise((resolve, reject) => {
    NeonApi.getLocationObservable(location).pipe(
      map((response) => {
        if (response && response.data) {
          resolve([response.data]);
          return of(true);
        }
        reject(new Error('Malformed response'));
        return of(false);
      }),
      catchError((error) => {
        reject(new Error(error.message));
        return of(false);
      }),
    ).subscribe();
  }).then((data) => parseLocationsArray(data)).then((locationMap) => (locationMap || {})[location]);
};

export const fetchManyLocationsGraphQL = (locations) => {
  // Extract locations list and validate
  if (
    !Array.isArray(locations) || !locations.length
      || !locations.every((loc) => typeof loc === 'string')
  ) {
    return Promise.reject(
      new Error('Locations list is not valid; must be non-empty array of only strings'),
    );
  }
  // Execute GraphQL query and pipe results to processing function
  return new Promise((resolve, reject) => {
    NeonGraphQL.getManyLocationsByName(locations).pipe(
      // Success
      map((result) => {
        if (
          !result.response || !result.response.data
            || !Array.isArray(result.response.data.locations)
        ) {
          reject(new Error('Malformed response'));
          return of(false);
        }
        resolve(result.response.data.locations);
        return of(true);
      }),
      // Error
      catchError((error) => {
        reject(new Error(error.message));
        return of(false);
      }),
    ).subscribe();
  }).then((data) => parseLocationsArray(data));
};

// Additional items exported for unit testing
export const getTestableItems = () => (
  process.env.NODE_ENV !== 'test' ? {} : {
    domainIsValid,
  }
);
