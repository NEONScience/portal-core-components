import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import NeonGraphQL from '../NeonGraphQL/NeonGraphQL';

let FEATURES = {};

const DEFAULT_LOCATION_PROPERTIES_WHITELIST = [
  'maximumElevation',
  'minimumElevation',
  'nationalLandCoverDatabase2001',
  'plotDimensions',
  'plotId',
  'plotSize',
  'plotSubtype',
  'plotType',
  'slopeAspect',
  'slopeGradient',
  'soilTypeOrder,',
];

/**
 Function to parse a locationProperties value from a locations API response into an object with
 only white-listed keys present. For example:
   locationProperties": [
     {
       "locationPropertyName": "Value for Foo Bar",
       "locationPropertyValue": 123
     }
   ]
  becomes:
   { fooBar: 123 }
*/
const parseLocationProperties = (
  inProps = [],
  whiteList = DEFAULT_LOCATION_PROPERTIES_WHITELIST,
) => {
  const outProps = {};
  const cleanPropKey = (inKey = '') => {
    const words = inKey.substr(10)
      .replace(/[^A-Za-z0-9_ -]/g, '')
      .replace(/[_-]/g, ' ')
      .toLowerCase()
      .split(' ');
    return words.map((word, idx) => (
      idx === 0 ? word : `${word.substr(0, 1).toUpperCase()}${word.substr(1)}`
    )).join('');
  };
  if (!Array.isArray(inProps) || !inProps.length) { return outProps; }
  inProps.forEach((prop) => {
    const inPropKeys = Object.keys(prop);
    if (
      inPropKeys.length !== 2
        || !inPropKeys.includes('locationPropertyName')
        || !inPropKeys.includes('locationPropertyValue')
        || !(typeof prop.locationPropertyName === 'string')
    ) { return; }
    const propKey = cleanPropKey(prop.locationPropertyName);
    if (propKey.length && (!whiteList.length || whiteList.includes(propKey))) {
      outProps[propKey] = prop.locationPropertyValue;
    }
  });
  return outProps;
};

/**
   Function to parse data for a single location response object
*/
export const parseLocationData = (data = {}) => {
  const {
    siteCode = null,
    locationName: name = null,
    locationType: type = null,
    locationDescription: description = null,
    locationDecimalLatitude: latitude = null,
    locationDecimalLongitude: longitude = null,
    locationElevation: elevation = null,
    locationPolygon: polygon = null,
    locationProperties = {},
    locationParent: parent = null,
  } = data;
  const parsed = {
    name,
    type,
    description,
    siteCode,
    parent,
    ...parseLocationProperties(locationProperties),
  };
  if (elevation !== null) { parsed.elevation = elevation; }
  if (latitude !== null && longitude !== null) {
    parsed.latitude = latitude;
    parsed.longitude = longitude;
  }
  if (polygon !== null) {
    parsed.geometry = {
      coordinates: polygon.coordinates.map(c => [c.latitude, c.longitude]),
    };
  }
  // Have geometry but no lat/lon - calculate a basic lat/lon center for icon positioning
  if (
    !['latitude', 'longitude'].every(k => Object.keys(parsed).includes(k))
      && parsed.geometry && parsed.geometry.coordinates
  ) {
    [parsed.latitude, parsed.longitude] = parsed.geometry.coordinates
      .reduce((acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]], [0, 0])
      .map(c => c / parsed.geometry.coordinates.length);
  }
  // Special case: set plotType TOWER_SOIL_PLOTS (not present in locations API)
  // The 'SOIL_PLOT' type maps to FEATURES.TOWER_SOIL_PLOTS.matchLocationType in SiteMapUtils.js
  // We don't pull in FEATURES here because that's all we need, and SiteMapUtils.js is not
  // worker-safe (due to importing Leaflet dependencies that are not worker-safe).
  if (parsed.type === 'SOIL_PLOT') {
    parsed.plotType = 'tower';
  }
  return parsed;
};

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
self.addEventListener("message", fetchLocations);
