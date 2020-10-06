"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _uniqueId = _interopRequireDefault(require("lodash/uniqueId"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _NeonApi = _interopRequireDefault(require("../NeonApi/NeonApi"));

var _NeonContext = _interopRequireDefault(require("../NeonContext/NeonContext"));

var _FetchLocationUtils = require("./FetchLocationUtils");

var _SiteMapUtils = require("./SiteMapUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Derive the selected status of a given boundary (US state or NEON domain). This should run
// every time the list of selected sites changes. It regenerates selectedStates and
// selectedDomains in state to each contain a key/value lookup where the key is the boundary code
// (state code or domain code) and the value is either 'total' (all sites selected) or 'partial'
// (some sites selected). If no sites are selected for the boundary it is omitted from the map.
var deriveBoundarySelections = function deriveBoundarySelections(state) {
  var _derived;

  var derive = function derive(featureKey) {
    if (!state.neonContextHydrated || !state.featureData[_SiteMapUtils.FEATURE_TYPES.BOUNDARIES][featureKey]) {
      return {};
    }

    var validSet = state.selection.validSet;
    var selectedBoundaries = {};
    Object.keys(state.featureData[_SiteMapUtils.FEATURE_TYPES.BOUNDARIES][featureKey]).forEach(function (boundaryCode) {
      var boundarySitesSet = state.featureData[_SiteMapUtils.FEATURE_TYPES.BOUNDARIES][featureKey][boundaryCode].sites || new Set();
      var selectableSites = !validSet ? boundarySitesSet : new Set(_toConsumableArray(boundarySitesSet).filter(function (siteCode) {
        return validSet.has(siteCode);
      }));

      var intersection = _toConsumableArray(selectableSites).filter(function (x) {
        return state.selection.set.has(x);
      });

      if (!intersection.length) {
        return;
      }

      selectedBoundaries[boundaryCode] = intersection.length === selectableSites.size ? _SiteMapUtils.SELECTION_PORTIONS.TOTAL : _SiteMapUtils.SELECTION_PORTIONS.PARTIAL;
    });
    return selectedBoundaries;
  };

  return _extends({}, state, {
    selection: _extends({}, state.selection, {
      derived: (_derived = {}, _defineProperty(_derived, _SiteMapUtils.FEATURES.STATES.KEY, derive(_SiteMapUtils.FEATURES.STATES.KEY)), _defineProperty(_derived, _SiteMapUtils.FEATURES.DOMAINS.KEY, derive(_SiteMapUtils.FEATURES.DOMAINS.KEY)), _derived)
    })
  });
}; // Returns a boolean indicating whether an item is selectable


var isSelectable = function isSelectable(item) {
  var validSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!validSet) {
    return true;
  }

  return validSet.has(item);
}; // Filters a set down to only selectable items


var getSelectableSet = function getSelectableSet(set) {
  var validSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!validSet) {
    return set;
  }

  return new Set(_toConsumableArray(set).filter(function (item) {
    return isSelectable(item, validSet);
  }));
}; // Set the valid flag for selection based on current limits. Empty selections are always invalid.


var validateSelection = function validateSelection(state) {
  var valid = false;
  var _state$selection = state.selection,
      limit = _state$selection.limit,
      set = _state$selection.set,
      validSet = _state$selection.validSet;

  if (set.size > 0 && (!validSet || _toConsumableArray(set).every(function (item) {
    return validSet.has(item);
  }))) {
    valid = true;

    if (Number.isFinite(limit) && set.size !== limit || Array.isArray(limit) && (set.size < limit[0] || set.size > limit[1])) {
      valid = false;
    }
  }

  return _extends({}, state, {
    selection: _extends({}, state.selection, {
      valid: valid
    })
  });
}; // NOTE: DISTRIBUTED_BASE_PLOTS and TOWER_BASE_PLOTS have the same locationType. We must fetch
// them all for a gicen site in order to differentiate them. This impacts how we structure fetches
// for base plot features as well as how we turn those fetch results into feater data. This func
// is used to consistently inform when to trigger that behavior for a given feature.


var basePlots = [_SiteMapUtils.FEATURES.DISTRIBUTED_BASE_PLOTS.KEY, _SiteMapUtils.FEATURES.TOWER_BASE_PLOTS.KEY];

var isBasePlot = function isBasePlot(featureKey) {
  return basePlots.includes(featureKey);
};
/**
   Reducer
*/


var zoomIsValid = function zoomIsValid(zoom) {
  return Number.isInteger(zoom) && zoom >= _SiteMapUtils.MAP_ZOOM_RANGE[0] && zoom <= _SiteMapUtils.MAP_ZOOM_RANGE[1];
};

var centerIsValid = function centerIsValid(center) {
  return Array.isArray(center) && center.length === 2 && center.every(function (v) {
    return typeof v === 'number';
  });
}; // Creates fetch objects with an AWAITING_CALL status based on current state.
// New fetches are created for all fetchable feature data found to be active (the feature is
// available and visible), within the current bounds of the map, and not already fetched.
// Optionally include required sites to consider "in bounds" (useful for when a focus location
// is a site feature like a plot far from the site center so the site itself may not be seen as
// "in bounds").


