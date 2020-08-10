import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import NeonApi from '../NeonApi/NeonApi';

/**
 Recursive function to parse a deeply nest hierarchy object into a flat key/value object
 where keys are location names and values are objects containing only those location attributes
 the hierarchy affords us (type, description, and parent)
*/
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

const domainIsValid = (domainString) => {
  if (typeof domainString !== 'string') { return false; }
  const domainTest = /^D([0-9]{2})$/.exec(domainString);
  if (!domainTest) { return false; }
  const domainNumber = Number.parseInt(domainTest[1]);
  if (isNaN(domainNumber) || domainNumber < 1 || domainNumber > 20) { return false; }
  return true;
};

const fetchHierarchy = (event) => {
  const domain = event.data || null;

  // Extract locations list and validate
  if (!domainIsValid(domain)) {
    postMessage({
      status: 'error',
      error: 'Domain is not valid. This worker only fetches domain hierarchies.',
    });
    return;
  }

  // Execute Locations REST API hierarchy fetch and pipe results to processing function
  NeonApi.getSiteLocationHierarchyObservable(domain).pipe(
    map((response) => {
      if (response && response.data) {
        const data = {};
        response.data.locationChildHierarchy.forEach((child) => {
          // At the top level we only care about sites and don't want the HQ test site
          if (child.locationType !== 'SITE' || child.locationName === 'HQTW') { return; }
          data[child.locationName] = parseLocationHierarchy(child);
        });
        postMessage({ status: 'success', data });
        return of(true);
      }
      postMessage({ status: 'error', error: 'Malformed response' });
      return of(false);
    }),
    catchError((error) => {
      postMessage({ status: 'error', error });
      return of(false);
    }),
  ).subscribe();
};

// Listen for the locations list
// eslint-disable-next-line
self.addEventListener("message", fetchHierarchy);

// Must have a default export for production build
export default fetchHierarchy;
