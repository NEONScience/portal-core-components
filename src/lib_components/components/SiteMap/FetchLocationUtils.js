import Parallel from 'paralleljs';

import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import NeonApi from '../NeonApi/NeonApi';
import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';

import { parseLocationData } from './SiteMapWorkerSafeUtils';

/**
 Recursive function to parse a deeply nest hierarchy object into a flat key/value object
 where keys are location names and values are objects containing only those location attributes
 the hierarchy affords us (type, description, and parent)
*/
/*
export const parseLocationHierarchy = (inHierarchy, parent = null) => {
  let outHierarchy = {};
  const name = inHierarchy.locationParentHierarchy ? null : inHierarchy.locationName;
  const description = inHierarchy.locationDescription || null;
  const type = inHierarchy.locationType || null;
  if (description.includes('Not Used')) { return outHierarchy; }
  if (name !== null) { outHierarchy[name] = { type, description, parent }; }
  inHierarchy.locationChildHierarchy.forEach((subLocation) => {
    outHierarchy = {
      ...outHierarchy,
      ...parseLocationHierarchy(subLocation, name),
    };
  });
  return outHierarchy;
};
*/

const domainIsValid = (domainString) => {
  if (typeof domainString !== 'string') { return false; }
  const domainTest = /^D([0-9]{2})$/.exec(domainString);
  if (!domainTest) { return false; }
  const domainNumber = Number.parseInt(domainTest[1], 10);
  if (Number.isNaN(domainNumber) || domainNumber < 1 || domainNumber > 20) { return false; }
  return true;
};

export const fetchDomainHierarchy = (domain) => {
  if (!domainIsValid) {
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
  }).then((data) => {
    // Parse the response in a worker
    const worker = new Parallel(data);
    console.log('WORKER', worker);
    return worker.spawn((inData) => {
      const parseLocationHierarchy = (inHierarchy, parent = null) => {
        let outHierarchy = {};
        const name = inHierarchy.locationParentHierarchy ? null : inHierarchy.locationName;
        const description = inHierarchy.locationDescription || null;
        const type = inHierarchy.locationType || null;
        if (description.includes('Not Used')) { return outHierarchy; }
        if (name !== null) { outHierarchy[name] = { type, description, parent }; }
        inHierarchy.locationChildHierarchy.forEach((subLocation) => {
          outHierarchy = {
            ...outHierarchy,
            ...parseLocationHierarchy(subLocation, name),
          };
        });
        return outHierarchy;
      };
      const outData = {};
      inData.locationChildHierarchy.forEach((child) => {
        // At the top level we only care about sites and don't want the HQ test site
        if (child.locationType !== 'SITE' || child.locationName === 'HQTW') { return; }
        outData[child.locationName] = parseLocationHierarchy(child);
      });
      return outData;
    });
  });
};

export const fetchLocations = (locations) => {
  // Extract locations list and validate
  if (
    !Array.isArray(locations) || !locations.length
      || !locations.every(loc => typeof loc === 'string')
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
        const data = {};
        result.response.data.locations.forEach((rawLocationData) => {
          const { locationName } = rawLocationData;
          if (!locationName) { return; }
          data[locationName] = parseLocationData(rawLocationData);
        });
        resolve(data);
        return of(true);
      }),
      // Error
      catchError((error) => {
        reject(new Error(error.message));
        return of(false);
      }),
    ).subscribe();
  });
};