var calculateFeatureDataFetches = function calculateFeatureDataFetches(state) {
  var requiredSites = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var sitesInMap = (0, _SiteMapUtils.calculateLocationsInMap)(state.sites, state.map.bounds, true, 0.06);
  var requiredSitesArray = [];

  if (requiredSites) {
    requiredSitesArray = (Array.isArray(requiredSites) ? requiredSites : [requiredSites]).filter(function (siteCode) {
      return Object.keys(state.sites).includes(siteCode);
    });
  }

  requiredSitesArray.forEach(function (siteCode) {
    if (!sitesInMap.includes(siteCode)) {
      sitesInMap.push(siteCode);
    }
  });

  if (!sitesInMap.length) {
    return state;
  }

  var domainsInMap = new Set();
  sitesInMap.filter(function (siteCode) {
    return state.sites[siteCode];
  }).forEach(function (siteCode) {
    domainsInMap.add(state.sites[siteCode].domainCode);
  });

  var newState = _extends({}, state); // Domain-location hierarchy fetches for individual domains
  // Only fetch if bounds are not null as that way we can trust sitesInMap is not all the sites


  if (state.map.zoom >= _SiteMapUtils.SITE_LOCATION_HIERARCHIES_MIN_ZOOM && state.map.bounds) {
    var hierarchiesSource = _SiteMapUtils.FEATURE_DATA_SOURCES.REST_LOCATIONS_API;
    var hierarchiesType = _SiteMapUtils.FEATURE_TYPES.SITE_LOCATION_HIERARCHIES;
    Array.from(domainsInMap).forEach(function (domainCode) {
      if (newState.featureDataFetches[hierarchiesSource][hierarchiesType][domainCode]) {
        return;
      }

      newState.featureDataFetches[hierarchiesSource][hierarchiesType][domainCode] = _SiteMapUtils.FETCH_STATUS.AWAITING_CALL; // eslint-disable-line max-len

      newState.overallFetch.expected += 1;
      newState.overallFetch.pendingHierarchy += 1;
      newState.featureDataFetchesHasAwaiting = true;
    });
  } // Feature fetches - ARCGIS_ASSET_API


  Object.keys(_SiteMapUtils.FEATURES).filter(function (featureKey) {
    return _SiteMapUtils.FEATURES[featureKey].dataSource === _SiteMapUtils.FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API && state.filters.features.available[featureKey] && state.filters.features.visible[featureKey];
  }).forEach(function (featureKey) {
    var dataSource = _SiteMapUtils.FEATURES[featureKey].dataSource;
    sitesInMap.forEach(function (siteCode) {
      if (newState.featureDataFetches[dataSource][featureKey][siteCode]) {
        return;
      }

      newState.featureDataFetches[dataSource][featureKey][siteCode] = _SiteMapUtils.FETCH_STATUS.AWAITING_CALL;
      newState.overallFetch.expected += 1;
      newState.featureDataFetchesHasAwaiting = true;
    });
  }); // Feature fetches - REST_LOCATIONS_API

  Object.keys(_SiteMapUtils.FEATURES) // Only look at available+visible features that get fetched and have a location type match
  .filter(function (featureKey) {
    return _SiteMapUtils.FEATURES[featureKey].dataSource === _SiteMapUtils.FEATURE_DATA_SOURCES.REST_LOCATIONS_API && _SiteMapUtils.FEATURES[featureKey].matchLocationType && state.filters.features.available[featureKey] && state.filters.features.visible[featureKey];
  }).forEach(function (featureKey) {
    var _FEATURES$featureKey = _SiteMapUtils.FEATURES[featureKey],
        dataSource = _FEATURES$featureKey.dataSource,
        matchLocationType = _FEATURES$featureKey.matchLocationType; // For each feature that warrants fetching; loop through the sites in the map

    sitesInMap // Domain hierarchy must be completed in order to generate subsequent fetches
    // (only true if site location hierarchy feature data is there)
    .filter(function (siteCode) {
      return state.featureData.SITE_LOCATION_HIERARCHIES[siteCode];
    }).forEach(function (siteCode) {
      if (!newState.featureDataFetches[dataSource][featureKey][siteCode]) {
        newState.featureDataFetches[dataSource][featureKey][siteCode] = {};
      } // Extract matching location IDs from the hierarchy and set them as fetches awaiting call


      var hierarchy = state.featureData.SITE_LOCATION_HIERARCHIES[siteCode];
      var locationIsMatch = matchLocationType instanceof RegExp ? function (locationKey) {
        return matchLocationType.test(hierarchy[locationKey].type);
      } : function (locationKey) {
        return hierarchy[locationKey].type === matchLocationType;
      };
      Object.keys(hierarchy).filter(locationIsMatch).forEach(function (locationKey) {
        if (newState.featureDataFetches[dataSource][featureKey][siteCode][locationKey]) {
          return;
        }

        newState.featureDataFetches[dataSource][featureKey][siteCode][locationKey] = _SiteMapUtils.FETCH_STATUS.AWAITING_CALL; // eslint-disable-line max-len

        newState.overallFetch.expected += 1;
        newState.featureDataFetchesHasAwaiting = true;
      });
    });
  }); // Feature fetches - GRAPHQL_LOCATIONS_API

  /* eslint-disable max-len */
  // Start by looping through all minZoom levels associated with any GraphQL Locations API features
  // Our goal is to build a single fetch containing a flat list of all locations for this site
  // that are now visible, clustered by minZoom level.

  Object.keys(_SiteMapUtils.GRAPHQL_LOCATIONS_API_CONSTANTS.MINZOOM_TO_FEATURES_MAP).filter(function (minZoom) {
    return state.map.zoom >= minZoom;
  }).forEach(function (minZoom) {
    // Loop through all available and visible features at this minZoom level
    _SiteMapUtils.GRAPHQL_LOCATIONS_API_CONSTANTS.MINZOOM_TO_FEATURES_MAP[minZoom].forEach(function (featureKey) {
      if (!state.filters.features.available[featureKey] || !state.filters.features.visible[featureKey]) {
        return;
      }

      var _FEATURES$featureKey2 = _SiteMapUtils.FEATURES[featureKey],
          dataSource = _FEATURES$featureKey2.dataSource,
          matchLocationType = _FEATURES$featureKey2.matchLocationType,
          matchLocationName = _FEATURES$featureKey2.matchLocationName;
      var companionFeatureKey = !isBasePlot(featureKey) ? null : basePlots.find(function (key) {
        return key !== featureKey;
      });

      if (!newState.featureDataFetches[dataSource][minZoom]) {
        newState.featureDataFetches[dataSource][minZoom] = {};
      } // We've narrowed to minZoom and feature, now narrow to only the sites in the map


      sitesInMap // Domain hierarchy must be completely loaded in order to generate subsequent fetches
      .filter(function (siteCode) {
        return state.featureData.SITE_LOCATION_HIERARCHIES[siteCode];
      }) // Site must have meaningful features to fetch at this minZoom level
      .filter(function (siteCode) {
        return state.sites[siteCode].terrain === _SiteMapUtils.FEATURES[featureKey].siteTerrain;
      }).forEach(function (siteCode) {
        // Initialize the fetch structure for the dataSource / minZoom / siteCode
        if (!newState.featureDataFetches[dataSource][minZoom][siteCode]) {
          newState.featureDataFetches[dataSource][minZoom][siteCode] = {
            features: Object.fromEntries(_SiteMapUtils.GRAPHQL_LOCATIONS_API_CONSTANTS.MINZOOM_TO_FEATURES_MAP[minZoom].filter(function (fKey) {
              return state.sites[siteCode].terrain === _SiteMapUtils.FEATURES[fKey].siteTerrain;
            }).map(function (fKey) {
              return [fKey, {
                fetchId: null,
                locations: []
              }];
            })),
            fetches: {}
          }; // If this is a base plot feature then look to see if already handled

          if (isBasePlot(featureKey) && companionFeatureKey) {
            var companionMinZoom = _SiteMapUtils.GRAPHQL_LOCATIONS_API_CONSTANTS.FEATURES_TO_MINZOOM_MAP[companionFeatureKey];

            if (companionMinZoom && newState.featureDataFetches[dataSource][companionMinZoom][siteCode]) {
              var companionFetchId = newState.featureDataFetches[dataSource][companionMinZoom][siteCode].features[companionFeatureKey];
              newState.featureDataFetches[dataSource][minZoom][siteCode].features[featureKey] = companionFetchId;
            }
          }
        }

        var _newState$featureData = newState.featureDataFetches[dataSource][minZoom][siteCode],
            features = _newState$featureData.features,
            fetches = _newState$featureData.fetches; // Stop if this feature already has a fetchID

        if (features[featureKey].fetchId !== null) {
          return;
        } // Find or create a fetch that's awaiting call with a unique ID


        var awaitingFetchKey = Object.keys(fetches).find(function (fetchKey) {
          return fetches[fetchKey].status === _SiteMapUtils.FETCH_STATUS.AWAITING_CALL;
        });

        if (!awaitingFetchKey) {
          awaitingFetchKey = (0, _uniqueId.default)('f');
          newState.featureDataFetches[dataSource][minZoom][siteCode].fetches[awaitingFetchKey] = {
            status: _SiteMapUtils.FETCH_STATUS.AWAITING_CALL,
            locations: []
          };
          newState.overallFetch.expected += 1;
          newState.featureDataFetchesHasAwaiting = true;
        } // Map this feature / site / zoom level / feature type to the unique fetch key


        newState.featureDataFetches[dataSource][minZoom][siteCode].features[featureKey].fetchId = awaitingFetchKey;

        if (isBasePlot(featureKey) && companionFeatureKey) {
          if (!newState.featureDataFetches[dataSource][minZoom][siteCode].features[companionFeatureKey]) {
            newState.featureDataFetches[dataSource][minZoom][siteCode].features[companionFeatureKey] = {
              fetchId: null,
              locations: []
            };
          }

          newState.featureDataFetches[dataSource][minZoom][siteCode].features[companionFeatureKey].fetchId = awaitingFetchKey;
        } // Harvest locations from the hierarchy for this feature/site; append to awaiting fetch
        // Matching function varies depending on how the feature is set up.


        var hierarchy = state.featureData.SITE_LOCATION_HIERARCHIES[siteCode];

        var locationIsMatch = function locationIsMatch() {
          return false;
        };

        if (matchLocationType instanceof RegExp) {
          locationIsMatch = function locationIsMatch(locationKey) {
            return matchLocationType.test(hierarchy[locationKey].type);
          };
        }

        if (typeof matchLocationType === 'string') {
          locationIsMatch = function locationIsMatch(locationKey) {
            return hierarchy[locationKey].type === matchLocationType;
          };
        }

        if (matchLocationName instanceof RegExp) {
          locationIsMatch = function locationIsMatch(locationKey) {
            return matchLocationName.test(locationKey);
          };
        }

        Object.keys(hierarchy).filter(locationIsMatch).forEach(function (locationKey) {
          newState.featureDataFetches[dataSource][minZoom][siteCode].fetches[awaitingFetchKey].locations.push(locationKey);
          newState.featureDataFetches[dataSource][minZoom][siteCode].features[featureKey].locations.push(locationKey);

          if (isBasePlot(featureKey) && companionFeatureKey) {
            newState.featureDataFetches[dataSource][minZoom][siteCode].features[companionFeatureKey].locations.push(locationKey);
          }
        });
      });
    });
  });
  /* eslint-enable max-len */

  return newState;
};

