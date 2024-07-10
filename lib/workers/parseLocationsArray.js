"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseLocationsArray;
var _paralleljs = _interopRequireDefault(require("../vendor/paralleljs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
   Worker - Parse Locations Array

   This function workerizes the process of taking an array of unparsed location objects from a
   locations GraphQL fetch and generating a map of location names to parsed location objects.

   Example output:
   {
     SRER_022.basePlot.all: { name: ..., type: ..., ... },
     SRER_015.birdGrid.brd: { name: ..., type: ..., ... },
     ...
   }
*/
function parseLocationsArray() {
  let locationsArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  const worker = new _paralleljs.default(locationsArray);
  return worker.spawn(inData => {

    // Babel polyfills for worker logic
    function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

    // REST_LOCATIONS_API returns a lot of properties we don't need, so specify the ones we do.
    const DEFAULT_LOCATION_PROPERTIES_WHITELIST = ['maximumElevation', 'minimumElevation', 'nationalLandCoverDatabase2001', 'plotDimensions', 'plotId', 'plotSize', 'plotSubtype', 'plotType', 'slopeAspect', 'slopeGradient', 'soilTypeOrder,'];

    // A mapping of location property names to aliases to be worked with more easily
    const RENAME_LOCATION_PROPERTIES = {
      nationalLandCoverDatabase2001: 'nlcdClass'
    };

    // Enforce numeric types for select properties
    const NUMERIC_LOCATION_PROPERTIES = ['maximumElevation', 'minimumElevation', 'plotSize', 'slopeAspect', 'slopeGradient'];

    /**
       Function to parse a locationProperties value from a locations API response into an object
       with only white-listed keys present. For example:
       locationProperties": [
         {
           "locationPropertyName": "Value for Foo Bar",
           "locationPropertyValue": 123
         }
       ]
       becomes:
       { fooBar: 123 }
    */
    const parseLocationProperties = function () {
      let inProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      let whiteList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_LOCATION_PROPERTIES_WHITELIST;
      // Function to convert a prop key into camelCase or, if applicable, a defined alias
      const cleanPropKey = function () {
        let inKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        const words = inKey.substr(10).replace(/[^A-Za-z0-9_ -]/g, '').replace(/[_-]/g, ' ').toLowerCase().split(' ');
        const newPropKey = words.map((word, idx) => idx === 0 ? word : "".concat(word.substr(0, 1).toUpperCase()).concat(word.substr(1))).join('');
        return RENAME_LOCATION_PROPERTIES[newPropKey] || newPropKey;
      };
      // Add any aliases to the whitelist
      const whiteListAliases = whiteList.filter(k => Object.keys(RENAME_LOCATION_PROPERTIES).includes(k)).map(k => RENAME_LOCATION_PROPERTIES[k]);
      const fullWhiteList = whiteList.concat(whiteListAliases);
      // outProps is the structure we plan to fill with parsed variables and return
      const outProps = {};
      if (!Array.isArray(inProps) || !inProps.length) {
        return outProps;
      }
      // Main loop over inProps
      inProps.forEach(prop => {
        const inPropKeys = Object.keys(prop);
        if (inPropKeys.length !== 2 || !inPropKeys.includes('locationPropertyName') || !inPropKeys.includes('locationPropertyValue') || !(typeof prop.locationPropertyName === 'string')) {
          return;
        }
        const propKey = cleanPropKey(prop.locationPropertyName);
        if (propKey.length && (!fullWhiteList.length || fullWhiteList.includes(propKey))) {
          outProps[propKey] = NUMERIC_LOCATION_PROPERTIES.includes(propKey) ? Number.parseFloat(prop.locationPropertyValue) : prop.locationPropertyValue;
        }
      });
      return outProps;
    };

    /**
       Function to parse data for a single location response object
    */
    const parseLocationData = function () {
      let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      const {
        siteCode = null,
        locationName: name = null,
        locationType: type = null,
        locationDescription: description = null,
        locationDecimalLatitude: latitude = null,
        locationDecimalLongitude: longitude = null,
        locationPolygon: polygon = null,
        locationProperties = {},
        locationParent: parent = null,
        locationChildren: children
      } = data;
      let {
        locationElevation: elevation = null
      } = data;
      const parsed = _extends({
        name,
        type,
        description,
        siteCode,
        parent
      }, parseLocationProperties(locationProperties));
      if (Array.isArray(children) && children.length) {
        parsed.children = children;
      }
      if (latitude !== null && longitude !== null) {
        parsed.latitude = latitude;
        parsed.longitude = longitude;
      }
      if (polygon !== null) {
        parsed.geometry = {
          coordinates: polygon.coordinates.map(c => [c.latitude, c.longitude])
        };
        // Fill in top-level elevation if not present but geometry with elevation is
        if (elevation === null) {
          let points = 0;
          const sum = polygon.coordinates.reduce((acc, cur) => {
            if (Number.isFinite(cur.elevation)) {
              points += 1;
              acc += cur.elevation; // eslint-disable-line no-param-reassign
            }
            return acc;
          }, 0);
          if (points > 0) {
            elevation = Number.parseFloat((sum / points).toFixed(2), 10);
          }
        }
      }
      if (elevation !== null) {
        parsed.elevation = elevation;
      }
      // Have geometry but no lat/lon - calculate a basic lat/lon center for icon positioning
      if (!['latitude', 'longitude'].every(k => Object.keys(parsed).includes(k)) && parsed.geometry && parsed.geometry.coordinates) {
        [parsed.latitude, parsed.longitude] = parsed.geometry.coordinates.reduce((acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]], [0, 0]).map(c => c / parsed.geometry.coordinates.length);
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

    /**
       Worker main loop - parse each entry in the locations array
    */
    const outData = {};
    inData.forEach(rawLocationData => {
      const {
        locationName
      } = rawLocationData;
      if (!locationName) {
        return;
      }
      outData[locationName] = parseLocationData(rawLocationData);
    });
    return outData;
  });
}