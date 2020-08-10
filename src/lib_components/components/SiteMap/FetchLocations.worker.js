import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';

import { parseLocationData } from './SiteMapWorkerSafeUtils';

const fetchLocations = (event) => {
  const locations = event.data || {};

  // Extract locations list and validate
  if (
    !Array.isArray(locations) || !locations.length
      || !locations.every(loc => typeof loc === 'string')
  ) {
    postMessage({
      status: 'error',
      error: 'Locations list is not valid; must be non-empty array of only strings',
    });
    return;
  }

  // Execute GraphQL query and pipe results to processing function
  const obs = NeonGraphQL.getManyLocationsByName(locations).pipe(
    // Success
    map((result) => {
      if (
        !result.response || !result.response.data || !Array.isArray(result.response.data.locations)
      ) {
        postMessage({ status: 'error', error: 'Malformed response' });
        return of(false);
      }
      const data = {};
      result.response.data.locations.forEach((rawLocationData) => {
        const { locationName } = rawLocationData;
        if (!locationName) { return; }
        data[locationName] = parseLocationData(rawLocationData);
      })
      postMessage({ status: 'success', data });
      return of(true);
    }),
    // Error
    catchError((error) => {
      postMessage({ status: 'error', error });
      return of(false);
    }),
  );
  obs.subscribe();
};

// Listen for the locations list
// eslint-disable-next-line
self.addEventListener("message", fetchLocations);

// Must have a default export for production build
export default fetchLocations;