var reducer = function reducer(state, action) {
  var setMethod = null;
  var calculateFetchesRequiredSites = null;

  var newState = _extends({}, state);

  var validSet = state.selection.validSet; // Increment the completed count for overall fetch and, if completed and expected are now equal,
  // reset both (so that subsequent batches of fetches can give an accurate progress metric).

  var completeOverallFetch = function completeOverallFetch() {
    newState.overallFetch.completed += 1;

    if (newState.overallFetch.expected === newState.overallFetch.completed) {
      newState.overallFetch.expected = 0;
      newState.overallFetch.completed = 0;
      newState.overallFetch.pendingHierarchy = 0;
    }
  }; // Returns a boolean describing whether a fetch status was updated


  var setFetchStatusFromAction = function setFetchStatusFromAction(status) {
    if (!Object.keys(_SiteMapUtils.FETCH_STATUS).includes(status) || status === _SiteMapUtils.FETCH_STATUS.AWAITING_CALL) {
      return false;
    }

    var dataSource = action.dataSource;

    if (!_SiteMapUtils.FEATURE_DATA_SOURCES[dataSource]) {
      return false;
    } // ARCGIS_ASSETS_API


    if (dataSource === _SiteMapUtils.FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API) {
      var featureKey = action.featureKey,
          siteCode = action.siteCode,
          data = action.data;

      if (!_SiteMapUtils.FEATURES[featureKey]) {
        return false;
      }

      if (!newState.featureDataFetches[dataSource] || !newState.featureDataFetches[dataSource][featureKey] || !newState.featureDataFetches[dataSource][featureKey][siteCode]) {
        return false;
      }

      newState.featureDataFetches[dataSource][featureKey][siteCode] = status; // If the status is SUCCESS and the action has data, also commit the data

      if (status === _SiteMapUtils.FETCH_STATUS.SUCCESS && data) {
        var featureType = _SiteMapUtils.FEATURES[featureKey].type;
        newState.featureData[featureType][featureKey][siteCode] = data;
      }

      return true;
    } // REST_LOCATIONS_API


    if (dataSource === _SiteMapUtils.FEATURE_DATA_SOURCES.REST_LOCATIONS_API) {
      var _featureKey = action.featureKey,
          _siteCode = action.siteCode,
          location = action.location,
          _data = action.data;

      if (!_SiteMapUtils.FEATURES[_featureKey]) {
        return false;
      }

      var _featureType = _SiteMapUtils.FEATURES[_featureKey].type;

      if (!newState.featureDataFetches[dataSource][_featureKey][_siteCode][location]) {
        return false;
      }

      newState.featureDataFetches[dataSource][_featureKey][_siteCode][location] = status; // If the status is SUCCESS and the action has data, also commit the data

      if (status === _SiteMapUtils.FETCH_STATUS.SUCCESS && _data) {
        if (!newState.featureData[_featureType][_featureKey]) {
          newState.featureData[_featureType][_featureKey] = {};
        }

        if (!newState.featureData[_featureType][_featureKey][_siteCode]) {
          newState.featureData[_featureType][_featureKey][_siteCode] = {};
        }

        newState.featureData[_featureType][_featureKey][_siteCode][location] = _extends({}, _data, {
          siteCode: _siteCode,
          featureKey: _featureKey,
          name: location,
          domainCode: state.sites[_siteCode].domainCode,
          stateCode: state.sites[_siteCode].stateCode
        });
      }
    } // GRAPHQL_LOCATIONS_API


    if (dataSource === _SiteMapUtils.FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API) {
      var minZoom = action.minZoom,
          _siteCode2 = action.siteCode,
          fetchId = action.fetchId,
          _data2 = action.data;

      if (!newState.featureDataFetches[dataSource] || !newState.featureDataFetches[dataSource][minZoom] || !newState.featureDataFetches[dataSource][minZoom][_siteCode2] || !newState.featureDataFetches[dataSource][minZoom][_siteCode2].fetches[fetchId]) {
        return false;
      }

      newState.featureDataFetches[dataSource][minZoom][_siteCode2].fetches[fetchId].status = status; // If the status is SUCCESS and the action has data, also commit the data

      if (status === _SiteMapUtils.FETCH_STATUS.SUCCESS && _data2) {
        // Make a map of location names to feature keys for this fetchId
        var features = newState.featureDataFetches[dataSource][minZoom][_siteCode2].features;
        var locNamesToFeatures = {};
        Object.keys(features).filter(function (featureKey) {
          return features[featureKey].fetchId === fetchId;
        }).forEach(function (featureKey) {
          features[featureKey].locations.forEach(function (locName) {
            // For *_BASE_PLOT features, which both have the same API locationType, determine
            // which locations go to which feature by looking at the plotType in the data
            if (isBasePlot(featureKey)) {
              var plotType = _data2[locName].plotType;

              if (plotType === 'tower') {
                locNamesToFeatures[locName] = _SiteMapUtils.FEATURES.TOWER_BASE_PLOTS.KEY;
              } else if (plotType === 'distributed') {
                locNamesToFeatures[locName] = _SiteMapUtils.FEATURES.DISTRIBUTED_BASE_PLOTS.KEY;
              }

              return;
            } // All other features get a simple mapping


            locNamesToFeatures[locName] = featureKey;
          });
        });
        Object.keys(_data2).forEach(function (locName) {
          var featureKey = locNamesToFeatures[locName];

          if (!_SiteMapUtils.FEATURES[featureKey]) {
            return;
          }

          var _FEATURES$featureKey3 = _SiteMapUtils.FEATURES[featureKey],
              featureType = _FEATURES$featureKey3.type,
              parentDataFeatureKey = _FEATURES$featureKey3.parentDataFeatureKey,
              matchLocationCoordinateMap = _FEATURES$featureKey3.matchLocationCoordinateMap; // This location is supplemental data to another location, so pipe it to the parent record

          if (parentDataFeatureKey) {
            var coordIdx = matchLocationCoordinateMap.findIndex(function (match) {
              return locName.endsWith(match);
            });

            if (coordIdx === -1) {
              return;
            }

            var parentDataFeatureType = _SiteMapUtils.FEATURES[parentDataFeatureKey].type;

            if (!newState.featureData[parentDataFeatureType][parentDataFeatureKey][_siteCode2]) {
              newState.featureData[parentDataFeatureType][parentDataFeatureKey][_siteCode2] = {};
            }

            var _data2$locName = _data2[locName],
                parentLocName = _data2$locName.parent,
                latitude = _data2$locName.latitude,
                longitude = _data2$locName.longitude;

            if (!parentLocName) {
              return;
            }

            var parentSiteData = newState.featureData[parentDataFeatureType][parentDataFeatureKey][_siteCode2]; // eslint-disable-line max-len

            if (!parentSiteData[parentLocName]) {
              parentSiteData[parentLocName] = {};
            } // Initialize the geometry.coordinates with as many empty points as expressed by the map


            if (!parentSiteData[parentLocName].geometry) {
              parentSiteData[parentLocName].geometry = {
                coordinates: []
              };

              for (var c = 0; c < matchLocationCoordinateMap.length; c += 1) {
                parentSiteData[parentLocName].geometry.coordinates.push([]);
              }
            }

            parentSiteData[parentLocName].geometry.coordinates[coordIdx] = [latitude, longitude];
            return;
          } // This is a "normal" location that is not part of another point-based location


          if (!newState.featureData[featureType][featureKey][_siteCode2]) {
            newState.featureData[featureType][featureKey][_siteCode2] = {};
          } // Geometry may be loaded by another sub-location so look for that and don't blow it away!


          var geometry = !newState.featureData[featureType][featureKey][_siteCode2][locName] || !newState.featureData[featureType][featureKey][_siteCode2][locName].geometry ? null : _extends({}, newState.featureData[featureType][featureKey][_siteCode2][locName].geometry); // eslint-disable-line max-len

          newState.featureData[featureType][featureKey][_siteCode2][locName] = _extends({}, _data2[locName], {
            featureKey: featureKey,
            domainCode: state.sites[_siteCode2].domainCode,
            stateCode: state.sites[_siteCode2].stateCode
          });

          if (geometry) {
            newState.featureData[featureType][featureKey][_siteCode2][locName].geometry = geometry;
          } // Base plot features: also pull sampling module data from the hierarchy


          if (isBasePlot(featureKey)) {
            var hierarchy = newState.featureData[_SiteMapUtils.FEATURE_TYPES.SITE_LOCATION_HIERARCHIES][_siteCode2]; // eslint-disable-line max-len

            var basePlot = locName.replace('all', '').replace('.', '\\.');
            var basePlotRegex = new RegExp("^".concat(basePlot, "([a-z]{3})$"));
            newState.featureData[featureType][featureKey][_siteCode2][locName].samplingModules = Object.keys(hierarchy).reduce(function (acc, cur) {
              var match = cur.match(basePlotRegex);

              if (match) {
                acc.push(match[1]);
              }

              return acc;
            }, []).filter(function (k) {
              return k !== 'all' && k !== 'mfb';
            }).sort(function (a, b) {
              return (_SiteMapUtils.PLOT_SAMPLING_MODULES[a] || null) > (_SiteMapUtils.PLOT_SAMPLING_MODULES[b] || null) ? 1 : -1;
            });
          }
        });
      }
    }

    return true;
  }; // Recursively applies a feature visibility change to parents and chilren up/down the tree


  var applyFeatureVisibilityToChildren = function applyFeatureVisibilityToChildren(feature, visible) {
    if (newState.filters.features.visible[feature] === visible) {
      return;
    }

    newState.filters.features.visible[feature] = visible;

    if (_SiteMapUtils.FEATURES[feature].type === _SiteMapUtils.FEATURE_TYPES.GROUP) {
      Object.keys(_SiteMapUtils.FEATURES).filter(function (f) {
        return _SiteMapUtils.FEATURES[f].parent === feature;
      }).forEach(function (f) {
        applyFeatureVisibilityToChildren(f, visible);
      });
    }
  };

  var applyFeatureVisibilityToParents = function applyFeatureVisibilityToParents(feature) {
    if (_SiteMapUtils.FEATURES[feature].parent) {
      var parentVisible = Object.keys(_SiteMapUtils.FEATURES).filter(function (f) {
        return _SiteMapUtils.FEATURES[f].parent === _SiteMapUtils.FEATURES[feature].parent;
      }) // Of all children...
      .some(function (f) {
        return newState.filters.features.visible[f];
      }); // ...some child is visible

      newState.filters.features.visible[_SiteMapUtils.FEATURES[feature].parent] = parentVisible;
      applyFeatureVisibilityToParents(_SiteMapUtils.FEATURES[feature].parent, parentVisible);
    }
  }; // NATGEO_WORLD_MAP has no data at zoom 17 or higher so go to WORLD_IMAGERY (satellite)


  var updateMapTileWithZoom = function updateMapTileWithZoom() {
    if (newState.map.zoom <= 17 && state.map.tileLayer !== _SiteMapUtils.TILE_LAYERS.NATGEO_WORLD_MAP.KEY && state.map.tileLayerAutoChangedAbove17) {
      newState.map.tileLayer = _SiteMapUtils.TILE_LAYERS.NATGEO_WORLD_MAP.KEY;
      newState.map.tileLayerAutoChangedAbove17 = false;
    }

    if (newState.map.zoom >= 17 && state.map.tileLayer === _SiteMapUtils.TILE_LAYERS.NATGEO_WORLD_MAP.KEY) {
      newState.map.tileLayer = _SiteMapUtils.TILE_LAYERS.WORLD_IMAGERY.KEY;
      newState.map.tileLayerAutoChangedAbove17 = true;
    }
  }; // Shortcuts for deailing with hierarchies


  var hierarchiesSource = _SiteMapUtils.FEATURE_DATA_SOURCES.REST_LOCATIONS_API;
  var hierarchiesType = _SiteMapUtils.FEATURE_TYPES.SITE_LOCATION_HIERARCHIES;

  switch (action.type) {
    case 'setView':
      if (!Object.keys(_SiteMapUtils.VIEWS).includes(action.view)) {
        return state;
      }

      newState.view.current = action.view;
      return newState;

    case 'setViewInitialized':
      if (!Object.keys(_SiteMapUtils.VIEWS).includes(state.view.current)) {
        return state;
      }

      newState.view.initialized[state.view.current] = true;
      return newState;

    case 'setAspectRatio':
      if (typeof action.aspectRatio !== 'number' || action.aspectRatio <= 0) {
        return state;
      }

      newState.aspectRatio.currentValue = action.aspectRatio;
      newState.aspectRatio.widthReference = action.widthReference || 0;
      newState.table.maxBodyHeightUpdateFromAspectRatio = true;
      return newState;

    case 'setAspectRatioResizeEventListenerInitialized':
      newState.aspectRatio.resizeEventListenerInitialized = true;
      return newState;

    case 'hydrateNeonContextData':
      if (!action.neonContextData) {
        return state;
      }

      return (0, _SiteMapUtils.hydrateNeonContextData)(newState, action.neonContextData);
    // Table

    case 'setTableFocus':
      newState.table.focus = action.focus;
      return newState;

    case 'setTableMaxBodyHeight':
      newState.table.maxBodyHeight = Math.max(action.height || 0, _SiteMapUtils.MIN_TABLE_MAX_BODY_HEIGHT);
      newState.table.maxBodyHeightUpdateFromAspectRatio = false;
      return newState;
    // Map

    case 'setMapZoom':
      if (!zoomIsValid(action.zoom)) {
        return state;
      }

      newState.map.zoom = action.zoom;
      newState.focusLocation.isAtCenter = false;

      if (centerIsValid(action.center)) {
        newState.map.center = action.center;
      }

      if ((0, _SiteMapUtils.boundsAreValid)(action.bounds)) {
        newState.map.bounds = action.bounds;
      }

      newState.map.zoomedIcons = (0, _SiteMapUtils.getZoomedIcons)(newState.map.zoom);
      updateMapTileWithZoom();
      return calculateFeatureDataFetches((0, _SiteMapUtils.calculateFeatureAvailability)(newState));

    case 'setMapBounds':
      if ((0, _SiteMapUtils.boundsAreValid)(action.bounds)) {
        newState.map.bounds = action.bounds;
      }

      newState.focusLocation.isAtCenter = false;
      return calculateFeatureDataFetches(newState);

    case 'setMapCenter':
      if (!centerIsValid(action.center)) {
        return state;
      }

      if ((0, _SiteMapUtils.boundsAreValid)(action.bounds)) {
        newState.map.bounds = action.bounds;
      }

      newState.map.center = _toConsumableArray(action.center);
      newState.focusLocation.isAtCenter = false;
      return calculateFeatureDataFetches(newState);

    case 'setMapTileLayer':
      if (!Object.keys(_SiteMapUtils.TILE_LAYERS).includes(action.tileLayer)) {
        return state;
      }

      newState.map.tileLayer = action.tileLayer;
      return newState;

    case 'setMapRepositionOpenPopupFunc':
      newState.map.repositionOpenPopupFunc = typeof action.func === 'function' ? action.func : null;
      return newState;

    case 'showFullObservatory':
      newState.map.center = _SiteMapUtils.OBSERVATORY_CENTER;
      newState.map.zoom = (0, _SiteMapUtils.deriveFullObservatoryZoomLevel)(action.mapRef);
      newState.focusLocation.isAtCenter = false;
      return newState;
    // Features

    case 'setFilterFeaturesOpen':
      newState.filters.features.open = !!action.open;
      return newState;

    case 'setFilterFeatureVisibility':
      if (!Object.keys(_SiteMapUtils.FEATURES).includes(action.feature) || typeof action.visible !== 'boolean') {
        return state;
      }

      applyFeatureVisibilityToChildren(action.feature, action.visible);
      applyFeatureVisibilityToParents(action.feature);
      return calculateFeatureDataFetches(newState);

    case 'setFilterFeatureCollapsed':
      if (!Object.keys(_SiteMapUtils.FEATURES).includes(action.feature)) {
        return state;
      }

      newState.filters.features.collapsed.add(action.feature);
      return newState;

    case 'setFilterFeatureExpanded':
      if (!Object.keys(_SiteMapUtils.FEATURES).includes(action.feature)) {
        return state;
      }

      newState.filters.features.collapsed.delete(action.feature);
      return newState;
    // Focus Location

    case 'setNewFocusLocation':
      newState.focusLocation.fetch = {
        status: _SiteMapUtils.FETCH_STATUS.AWAITING_CALL,
        error: null
      };
      newState.focusLocation.current = action.location;
      newState.focusLocation.data = null;
      newState.overallFetch.expected += 1;

      if (newState.view.current !== _SiteMapUtils.VIEWS.MAP) {
        newState.view.current = _SiteMapUtils.VIEWS.MAP;
      }

      return newState;

    case 'setFocusLocationFetchStarted':
      newState.focusLocation.fetch = {
        status: _SiteMapUtils.FETCH_STATUS.FETCHING,
        error: null
      };
      newState.focusLocation.data = null;
      return newState;

    case 'setFocusLocationFetchFailed':
      newState.focusLocation.fetch = {
        status: _SiteMapUtils.FETCH_STATUS.ERROR,
        error: "Invalid location: ".concat(state.focusLocation.current.toString())
      };
      newState.focusLocation.current = null;
      newState.focusLocation.data = null;
      completeOverallFetch();
      return newState;

    case 'setFocusLocationFetchSucceeded':
      newState.focusLocation.fetch = {
        status: _SiteMapUtils.FETCH_STATUS.SUCCESS,
        error: null
      };
      newState.focusLocation.data = action.data; // For STATE and DOMAIN types: ensure corresponding feature is visible

      if (newState.focusLocation.data.type === 'STATE') {
        newState.filters.features.visible[_SiteMapUtils.FEATURES.STATES.KEY] = true;
        newState.filters.features.visible[_SiteMapUtils.FEATURES.DOMAINS.KEY] = false;
      }

      if (newState.focusLocation.data.type === 'DOMAIN') {
        newState.filters.features.visible[_SiteMapUtils.FEATURES.DOMAINS.KEY] = true;
        newState.filters.features.visible[_SiteMapUtils.FEATURES.STATES.KEY] = false;
      }

      completeOverallFetch();
      newState.map = (0, _SiteMapUtils.getMapStateForFocusLocation)(newState);
      updateMapTileWithZoom();

      if (newState.focusLocation.data && newState.focusLocation.data.siteCode) {
        calculateFetchesRequiredSites = [newState.focusLocation.data.siteCode];
      }

      return calculateFeatureDataFetches((0, _SiteMapUtils.calculateFeatureAvailability)(newState), calculateFetchesRequiredSites);
    // Fetch and Import

    case 'awaitingFeatureDataFetchesTriggered':
      return _extends({}, state, {
        featureDataFetchesHasAwaiting: false
      });

    case 'setFeatureDataFetchStarted':
      setFetchStatusFromAction(_SiteMapUtils.FETCH_STATUS.FETCHING);
      return newState;

    case 'setFeatureDataFetchSucceeded':
      setFetchStatusFromAction(_SiteMapUtils.FETCH_STATUS.SUCCESS);
      completeOverallFetch();
      return newState.overallFetch.expected === 0 ? calculateFeatureDataFetches(newState) : newState;

    case 'setFeatureDataFetchFailed':
      setFetchStatusFromAction(_SiteMapUtils.FETCH_STATUS.ERROR);
      completeOverallFetch();
      return newState;

    case 'setDomainLocationHierarchyFetchStarted':
      /* eslint-disable max-len */
      if (!newState.featureDataFetches[hierarchiesSource][hierarchiesType][action.domainCode]) {
        return state;
      }

      newState.featureDataFetches[hierarchiesSource][hierarchiesType][action.domainCode] = _SiteMapUtils.FETCH_STATUS.FETCHING;
      /* eslint-enable max-len */

      return newState;

    case 'setDomainLocationHierarchyFetchSucceeded':
      if (!newState.featureDataFetches[hierarchiesSource][hierarchiesType][action.domainCode] || !action.data) {
        return state;
      }
      /* eslint-disable max-len */


      newState.featureDataFetches[hierarchiesSource][hierarchiesType][action.domainCode] = _SiteMapUtils.FETCH_STATUS.SUCCESS;
      Object.keys(action.data).forEach(function (siteCode) {
        newState.featureData.SITE_LOCATION_HIERARCHIES[siteCode] = action.data[siteCode];
      });
      /* eslint-enable max-len */

      newState.overallFetch.pendingHierarchy -= 1;
      completeOverallFetch();

      if (state.focusLocation.isAtCenter && state.focusLocation.data && state.focusLocation.data.siteCode) {
        calculateFetchesRequiredSites = [state.focusLocation.data.siteCode];
      }

      return calculateFeatureDataFetches(newState, calculateFetchesRequiredSites);

    case 'setDomainLocationHierarchyFetchFailed':
      /* eslint-disable max-len */
      if (!newState.featureDataFetches[hierarchiesSource][hierarchiesType][action.domainCode]) {
        return state;
      }

      newState.featureDataFetches[hierarchiesSource][hierarchiesType][action.domainCode] = _SiteMapUtils.FETCH_STATUS.ERROR;
      /* eslint-enable max-len */

      newState.overallFetch.pendingHierarchy -= 1;
      completeOverallFetch();
      return newState;
    // Selection

    case 'setHideUnselectable':
      newState.selection.hideUnselectable = !!action.hideUnselectable;
      return newState;

    case 'toggleSelectionSummary':
      newState.selection.showSummary = !!action.showSummary;
      return newState;

    case 'selectionOnChangeTriggered':
      newState.selection.changed = false;
      return newState;

    case 'updateSitesSelection':
      if (!action.selection || !action.selection.constructor || action.selection.constructor.name !== 'Set') {
        return state;
      }

      newState.selection.set = getSelectableSet(action.selection, validSet);
      newState.selection.changed = true;
      return deriveBoundarySelections(validateSelection(newState));

    case 'toggleSiteSelected':
      // Special case: when the selectionLimit is 1 always maintain a selection size of 1
      if (newState.selection.limit === 1) {
        if (newState.selection.set.has(action.site) && newState.selection.set.size > 1) {
          newState.selection.set.delete(action.site);
          newState.selection.changed = true;
        } else if (!newState.selection.set.has(action.site) && isSelectable(action.site, validSet)) {
          newState.selection.set = new Set([action.site]);
          newState.selection.changed = true;
        }
      } else if (newState.selection.set.has(action.site)) {
        newState.selection.set.delete(action.site);
        newState.selection.changed = true;
      } else if (isSelectable(action.site, validSet)) {
        newState.selection.set.add(action.site);
        newState.selection.changed = true;
      }

      return deriveBoundarySelections(validateSelection(newState));

    case 'toggleStateSelected':
      if (!action.stateCode) {
        return state;
      }
      /* eslint-disable max-len */


      setMethod = state.selection.derived[_SiteMapUtils.FEATURES.STATES.KEY][action.stateCode] === _SiteMapUtils.SELECTION_PORTIONS.TOTAL ? 'delete' : 'add';
      getSelectableSet(newState.featureData[_SiteMapUtils.FEATURE_TYPES.BOUNDARIES][_SiteMapUtils.FEATURES.STATES.KEY][action.stateCode].sites, validSet).forEach(function (siteCode) {
        newState.selection.set[setMethod](siteCode);
      });
      newState.selection.changed = true;
      return deriveBoundarySelections(validateSelection(newState));

    /* eslint-enable max-len */

    case 'toggleDomainSelected':
      if (!action.domainCode) {
        return state;
      }
      /* eslint-disable max-len */


      setMethod = state.selection.derived[_SiteMapUtils.FEATURES.DOMAINS.KEY][action.domainCode] === _SiteMapUtils.SELECTION_PORTIONS.TOTAL ? 'delete' : 'add';
      getSelectableSet(newState.featureData[_SiteMapUtils.FEATURE_TYPES.BOUNDARIES][_SiteMapUtils.FEATURES.DOMAINS.KEY][action.domainCode].sites, validSet).forEach(function (siteCode) {
        newState.selection.set[setMethod](siteCode);
      });
      newState.selection.changed = true;
      return deriveBoundarySelections(validateSelection(newState));

    /* eslint-enable max-len */
    // Default

    default:
      return state;
  }
};
/**
   Context and Hook
*/


