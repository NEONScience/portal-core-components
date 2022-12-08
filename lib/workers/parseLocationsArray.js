"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseLocationsArray;
var _paralleljs = _interopRequireDefault(require("../vendor/paralleljs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
  var locationsArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var worker = new _paralleljs.default(locationsArray);
  return worker.spawn(function (inData) {

    // Babel polyfills for worker logic
    function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
    function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
    function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
    function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
    function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

    // REST_LOCATIONS_API returns a lot of properties we don't need, so specify the ones we do.
    var DEFAULT_LOCATION_PROPERTIES_WHITELIST = ['maximumElevation', 'minimumElevation', 'nationalLandCoverDatabase2001', 'plotDimensions', 'plotId', 'plotSize', 'plotSubtype', 'plotType', 'slopeAspect', 'slopeGradient', 'soilTypeOrder,'];

    // A mapping of location property names to aliases to be worked with more easily
    var RENAME_LOCATION_PROPERTIES = {
      nationalLandCoverDatabase2001: 'nlcdClass'
    };

    // Enforce numeric types for select properties
    var NUMERIC_LOCATION_PROPERTIES = ['maximumElevation', 'minimumElevation', 'plotSize', 'slopeAspect', 'slopeGradient'];

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
    var parseLocationProperties = function parseLocationProperties() {
      var inProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var whiteList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_LOCATION_PROPERTIES_WHITELIST;
      // Function to convert a prop key into camelCase or, if applicable, a defined alias
      var cleanPropKey = function cleanPropKey() {
        var inKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var words = inKey.substr(10).replace(/[^A-Za-z0-9_ -]/g, '').replace(/[_-]/g, ' ').toLowerCase().split(' ');
        var newPropKey = words.map(function (word, idx) {
          return idx === 0 ? word : "".concat(word.substr(0, 1).toUpperCase()).concat(word.substr(1));
        }).join('');
        return RENAME_LOCATION_PROPERTIES[newPropKey] || newPropKey;
      };
      // Add any aliases to the whitelist
      var whiteListAliases = whiteList.filter(function (k) {
        return Object.keys(RENAME_LOCATION_PROPERTIES).includes(k);
      }).map(function (k) {
        return RENAME_LOCATION_PROPERTIES[k];
      });
      var fullWhiteList = whiteList.concat(whiteListAliases);
      // outProps is the structure we plan to fill with parsed variables and return
      var outProps = {};
      if (!Array.isArray(inProps) || !inProps.length) {
        return outProps;
      }
      // Main loop over inProps
      inProps.forEach(function (prop) {
        var inPropKeys = Object.keys(prop);
        if (inPropKeys.length !== 2 || !inPropKeys.includes('locationPropertyName') || !inPropKeys.includes('locationPropertyValue') || !(typeof prop.locationPropertyName === 'string')) {
          return;
        }
        var propKey = cleanPropKey(prop.locationPropertyName);
        if (propKey.length && (!fullWhiteList.length || fullWhiteList.includes(propKey))) {
          outProps[propKey] = NUMERIC_LOCATION_PROPERTIES.includes(propKey) ? Number.parseFloat(prop.locationPropertyValue) : prop.locationPropertyValue;
        }
      });
      return outProps;
    };

    /**
       Function to parse data for a single location response object
    */
    var parseLocationData = function parseLocationData() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _data$siteCode = data.siteCode,
        siteCode = _data$siteCode === void 0 ? null : _data$siteCode,
        _data$locationName = data.locationName,
        name = _data$locationName === void 0 ? null : _data$locationName,
        _data$locationType = data.locationType,
        type = _data$locationType === void 0 ? null : _data$locationType,
        _data$locationDescrip = data.locationDescription,
        description = _data$locationDescrip === void 0 ? null : _data$locationDescrip,
        _data$locationDecimal = data.locationDecimalLatitude,
        latitude = _data$locationDecimal === void 0 ? null : _data$locationDecimal,
        _data$locationDecimal2 = data.locationDecimalLongitude,
        longitude = _data$locationDecimal2 === void 0 ? null : _data$locationDecimal2,
        _data$locationPolygon = data.locationPolygon,
        polygon = _data$locationPolygon === void 0 ? null : _data$locationPolygon,
        _data$locationPropert = data.locationProperties,
        locationProperties = _data$locationPropert === void 0 ? {} : _data$locationPropert,
        _data$locationParent = data.locationParent,
        parent = _data$locationParent === void 0 ? null : _data$locationParent,
        children = data.locationChildren;
      var _data$locationElevati = data.locationElevation,
        elevation = _data$locationElevati === void 0 ? null : _data$locationElevati;
      var parsed = _extends({
        name: name,
        type: type,
        description: description,
        siteCode: siteCode,
        parent: parent
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
          coordinates: polygon.coordinates.map(function (c) {
            return [c.latitude, c.longitude];
          })
        };
        // Fill in top-level elevation if not present but geometry with elevation is
        if (elevation === null) {
          var points = 0;
          var sum = polygon.coordinates.reduce(function (acc, cur) {
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
      if (!['latitude', 'longitude'].every(function (k) {
        return Object.keys(parsed).includes(k);
      }) && parsed.geometry && parsed.geometry.coordinates) {
        var _parsed$geometry$coor = parsed.geometry.coordinates.reduce(function (acc, cur) {
          return [acc[0] + cur[0], acc[1] + cur[1]];
        }, [0, 0]).map(function (c) {
          return c / parsed.geometry.coordinates.length;
        });
        var _parsed$geometry$coor2 = _slicedToArray(_parsed$geometry$coor, 2);
        parsed.latitude = _parsed$geometry$coor2[0];
        parsed.longitude = _parsed$geometry$coor2[1];
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
    var outData = {};
    inData.forEach(function (rawLocationData) {
      var locationName = rawLocationData.locationName;
      if (!locationName) {
        return;
      }
      outData[locationName] = parseLocationData(rawLocationData);
    });
    return outData;
  });
}