var Context = /*#__PURE__*/(0, _react.createContext)(_SiteMapUtils.DEFAULT_STATE);

var useSiteMapContext = function useSiteMapContext() {
  var hookResponse = (0, _react.useContext)(Context);

  if (hookResponse.length !== 2) {
    return [(0, _cloneDeep.default)(_SiteMapUtils.DEFAULT_STATE), function () {}];
  }

  return hookResponse;
};
/**
   Context Provider
*/


var Provider = function Provider(props) {
  var view = props.view,
      aspectRatio = props.aspectRatio,
      fullscreen = props.fullscreen,
      mapZoom = props.mapZoom,
      mapCenter = props.mapCenter,
      mapTileLayer = props.mapTileLayer,
      locationProp = props.location,
      selection = props.selection,
      validItems = props.validItems,
      selectedItems = props.selectedItems,
      selectionLimit = props.selectionLimit,
      onSelectionChange = props.onSelectionChange,
      children = props.children; // Neon Context State

  var _NeonContext$useNeonC = _NeonContext.default.useNeonContextState(),
      _NeonContext$useNeonC2 = _slicedToArray(_NeonContext$useNeonC, 1),
      _NeonContext$useNeonC3 = _NeonContext$useNeonC2[0],
      neonContextData = _NeonContext$useNeonC3.data,
      neonContextIsFinal = _NeonContext$useNeonC3.isFinal,
      neonContextHasError = _NeonContext$useNeonC3.hasError;
  /**
     Initial State and Reducer Setup
  */


  var initialMapZoom = mapZoom === null ? null : Math.max(Math.min(mapZoom, _SiteMapUtils.MAP_ZOOM_RANGE[1]), _SiteMapUtils.MAP_ZOOM_RANGE[0]);
  var initialState = (0, _cloneDeep.default)(_SiteMapUtils.DEFAULT_STATE);
  initialState.view.current = Object.keys(_SiteMapUtils.VIEWS).includes(view.toUpperCase()) ? view.toUpperCase() : _SiteMapUtils.VIEWS.MAP;
  initialState.fullscreen = fullscreen;
  initialState.map = _extends({}, initialState.map, {
    zoom: initialMapZoom,
    center: mapCenter,
    tileLayer: mapTileLayer
  });

  if (typeof locationProp === 'string') {
    initialState.focusLocation.current = locationProp;
    initialState.focusLocation.fetch.status = _SiteMapUtils.FETCH_STATUS.AWAITING_CALL;
    initialState.overallFetch.expected += 1;
  }

  if (typeof aspectRatio === 'number' && aspectRatio > 0) {
    initialState.aspectRatio.isDynamic = false;
    initialState.aspectRatio.currentValue = aspectRatio;
  }

  if (Object.keys(_SiteMapUtils.SELECTABLE_FEATURE_TYPES).includes(selection)) {
    initialState.selection.active = selection;
    initialState.selection.limit = selectionLimit;
    initialState.selection.onChange = onSelectionChange;
    initialState.selection.set = new Set(selectedItems);

    if (Array.isArray(validItems)) {
      initialState.selection.validSet = new Set(validItems);
    }

    initialState.selection.changed = true;
    initialState = validateSelection(initialState);
  }

  if (neonContextIsFinal && !neonContextHasError) {
    initialState = (0, _SiteMapUtils.hydrateNeonContextData)(initialState, neonContextData);
  }

  var _useReducer = (0, _react.useReducer)(reducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var canFetchFeatureData = state.neonContextHydrated && !(state.focusLocation.current && state.focusLocation.fetch.status !== _SiteMapUtils.FETCH_STATUS.SUCCESS);
  /**
     Effect - trigger focusLocation fetch or short circuit if found in NeonContext data
  */

  (0, _react.useEffect)(function () {
    var noop = function noop() {};

    var _state$focusLocation = state.focusLocation,
        current = _state$focusLocation.current,
        currentStatus = _state$focusLocation.fetch.status;

    if (!current || currentStatus !== _SiteMapUtils.FETCH_STATUS.AWAITING_CALL || !state.neonContextHydrated) {
      return noop;
    } // If the location is a known Domain, State, or Site then pull from NeonContext


    var _state$featureData$FE = state.featureData[_SiteMapUtils.FEATURE_TYPES.BOUNDARIES],
        _state$featureData$FE2 = _state$featureData$FE[_SiteMapUtils.FEATURES.STATES.KEY],
        statesData = _state$featureData$FE2 === void 0 ? {} : _state$featureData$FE2,
        _state$featureData$FE3 = _state$featureData$FE[_SiteMapUtils.FEATURES.DOMAINS.KEY],
        domainsData = _state$featureData$FE3 === void 0 ? {} : _state$featureData$FE3;

    if (Object.keys(statesData).includes(current)) {
      var _statesData$current$c = statesData[current].center,
          latitude = _statesData$current$c[0],
          longitude = _statesData$current$c[1];
      var timeout = window.setTimeout(function () {
        dispatch({
          type: 'setFocusLocationFetchSucceeded',
          data: {
            type: 'STATE',
            latitude: latitude,
            longitude: longitude
          }
        });
      }, 0);
      return function () {
        return window.clearTimeout(timeout);
      };
    }

    if (Object.keys(domainsData).includes(current)) {
      var _domainsData$current$ = domainsData[current].center,
          _latitude = _domainsData$current$[0],
          _longitude = _domainsData$current$[1];

      var _timeout = window.setTimeout(function () {
        dispatch({
          type: 'setFocusLocationFetchSucceeded',
          data: {
            type: 'DOMAIN',
            latitude: _latitude,
            longitude: _longitude
          }
        });
      }, 0);

      return function () {
        return window.clearTimeout(_timeout);
      };
    }

    if (Object.keys(state.sites).includes(current)) {
      var _state$sites$current = state.sites[current],
          _latitude2 = _state$sites$current.latitude,
          _longitude2 = _state$sites$current.longitude;

      var _timeout2 = window.setTimeout(function () {
        dispatch({
          type: 'setFocusLocationFetchSucceeded',
          data: {
            type: 'SITE',
            latitude: _latitude2,
            longitude: _longitude2
          }
        });
      }, 0);

      return function () {
        return window.clearTimeout(_timeout2);
      };
    } // Trigger focus location fetch


    dispatch({
      type: 'setFocusLocationFetchStarted'
    });
    (0, _FetchLocationUtils.fetchManyLocationsGraphQL)([current]).then(function (response) {
      dispatch({
        type: 'setFocusLocationFetchSucceeded',
        data: response[current]
      });
    }).catch(function (error) {
      dispatch({
        type: 'setFocusLocationFetchFailed',
        error: error
      });
    });
    return noop;
  }, [state.sites, state.focusLocation, state.focusLocation.fetch.status, state.neonContextHydrated, state.featureData]);
  /**
     Effect - trigger all data fetches and imports
  */

  (0, _react.useEffect)(function () {
    if (!canFetchFeatureData || !state.featureDataFetchesHasAwaiting) {
      return;
    } // SITE_LOCATION_HIERARCHIES Fetches (REST_LOCATIONS_API)
    // These are not features themselves but constitute critical data in order to generate feature
    // fetches for anything from the locations API family


    var hierarchiesSource = _SiteMapUtils.FEATURE_DATA_SOURCES.REST_LOCATIONS_API;
    var hierarchiesType = _SiteMapUtils.FEATURE_TYPES.SITE_LOCATION_HIERARCHIES;
    Object.keys(state.featureDataFetches[hierarchiesSource][hierarchiesType]).forEach(function (domainCode) {
      if (state.featureDataFetches[hierarchiesSource][hierarchiesType][domainCode] !== _SiteMapUtils.FETCH_STATUS.AWAITING_CALL) {
        return;
      } // eslint-disable-line max-len


      dispatch({
        type: 'setDomainLocationHierarchyFetchStarted',
        domainCode: domainCode
      });
      (0, _FetchLocationUtils.fetchDomainHierarchy)(domainCode).then(function (response) {
        dispatch({
          type: 'setDomainLocationHierarchyFetchSucceeded',
          data: response,
          domainCode: domainCode
        });
      }).catch(function (error) {
        dispatch({
          type: 'setDomainLocationHierarchyFetchFailed',
          error: error,
          domainCode: domainCode
        });
      });
    }); // ARCGIS_ASSETS_API Fetches

    var arcgisSource = _SiteMapUtils.FEATURE_DATA_SOURCES.ARCGIS_ASSETS_API;
    Object.keys(state.featureDataFetches[arcgisSource]).forEach(function (featureKey) {
      Object.keys(state.featureDataFetches[arcgisSource][featureKey]).forEach(function (siteCode) {
        var status = state.featureDataFetches[arcgisSource][featureKey][siteCode] || null;

        if (status !== _SiteMapUtils.FETCH_STATUS.AWAITING_CALL) {
          return;
        }

        dispatch({
          type: 'setFeatureDataFetchStarted',
          dataSource: arcgisSource,
          featureKey: featureKey,
          siteCode: siteCode
        });

        _NeonApi.default.getArcgisAssetObservable(featureKey, siteCode).pipe((0, _operators.map)(function (response) {
          if (response) {
            dispatch({
              type: 'setFeatureDataFetchSucceeded',
              dataSource: arcgisSource,
              data: response,
              featureKey: featureKey,
              siteCode: siteCode
            });
            return (0, _rxjs.of)(true);
          }

          dispatch({
            type: 'setFeatureDataFetchFailed',
            dataSource: arcgisSource,
            error: 'malformed response',
            featureKey: featureKey,
            siteCode: siteCode
          });
          return (0, _rxjs.of)(false);
        }), (0, _operators.catchError)(function (error) {
          dispatch({
            type: 'setFeatureDataFetchFailed',
            dataSource: arcgisSource,
            error: error.message,
            featureKey: featureKey,
            siteCode: siteCode
          });
          return (0, _rxjs.of)(false);
        })).subscribe();
      });
    }); // REST_LOCATIONS_API Fetches

    var restLocSource = _SiteMapUtils.FEATURE_DATA_SOURCES.REST_LOCATIONS_API;
    var restLocFetches = state.featureDataFetches[restLocSource];
    Object.keys(restLocFetches).filter(function (featureKey) {
      return featureKey !== _SiteMapUtils.FEATURE_TYPES.SITE_LOCATION_HIERARCHIES;
    }).forEach(function (featureKey) {
      Object.keys(state.featureDataFetches[restLocSource][featureKey]).forEach(function (siteCode) {
        var featureSite = state.featureDataFetches[restLocSource][featureKey][siteCode];
        Object.keys(featureSite).forEach(function (location) {
          if (featureSite[location] !== _SiteMapUtils.FETCH_STATUS.AWAITING_CALL) {
            return;
          }

          dispatch({
            type: 'setFeatureDataFetchStarted',
            dataSource: restLocSource,
            featureKey: featureKey,
            siteCode: siteCode,
            location: location
          });
          (0, _FetchLocationUtils.fetchSingleLocationREST)(location).then(function (data) {
            dispatch({
              type: 'setFeatureDataFetchSucceeded',
              dataSource: restLocSource,
              data: data,
              featureKey: featureKey,
              siteCode: siteCode,
              location: location
            });
          }).catch(function (error) {
            dispatch({
              type: 'setFeatureDataFetchFailed',
              dataSource: restLocSource,
              error: error.message,
              featureKey: featureKey,
              siteCode: siteCode,
              location: location
            });
          });
        });
      });
    }); // GRAPHQL_LOCATIONS_API Fetches

    var gqlLocSource = _SiteMapUtils.FEATURE_DATA_SOURCES.GRAPHQL_LOCATIONS_API;
    var gqlLocFetches = state.featureDataFetches[gqlLocSource];
    Object.keys(gqlLocFetches).forEach(function (minZoom) {
      Object.keys(gqlLocFetches[minZoom]).forEach(function (siteCode) {
        Object.keys(gqlLocFetches[minZoom][siteCode].fetches).filter(function (fetchId) {
          return gqlLocFetches[minZoom][siteCode].fetches[fetchId].status === _SiteMapUtils.FETCH_STATUS.AWAITING_CALL;
        }).forEach(function (fetchId) {
          dispatch({
            type: 'setFeatureDataFetchStarted',
            dataSource: gqlLocSource,
            minZoom: minZoom,
            siteCode: siteCode,
            fetchId: fetchId
          });
          (0, _FetchLocationUtils.fetchManyLocationsGraphQL)(gqlLocFetches[minZoom][siteCode].fetches[fetchId].locations).then(function (response) {
            dispatch({
              type: 'setFeatureDataFetchSucceeded',
              dataSource: gqlLocSource,
              minZoom: minZoom,
              siteCode: siteCode,
              fetchId: fetchId,
              data: response
            });
          }).catch(function (error) {
            dispatch({
              type: 'setFeatureDataFetchFailed',
              dataSource: gqlLocSource,
              minZoom: minZoom,
              siteCode: siteCode,
              fetchId: fetchId,
              error: error
            });
          });
        });
      });
    });
    dispatch({
      type: 'awaitingFeatureDataFetchesTriggered'
    });
  }, [canFetchFeatureData, state.featureDataFetchesHasAwaiting, state.featureDataFetches]);
  /**
     Effect - trigger onChange for selection whenever selection has changed
  */

  (0, _react.useEffect)(function () {
    if (state.selection.changed) {
      state.selection.onChange(state.selection);
    }

    dispatch({
      type: 'selectionOnChangeTriggered'
    });
  }, [state.selection, state.selection.changed]);
  /**
     Render
  */

  return /*#__PURE__*/_react.default.createElement(Context.Provider, {
    value: [state, dispatch]
  }, children);
};

Provider.propTypes = _extends({}, _SiteMapUtils.SITE_MAP_PROP_TYPES, {
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string])), _propTypes.default.node, _propTypes.default.string]).isRequired
});
Provider.defaultProps = _SiteMapUtils.SITE_MAP_DEFAULT_PROPS;
/**
   Export
*/

var SiteMapContext = {
  Provider: Provider,
  useSiteMapContext: useSiteMapContext,
  SORT_DIRECTIONS: _SiteMapUtils.SORT_DIRECTIONS,
  VIEWS: _SiteMapUtils.VIEWS
};
var _default = SiteMapContext;
exports.default = _default;